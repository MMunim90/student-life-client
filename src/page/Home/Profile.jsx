import React, { useState } from "react";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import useAxios from "../../hooks/useAxios";
import { CiMail } from "react-icons/ci";
import ThemeButton from "../../sharedItem/ThemeButton";
import useAuth from "../../hooks/useAuth";
import { MdEdit } from "react-icons/md";
import { FaHourglassStart } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import Navbar from "../../sharedItem/Navbar";

const Profile = () => {
  const { user, setUser, updateUserProfile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const axiosInstance = useAxios();
  const formatDate = (dateString) => dayjs(dateString).format("DD/MM/YYYY");

  const handleUpdateUser = (e) => {
    e.preventDefault();

    const form = e.target;
    const name = form.name.value;
    const photoURL = form.photoURL.value;
    //console.log(photoURL);

    updateUserProfile({
      displayName: name,
      photoURL: photoURL,
    })
      .then(async () => {
        // Update local state
        setUser({ ...user, displayName: name, photoURL: photoURL });

        // Update displayName in MongoDB
        // try {
        //   await axiosInstance.patch("/users/updateName", {
        //     email: user.email,
        //     displayName: name,
        //   });
        // } catch (error) {
        //   console.error("Failed to update name in DB", error);
        // }

        Swal.fire({
          title: "Great!",
          text: "You updated your profile successfully!",
          icon: "success",
          confirmButtonColor: "#01AFF7",
        });

        setIsOpen(false);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${errorMessage} (${errorCode})`,
        });
      });
  };

  return (
    <div className="w-full min-h-screen">
      <div className="lg:hidden">
        <ThemeButton></ThemeButton>
      </div>
      {/* Banner Section */}
      <div className="w-full h-64 md:h-80 lg:h-96 relative">
        <div className="hidden lg:block">
          <ThemeButton></ThemeButton>
        </div>
        <img
          src="https://images.pexels.com/photos/45987/pexels-photo-45987.jpeg?cs=srgb&dl=pexels-mali-45987.jpg&fm=jpg"
          alt="Banner"
          className="w-full h-full object-cover"
        />
        {/* Profile Image */}
        <div className="absolute left-1/2 transform -translate-x-1/2 md:left-20 lg:left-32 md:translate-x-0 -bottom-16 lg:-bottom-20">
          <img
            src={user?.photoURL || "https://i.ibb.co.com/990my6Yq/avater.png"}
            alt="Profile"
            className="w-32 h-32 md:w-36 md:h-36 lg:w-44 lg:h-44 rounded-full border-4 border-white shadow-md object-cover"
          />
        </div>
      </div>

      <div className="py-6 md:py-12">
        {/* Profile Info */}
        <div className="mt-20 md:mt-12 px-4 md:pl-20 lg:pl-40 text-center md:text-left">
          <div className="flex gap-4 md:justify-start justify-center mb-2 items-center">
            <h1 className="text-2xl md:text-3xl font-semibold">
              {user.displayName}
            </h1>
            <button
              onClick={() => setIsOpen(true)}
              className="cursor-pointer hover:bg-gray-400 p-2 hover:rounded-full"
            >
              <MdEdit size={25} />
            </button>
          </div>
          <p className="text-md text-gray-400 flex items-center gap-2 md:justify-start justify-center">
            <CiMail size={20} />
            {user.email}
          </p>

          <p className="text-gray-400 flex items-center gap-2 mt-2 md:justify-start justify-center">
            <FaHourglassStart /> {formatDate(user.metadata.creationTime)}
          </p>
        </div>

        {/* Modal Overlay */}
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            {/* Modal Content */}
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 p-6 relative">
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-3 text-gray-500 hover:text-gray-700 text-2xl"
              >
                <IoCloseSharp />
              </button>

              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Update
              </h2>

              <form onSubmit={handleUpdateUser} className="space-y-6">
                <input
                  type="text"
                  name="name"
                  id="username"
                  placeholder="New Username"
                  required
                  className="w-full px-4 py-3 rounded-md border border-gray-300 bg-gray-50 text-black"
                />

                <input
                  type="text"
                  name="photoURL"
                  id="photoURL"
                  placeholder="New Photo URL"
                  required
                  className="w-full px-4 py-3 rounded-md border border-gray-300 bg-gray-50 text-black"
                />

                <button
                  type="submit"
                  className="block w-full p-3 text-white text-center rounded-md text-xl bg-[#2A4759] hover:bg-[#253b49] cursor-pointer"
                >
                  Save
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      <Navbar></Navbar>
    </div>
  );
};

export default Profile;
