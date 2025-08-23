"use client";

import { useState } from "react";
import {
  AlertCircle,
  CheckCircle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export function KeyInsights({ data }) {
  const [expanded, setExpanded] = useState(false);

  const detailed_analysis = data?.detailed_analysis || {};

  const getTopStrengths = () => {
    const strengths = [];

    // Check all sections for high scores
    if (detailed_analysis && typeof detailed_analysis === "object") {
      Object.entries(detailed_analysis).forEach(([sectionKey, section]) => {
        if (section && section.metrics && typeof section.metrics === "object") {
          Object.entries(section.metrics).forEach(([metricKey, metric]) => {
            if (metric && metric.score >= 0.7) {
              strengths.push({
                title: formatMetricName(metricKey),
                score: Math.round(metric.score * 100),
                section: formatSectionName(sectionKey),
                explanation: metric.explanation
                  ? metric.explanation.split(".")[0]
                  : "",
              });
            }
          });
        }
      });
    }

    // Sort by score (highest first) and take top 3
    return strengths.sort((a, b) => b.score - a.score).slice(0, 3);
  };

  // Function to get areas for improvement from the analysis
  const getAreasForImprovement = () => {
    const improvements = [];

    // Check all sections for low scores
    if (detailed_analysis && typeof detailed_analysis === "object") {
      Object.entries(detailed_analysis).forEach(([sectionKey, section]) => {
        if (section && section.metrics && typeof section.metrics === "object") {
          Object.entries(section.metrics).forEach(([metricKey, metric]) => {
            if (metric && metric.score < 0.7) {
              improvements.push({
                title: formatMetricName(metricKey),
                score: Math.round(metric.score * 100),
                section: formatSectionName(sectionKey),
                explanation: metric.explanation
                  ? metric.explanation.split(".")[0]
                  : "",
                suggestion: metric.suggestion
                  ? metric.suggestion.split(".")[0]
                  : "",
              });
            }
          });
        }
      });
    }

    // Sort by score (lowest first) and take top 3
    return improvements.sort((a, b) => a.score - b.score).slice(0, 3);
  };

  // Function to generate a quick recommendation based on the lowest scores
  const getQuickRecommendation = () => {
    const improvements = getAreasForImprovement();

    if (improvements.length === 0) {
      return "Your resume is looking great! Consider having it reviewed by someone in your target industry for any final improvements.";
    }

    // Focus on the lowest scored area
    const lowestArea = improvements[0];

    return `Focus on improving your resume's ${lowestArea.section.toLowerCase()} by enhancing ${lowestArea.title.toLowerCase()}. ${lowestArea.suggestion}`;
  };

  // Helper function to format metric names for display
  const formatMetricName = (name) => {
    return name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Helper function to format section names for display
  const formatSectionName = (name) => {
    return name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const strengths = getTopStrengths();
  const improvements = getAreasForImprovement();
  const recommendation = getQuickRecommendation();

  // Get overall categories to highlight
  const section_scores = data?.section_scores || {};
  const highestCategory =
    Object.entries(section_scores).length > 0
      ? Object.entries(section_scores).sort((a, b) => b[1] - a[1])[0]
      : ["No Data", 0];
  const lowestCategory =
    Object.entries(section_scores).length > 0
      ? Object.entries(section_scores).sort((a, b) => a[1] - b[1])[0]
      : ["No Data", 0];

  const getPerformanceAnalytics = () => {
    const sectionScores = data?.section_scores || {};
    const scores = Object.values(sectionScores);

    if (scores.length === 0) {
      return {
        averageScore: 0,
        consistency: 0,
        balanceStatus: "No Data",
        balanceDescription: "Not enough data to calculate balance",
        balanceScore: 0,
        visualImpact: 0,
        contentQuality: 0,
        relationships: [],
        processingTime: data?.processing_time || "N/A",
        scoreDistribution: [],
      };
    }

    // Calculate average score
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

    // Calculate standard deviation for consistency
    const variance =
      scores.reduce((a, b) => a + Math.pow(b - avgScore, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);
    const consistency = 1 - stdDev; // Higher value means more consistent scores

    // Calculate Visual Impact and Content Quality averages
    const visualImpact =
      sectionScores.first_impression && sectionScores.appearance
        ? (sectionScores.first_impression + sectionScores.appearance) / 2
        : 0;
    const contentQuality =
      sectionScores.career_goals && sectionScores.writing_style
        ? (sectionScores.career_goals + sectionScores.writing_style) / 2
        : 0;

    // Calculate balance as average of Visual Impact and Content Quality
    const balanceScore = (visualImpact + contentQuality) / 2;

    // Determine balance status and description based on the new balance score
    let balanceStatus, balanceDescription;
    if (balanceScore >= 0.7) {
      balanceStatus = "Well Balanced";
      balanceDescription =
        "Your resume shows excellent balance between visual impact and content quality.";
    } else if (balanceScore >= 0.5) {
      balanceStatus = "Moderately Balanced";
      balanceDescription =
        "Your resume has reasonable balance but could benefit from improvements in either visual presentation or content quality.";
    } else {
      balanceStatus = "Needs Improvement";
      balanceDescription =
        "Your resume needs significant improvements in either visual presentation, content quality, or both.";
    }

    // Calculate score distribution for visualization
    const scoreDistribution = Object.entries(sectionScores).map(
      ([name, score]) => ({
        name: formatSectionName(name),
        score,
        percentage: Math.round(score * 100),
      }),
    );

    // Identify section relationships
    const relationships = [];
    if (sectionScores.first_impression && sectionScores.appearance) {
      relationships.push({
        sections: ["First Impression", "Appearance"],
        correlation: "Visual Impact",
        status: visualImpact >= 0.7,
        score: visualImpact,
      });
    }
    if (sectionScores.career_goals && sectionScores.writing_style) {
      relationships.push({
        sections: ["Career Goals", "Writing Style"],
        correlation: "Content Quality",
        status: contentQuality >= 0.7,
        score: contentQuality,
      });
    }
    if (sectionScores.experience && sectionScores.skills) {
      const competencyScore =
        (sectionScores.experience + sectionScores.skills) / 2;
      relationships.push({
        sections: ["Experience", "Skills"],
        correlation: "Professional Competency",
        status: competencyScore >= 0.7,
        score: competencyScore,
      });
    }

    return {
      averageScore: avgScore,
      consistency,
      balanceStatus,
      balanceDescription,
      balanceScore,
      visualImpact,
      contentQuality,
      relationships,
      processingTime: data?.processing_time || "N/A",
      scoreDistribution,
      standardDeviation: stdDev,
    };
  };

  const analytics = getPerformanceAnalytics();

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-start">
        <div className="bg-sky-100 p-3 rounded-xl mr-5 flex-shrink-0">
          <Lightbulb size={24} className="text-sky-600" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Key Insights</h3>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <CheckCircle size={18} className="text-emerald-600 mr-2" />
                Strengths
              </h4>
              <ul className="space-y-3">
                {strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <div className="bg-emerald-100 p-1 rounded-full mr-2 mt-0.5">
                      <CheckCircle size={12} className="text-emerald-600" />
                    </div>
                    <span className="text-sm">
                      {strength.title} ({strength.score}% score)
                    </span>
                  </li>
                ))}
              </ul>
              {expanded && strengths.length > 0 && (
                <div className="mt-4 pt-4 border-t border-emerald-100">
                  <h5 className="font-medium text-sm text-gray-700 mb-2">
                    Highest Scoring Area:
                  </h5>
                  <div className="text-sm text-gray-600 bg-emerald-50 p-3 rounded-lg">
                    <span className="font-semibold">
                      {formatSectionName(highestCategory[0])}:{" "}
                      {Math.round(highestCategory[1] * 100)}%
                    </span>
                    <p className="mt-1">
                      This is your strongest category - continue to build on
                      these skills!
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-rose-50 rounded-xl p-5 border border-rose-100">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <AlertCircle size={18} className="text-rose-600 mr-2" />
                Areas for Improvement
              </h4>
              <ul className="space-y-3">
                {improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start">
                    <div className="bg-rose-100 p-1 rounded-full mr-2 mt-0.5">
                      <AlertCircle size={12} className="text-rose-600" />
                    </div>
                    <span className="text-sm">
                      {improvement.title} ({improvement.score}% score)
                    </span>
                  </li>
                ))}
              </ul>
              {expanded && improvements.length > 0 && (
                <div className="mt-4 pt-4 border-t border-rose-100">
                  <h5 className="font-medium text-sm text-gray-700 mb-2">
                    Lowest Scoring Area:
                  </h5>
                  <div className="text-sm text-gray-600 bg-rose-50 p-3 rounded-lg">
                    <span className="font-semibold">
                      {formatSectionName(lowestCategory[0])}:{" "}
                      {Math.round(lowestCategory[1] * 100)}%
                    </span>
                    <p className="mt-1">
                      Focus your immediate improvements here for the biggest
                      impact.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
              <Lightbulb size={18} className="text-amber-600 mr-2" />
              Quick Recommendation
            </h4>
            <p className="text-sm text-gray-700">{recommendation}</p>
          </div>

          {expanded && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Lightbulb size={18} className="text-blue-600 mr-2" />
                  Performance Analytics
                </h4>

                <div className="space-y-4">
                  {/* Score Balance */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h5 className="font-medium text-sm">Resume Balance</h5>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          analytics.balanceStatus === "Well Balanced"
                            ? "bg-emerald-100 text-emerald-700"
                            : analytics.balanceStatus === "Moderately Balanced"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {analytics.balanceStatus}
                      </span>
                    </div>

                    <div className="bg-white/50 rounded-lg p-3">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              analytics.balanceScore >= 0.7
                                ? "bg-emerald-500"
                                : analytics.balanceScore >= 0.5
                                  ? "bg-yellow-500"
                                  : "bg-rose-500"
                            }`}
                            style={{
                              width: `${analytics.balanceScore * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs font-medium">
                          {Math.round(analytics.balanceScore * 100)}% Balance
                          Score
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        {analytics.balanceDescription}
                      </p>
                    </div>
                  </div>

                  {/* Visual Impact and Content Quality Scores */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-white/50 rounded-lg p-3 border border-gray-200">
                      <h5 className="text-xs font-medium text-gray-600 mb-1">
                        Visual Impact
                      </h5>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              analytics.visualImpact >= 0.7
                                ? "bg-emerald-500"
                                : analytics.visualImpact >= 0.5
                                  ? "bg-yellow-500"
                                  : "bg-rose-500"
                            }`}
                            style={{
                              width: `${analytics.visualImpact * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs font-medium">
                          {Math.round(analytics.visualImpact * 100)}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        First Impression & Appearance
                      </p>
                    </div>

                    <div className="bg-white/50 rounded-lg p-3 border border-gray-200">
                      <h5 className="text-xs font-medium text-gray-600 mb-1">
                        Content Quality
                      </h5>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              analytics.contentQuality >= 0.7
                                ? "bg-emerald-500"
                                : analytics.contentQuality >= 0.5
                                  ? "bg-yellow-500"
                                  : "bg-rose-500"
                            }`}
                            style={{
                              width: `${analytics.contentQuality * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs font-medium">
                          {Math.round(analytics.contentQuality * 100)}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Career Goals & Writing Style
                      </p>
                    </div>
                  </div>

                  {/* Section Relationships */}
                  <div className="space-y-3 mt-4">
                    <h5 className="font-medium text-sm">
                      Section Relationships
                    </h5>
                    {analytics.relationships.map((rel, index) => (
                      <div key={index} className="bg-white/50 rounded-lg p-3">
                        <div className="flex justify-between items-center text-sm mb-1">
                          <span className="font-medium">{rel.correlation}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-xs ${
                              rel.status
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-rose-100 text-rose-700"
                            }`}
                          >
                            {rel.status ? "Strong" : "Weak"} (
                            {Math.round(rel.score * 100)}%)
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">
                          {rel.sections.join(" + ")}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Processing Stats */}
                  <div className="mt-4 pt-4 border-t border-blue-100">
                    <div className="flex justify-between items-center text-xs text-gray-600">
                      <span>Processing Time</span>
                      <span className="font-medium">
                        {analytics.processingTime}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Lightbulb size={18} className="text-purple-600 mr-2" />
                  Next Steps
                </h4>
                <ol className="space-y-2 ml-5 list-decimal text-sm">
                  <li>
                    Review the detailed analysis tab for specific feedback
                  </li>
                  <li>
                    Implement the suggested improvements, starting with the
                    lowest scoring areas
                  </li>
                  <li>Consider getting a peer review after making changes</li>
                  <li>Scan your resume again to see your progress</li>
                </ol>

                {/* Additional recommendations based on balance */}
                <div className="mt-6 p-4 bg-white rounded-lg border border-purple-100">
                  <h5 className="font-medium text-sm text-gray-700 mb-2">
                    Balance Recommendations
                  </h5>
                  {analytics.balanceScore >= 0.7 ? (
                    <p className="text-xs text-gray-600">
                      Your resume has excellent balance. Maintain this by
                      keeping both visual elements and content quality strong.
                    </p>
                  ) : analytics.balanceScore >= 0.5 ? (
                    <p className="text-xs text-gray-600">
                      Focus on{" "}
                      {analytics.visualImpact > analytics.contentQuality
                        ? "improving content quality"
                        : "enhancing visual presentation"}{" "}
                      to achieve better balance.
                    </p>
                  ) : (
                    <p className="text-xs text-gray-600">
                      Your resume needs significant improvements in both visual
                      presentation and content quality. Start with the lowest
                      scoring area first.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-6 w-full text-center text-sm font-medium text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            {expanded ? "Show Less" : "Show More"}
          </button>
        </div>
      </div>
    </div>
  );
}
