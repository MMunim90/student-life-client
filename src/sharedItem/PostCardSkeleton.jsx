import { GoHeart, GoHeartFill } from "react-icons/go";
import { PiPaperPlaneTilt } from "react-icons/pi";
import { IoBookmarkOutline, IoBookmark } from "react-icons/io5";
import { FaHourglassStart } from "react-icons/fa";

const PostCardSkeleton = () => {
  return (
    <div className="p-4 border-b border-gray-400 animate-pulse">
      {/* User info */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-gray-300" />
        <div className="flex-1">
          <div className="flex gap-3">
            <div className="h-4 w-24 bg-gray-300 rounded" />
            <div className="h-4 w-16 bg-gray-300 rounded" />
          </div>
          <div className="flex items-center gap-2 mt-1">
            <FaHourglassStart className="text-gray-400" />
            <div className="h-3 w-32 bg-gray-300 rounded" />
          </div>
        </div>
      </div>

      {/* Message */}
      <p className="mb-3">
        <span className="block h-3 w-full bg-gray-300 rounded mb-2" />
        <span className="block h-3 w-5/6 bg-gray-300 rounded" />
      </p>

      {/* Post image */}
      <div className="w-full h-60 bg-gray-300 rounded-md mb-4" />

      {/* Actions */}
      <div className="flex items-center mt-4 justify-between mx-2 mb-4">
        <div className="flex gap-4 items-center">
          <div className="w-7 h-7 bg-gray-300 rounded-full" />
          {/* <button className="cursor-pointer">
            <MdOutlineComment size={27} />
          </button> */}
          <div className="w-7 h-7 bg-gray-300 rounded-full" />
        </div>
        <div className="w-7 h-7 bg-gray-300 rounded-full" />
      </div>

      {/* Likes count */}
      <span className="mx-3 block h-3 w-20 bg-gray-300 rounded" />
    </div>
  );
};

export default PostCardSkeleton;
