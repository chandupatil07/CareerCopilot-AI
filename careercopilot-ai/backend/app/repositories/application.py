from typing import List, Optional, Dict, Any
from datetime import date, datetime
from sqlalchemy.orm import Session
from sqlalchemy import select, and_, or_, func
from app.repositories.base import BaseRepository
from app.models.application import Application
from app.models.application_timeline import ApplicationTimeline

class ApplicationRepository(BaseRepository[Application]):
    """
    ApplicationRepository managing query filters, search patterns,
    pagination limits, timeline insertions, and database statistics.
    """
    def list_applications(
        self,
        db: Session,
        *,
        user_id: int,
        skip: int = 0,
        limit: int = 100,
        search: Optional[str] = None,
        status: Optional[str] = None,
        location: Optional[str] = None,
        priority: Optional[str] = None,
        favorite: Optional[bool] = None,
        archived: Optional[bool] = False,
        sort_by: Optional[str] = "newest"
    ) -> List[Application]:
        """Fetch list of user applications filtered by search queries and sorting criteria"""
        query = select(self.model).where(self.model.user_id == user_id)

        # Filters
        if status:
            query = query.where(self.model.current_stage == status)
        if location:
            query = query.where(self.model.location.ilike(f"%{location}%"))
        if priority:
            query = query.where(self.model.priority == priority)
        if favorite is not None:
            query = query.where(self.model.favorite == favorite)
        if archived is not None:
            query = query.where(self.model.archived == archived)

        if search:
            search_filter = or_(
                self.model.company_name.ilike(f"%{search}%"),
                self.model.job_role.ilike(f"%{search}%"),
                self.model.location.ilike(f"%{search}%"),
                self.model.notes.ilike(f"%{search}%")
            )
            query = query.where(search_filter)

        # Sorting
        if sort_by == "oldest":
            query = query.order_by(self.model.created_at.asc())
        elif sort_by == "company":
            query = query.order_by(self.model.company_name.asc())
        elif sort_by == "status":
            query = query.order_by(self.model.current_stage.asc())
        elif sort_by == "applied_date":
            query = query.order_by(self.model.applied_date.desc().nullslast())
        else: # newest
            query = query.order_by(self.model.created_at.desc())

        query = query.offset(skip).limit(limit)
        return list(db.execute(query).scalars().all())

    def check_duplicate(
        self, db: Session, *, user_id: int, company_name: str, job_role: str, applied_date: Optional[date]
    ) -> bool:
        """Verify that a candidate doesn't log duplicate records for the same company, role, and date"""
        query = select(self.model).where(
            self.model.user_id == user_id,
            self.model.company_name == company_name,
            self.model.job_role == job_role
        )
        if applied_date:
            query = query.where(self.model.applied_date == applied_date)
        
        existing = db.execute(query).scalars().first()
        return existing is not None

    def add_timeline_entry(
        self, db: Session, *, application_id: int, from_stage: str, to_stage: str, notes: Optional[str] = None
    ) -> ApplicationTimeline:
        """Record a historical stage migration event"""
        db_obj = ApplicationTimeline(
            application_id=application_id,
            from_stage=from_stage,
            to_stage=to_stage,
            notes=notes
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_statistics(self, db: Session, *, user_id: int) -> Dict[str, Any]:
        """Compile aggregate dashboard metrics using database-agnostic operations"""
        query = select(self.model).where(self.model.user_id == user_id)
        apps = list(db.execute(query).scalars().all())

        total = len(apps)
        applied = sum(1 for a in apps if a.current_stage != "Interested")
        
        # Interviewing stage groupings
        interview_stages = {"Online Assessment", "Technical Interview", "HR Interview", "Manager Round"}
        interviewing = sum(1 for a in apps if a.current_stage in interview_stages)
        
        offers = sum(1 for a in apps if a.current_stage in {"Offer", "Accepted"})
        rejected = sum(1 for a in apps if a.current_stage == "Rejected")

        # Ratios calculation
        # Response Rate = (Interviewing + Offers + Rejections) / Applied (ignores Interested bucket)
        responded = sum(1 for a in apps if a.current_stage not in {"Interested", "Applied"})
        response_rate = (responded / applied * 100.0) if applied > 0 else 0.0
        
        # Acceptance Rate = Accepted / Offers
        acceptance_rate = (sum(1 for a in apps if a.current_stage == "Accepted") / offers * 100.0) if offers > 0 else 0.0

        # Distribution groupings
        distribution = {}
        for a in apps:
            distribution[a.current_stage] = distribution.get(a.current_stage, 0) + 1

        # Monthly trends extraction
        monthly_map = {}
        for a in apps:
            # Fallback to created_at if applied_date is missing
            t_date = a.applied_date or a.created_at.date()
            if t_date:
                m_str = t_date.strftime("%Y-%m")
                monthly_map[m_str] = monthly_map.get(m_str, 0) + 1
        
        monthly_trends = [{"month": k, "count": v} for k, v in sorted(monthly_map.items())]

        return {
            "total_applications": total,
            "applied_count": applied,
            "interviewing_count": interviewing,
            "offers_count": offers,
            "rejected_count": rejected,
            "acceptance_rate": round(acceptance_rate, 2),
            "response_rate": round(response_rate, 2),
            "status_distribution": distribution,
            "monthly_trends": monthly_trends
        }

application_repo = ApplicationRepository(Application)
