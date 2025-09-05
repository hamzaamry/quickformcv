import io
from typing import Dict, Union
from PyPDF2 import PdfReader
from .logging_config import logger


def ExtractResumeData(file):
    """
    Method to extract text from a PDF file.
    """
    if not file.filename.lower().endswith(".pdf"):
        logger.error(f"File {file.filename} is not a PDF. Aborting text extraction.")
        raise ValueError("Only PDF files are allowed")
    try:
        contents = file.file.read()
        pdf_file = io.BytesIO(contents)

        pdf_reader = PdfReader(pdf_file)
        resume_text = "".join(page.extract_text() or "" for page in pdf_reader.pages)
        logger.info(f"Extracted {len(resume_text)} characters from the resume {file.filename}")

        return resume_text

    except Exception as e:
        logger.error(f"An error occurred while extracting text from {file.filename}: {e}")
        raise ValueError("An error occurred while processing the PDF file")


def calculate_job_match_percentage(job_match_metrics: Dict[str, Union[int, float]]) -> float:
    """
    Calculate the overall job match percentage based on keyword match and experience level alignment.
    """
    try:
        keyword_match = job_match_metrics.get("job_match_metrics", {}).get("KeywordMatch", 0)
        experience_alignment = job_match_metrics.get("job_match_metrics", {}).get("ExperienceLevelAlignment", 0)

        if not (0 <= keyword_match <= 100 and 0 <= experience_alignment <= 100):
            raise ValueError("Metrics must be percentages between 0 and 100")

        overall_match = (keyword_match * 0.5) + (experience_alignment * 0.5)
        return round(overall_match, 2)

    except (TypeError, KeyError) as e:
        raise ValueError(f"Invalid job match metrics format: {e}")


def calculate_overall_score(skills_coverage: float, content_quality: float, job_match_percentage: float) -> float:
    """
    Calculate the overall score for a resume based on Skills Coverage, Content Quality, and Job Match Percentage.
    """
    try:
        if not (0 <= skills_coverage <= 100 and 0 <= content_quality <= 100 and 0 <= job_match_percentage <= 100):
            raise ValueError("All inputs must be percentages between 0 and 100")

        overall_score = (skills_coverage + content_quality + job_match_percentage) / 3

        return round(overall_score, 2)

    except TypeError as e:
        raise ValueError(f"Invalid input types for score calculation: {e}")


def categorize_cv_quality(overall_score: float) -> str:
    """
    Categorize the CV quality based on the overall score.
    """
    if not 0 <= overall_score <= 100:
        raise ValueError("Overall score must be between 0 and 100")

    if overall_score >= 90:
        return "Perfect"
    elif 80 <= overall_score < 90:
        return "Very Good"
    elif 70 <= overall_score < 80:
        return "Good"
    elif 60 <= overall_score < 70:
        return "Average"
    else:
        return "Below Average"
