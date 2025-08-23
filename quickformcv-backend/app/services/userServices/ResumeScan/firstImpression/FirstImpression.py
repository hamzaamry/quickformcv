import time
import logging
from typing import Dict, List

from ..Constants import FIRST_IMPRESSION_WEIGHTS
from .Metrics import MetricsCalculator

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')
logger = logging.getLogger(__name__)

class FirstImpression:
    def __init__(self, delay_seconds=0.5):
        self.metrics_calculator = MetricsCalculator(delay_seconds)
        self.weights = FIRST_IMPRESSION_WEIGHTS
        self.delay_seconds = delay_seconds

    def analyze_resume(self, metadata: List[Dict]) -> Dict:
        """Analyze resume metadata and return comprehensive scoring and feedback."""
        start_time = time.time()
        logger.info("Starting resume analysis")

        # Add delay between service initialization and first call
        self._add_delay("Before starting analysis")

        # Get all metrics in a single API call
        (
            (readability_score, readability_explanation, readability_suggestion),
            (design_score, design_explanation, design_suggestion),
            (summary_score, summary_explanation, summary_suggestion),
            (appearance_score, appearance_explanation, appearance_suggestion)
        ) = self.metrics_calculator.analyze_first_impression(metadata)

        logger.info(f"First impression metrics analysis completed in {time.time() - start_time:.2f}s")

        overall_score = sum(
            [
                readability_score * self.weights["readability"],
                design_score * self.weights["design"],
                summary_score * self.weights["summary"],
                appearance_score * self.weights["appearance"],
                ]
        )

        total_time = time.time() - start_time
        logger.info(f"Total analysis completed in {total_time:.2f}s")

        return {
            "overall_score": overall_score,
            "metrics": {
                "readability": {
                    "score": readability_score,
                    "explanation": readability_explanation,
                    "suggestion": readability_suggestion,
                },
                "design": {
                    "score": design_score,
                    "explanation": design_explanation,
                    "suggestion": design_suggestion,
                },
                "summary": {
                    "score": summary_score,
                    "explanation": summary_explanation,
                    "suggestion": summary_suggestion,
                },
                "appearance": {
                    "score": appearance_score,
                    "explanation": appearance_explanation,
                    "suggestion": appearance_suggestion,
                },
            },
            "processing_time": f"{total_time:.2f}s"
        }

    def _add_delay(self, checkpoint_name=""):
        """Add configurable delay between operations and log it"""
        if self.delay_seconds > 0:
            logger.info(f"Adding delay of {self.delay_seconds}s {checkpoint_name}")
            time.sleep(self.delay_seconds)