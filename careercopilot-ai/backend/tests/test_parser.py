import pytest
from unittest.mock import MagicMock, patch
from fastapi import HTTPException, status
from app.services.parser import ResumeParserService
from app.services.ats_scorer import ATSScoringService

def test_extract_email():
    text = "Jane Doe\nEmail: jane@demo.com\nPhone: 123-456-7890"
    assert ResumeParserService.extract_email(text) == "jane@demo.com"
    
    text_none = "Jane Doe\nNo email here"
    assert ResumeParserService.extract_email(text_none) is None

def test_extract_phone():
    text = "Jane Doe\nPhone: (123) 456-7890\nEmail: jane@demo.com"
    assert ResumeParserService.extract_phone(text) == "(123) 456-7890"
    
    text_simple = "Phone: +1-123-456-7890"
    assert ResumeParserService.extract_phone(text_simple) == "+1-123-456-7890"

def test_extract_urls():
    text = "Profile: https://github.com/janedoe and https://linkedin.com/in/janedoe"
    urls = ResumeParserService.extract_urls(text)
    assert len(urls) == 2
    assert "https://github.com/janedoe" in urls
    assert "https://linkedin.com/in/janedoe" in urls

def test_extract_skills():
    text = "Experienced Software Engineer. Core skills include Python, React, Docker, and SQL."
    skills = ResumeParserService.extract_skills(text)
    assert "python" in skills
    assert "react" in skills
    assert "docker" in skills
    assert "sql" in skills
    assert "java" not in skills

def test_extract_sections():
    text = """
    Jane Doe
    
    Education
    B.S. in Computer Science
    Stanford University
    
    Experience
    Software Engineer at Google
    Built FastAPI services.
    
    Skills
    Python, FastAPI, SQL
    """
    sections = ResumeParserService.extract_sections(text)
    assert len(sections["education"]) > 0
    assert "Stanford University" in sections["education"]
    assert len(sections["experience"]) > 0
    assert "Software Engineer at Google" in sections["experience"]

def test_calculate_ats_score_full():
    """Verify that a perfect resume containing all sections and parameters scores 100"""
    parsed_data = {
        "parsed_text": "word " * 200, # word count = 200
        "contact_info": {
            "email": "jane@demo.com",
            "phone": "123-456-7890",
            "urls": ["https://github.com/janedoe"]
        },
        "education": ["Stanford University"],
        "experience": ["Worked at Google"],
        "skills": ["python", "fastapi"],
        "projects": ["Built CareerCopilot"]
    }
    
    result = ATSScoringService.calculate_ats_score(parsed_data)
    assert result["ats_score"] == 100
    assert result["score_breakdown"]["contact_score"] == 30
    assert result["score_breakdown"]["section_score"] == 60
    assert result["score_breakdown"]["formatting_score"] == 10
    assert len(result["score_breakdown"]["missing_sections"]) == 0

def test_calculate_ats_score_missing():
    """Verify that a sparse resume gets computed with deducted scores and missing indicators"""
    parsed_data = {
        "parsed_text": "word " * 50, # word count = 50 (too short)
        "contact_info": {
            "email": None,
            "phone": "123-456-7890",
            "urls": []
        },
        "education": [],
        "experience": ["Worked at Google"],
        "skills": [],
        "projects": []
    }
    
    result = ATSScoringService.calculate_ats_score(parsed_data)
    # Contact: email missing (10), urls missing (10) -> score 10
    # Sections: edu missing, skills missing, projects missing -> score 15
    # Formatting: too short -> score 2
    # Total: 10 + 15 + 2 = 27
    assert result["ats_score"] == 27
    assert "Education" in result["score_breakdown"]["missing_sections"]
    assert "Skills" in result["score_breakdown"]["missing_sections"]
    assert "Projects" in result["score_breakdown"]["missing_sections"]
    assert len(result["score_breakdown"]["suggestions"]) > 0

@patch("app.services.parser.pdfplumber.open")
@patch("app.services.parser.os.path.exists")
def test_extract_text_empty_pdf(mock_exists, mock_pdf_open):
    """Verify that a PDF containing no readable text is rejected with HTTP 400"""
    mock_exists.return_value = True
    
    mock_pdf = MagicMock()
    mock_page = MagicMock()
    mock_page.extract_text.return_value = "" # No text extracted
    mock_pdf.pages = [mock_page]
    mock_pdf_open.return_value.__enter__.return_value = mock_pdf

    with pytest.raises(HTTPException) as exc_info:
        ResumeParserService.extract_text_from_pdf("dummy.pdf")
        
    assert exc_info.value.status_code == status.HTTP_400_BAD_REQUEST
    assert "plain text is empty" in exc_info.value.detail
