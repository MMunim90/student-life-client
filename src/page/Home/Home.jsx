import React from "react";
import ThemeButton from "../../sharedItem/ThemeButton";
import { ImMail2 } from "react-icons/im";
import { BsWhatsapp } from "react-icons/bs";
import { Link } from "react-router";
import { RxExternalLink } from "react-icons/rx";
import Navbar from "../../sharedItem/Navbar";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../../sharedItem/Loading";
import dayjs from "dayjs";
import { FaHourglassStart, FaRegHeart } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import { FiBookmark } from "react-icons/fi";
import { PiPaperPlaneTiltBold } from "react-icons/pi";
import { MdOutlineModeComment } from "react-icons/md";

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
                  className="p-4 pb-8 border-b border-gray-400"
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

                  <div className="flex items-center mt-4 justify-between mx-2">
                    <div className="flex gap-4 md:gap-6 items-center">
                      <button className="cursor-pointer"><FaRegHeart size={27}/></button>
                      <button className="cursor-pointer"><MdOutlineModeComment size={27}/></button>
                      <button className="cursor-pointer"><PiPaperPlaneTiltBold size={27}/></button>
                    </div>
                    <button className="cursor-pointer"><FiBookmark size={27}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

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
    </div>
  );
};

export default Home;
