# Import all the models, so that Base has them before autogenerating migrations
from app.database.base_class import Base  # noqa
from app.models.user import User  # noqa
from app.models.resume import Resume  # noqa
from app.models.application import Application  # noqa
from app.models.interview import Interview  # noqa
from app.models.notification import Notification  # noqa
from app.models.chat import AIChat  # noqa
from app.models.outreach import ColdEmailHistory, LinkedInHistory  # noqa
from app.models.resume_analysis import ResumeAnalysis  # noqa
from app.models.application_timeline import ApplicationTimeline  # noqa


