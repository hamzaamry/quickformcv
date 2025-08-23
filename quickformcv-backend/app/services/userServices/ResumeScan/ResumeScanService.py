import logging
from .appearance.Appearance import Appearance
from .careerGoals.CareerGoals import CareerGoals
from .Constants import SECTION_WEIGHTS
from .firstImpression.FirstImpression import FirstImpression
from .writingStyle.WritingStyle import WritingStyle
import time
from typing import Dict, List
from concurrent.futures import ThreadPoolExecutor, as_completed

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')
logger = logging.getLogger(__name__)

class ResumeScanService:
    def __init__(self, delay_between_calls=1.5, max_workers=2):  # Added max_workers parameter
        self.first_impression = FirstImpression(delay_between_calls)
        self.appearance = Appearance(delay_between_calls)
        self.career_goals = CareerGoals(delay_between_calls)
        self.writing_style = WritingStyle(delay_between_calls)
        self.weights = SECTION_WEIGHTS
        self.delay_between_calls = delay_between_calls
        self.max_workers = max_workers  # Number of parallel processes

    def analyze_resume(self, metadata: List[Dict]) -> Dict:
        """
        Analyze the resume using parallel services with dynamic grouping.
        Returns comprehensive analysis results.
        """
        start_time = time.time()
        logger.info("Starting full resume analysis")

        # Define all analysis functions (now without fixed groups)
        analysis_functions = [
            (self.first_impression.analyze_resume, "first_impression"),
            (self.appearance.analyze_resume, "appearance"),
            (self.career_goals.analyze_resume, "career_goals"),
            (self.writing_style.analyze_resume, "writing_style"),
        ]

        results = {}
        self._add_delay("Before starting full analysis")

        # Process in dynamically sized batches based on max_workers
        for i in range(0, len(analysis_functions), self.max_workers):
            current_batch = analysis_functions[i:i + self.max_workers]

            with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
                futures = {
                    executor.submit(self._safe_execute, func, metadata, name): name
                    for func, name in current_batch
                }

                for future in as_completed(futures):
                    name = futures[future]
                    try:
                        results[name] = future.result()
                        logger.info(f"Completed {name} analysis")
                    except Exception as e:
                        logger.error(f"Error in {name}: {str(e)}", exc_info=True)
                        results[name] = {
                            "overall_score": 0,
                            "error": str(e),
                            "metrics": {}
                        }

            # Add delay between batches but not within batches
            if i + self.max_workers < len(analysis_functions):  # Only if more batches remain
                self._add_delay(f"after batch {i//self.max_workers + 1}")

        # Calculate overall score using weighted average
        section_scores = {
            name: {
                "score": results[name].get("overall_score", 0),
                "weight": self.weights[name]
            }
            for name in results
        }

        total_weight = sum(section["weight"] for section in section_scores.values())
        overall_score = sum(
            section["score"] * section["weight"]
            for section in section_scores.values()
        ) / total_weight if total_weight > 0 else 0

        total_time = time.time() - start_time
        logger.info(f"Full resume analysis completed in {total_time:.2f}s")

        return {
            "overall_score": round(overall_score, 2),
            "section_scores": {
                name: round(data["score"], 2)
                for name, data in section_scores.items()
            },
            "detailed_analysis": results,
            "processing_time": f"{total_time:.2f}s"
        }

    def _safe_execute(self, func, metadata, name):
        """Wrapper function for safe execution in threads"""
        logger.info(f"Starting {name} analysis")
        try:
            return func(metadata)
        except Exception as e:
            logger.error(f"Error in {name} during parallel execution: {str(e)}", exc_info=True)
            raise

    def _add_delay(self, checkpoint_name=""):
        """Add configurable delay between operations"""
        if self.delay_between_calls > 0:
            logger.info(f"Adding delay of {self.delay_between_calls}s {checkpoint_name}")
            time.sleep(self.delay_between_calls)