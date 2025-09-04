import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Loading from "../sharedItem/Loading";

const MyPosts = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

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

  if (isLoading)
    return (
      <div>
        <Loading></Loading>
      </div>
    );
  if (isError) return <p className="text-red-500">Failed to load posts</p>;

  return (
    <div className="w-11/12 lg:w-9/12 mx-auto my-6">
      {posts.length === 0 ? (
        <p>You haven’t created any posts yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-28 md:mb-8">
          {posts.map((post) => (
            <div
              key={post._id}
              className="border border-gray-300 rounded-lg shadow-lg hover:shadow-2xl flex flex-col"
            >
              {post.image && (
                <img
                  src={post.image}
                  alt="Post"
                  className="rounded-t-lg w-full object-cover md:h-92"
                />
              )}
              <div className="p-4 flex-1 flex flex-col">
                <p className="mb-2">{post.message}</p>
                <p className="text-sm text-gray-500 mt-auto">
                  Category: {post.category}
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
