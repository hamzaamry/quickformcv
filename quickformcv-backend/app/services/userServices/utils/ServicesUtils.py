from uuid import UUID

from app.schemas.userSchemas.resumeSchema.sections import SummarySection, CustomSection, ItemsSection
from app.schemas.userSchemas.resumeSchema.resume import ResumeSection
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