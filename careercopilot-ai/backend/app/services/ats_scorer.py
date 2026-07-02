from typing import Dict, List, Any

class ATSScoringService:
    """
    ATSScoringService evaluates resume data structures and extracts transparent metrics,
    returning overall and section-wise scores, listing missing parts, and recommendations.
    """

    @classmethod
    def calculate_ats_score(cls, parsed_data: Dict[str, Any]) -> Dict[str, Any]:
        """Perform transparent mathematical scoring on extracted resume parameters"""
        score = 0
        suggestions = []
        missing_sections = []
        breakdown = {
            "contact_score": 0,
            "section_score": 0,
            "formatting_score": 0
        }

        # 1. Contact Info Scoring (Max 30 Points)
        contact = parsed_data.get("contact_info", {})
        if contact.get("email"):
            breakdown["contact_score"] += 10
        else:
            suggestions.append("Add a professional email address to the header coordinates.")
            
        if contact.get("phone"):
            breakdown["contact_score"] += 10
        else:
            suggestions.append("Add a primary contact phone number to enable recruiter outreach.")
            
        if contact.get("urls") and len(contact.get("urls")) > 0:
            breakdown["contact_score"] += 10
        else:
            suggestions.append("Include your LinkedIn profile, GitHub repository, or online portfolio URL.")

        # 2. Section Presence Scoring (Max 60 Points)
        sections_map = {
            "education": "Education",
            "experience": "Experience",
            "skills": "Skills",
            "projects": "Projects"
        }
        
        for key, name in sections_map.items():
            content = parsed_data.get(key, [])
            if content and len(content) > 0:
                breakdown["section_score"] += 15
            else:
                missing_sections.append(name)
                suggestions.append(f"Create a dedicated '{name}' section to outline your qualifications.")

        # 3. Formatting & Content Density (Max 10 Points)
        raw_text = parsed_data.get("parsed_text", "")
        word_count = len(raw_text.split())
        
        if 150 <= word_count <= 800:
            breakdown["formatting_score"] += 10
        elif word_count > 800:
            breakdown["formatting_score"] += 5
            suggestions.append("Your resume text density exceeds 800 words. Condense descriptions to keep it scannable.")
        else:
            breakdown["formatting_score"] += 2
            suggestions.append("Resume content is sparse (<150 words). Expand on your projects and work history.")

        # Aggregate total score
        total_score = breakdown["contact_score"] + breakdown["section_score"] + breakdown["formatting_score"]

        return {
            "ats_score": total_score,
            "score_breakdown": {
                "contact_score": breakdown["contact_score"],
                "section_score": breakdown["section_score"],
                "formatting_score": breakdown["formatting_score"],
                "missing_sections": missing_sections,
                "suggestions": suggestions
            }
        }
