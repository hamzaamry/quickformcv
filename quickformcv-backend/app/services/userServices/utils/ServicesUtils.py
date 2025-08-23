import re
import json
from uuid import UUID
from typing import Dict, Any

from app.schemas.userSchemas.resumeSchema.sections import SummarySection, CustomSection, ItemsSection
from app.schemas.userSchemas.resumeSchema.resume import ResumeSection
from app.services.userServices.constants import JSON_EXTRACTION_PATTERNS, LLM_RESUME_EXTRACTION_INSTRUCTION, \
    LLM_DEFAULT_RESUME_STRUCTURE
from app.utils.logging_config import logger

def parse_basics_data(basics_data, resume_id: UUID):
    """
    Parse the basics data from the resume.
    """
    from app.schemas.userSchemas.resumeSchema.basics import Basics

    if not basics_data:
        return Basics()

    try:
        return Basics(**basics_data)
    except Exception as e:
        logger.warning(
            "Error parsing basics data, using defaults",
            extra={
                "resume_id": str(resume_id),
                "error": str(e)
            }
        )
        return Basics()

def transform_sections(sections):
    """
    Transform section data into appropriate schema objects.
    """
    transformed_sections = []
    section_type_mapping = {
        "summary": SummarySection,
        "custom": CustomSection
    }

    for section in sections:
        section_class = section_type_mapping.get(section.section_type, ItemsSection)
        section_data = section_class(**section.section_data)
        transformed_section = ResumeSection(
            id=section.id,
            section_type=section.section_type,
            section_data=section_data
        )
        transformed_sections.append(transformed_section)
    return transformed_sections


def extract_json_from_response(response) -> Dict[str, Any]:
    """
    Validate JSON extraction from a response, with fallback mechanisms.

    Primary goal is to validate the structure of the extracted JSON,
    not to be the main data extraction method.
    """
    # If response is already a dictionary, return it directly
    if isinstance(response, dict):
        return response

    try:
        parsed_json = json.loads(response)
        return parsed_json
    except (json.JSONDecodeError, TypeError):
        # If direct parsing fails, try more advanced extraction methods
        try:
            # Extract JSON between first { and last }
            json_match = re.search(r'\{.*\}', response, re.DOTALL)
            if json_match:
                cleaned_json = json_match.group(0)
                return json.loads(cleaned_json)
        except Exception:
            pass

        for pattern in JSON_EXTRACTION_PATTERNS:
            matches = re.findall(pattern, response, re.DOTALL | re.MULTILINE)
            for match in matches:
                try:
                    cleaned_match = match.strip()
                    return json.loads(cleaned_match)
                except json.JSONDecodeError:
                    continue

        logger.warning(f"Failed to extract JSON from response: {response}")
        return LLM_DEFAULT_RESUME_STRUCTURE

def format_conversation_messages(messages):
    """
    Format conversation messages for LLM processing.
    """
    return [
        {
            "role": "system",
            "content": LLM_RESUME_EXTRACTION_INSTRUCTION
        },
        {
            "role": "user",
            "content": "\n".join([
                f"{msg.role.upper()}: {msg.content}"
                for msg in messages
                if msg.role in ['user', 'assistant'] and msg.role != 'system'
            ])
        }
    ]