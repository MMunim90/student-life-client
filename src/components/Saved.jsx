import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";
import { FaHourglassStart } from "react-icons/fa";
import dayjs from "dayjs";
import PostManageCardSkeleton from "../sharedItem/PostManageCardSkeleton";

const Saved = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const formatDate = (dateString) => dayjs(dateString).format("DD/MM/YYYY");
  const [expandedPosts, setExpandedPosts] = useState({});
  const [imgOpen, setImgOpen] = useState(null);

  const {
    data: savedPosts = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["savedPosts", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/savedPosts/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This post will be permanently removed from your saved posts!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/savedPosts/${id}`);
        Swal.fire(
          "Removed!",
          "Post has been removed from saved posts.",
          "success"
        );

        // Refresh saved posts list
        queryClient.invalidateQueries(["savedPosts", user?.email]);
      } catch (err) {
        console.error("Failed to remove saved post", err);
        Swal.fire("Error", "Failed to remove post. Please try again.", "error");
      }
    }
  };

  if (isLoading)
    return (
      <div className="w-11/12 lg:w-9/12 mx-auto my-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-28 md:mb-8">
          {[...Array(6)].map((_, i) => (
            <PostManageCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  if (isError)
    return <p className="text-red-500">Failed to load saved posts</p>;

  return (
    <div className="w-11/12 lg:w-9/12 mx-auto my-6">
      {savedPosts.length === 0 ? (
        <p className="text-gray-600 text-center text-2xl mb-28 md:mb-8">
          You don’t have any saved posts yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-28 md:mb-8">
          {savedPosts.map((post) => (
            <div
              key={post._id}
              className="border border-gray-300 p-4 rounded-md shadow-lg"
            >
              <button
                onClick={() => handleDelete(post._id)}
                className="w-full cursor-pointer mb-3 text-end"
              >
                Remove
              </button>

              {post.image && (
                <img
                  onClick={() => setImgOpen(post.image)}
                  src={post.image}
                  alt="Post"
                  className="rounded-lg w-full object-cover h-92 cursor-pointer"
                />
              )}

              {imgOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
                  <div className="w-11/12 max-w-2xl p-6 overflow-y-auto max-h-[90vh]">
                    {/* Header */}

                    <button
                      onClick={() => setImgOpen(null)}
                      className="text-gray-400 hover:text-gray-500 text-2xl font-bold cursor-pointer absolute top-6 right-6"
                    >
                      ✕
                    </button>

                    {/* Image */}
                    <div className="flex justify-center">
                      <img
                        src={imgOpen}
                        alt="Post preview"
                        className="rounded-lg max-h-[75vh] object-contain"
                      />
                    </div>
                  </div>
                </div>
              )}
              <p className="mb-3 mt-3">
                {post.message.split(" ").length > 22 ? (
                  <>
                    {expandedPosts[post._id]
                      ? post.message
                      : post.message.split(" ").slice(0, 20).join(" ") + "..."}
                    <button
                      onClick={() =>
                        setExpandedPosts((prev) => ({
                          ...prev,
                          [post._id]: !prev[post._id],
                        }))
                      }
                      className="text-[#4b83a5] ml-2 cursor-pointer"
                    >
                      {expandedPosts[post._id] ? "See Less" : "See More"}
                    </button>
                  </>
                ) : (
                  post.message
                )}
              </p>

              <div className="flex items-center gap-3 mb-2">
                <img
                  onClick={() => setImgOpen(post.posterImage)}
                  src={post.posterImage}
                  alt={post.posterName}
                  className="w-10 h-10 rounded-full object-cover cursor-pointer"
                />
                <div>
                  <div className="flex gap-3">
                    <p className="font-semibold">{post.posterName}</p>
                    <p className="text-sm text-gray-500">{post.category}</p>
                  </div>
                  <p className="text-gray-400 flex items-center gap-2 justify-start">
                    <FaHourglassStart />{" "}
                    {formatDate(user.metadata.creationTime)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Saved;
