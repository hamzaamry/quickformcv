export const SummarySkeleton = () => {
  return (
    <div className="px-4 pb-4 space-y-4 animate-pulse">
      <div className="space-y-2">
        {/* Label skeleton */}
        <div className="h-4 bg-gray-200 rounded w-32"></div>

        {/* Textarea skeleton */}
        <div className="min-h-[120px] bg-gray-200 rounded"></div>

        {/* Bottom section with button and character count */}
        <div className="flex items-center justify-between">
          {/* Clara suggestion button skeleton */}
          <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-[10px]">
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>

          {/* Character count skeleton */}
          <div className="h-3 bg-gray-200 rounded w-12"></div>
        </div>
      </div>
    </div>
  );
};
