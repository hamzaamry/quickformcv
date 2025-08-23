export const MacWindow = ({
  children,
  title = "ClaraHire - Resume Builder",
  className = "",
}) => {
  return (
    <div className={`bg-gray-100 rounded-t-lg shadow-2xl ${className}`}>
      {/* Mac Window Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-200 rounded-t-lg border-b border-gray-300">
        {/* Traffic Light Buttons */}
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>

        {/* Window Title */}
        <div className="flex-1 text-center">
          <span className="text-sm font-medium text-gray-700">{title}</span>
        </div>

        {/* Empty space for balance */}
        <div className="w-16"></div>
      </div>

      {/* Window Content */}
      <div className="bg-white">{children}</div>
    </div>
  );
};
