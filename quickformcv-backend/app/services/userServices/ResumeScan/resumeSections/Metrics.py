import time
import logging

from ....shared.GroqService import GroqService
from ...utils.utils import *
from ..prompts.ResumeSectionsPrompts import RESUME_SECTION_ANALYSIS

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')
logger = logging.getLogger(__name__)

class ResumeSectionsMetricsCalculator:
    def __init__(self, delay_seconds=3):
        self.groq_service = GroqService()
        self.delay_seconds = delay_seconds

    def analyze_all_sections(self, metadata: List[Dict]) -> Tuple[
        Tuple[float, str, str],  # section labeling
        Tuple[float, str, str],  # section order
        Tuple[float, str, str]   # work history order
    ]:
        """Analyze all section metrics in a single call."""
        start_time = time.time()
        logger.info("Starting combined resume sections analysis")

        if not metadata:
            default_response = (0.5, "Unable to analyze due to missing metadata", "")
            return default_response, default_response, default_response

        prompt = RESUME_SECTION_ANALYSIS.format(metrics=metadata)
        response = self._get_ai_response_with_timing(prompt, "combined sections analysis")

        # Parse the response into the three components
        try:
            section_labeling = self._extract_component(response, "SECTION LABELING")
            section_order = self._extract_component(response, "SECTION ORDER")
            work_history = self._extract_component(response, "WORK HISTORY ORDER")
        except Exception as e:
            logger.error(f"Error parsing response: {str(e)}", exc_info=True)
            error_response = (0.5, "Analysis error", "Please check resume formatting")
            return error_response, error_response, error_response

        logger.info(f"Combined sections analysis completed in {time.time() - start_time:.2f}s")
        return section_labeling, section_order, work_history

    def _extract_component(self, response: str, section_name: str) -> Tuple[float, str, str]:
        """Extract a single component from the combined response."""
        section_text = response.split(f"=== {section_name} ===")[1].split("===")[0]
        return extract_llm_components(section_text)

    def _get_ai_response_with_timing(self, prompt, description="AI request"):
        """Get AI response with timing logs and delay"""
        ai_start_time = time.time()
        logger.info(f"Sending request to AI for {description}")

        response = self.groq_service.get_AI_response_sync(prompt)

        ai_time = time.time() - ai_start_time
        logger.info(f"AI response for {description} received in {ai_time:.2f}s")

        if self.delay_seconds > 0:
            logger.info(f"Adding delay of {self.delay_seconds}s after {description}")
            time.sleep(self.delay_seconds)

        return response