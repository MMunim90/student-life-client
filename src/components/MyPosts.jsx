import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Loading from "../sharedItem/Loading";
import Swal from "sweetalert2";
import { MdDelete } from "react-icons/md";
import dayjs from "dayjs";
import { FaHourglassStart } from "react-icons/fa";

const MyPosts = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const formatDate = (dateString) => dayjs(dateString).format("DD/MM/YYYY");

  const {
    data: posts = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["myPosts", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await axiosSecure.get(`/getUserPosts/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email, // only run if email exists
  });

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This post will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/posts/${id}`);
        Swal.fire("Deleted!", "Your post has been deleted.", "success");

        // Refresh posts list
        queryClient.invalidateQueries(["myPosts", user?.email]);
      } catch (err) {
        console.error("Failed to delete post", err);
        Swal.fire("Error", "Failed to delete post. Please try again.", "error");
      }
    }
  };

  if (isLoading)
    return (
      <div>
        <Loading />
      </div>
    );
  if (isError) return <p className="text-red-500">Failed to load posts</p>;

  return (
    <div className="w-11/12 lg:w-9/12 mx-auto my-6">
      {posts.length === 0 ? (
        <p className="text-gray-600 text-center text-2xl mb-28 md:mb-8">
          You haven’t created any posts yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-28 md:mb-8">
          {posts.map((post) => (
            <div
              key={post._id}
              className="border border-gray-300 rounded-lg shadow-lg hover:shadow-2xl flex flex-col p-4 relative"
            >
              <div className="flex justify-between mb-4">
                <p className="">
                Category: {post.category}
              </p>
              <button
                onClick={() => handleDelete(post._id)}
                className="cursor-pointer"
              >
                Delete
              </button>
              </div>

              {post.image && (
                <img
                  src={post.image}
                  alt="Post"
                  className="rounded-lg w-full object-cover h-92"
                />
              )}
              <div className="flex-1 flex flex-col mt-3">
                <p className="mb-2">{post.message}</p>
                <p className="text-gray-400 flex items-center gap-2 justify-start">
                  <FaHourglassStart /> {formatDate(user.metadata.creationTime)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPosts;
