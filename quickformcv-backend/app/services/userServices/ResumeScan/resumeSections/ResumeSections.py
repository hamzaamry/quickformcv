import time
import logging
from typing import Dict, List

from ..Constants import RESUME_SECTION_WEIGHTS
from .Metrics import ResumeSectionsMetricsCalculator

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')
logger = logging.getLogger(__name__)

class ResumeSectionsAnalysis:
    def __init__(self, delay_seconds=3):
        self.metrics_calculator = ResumeSectionsMetricsCalculator(delay_seconds)
        self.weights = RESUME_SECTION_WEIGHTS
        self.delay_seconds = delay_seconds

    def analyze_resume(self, metadata: List[Dict]) -> Dict:
        """Analyze resume sections metadata and return comprehensive scoring and feedback."""
        start_time = time.time()
        logger.info("Starting resume sections analysis")
        self._add_delay("Before starting sections analysis")
        section_results, order_results, work_history_results = self.metrics_calculator.analyze_all_sections(metadata)
        logger.info(f"Resume sections metrics analysis completed in {time.time() - start_time:.2f}s")
        overall_score = sum(
            [
                section_results[0] * self.weights["section_labeling"],
                order_results[0] * self.weights["section_order"],
                work_history_results[0] * self.weights["work_history_order"],
                ]
        )

        total_time = time.time() - start_time
        logger.info(f"Total sections analysis completed in {total_time:.2f}s")

        return {
            "overall_score": overall_score,
            "metrics": {
                "section_labeling": {
                    "score": section_results[0],
                    "explanation": section_results[1],
                    "suggestion": section_results[2],
                },
                "section_order": {
                    "score": order_results[0],
                    "explanation": order_results[1],
                    "suggestion": order_results[2],
                },
                "work_history_order": {
                    "score": work_history_results[0],
                    "explanation": work_history_results[1],
                    "suggestion": work_history_results[2],
                },
            },
            "processing_time": f"{total_time:.2f}s"
        }

    def _add_delay(self, checkpoint_name=""):
        """Add configurable delay between operations and log it"""
        if self.delay_seconds > 0:
            logger.info(f"Adding delay of {self.delay_seconds}s {checkpoint_name}")
            time.sleep(self.delay_seconds)