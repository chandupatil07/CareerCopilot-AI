import pytest
from unittest.mock import patch

# Import all models to register them on Base metadata before test execution begins
import app.database.base  # noqa

@pytest.fixture(autouse=True)
def mock_notification_service_triggers(request):
    """Automatically mock NotificationService.create_notification to avoid polluting database transaction mocks in other unit tests"""
    if "test_notification" in request.node.fspath.strpath:
        yield
    else:
        with patch("app.services.notification.NotificationService.create_notification") as mock_create:
            yield mock_create
