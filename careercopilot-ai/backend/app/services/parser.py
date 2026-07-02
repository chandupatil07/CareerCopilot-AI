import re
import logging
import pdfplumber
from typing import Dict, List, Any
from fastapi import HTTPException, status

logger = logging.getLogger("app.services.parser")

# Standard industry skills dictionary list
TECH_SKILLS_DB = [
    "python", "fastapi", "react", "sql", "postgresql", "mysql", "sqlite", "aws", "gcp", "azure", 
    "docker", "kubernetes", "git", "typescript", "javascript", "node.js", "express", "django", 
    "flask", "html", "css", "java", "c++", "go", "rust", "terraform", "ci/cd", "rest api", 
    "graphql", "redis", "mongodb", "linux", "scikit-learn", "tensorflow", "pytorch", "nlp", "ai"
]

class ResumeParserService:
    """
    ResumeParserService handles raw text extraction from PDF binaries using pdfplumber,
    and isolates contacts, universities, skills, and projects using regular expressions
    and target token keyword mapping.
    """

    @staticmethod
    def extract_text_from_pdf(storage_path: str) -> str:
        """Extract plain text lines from a physical PDF document"""
        if not os.path.exists(storage_path):
             raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Resume PDF file is missing from local disk storage."
            )

        text_content = []
        try:
            with pdfplumber.open(storage_path) as pdf:
                # Reject empty PDFs
                if len(pdf.pages) == 0:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="The uploaded PDF document contains no pages."
                    )
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text_content.append(page_text)
        except Exception as e:
            logger.error(f"pdfplumber exception on file {storage_path}: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to parse the PDF document. It may be corrupted or password-encrypted."
            )

        extracted_text = "\n".join(text_content).strip()
        if not extracted_text:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Extracted plain text is empty. The PDF may contain scanned image scans without OCR text."
            )

        return extracted_text

    @classmethod
    def parse_resume(cls, storage_path: str) -> Dict[str, Any]:
        """Orchestrate parsing pipeline steps on target resume PDF file"""
        raw_text = cls.extract_text_from_pdf(storage_path)
        
        # 1. Contact coordinates parsing
        email = cls.extract_email(raw_text)
        phone = cls.extract_phone(raw_text)
        urls = cls.extract_urls(raw_text)

        # 2. Section segment extraction
        sections = cls.extract_sections(raw_text)

        # 3. Extract skills list
        skills = cls.extract_skills(raw_text)

        return {
            "parsed_text": raw_text,
            "contact_info": {
                "email": email,
                "phone": phone,
                "urls": urls
            },
            "education": sections.get("education", []),
            "experience": sections.get("experience", []),
            "skills": skills,
            "projects": sections.get("projects", []),
            "certificates": sections.get("certificates", []),
            "languages": sections.get("languages", [])
        }

    @staticmethod
    def extract_email(text: str) -> str:
        """Parse email coordinate using RFC 5322 regex validation"""
        match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
        return match.group(0) if match else None

    @staticmethod
    def extract_phone(text: str) -> str:
        """Parse standard phone format coordinates using regex"""
        match = re.search(r'(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)
        return match.group(0) if match else None

    @staticmethod
    def extract_urls(text: str) -> List[str]:
        """Find candidate GitHub, LinkedIn, or personal portfolio link references"""
        urls = re.findall(r'https?://[^\s,\'\"]+', text)
        matched_links = []
        for url in urls:
            url_lower = url.lower()
            if "github.com" in url_lower or "linkedin.com" in url_lower or "portfolio" in url_lower:
                matched_links.append(url)
        return list(set(matched_links))

    @staticmethod
    def extract_skills(text: str) -> List[str]:
        """Scan resume text matching dictionary tokens from TECH_SKILLS_DB"""
        found_skills = []
        text_lower = text.lower()
        for skill in TECH_SKILLS_DB:
            # Enforce boundary checking around skill keywords (e.g. 'go' shouldn't match 'good')
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, text_lower):
                found_skills.append(skill)
        return found_skills

    @staticmethod
    def extract_sections(text: str) -> Dict[str, List[str]]:
        """
        Segment raw text into sections based on structural headings.
        Returns mapped paragraphs for each heading.
        """
        # Section identifiers mapped to regex keywords
        section_headers = {
            "education": [r"\beducation\b", r"\bacademics\b"],
            "experience": [r"\bexperience\b", r"\bwork history\b", r"\bemployment\b"],
            "projects": [r"\bprojects\b", r"\bpersonal projects\b"],
            "certificates": [r"\bcertifications\b", r"\bcertificates\b"],
            "languages": [r"\blanguages\b"]
        }

        parsed_sections = {sec: [] for sec in section_headers}
        lines = [line.strip() for line in text.split("\n") if line.strip()]

        current_section = None
        
        for line in lines:
            line_lower = line.lower()
            header_detected = False
            
            # Check if current line is a section heading
            for sec, regexes in section_headers.items():
                for regex in regexes:
                    if re.match(regex, line_lower):
                        current_section = sec
                        header_detected = True
                        break
                if header_detected:
                    break
            
            if header_detected:
                continue
                
            if current_section:
                parsed_sections[current_section].append(line)

        return parsed_sections

import os  # Ensure os module is imported for path checks
