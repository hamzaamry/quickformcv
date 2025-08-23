import time
import logging
from typing import Dict, List

from ..Constants import ACCOMPLISHMENTS_WEIGHTS
from .Metrics import AccomplishmentsMetricsCalculator

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')
logger = logging.getLogger(__name__)

class Accomplishments:
    def __init__(self, delay_seconds=3):
        self.metrics_calculator = AccomplishmentsMetricsCalculator(delay_seconds)
        self.weights = ACCOMPLISHMENTS_WEIGHTS
        self.delay_seconds = delay_seconds

    def analyze_resume(self, metadata: List[Dict]) -> Dict:
        """Analyze resume metadata and return comprehensive scoring and feedback."""
        start_time = time.time()
        logger.info("Starting accomplishments analysis")

        # Add delay between service initialization and first call
        self._add_delay("Before starting accomplishments analysis")

        (
            (accomplishments_score, accomplishments_explanation, accomplishments_suggestion),
            (quantification_score, quantification_explanation, quantification_suggestion),
            (distinction_score, distinction_explanation, distinction_suggestion)
        ) = self.metrics_calculator.analyze_accomplishments(metadata)

        logger.info(f"Accomplishments metrics analysis completed in {time.time() - start_time:.2f}s")

        overall_score = sum(
            [
                accomplishments_score * self.weights["career_accomplishments"],
                quantification_score * self.weights["quantification"],
                distinction_score * self.weights["distinction"],
                ]
        )

        total_time = time.time() - start_time
        logger.info(f"Total accomplishments analysis completed in {total_time:.2f}s")

        return {
            "overall_score": overall_score,
            "metrics": {
                "career_accomplishments": {
                    "score": accomplishments_score,
                    "explanation": accomplishments_explanation,
                    "suggestion": accomplishments_suggestion,
                },
                "quantification": {
                    "score": quantification_score,
                    "explanation": quantification_explanation,
                    "suggestion": quantification_suggestion,
                },
                "distinction": {
                    "score": distinction_score,
                    "explanation": distinction_explanation,
                    "suggestion": distinction_suggestion,
                },
            },
            "processing_time": f"{total_time:.2f}s"
        }

    def _add_delay(self, checkpoint_name=""):
        """Add configurable delay between operations and log it"""
        if self.delay_seconds > 0:
            logger.info(f"Adding delay of {self.delay_seconds}s {checkpoint_name}")
            time.sleep(self.delay_seconds)