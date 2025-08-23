export const ScoreGauge = ({ score, size = "md" }) => {
  // Convert score (0-1) to percentage
  const percentage = Math.round(score * 100);

  // Calculate the SVG circle properties
  const radius = size === "sm" ? 32 : size === "md" ? 40 : 48;
  const strokeWidth = size === "sm" ? 6 : size === "md" ? 8 : 10;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Determine color based on score
  const getScoreColor = (score) => {
    if (score < 0.5) return "#EF4444"; // red-500
    if (score < 0.7) return "#F59E0B"; // yellow-500
    if (score < 0.8) return "#10B981"; // green-500
    return "#059669"; // green-600
  };

  // Size classes
  const containerSize =
    size === "sm" ? "w-16 h-16" : size === "md" ? "w-24 h-24" : "w-32 h-32";
  const textSize =
    size === "sm" ? "text-lg" : size === "md" ? "text-2xl" : "text-3xl";

  return (
    <div
      className={`relative ${containerSize} flex items-center justify-center`}
    >
      <svg
        className="transform -rotate-90 w-full h-full"
        viewBox={`0 0 ${radius * 2} ${radius * 2}`}
      >
        {/* Background circle */}
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="transparent"
          stroke="#E5E7EB" // gray-200
          strokeWidth={strokeWidth}
        />

        {/* Progress circle */}
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="transparent"
          stroke={getScoreColor(score)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>

      {/* Percentage display */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`${textSize} font-bold`}
          style={{ color: getScoreColor(score) }}
        >
          {percentage}%
        </span>
      </div>
    </div>
  );
};
