export const BasicsSkeleton = () => {
  return (
    <div className="px-4 pb-4 space-y-6 animate-pulse">
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
        <div className="flex justify-center">
          <div className="space-y-2">
            <div className="h-24 w-24 bg-gray-200 rounded-xl"></div>
            <div className="h-3 bg-gray-200 rounded w-20 mx-auto"></div>
          </div>
        </div>
      </div>

      {/* First name & Last name grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Professional Headline */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>

      {/* Email & Website grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-12"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Phone and Location - Updated Layout */}
      <div className="space-y-4">
        {/* Phone Number - Full Width */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="flex gap-3">
            <div className="w-[120px] h-10 bg-gray-200 rounded"></div>
            <div className="flex-1 h-10 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Location - Full Width */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};
