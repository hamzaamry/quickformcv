from typing import Dict, Any, List, Union
from uuid import UUID
import json

from app.utils.logging_config import logger
from app.services.userServices.ResumeServices.resumeService import ResumeService
from app.schemas.userSchemas.resumeSchema import Basics, ResumeComplete

class ResumeDataProcessor:
    def __init__(self, resume_service: ResumeService):
        self.resume_service = resume_service

    def _save_section_items(
            self,
            resume_id: UUID,
            user_id: UUID,
            section_type: str,
            section_data: Union[List, None],
            key_name: str = 'name'
    ) -> ResumeComplete:
        """
        Generic method to save section items for different resume sections.
        """
        if not section_data:
            logger.info(f"No {section_type} found to save for resume {resume_id}")
            return self.resume_service.get_complete_resume(resume_id, user_id)

        logger.info(f"Processing {len(section_data)} items for section {section_type}")
        logger.info(f"Section data type: {type(section_data)}")

        if isinstance(section_data, str):
            try:
                # Try to parse as JSON if it's a string
                section_data = json.loads(section_data)
                logger.info(f"Parsed section data from string: {section_data}")
            except json.JSONDecodeError:
                # If it's not JSON, treat it as a single string item
                section_data = [section_data]
                logger.info(f"Treating section data as single string item: {section_data}")

        for item in section_data:
            try:
                logger.info(f"Processing item for {section_type}: {item}")
                item_data = {key_name: item} if isinstance(item, str) else item

                self.resume_service.add_section_item(
                    resume_id=resume_id,
                    user_id=user_id,
                    section_type=section_type,
                    item_data=item_data
                )
                logger.info(f"Successfully saved {section_type} item: {item_data.get(key_name, 'Unknown')}")
            except Exception as e:
                logger.error(f"Error saving individual {section_type} item: {str(e)}")
                logger.error(f"Item data: {item}")

        return self.resume_service.get_complete_resume(resume_id, user_id)

    def save_summary(self, resume_id: UUID, user_id: UUID, resume_data: Dict[str, Any]) -> ResumeComplete:
        try:
            # Try both lowercase and uppercase key names
            summary = resume_data.get('summary', resume_data.get('Summary', ''))
            logger.info(f"Found summary: {summary[:50]}..." if summary and len(summary) > 50 else f"Found summary: {summary}")

            if summary:
                self.resume_service.add_or_update_summary(
                    resume_id=resume_id,
                    user_id=user_id,
                    summary_content=summary
                )
                logger.info(f"Successfully saved summary for resume {resume_id}")
            return self.resume_service.get_complete_resume(resume_id, user_id)
        except Exception as e:
            logger.error(f"Error processing summary for resume {resume_id}: {str(e)}")
            return self.resume_service.get_complete_resume(resume_id, user_id)

    def save_basics(self, resume_id: UUID, user_id: UUID, resume_data: Dict[str, Any]) -> ResumeComplete:
        try:
            # Try both lowercase and uppercase key names
            basics = resume_data.get('basics', resume_data.get('Basics', {}))
            logger.info(f"Found basics data: {basics}")

            if basics:
                basics_obj = Basics(
                    firstName=basics.get('firstName', ''),
                    lastName=basics.get('lastName', ''),
                    headline=basics.get('headline', ''),
                    email=basics.get('email', ''),
                    phone=basics.get('phone', ''),
                    location=basics.get('location', '')
                )
                logger.info(f"Created basics object: {basics_obj}")

                self.resume_service.update_resume_basics(
                    resume_id=resume_id,
                    user_id=user_id,
                    basics=basics_obj
                )
                logger.info(f"Successfully saved basics for resume {resume_id}")
            return self.resume_service.get_complete_resume(resume_id, user_id)
        except Exception as e:
            logger.error(f"Error saving basics for resume {resume_id}: {str(e)}")
            logger.error(f"Basics data: {basics if 'basics' in locals() else 'Not available'}")
            return self.resume_service.get_complete_resume(resume_id, user_id)

    def save_experiences(self, resume_id: UUID, user_id: UUID, resume_data: Dict[str, Any]) -> ResumeComplete:
        # Try both lowercase and uppercase key names
        experiences = resume_data.get('experiences', resume_data.get('Experiences', []))
        logger.info(f"Found experiences: {experiences}")

        return self._save_section_items(
            resume_id,
            user_id,
            'experiences',
            experiences,
            key_name='company'  # Change this to match the expected field name
        )

    def save_skills(self, resume_id: UUID, user_id: UUID, resume_data: Dict[str, Any]) -> ResumeComplete:
        # Try both lowercase and uppercase key names
        skills = resume_data.get('skills', resume_data.get('Skills', []))
        logger.info(f"Found skills: {skills}")

        return self._save_section_items(
            resume_id,
            user_id,
            'skills',
            skills,
        )

    def save_education(self, resume_id: UUID, user_id: UUID, resume_data: Dict[str, Any]) -> ResumeComplete:
        # Try both lowercase and uppercase key names
        education = resume_data.get('education', resume_data.get('Education', []))
        logger.info(f"Found education: {education}")

        return self._save_section_items(
            resume_id,
            user_id,
            'education',
            education,
            key_name='institution'
        )

    def save_certifications(self, resume_id: UUID, user_id: UUID, resume_data: Dict[str, Any]) -> ResumeComplete:
        # Try both lowercase and uppercase key names
        certifications = resume_data.get('certifications', resume_data.get('Certifications', []))
        logger.info(f"Found certifications: {certifications}")

        return self._save_section_items(
            resume_id,
            user_id,
            'certifications',
            certifications,
            key_name='name'
        )

    def save_socials(self, resume_id: UUID, user_id: UUID, resume_data: Dict[str, Any]) -> ResumeComplete:
        # Try both lowercase and uppercase key names
        socials = resume_data.get('socials', resume_data.get('Socials', []))
        logger.info(f"Found socials: {socials}")

        return self._save_section_items(
            resume_id,
            user_id,
            'socials',
            socials,
            key_name='network'
        )