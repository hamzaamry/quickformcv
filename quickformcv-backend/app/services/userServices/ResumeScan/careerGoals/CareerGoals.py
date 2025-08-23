# app/services/userServices/ResumeScan/careerGoals/CareerGoals.py
import time
import logging
from typing import Dict, List

from ..Constants import CAREER_GOALS_WEIGHTS
from .Metrics import CareerGoalsMetricsCalculator

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')
logger = logging.getLogger(__name__)

class CareerGoals:
    def __init__(self, delay_seconds=0.5):
        self.metrics_calculator = CareerGoalsMetricsCalculator(delay_seconds)
        self.weights = CAREER_GOALS_WEIGHTS
        self.delay_seconds = delay_seconds

    def analyze_resume(self, metadata: List[Dict]) -> Dict:
        """Analyze career goals with a single API call."""
        start_time = time.time()
        logger.info("Starting career goals analysis")

        # Add initial delay if needed
        self._add_delay("Before starting career goals analysis")

        # Get all metrics in one call
        position_results, transition_results = self.metrics_calculator.analyze_all_career_metrics(metadata)

        logger.info(f"Career goals metrics analysis completed in {time.time() - start_time:.2f}s")

        overall_score = sum(
            [
                position_results[0] * self.weights["position_targeting"],
                transition_results[0] * self.weights["career_transition"],
                ]
        )

        total_time = time.time() - start_time
        logger.info(f"Total career goals analysis completed in {total_time:.2f}s")

        return {
            "overall_score": overall_score,
            "metrics": {
                "position_targeting": {
                    "score": position_results[0],
                    "explanation": position_results[1],
                    "suggestion": position_results[2],
                },
                "career_transition": {
                    "score": transition_results[0],
                    "explanation": transition_results[1],
                    "suggestion": transition_results[2],
                },
            },
            "processing_time": f"{total_time:.2f}s"
        }

    def _add_delay(self, checkpoint_name=""):
        """Add configurable delay between operations and log it"""
        if self.delay_seconds > 0:
            logger.info(f"Adding delay of {self.delay_seconds}s {checkpoint_name}")
            time.sleep(self.delay_seconds)