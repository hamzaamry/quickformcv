import time
import logging

from ....shared.GroqService import GroqService
from ...utils.utils import *
from ..prompts import ANALYZE_FIRST_IMPRESSION
from ..Constants import COMMON_FONTS

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')
logger = logging.getLogger(__name__)

class MetricsCalculator:
    def __init__(self, delay_seconds=0.5):
        self.groq_service = GroqService()
        self.common_fonts = COMMON_FONTS
        self.delay_seconds = delay_seconds

    def analyze_first_impression(self, metadata: List[Dict]) -> Tuple[
        Tuple[float, str, str],  # readability
        Tuple[float, str, str],  # design
        Tuple[float, str, str],  # summary
        Tuple[float, str, str]   # appearance
    ]:
        """Analyze all aspects of first impression in a single call."""
        start_time = time.time()
        logger.info("Starting first impression analysis")

        if not metadata:
            default_response = (0.5, "Unable to analyze due to missing metadata", "")
            default_summary = (0.5, "Unable to analyze due to missing metadata", "", "")
            return default_response, default_response, default_summary, default_response

        # Prepare the analysis points for each metric
        analysis_points = []

        # Add readability analysis
        readability_points = prepare_readability_analysis(metadata)
        analysis_points.append("READABILITY METRICS:")
        analysis_points.extend(readability_points)
        analysis_points.append("")

        # Add design analysis
        design_points, total_prof_fonts, total_fonts = prepare_design_analysis(metadata, self.common_fonts)
        design_points.extend([
            "Overall:",
            f"- Font professionalism: {total_prof_fonts/max(total_fonts, 1):.0%}",
            f"- Bullet consistency: {'Consistent' if len(design_points) <= 2 else 'Inconsistent'}",
        ])
        analysis_points.append("DESIGN METRICS:")
        analysis_points.extend(design_points)
        analysis_points.append("")

        # Add summary text for analysis
        summary_text = metadata[0]["text"][:1000].strip() if metadata and metadata[0].get("text") else ""
        analysis_points.append("SUMMARY TEXT:")
        analysis_points.append(summary_text)
        analysis_points.append("")

        # Add appearance analysis
        appearance_points, _ = prepare_appearance_analysis(metadata)
        analysis_points.append("APPEARANCE METRICS:")
        analysis_points.extend(appearance_points)

        prompt = ANALYZE_FIRST_IMPRESSION.format(metrics="\n".join(analysis_points))

        response = self._get_ai_response_with_timing(prompt, "first impression analysis")

        score_blocks = extract_score_blocks(response)

        readability_metrics = extract_llm_components(score_blocks[0])
        design_metrics = extract_llm_components(score_blocks[1])

        # Handle the summary block differently as it has an extra line
        summary_block = score_blocks[2]
        try:
            score, explanation, suggestion = extract_llm_components(summary_block)
            summary_metrics = (score, explanation, suggestion)
        except Exception as e:
            logger.error(f"Error extracting summary metrics: {str(e)}", exc_info=True)
            summary_metrics = (0.5, "Error analyzing summary section",
                               "Consider reviewing your professional summary")

        appearance_metrics = extract_llm_components(score_blocks[3])

        logger.info(f"First impression analysis completed in {time.time() - start_time:.2f}s")
        return readability_metrics, design_metrics, summary_metrics, appearance_metrics

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