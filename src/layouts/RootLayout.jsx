import React, { useContext, useState } from "react";
import { Link, NavLink, Outlet } from "react-router";
import {
  FaCheckCircle,
  FaFacebook,
  FaHeart,
  FaStar,
  FaTwitter,
  FaUserCircle,
  FaWhatsapp,
} from "react-icons/fa";
// import useAxios from "../hooks/useAxios";
import Logo from "../sharedItem/logo";
import { LogOut } from "lucide-react";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext/AuthContext";

const RootLayout = () => {
  const { user, logOut } = useContext(AuthContext);
  const [error, setError] = useState(null);
  // const axiosInstance = useAxios();

  const handleLogOut = () => {
    logOut()
      .then(() => {
        Swal.fire({
          title: "Log Out Successfully!",
          icon: "success",
          confirmButtonColor: "#01AFF7",
        });
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

  if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="navbar w-full lg:hidden">
          <div className="flex-none">
            <label
              htmlFor="my-drawer-3"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="mx-2 flex-1 px-2 lg:hidden font-semibold">
            Dashboard
          </div>
        </div>
        {/* Page content here */}
        <Outlet></Outlet>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="flex flex-col justify-between menu min-h-full w-auto p-8 border-r border-gray-500 bg-white text-black">
          {/* Sidebar content here */}
          <div>
            <Logo></Logo>
            {/* <div className="text-center">
              <img
                src={user?.photoURL || "https://i.ibb.co.com/990my6Yq/avater.png"}
                alt="profile"
                className="w-28 h-28 object-cover rounded-full mx-auto border-4 border-blue-400 mb-4"
              />
              <h2 className="font-semibold my-2">{user.displayName}</h2>
              <p className="text-sm text-gray-500 mb-2">{user.email}</p>
            </div>
            <div className="border border-blue-400 text-black mb-4"></div> */}

            {/* user link */}
            {user && (
              <>
                <li>
                  <NavLink
                    to="/app/home"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 rounded ${
                        isActive
                          ? "text-blue-600 font-semibold"
                          : "hover:text-blue-500"
                      }`
                    }
                  >
                    <FaUserCircle /> My Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/wishlist"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 rounded ${
                        isActive
                          ? "text-blue-600 font-semibold"
                          : "hover:text-blue-500"
                      }`
                    }
                  >
                    <FaHeart /> Wishlist
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/propertyBought"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 rounded ${
                        isActive
                          ? "text-blue-600 font-semibold"
                          : "hover:text-blue-500"
                      }`
                    }
                  >
                    <FaCheckCircle /> Property Bought
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/myReviews"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 rounded ${
                        isActive
                          ? "text-blue-600 font-semibold"
                          : "hover:text-blue-500"
                      }`
                    }
                  >
                    <FaStar /> My Reviews
                  </NavLink>
                </li>
              </>
            )}
          </div>

          <div>
            <button
              onClick={handleLogOut}
              className="flex items-center gap-2 mt-20 md:mt-36 lg:mt-0 ml-2 lg:ml-4 cursor-pointer"
            >
              <LogOut className="w-6 h-6 mr-2" />
              <span className="text-xl font-bold">Log Out</span>
            </button>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default RootLayout;
