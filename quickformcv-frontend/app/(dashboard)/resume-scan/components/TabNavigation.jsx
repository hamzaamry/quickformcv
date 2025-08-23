"use client";

export const TabNavigation = ({ activeTab, setActiveTab }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-1 mb-8">
      <div className="flex">
        <button
          onClick={() => setActiveTab("detailed")}
          className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "detailed"
              ? "bg-gray-100 text-gray-900"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          Detailed Analysis
        </button>
        <button
          onClick={() => setActiveTab("recommendations")}
          className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "recommendations"
              ? "bg-gray-100 text-gray-900"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          Recommendations
        </button>
      </div>
    </div>
  );
};
