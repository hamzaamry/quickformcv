from sqlalchemy.orm import Session
from typing import Dict, Any
from uuid import UUID
import json
import re

from app.services.userServices.ResumeServices.resumeService import ResumeService
from app.services.userServices.ClaraConversation.ClaraConversationService import ClaraService
from app.utils.logging_config import logger
from app.services.userServices.constants import LLM_DEFAULT_RESUME_STRUCTURE
from app.schemas.userSchemas.resumeSchema import ResumeComplete, ResumeCreate
from app.services.userServices.ClaraConversation.ResumeDataProcessor import ResumeDataProcessor
from app.services.userServices.utils.ServicesUtils import (
    extract_json_from_response,
    format_conversation_messages
)

class ResumeDataExtractor:
    def __init__(self, db: Session):
        self.db = db
        self.clara_service = ClaraService()
        self.resume_service = ResumeService(db)

    def _clean_json_string(self, json_str: str) -> str:
        """
        Clean and fix common issues in JSON strings that might cause parsing errors.
        """
        # Fix unescaped quotes within strings
        # This uses regex to find potential problematic patterns and fix them
        json_str = re.sub(r'(?<=[^\\])"(?=.*":)', r'\"', json_str)

        # Remove any control characters that might break JSON parsing
        json_str = ''.join(ch for ch in json_str if ord(ch) >= 32 or ch == '\n')

        return json_str

    def _parse_content_safely(self, content_str: str) -> Dict[str, Any]:
        """
        Attempt to parse the content string as JSON with several fallback mechanisms.
        """
        try:
            # First try direct parsing
            return json.loads(content_str)
        except json.JSONDecodeError as e:
            logger.error(f"Initial JSON parse failed: {str(e)}")

            try:
                # Try cleaning the string first
                cleaned_content = self._clean_json_string(content_str)
                logger.info("Attempting to parse with cleaned JSON string")
                return json.loads(cleaned_content)
            except json.JSONDecodeError as e2:
                logger.error(f"Cleaned JSON parse also failed: {str(e2)}")

                # As a last resort, manually extract the main sections
                logger.info("Attempting manual extraction of resume sections")
                resume_data = {}

                # Extract basics section using regex
                basics_match = re.search(r'"basics"\s*:\s*({[^}]+})', content_str)
                if basics_match:
                    try:
                        basics_str = basics_match.group(1)
                        # Clean up any potential issues in the basics string
                        basics_str = self._clean_json_string(basics_str)
                        basics_data = json.loads('{' + f'"basics": {basics_str}' + '}')
                        resume_data.update(basics_data)
                        logger.info(f"Successfully extracted basics: {basics_data}")
                    except Exception as be:
                        logger.error(f"Failed to parse basics: {str(be)}")

                # Extract summary
                summary_match = re.search(r'"summary"\s*:\s*"([^"]+)"', content_str)
                if summary_match:
                    resume_data['summary'] = summary_match.group(1)
                    logger.info(f"Extracted summary: {resume_data['summary'][:50]}...")

                # Try to extract experiences, skills, education, and socials
                # This is a simplified approach - for complex nested structures,
                # a more sophisticated parsing might be needed
                for section in ['experiences', 'Skills', 'Education', 'Socials']:
                    section_match = re.search(f'"{section}"\s*:\s*(\[[^\]]+\])', content_str)
                    if section_match:
                        try:
                            section_str = section_match.group(1)
                            section_data = json.loads('{' + f'"{section}": {section_str}' + '}')
                            resume_data.update(section_data)
                            logger.info(f"Successfully extracted {section}")
                        except Exception as se:
                            logger.error(f"Failed to parse {section}: {str(se)}")

                return resume_data

    async def extract_resume_data(self, conversation_id: UUID, user_id: UUID) -> Dict[str, Any]:
        """
        Extract resume data from a conversation using LLM.
        """
        try:
            messages = self.clara_service.get_messages(self.db, conversation_id, user_id)
            extraction_messages = format_conversation_messages(messages)
            response = await self.clara_service._generate_response(extraction_messages)
            extracted_data = extract_json_from_response(response)

            # Fix for nested content structure
            if 'content' in extracted_data and isinstance(extracted_data['content'], str):
                logger.info(f"Found nested content structure, parsing inner JSON")
                content_data = self._parse_content_safely(extracted_data['content'])
                if content_data:
                    logger.info(f"Successfully parsed inner content with keys: {list(content_data.keys())}")
                    return content_data
                else:
                    logger.warning("Failed to parse inner content, using original extracted data")
                    return extracted_data
            return extracted_data
        except Exception as e:
            logger.error(f"Error extracting resume data: {str(e)}")
            return LLM_DEFAULT_RESUME_STRUCTURE

    async def generate_resume(self, conversation_id: UUID, user_id: UUID) -> ResumeComplete:
        """
        Generate a resume from conversation data by extracting and saving all relevant sections.
        """
        try:
            resume_data = await self.extract_resume_data(conversation_id, user_id)

            # Convert resume_data to a string for logging, with a character limit
            resume_data_str = json.dumps(resume_data, indent=2)
            if len(resume_data_str) > 1000:
                resume_data_str = resume_data_str[:1000] + "... (truncated)"
            logger.info(f"Resume data structure: {resume_data_str}")
            logger.info(f"Resume data keys: {list(resume_data.keys())}")

            if not resume_data:
                logger.warning(f"No resume data extracted from conversation {conversation_id}")
                raise ValueError("Unable to extract resume data from conversation")

            basics = resume_data.get('basics', {})
            first_name = basics.get('firstName', 'Unnamed')
            last_name = basics.get('lastName', 'Resume')

            initial_resume_data = ResumeCreate(
                title=f"{first_name} {last_name}'s Resume",
                description=basics.get('headline', 'Professional Resume')
            )

            new_resume = self.resume_service.create_resume(
                resume=initial_resume_data,
                user_id=user_id
            )
            new_resume_id = new_resume.id

            self._process_resume_sections(new_resume_id, user_id, resume_data)

            final_resume = self.resume_service.get_complete_resume(new_resume_id, user_id)
            logger.info(f"Successfully generated resume {new_resume_id} for user {user_id}")
            return final_resume

        except Exception as e:
            logger.error(f"Comprehensive error in resume generation: {str(e)}")
            raise

    def _process_resume_sections(self, resume_id: UUID, user_id: UUID, resume_data: Dict[str, Any]) -> None:
        """
        Process and save different resume sections.
        """
        processor = ResumeDataProcessor(self.resume_service)

        # Log the structure of resume_data to help with debugging
        logger.info(f"Processing resume sections for data with keys: {list(resume_data.keys())}")

        sections_to_save = [
            ('Basics', processor.save_basics),
            ('Summary', processor.save_summary),
            ('Experiences', processor.save_experiences),
            ('Education', processor.save_education),
            ('Skills', processor.save_skills),
            ('Certifications', processor.save_certifications),
            ('Socials', processor.save_socials)
        ]

        for section_name, save_method in sections_to_save:
            try:
                logger.info(f"Processing {section_name} section for resume {resume_id}")
                save_method(resume_id, user_id, resume_data)
            except Exception as section_error:
                logger.error(f"Error processing {section_name} section: {str(section_error)}")