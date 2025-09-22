import React from "react";

const SkeletonCard = () => {
  return (
    <div className="border border-gray-300 rounded-lg shadow-lg flex flex-col p-4 relative animate-pulse">
      {/* Top section */}
      <div className="flex justify-between mb-4">
        <div className="h-4 w-28 bg-gray-300 rounded"></div>
        <div className="h-4 w-12 bg-gray-300 rounded"></div>
      </div>

      {/* Image placeholder */}
      <div className="rounded-lg w-full h-92 bg-gray-300"></div>

      {/* Text section */}
      <div className="flex-1 flex flex-col mt-3">
        <div className="h-4 w-full bg-gray-300 rounded mb-2"></div>
        <div className="h-4 w-3/4 bg-gray-300 rounded mb-3"></div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
          <div className="h-4 w-32 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
