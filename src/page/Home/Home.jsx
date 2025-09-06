import React, { useEffect, useState } from "react";
import ThemeButton from "../../sharedItem/ThemeButton";
import { ImMail2 } from "react-icons/im";
import { BsWhatsapp } from "react-icons/bs";
import { Link } from "react-router";
import { RxExternalLink } from "react-icons/rx";
import Navbar from "../../sharedItem/Navbar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../../sharedItem/Loading";
import dayjs from "dayjs";
import { FaHourglassStart } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import { PiPaperPlaneTilt } from "react-icons/pi";
import { MdOutlineComment } from "react-icons/md";
import {
  EmailShareButton,
  WhatsappShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  PinterestShareButton,
  RedditShareButton,
  TelegramShareButton,
  ThreadsShareButton,
  TwitterShareButton,
  FacebookIcon,
  LinkedinIcon,
  PinterestIcon,
  RedditIcon,
  TelegramIcon,
  ThreadsIcon,
  TwitterIcon,
  EmailIcon,
  WhatsappIcon,
} from "react-share";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import Swal from "sweetalert2";
import { GoHeart, GoHeartFill } from "react-icons/go";

const data = [
  {
    id: 1,
    name: "BrickBase",
    image: "https://i.ibb.co.com/0VW7M2g4/Screenshot-2025-07-21-173448.png",
    link: "https://brickbase-47887.web.app/",
  },
  {
    id: 2,
    name: "Runfinity",
    image: "https://i.ibb.co.com/GQK5DBPj/Screenshot-2025-08-09-001551.png",
    link: "https://marathon-management-syst-9bb4a.web.app/",
  },
  // {
  //   id: 3,
  //   name: "Find Mate",
  //   image: "https://i.ibb.co.com/HDCphMqd/Screenshot-2025-06-25-161456.png",
  //   link: "https://find-mate-app.web.app/",
  // },
];

