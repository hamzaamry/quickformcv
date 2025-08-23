import time
import logging
from typing import Dict, List

from ..Constants import WRITING_STYLE_WEIGHTS
from .Metrics import WritingStyleMetricsCalculator

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')
logger = logging.getLogger(__name__)

class WritingStyle:
    def __init__(self, delay_seconds=0.5):
        self.metrics_calculator = WritingStyleMetricsCalculator(delay_seconds)
        self.weights = WRITING_STYLE_WEIGHTS
        self.delay_seconds = delay_seconds

    def analyze_resume(self, metadata: List[Dict]) -> Dict:
        """Analyze the resume's writing style with a single API call."""
        start_time = time.time()
        logger.info("Starting writing style analysis")

        # Add initial delay if needed
        self._add_delay("Before starting writing style analysis")

        # Get all metrics in one call
        (first_person_results, logical_flow_results,
         crisp_phrases_results, error_free_results) = self.metrics_calculator.analyze_all_writing_metrics(metadata)

        logger.info(f"Writing style metrics analysis completed in {time.time() - start_time:.2f}s")

        overall_score = sum(
            [
                first_person_results[0] * self.weights["first_person_voice"],
                logical_flow_results[0] * self.weights["logical_flow"],
                crisp_phrases_results[0] * self.weights["crisp_phrases"],
                error_free_results[0] * self.weights["error_free_writing"],
                ]
        )

        total_time = time.time() - start_time
        logger.info(f"Total writing style analysis completed in {total_time:.2f}s")

        return {
            "overall_score": overall_score,
            "metrics": {
                "first_person_voice": {
                    "score": first_person_results[0],
                    "explanation": first_person_results[1],
                    "suggestion": first_person_results[2],
                },
                "logical_flow": {
                    "score": logical_flow_results[0],
                    "explanation": logical_flow_results[1],
                    "suggestion": logical_flow_results[2],
                },
                "crisp_phrases": {
                    "score": crisp_phrases_results[0],
                    "explanation": crisp_phrases_results[1],
                    "suggestion": crisp_phrases_results[2],
                },
                "error_free_writing": {
                    "score": error_free_results[0],
                    "explanation": error_free_results[1],
                    "suggestion": error_free_results[2],
                },
            },
            "processing_time": f"{total_time:.2f}s"
        }

    def _add_delay(self, checkpoint_name=""):
        """Add configurable delay between operations and log it"""
        if self.delay_seconds > 0:
            logger.info(f"Adding delay of {self.delay_seconds}s {checkpoint_name}")
            time.sleep(self.delay_seconds)