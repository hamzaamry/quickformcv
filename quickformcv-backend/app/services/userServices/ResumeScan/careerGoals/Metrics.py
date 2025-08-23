import time
import logging

from ....shared.GroqService import GroqService
from ...utils.utils import *
from ..prompts.CareerGoalsPrompts import *

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')
logger = logging.getLogger(__name__)

class CareerGoalsMetricsCalculator:
    def __init__(self, delay_seconds=0.5):
        self.groq_service = GroqService()
        self.delay_seconds = delay_seconds

    def analyze_all_career_metrics(self, metadata: List[Dict]) -> Tuple[
        Tuple[float, str, str],  # position targeting
        Tuple[float, str, str]   # career transition
    ]:
        """Analyze all career goal metrics in a single call."""
        start_time = time.time()
        logger.info("Starting combined career goals analysis")

        if not metadata:
            default_response = (0.5, "Unable to analyze due to missing metadata", "")
            return default_response, default_response

        prompt = COMBINED_CAREER_GOALS_ANALYSIS.format(metrics=metadata)
        response = self._get_ai_response_with_timing(prompt, "combined career goals analysis")

        # Parse the response into the two components
        try:
            position_targeting = self._extract_component(response, "POSITION TARGETING")
            career_transition = self._extract_component(response, "CAREER TRANSITION")
        except Exception as e:
            logger.error(f"Error parsing response: {str(e)}", exc_info=True)
            error_response = (0.5, "Analysis error", "Please check resume formatting")
            return error_response, error_response

        logger.info(f"Combined career goals analysis completed in {time.time() - start_time:.2f}s")
        return position_targeting, career_transition

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