import time
import logging
from typing import Dict, List, Tuple

from ..Constants import APPEARANCE_WEIGHTS
from .Metrics import AppearanceMetricsCalculator

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')
logger = logging.getLogger(__name__)

class Appearance:
    def __init__(self, delay_seconds=3):
        self.metrics_calculator = AppearanceMetricsCalculator(delay_seconds)
        self.weights = APPEARANCE_WEIGHTS
        self.delay_seconds = delay_seconds

    def analyze_resume(self, metadata: List[Dict]) -> Dict:
        """Analyze resume appearance and return comprehensive scoring and feedback."""
        start_time = time.time()
        logger.info("Starting appearance analysis")

        # Add initial delay
        self._add_delay("Before starting appearance analysis")

        # Get all metrics in a single call with timing
        (
            (visual_score, visual_explanation, visual_suggestion),
            (margins_score, margins_explanation, margins_suggestion),
            (consistency_score, consistency_explanation, consistency_suggestion),
            (formatting_score, formatting_explanation, formatting_suggestion)
        ) = self._get_appearance_metrics_with_timing(metadata)

        # Calculate overall score
        overall_score = sum(
            [
                visual_score * self.weights["visual_presentation"],
                margins_score * self.weights["margins"],
                consistency_score * self.weights["design_consistency"],
                formatting_score * self.weights["page_formatting"],
                ]
        )

        total_time = time.time() - start_time
        logger.info(f"Appearance analysis completed in {total_time:.2f}s")

        return {
            "overall_score": overall_score,
            "metrics": {
                "visual_presentation": {
                    "score": visual_score,
                    "explanation": visual_explanation,
                    "suggestion": visual_suggestion,
                },
                "margins": {
                    "score": margins_score,
                    "explanation": margins_explanation,
                    "suggestion": margins_suggestion,
                },
                "design_consistency": {
                    "score": consistency_score,
                    "explanation": consistency_explanation,
                    "suggestion": consistency_suggestion,
                },
                "page_formatting": {
                    "score": formatting_score,
                    "explanation": formatting_explanation,
                    "suggestion": formatting_suggestion,
                },
            },
            "processing_time": f"{total_time:.2f}s"
        }

    def _get_appearance_metrics_with_timing(self, metadata: List[Dict]) -> Tuple:
        """Get appearance metrics with timing and delay handling"""
        start_time = time.time()
        logger.info("Starting appearance metrics calculation")

        result = self.metrics_calculator.analyze_appearance(metadata)

        calc_time = time.time() - start_time
        logger.info(f"Appearance metrics calculated in {calc_time:.2f}s")

        self._add_delay("After appearance metrics calculation")
        return result

    def _add_delay(self, checkpoint_name=""):
        """Add configurable delay between operations and log it"""
        if self.delay_seconds > 0:
            logger.info(f"Adding delay of {self.delay_seconds}s {checkpoint_name}")
            time.sleep(self.delay_seconds)