import time
import logging
from typing import Dict, List, Tuple

from ....shared.GroqService import GroqService
from ...utils.utils import extract_score_blocks, extract_llm_components
from ..prompts import ANALYZE_ACCOMPLISHMENTS

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')
logger = logging.getLogger(__name__)

class AccomplishmentsMetricsCalculator:
    def __init__(self, delay_seconds=3):
        self.groq_service = GroqService()
        self.delay_seconds = delay_seconds

    def analyze_accomplishments(self, metadata: List[Dict]) -> Tuple[
        Tuple[float, str, str],  # career accomplishments
        Tuple[float, str, str],  # quantification
        Tuple[float, str, str]   # responsibilities vs achievements
    ]:
        """Analyze all aspects of accomplishments in a single call."""
        start_time = time.time()
        logger.info("Starting accomplishments analysis")

        if not metadata:
            default_response = (0.5, "Unable to analyze due to missing metadata", "")
            return default_response, default_response, default_response

        prompt = ANALYZE_ACCOMPLISHMENTS.format(metrics=metadata)
        response = self._get_ai_response_with_timing(prompt, "accomplishments analysis")

        try:
            score_blocks = extract_score_blocks(response)
            if len(score_blocks) < 3:
                raise ValueError(f"Expected 3 score blocks, got {len(score_blocks)}")

            career_metrics = extract_llm_components(score_blocks[0])
            quant_metrics = extract_llm_components(score_blocks[1])
            resp_metrics = extract_llm_components(score_blocks[2])

        except Exception as e:
            logger.error(f"Error parsing response: {str(e)}", exc_info=True)
            error_response = (0.5, "Analysis error - "+str(e), "Please check resume formatting")
            return error_response, error_response, error_response

        logger.info(f"Combined accomplishments analysis completed in {time.time() - start_time:.2f}s")
        return career_metrics, quant_metrics, resp_metrics

    def _get_ai_response_with_timing(self, prompt, description="AI request"):
        """Get AI response with timing logs"""
        ai_start_time = time.time()
        logger.info(f"Sending request to AI for {description}")

        # Made synchronous instead of async
        response = self.groq_service.get_AI_response_sync(prompt)

        ai_time = time.time() - ai_start_time
        logger.info(f"AI response for {description} received in {ai_time:.2f}s")

        # Add delay after each API call
        self._add_delay(f"after {description}")

        return response

    def _add_delay(self, checkpoint_name=""):
        """Add configurable delay between operations and log it"""
        if self.delay_seconds > 0:
            logger.info(f"Adding delay of {self.delay_seconds}s {checkpoint_name}")
            time.sleep(self.delay_seconds)