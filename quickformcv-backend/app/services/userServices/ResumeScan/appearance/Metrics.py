import time
import logging
from typing import Dict, List, Tuple

from ....shared.GroqService import GroqService
from ...utils.utils import *
from ..prompts.AppearancePrompts import ANALYZE_APPEARANCE

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')
logger = logging.getLogger(__name__)

class AppearanceMetricsCalculator:
    def __init__(self, delay_seconds=0.5):
        self.groq_service = GroqService()
        self.delay_seconds = delay_seconds

    def analyze_appearance(self, metadata: List[Dict]) -> Tuple[Tuple[float, str, str], Tuple[float, str, str], Tuple[float, str, str], Tuple[float, str, str]]:
        """Analyze all aspects of appearance in a single call."""
        start_time = time.time()
        logger.info("Starting appearance metrics analysis")

        if not metadata:
            default_response = (0.5, "Unable to analyze due to missing metadata", "")
            return default_response, default_response, default_response, default_response

        # Add delay before metrics preparation
        self._add_delay("Before preparing appearance metrics")

        # Prepare all metrics
        all_metrics = []
        for page in metadata:
            margin_balance = calculate_margin_balance(page["margins"])
            avg_height, spacing_consistency = analyze_line_spacing(page["line_heights"])
            bullet_types, bullet_consistency = analyze_bullets(page["bullets"])
            words_at_top = page.get("text", "")[:100].strip()
            has_header = len(words_at_top) > 0

            all_metrics.extend([
                f"\nPage {page['page']} Metrics:",
                "Visual Presentation:",
                f"- Margin balance ratio: {margin_balance:.2f}",
                f"- Line spacing: {avg_height:.2f} ({spacing_consistency})",
                f"- Font variations: {len(page['fonts'])}",
                f"- Content density: {page['word_count']} words",

                "Margins:",
                f"- Left: {page['margins']['left']:.2f}",
                f"- Right: {page['margins']['right']:.2f}",
                f"- Top: {page['margins']['top']:.2f}",
                f"- Bottom: {page['margins']['bottom']:.2f}",

                "Design Elements:",
                f"- Bullet style: {bullet_consistency}",
                f"- Font types: {len(page['fonts'])}",
                f"- Bullet types: {len(bullet_types)}",

                "Page Formatting:",
                f"- Header present: {'Yes' if has_header else 'No'}",
                f"- Content distribution: {analyze_content_distribution(page['word_count'], page['word_count'])}"
            ])

        prep_time = time.time() - start_time
        logger.info(f"Metrics preparation completed in {prep_time:.2f}s")

        # Add delay before AI call
        self._add_delay("Before AI analysis")

        # Get AI response synchronously
        response = self._get_ai_response_with_timing(
            ANALYZE_APPEARANCE.format(metrics="\n".join(all_metrics)),
            "appearance analysis"
        )

        score_blocks = extract_score_blocks(response)

        visual_metrics = extract_llm_components(score_blocks[0])
        margin_metrics = extract_llm_components(score_blocks[1])
        design_metrics = extract_llm_components(score_blocks[2])
        formatting_metrics = extract_llm_components(score_blocks[3])

        total_time = time.time() - start_time
        logger.info(f"Appearance metrics analysis completed in {total_time:.2f}s")

        return visual_metrics, margin_metrics, design_metrics, formatting_metrics

    def _get_ai_response_with_timing(self, prompt, description="AI request"):
        """Get AI response with timing logs"""
        ai_start_time = time.time()
        logger.info(f"Sending request to AI for {description}")

        # Made synchronous instead of async
        response = self.groq_service.get_AI_response_sync(prompt)

        ai_time = time.time() - ai_start_time
        logger.info(f"AI response for {description} received in {ai_time:.2f}s")

        # Add delay after API call
        self._add_delay(f"after {description}")

        return response

    def _add_delay(self, checkpoint_name=""):
        """Add configurable delay between operations and log it"""
        if self.delay_seconds > 0:
            logger.info(f"Adding delay of {self.delay_seconds}s {checkpoint_name}")
            time.sleep(self.delay_seconds)