import React from "react";
import { FaHourglassStart } from "react-icons/fa";

const PostManageCardSkeleton = () => {
  return (
    <div className="border border-gray-300 p-4 rounded-md shadow-lg animate-pulse">
      {/* Remove button */}
      <div className="w-full mb-3 flex justify-end">
        <div className="h-4 w-16 bg-gray-300 rounded" />
      </div>

      {/* Image placeholder */}
      <div className="rounded-lg w-full h-80 bg-gray-300 mb-4" /> 

      {/* Message placeholder */}
      <div className="space-y-3 mb-5"> 
        <div className="h-4 w-full bg-gray-300 rounded" /> {/* increased height */}
        <div className="h-4 w-5/6 bg-gray-300 rounded" /> {/* increased height */}
      </div>

      {/* User info */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gray-300" />
        <div className="flex-1">
          <div className="flex gap-3 mb-2"> {/* increased margin bottom */}
            <div className="h-4 w-28 bg-gray-300 rounded" /> {/* slightly longer */}
            <div className="h-4 w-20 bg-gray-300 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <FaHourglassStart className="text-gray-400" />
            <div className="h-3 w-32 bg-gray-300 rounded" /> {/* slightly longer */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostManageCardSkeleton;