"use client";

export const ProgressBar = ({
  percentage,
  height = 3,
  bgColor = "bg-black",
  bgTrack = "bg-gray-200",
}) => {
  const validPercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <div
      className={`w-full ${bgTrack} rounded-full`}
      style={{ height: `${height}px` }}
    >
      <div
        className={`${bgColor} rounded-full transition-all duration-300 ease-in-out`}
        style={{ width: `${validPercentage}%`, height: `${height}px` }}
      ></div>
    </div>
  );
};