const Home = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const formatDate = (dateString) => dayjs(dateString).format("DD/MM/YYYY");
  const [isOpen, setIsOpen] = useState(false);
  const [hasSaved, setHasSaved] = useState({});
  const queryClient = useQueryClient();

  const shareUrl = window.location.href;

  const {
    data: posts = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await axiosSecure.get("/getAllPosts");
      return res.data;
    },
  });

  const handleSave = async (post) => {
    try {
      await axiosSecure.post("/savedPosts", {
        postId: post._id,
        posterEmail: post.userEmail,
        userEmail: user.email,
        posterName: post.userName,
        posterImage: post.userImage,
        message: post.message,
        image: post.image,
        category: post.category,
      });

      Swal.fire({
        title: "Saved successfully!",
        icon: "success",
      });

      setHasSaved((prev) => ({
        ...prev,
        [post._id]: true,
      }));
    } catch (err) {
      console.error("Failed to save post", err);
      Swal.fire({
        title: "Failed to save",
        text: "Something went wrong. Please try again.",
        icon: "error",
      });
    }
  };

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        if (user?.email) {
          const res = await axiosSecure.get(`/savedPosts/${user.email}`);
          const savedMap = {};
          res.data.forEach((saved) => {
            savedMap[saved.postId] = true;
          });
          setHasSaved(savedMap);
        }
      } catch (err) {
        console.error("Error fetching saved posts", err);
      }
    };

    fetchSavedPosts();
  }, [user?.email, axiosSecure]);

  const handleLike = async (postId) => {
    try {
      const { data: updatedPost } = await axiosSecure.post(
        `/posts/${postId}/like`,
        { userEmail: user.email }
      );

      queryClient.setQueryData(["posts"], (oldPosts = []) =>
        oldPosts.map((post) => (post._id === postId ? updatedPost : post))
      );
    } catch (error) {
      console.error("Failed to like post", error);
      Swal.fire("Error", "Failed to like post", "error");
    }
  };

  const handleUnlike = async (postId) => {
    try {
      const { data: updatedPost } = await axiosSecure.post(
        `/posts/${postId}/unlike`,
        { userEmail: user.email }
      );

      queryClient.setQueryData(["posts"], (oldPosts = []) =>
        oldPosts.map((post) => (post._id === postId ? updatedPost : post))
      );
    } catch (error) {
      console.error("Failed to unlike post", error);
      Swal.fire("Error", "Failed to unlike post", "error");
    }
  };

  return (
    <div>
      <div className="lg:hidden">
        <ThemeButton></ThemeButton>
      </div>

      <div className="w-11/12 mx-auto my-3 grid grid-cols-12 gap-5 mt-6">
        <section className="main col-span-12 xl:col-span-9 lg:mr-10 mx-1">
          <div>
            {isLoading && (
              <div>
                <Loading></Loading>
              </div>
            )}
            {isError && <p className="text-red-500">Failed to load posts</p>}

            <div className="space-y-4 mb-28 md:mb-8 mt-4 md:w-1/2 md:mx-auto">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="p-4 border-b border-gray-400"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={post.userImage}
                      alt={post.userName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex gap-3">
                        <p className="font-semibold">{post.userName}</p>
                        <p className="text-sm text-gray-500">{post.category}</p>
                      </div>
                      <p className="text-gray-400 flex items-center gap-2 justify-start">
                        <FaHourglassStart />{" "}
                        {formatDate(user.metadata.creationTime)}
                      </p>
                    </div>
                  </div>
                  <p className="mb-2">{post.message}</p>
                  {post.image && (
                    <img
                      src={post.image}
                      alt="Post"
                      className="rounded-md w-full max-h-120 object-cover"
                    />
                  )}

                  <div className="flex items-center mt-4 justify-between mx-2 mb-4">
                    <div className="flex gap-4 items-center">
                      <button
                        className="cursor-pointer"
                        onClick={() =>
                          (post.likes || []).includes(user.email)
                            ? handleUnlike(post._id)
                            : handleLike(post._id)
                        }
                      >
                        {(post.likes || []).includes(user.email) ? (
                          <GoHeartFill size={27} />
                        ) : (
                          <GoHeart size={27} />
                        )}
                      </button>

                      {/* <button className="cursor-pointer">
                        <MdOutlineComment size={27} />
                      </button> */}
                      <button
                        onClick={() => setIsOpen(true)}
                        className="cursor-pointer"
                      >
                        <PiPaperPlaneTilt size={27} />
                      </button>
                    </div>
                    {post.userEmail !== user.email && (
                      <button
                        onClick={() => handleSave(post)}
                        disabled={hasSaved[post._id]}
                        className={`${
                          hasSaved[post._id]
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                      >
                        {hasSaved[post._id] ? (
                          <IoBookmark size={27} />
                        ) : (
                          <IoBookmarkOutline size={27} />
                        )}
                      </button>
                    )}
                  </div>
                  <span className="mx-3">{(post.likes || []).length} {" "} Likes</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sidebar */}
        <aside className="hidden xl:block col-span-3 sticky top-8 h-fit">
          <div className="mb-2">
            <ThemeButton></ThemeButton>
          </div>
          <div className="space-y-3 mb-4">
            <div className="px-4 py-2 bg-gray-400 rounded-md">
              <h1 className="text-2xl mb-2 border-b-2 pb-2">Sponsor</h1>
              <p className="mb-2">My Other Creation - </p>
              <div className="">
                {data.map((data) => (
                  <div key={data.id}>
                    <div className="flex gap-2 items-center mb-2">
                      <p>{data.name}</p>
                      <Link to={data.link}>
                        <RxExternalLink />
                      </Link>
                    </div>
                    <img className="mb-2" src={data.image} alt="" />
                  </div>
                ))}
              </div>
            </div>
            <div className="border-2 px-4 py-2 rounded-md">
              <h1 className="text-2xl mb-2 border-b-2 pb-2">Contact</h1>
              <div className="space-y-2">
                <p className="flex gap-3 text-lg items-center">
                  <ImMail2 size={20} />
                  shahan.al.munim
                  <br />
                  @gmail.com
                </p>
                <p className="flex gap-3 text-lg items-center">
                  <BsWhatsapp size={20} />
                  +8801705620458
                </p>
              </div>
            </div>
          </div>
          <p>&copy; {new Date().getFullYear()} BrainBox by MMunim</p>
        </aside>
      </div>
      <Navbar></Navbar>

      {/* Share Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          {/* Modal Content */}
          <div className="rounded-lg shadow-2xl w-full max-w-lg mx-4 p-6 relative bg-gray-800">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-300 hover:text-gray-400 text-2xl cursor-pointer"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold text-white mb-6 text-center">
              Share this Post
            </h2>

            {/* Share Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <FacebookShareButton url={shareUrl}>
                <FacebookIcon size={48} round />
              </FacebookShareButton>
              <TwitterShareButton url={shareUrl}>
                <TwitterIcon size={48} round />
              </TwitterShareButton>
              <LinkedinShareButton url={shareUrl}>
                <LinkedinIcon size={48} round />
              </LinkedinShareButton>
              <RedditShareButton url={shareUrl}>
                <RedditIcon size={48} round />
              </RedditShareButton>
              <TelegramShareButton url={shareUrl}>
                <TelegramIcon size={48} round />
              </TelegramShareButton>
              <PinterestShareButton url={shareUrl}>
                <PinterestIcon size={48} round />
              </PinterestShareButton>
              <ThreadsShareButton url={shareUrl}>
                <ThreadsIcon size={48} round />
              </ThreadsShareButton>
              <EmailShareButton url={shareUrl}>
                <EmailIcon size={48} round />
              </EmailShareButton>
              <WhatsappShareButton url={shareUrl}>
                <WhatsappIcon size={48} round />
              </WhatsappShareButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
