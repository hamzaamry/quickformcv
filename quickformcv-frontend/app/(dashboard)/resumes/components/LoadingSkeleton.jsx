export const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6 w-full">
    {[...Array(6)].map((_, index) => (
      <div
        key={index}
        className="w-[140px] sm:w-[160px] h-64 rounded-lg border border-gray-200 bg-white shadow-sm animate-pulse"
      >
        <div className="relative w-full h-48 bg-gray-200 rounded-t-lg" />
        <div className="px-2 py-1 space-y-2">
          <div className="h-3 bg-gray-200 rounded w-3/4" />
          <div className="h-2 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    ))}
  </div>
);
