import React, { useState } from "react";
import { NavLink } from "react-router";
import { GoHomeFill } from "react-icons/go";
import { FaUsers, FaPlus } from "react-icons/fa";
import { GrSchedules } from "react-icons/gr";
import { GiMoneyStack } from "react-icons/gi";
import { PiExamBold, PiStudentBold } from "react-icons/pi";
import useAuth from "../hooks/useAuth";
import UploadForm from "../components/UploadForm";

const Navbar = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 text-white border-t border-gray-800">
      <ul className="flex justify-around items-center py-1">
        <li>
          <NavLink
            to="/app/home"
            className={({ isActive }) =>
              `p-2 ${isActive ? "text-blue-500" : "hover:text-gray-400"}`
            }
          >
            <GoHomeFill size={24} />
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/app/class"
            className={({ isActive }) =>
              `p-2 ${isActive ? "text-blue-500" : "hover:text-gray-400"}`
            }
          >
            <GrSchedules size={24} />
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/app/budget"
            className={({ isActive }) =>
              `relative p-2 ${
                isActive ? "text-blue-500" : "hover:text-gray-400"
              }`
            }
          >
            <GiMoneyStack size={24} />
          </NavLink>
        </li>

        <li>
          <button
            onClick={() => setIsOpen(true)}
            className="text-lg hover:text-blue-500"
          >
            <FaPlus size={24} />
          </button>
        </li>

        <li>
          <NavLink
            to="/app/exam"
            className={({ isActive }) =>
              `p-2 ${isActive ? "text-blue-500" : "hover:text-gray-400"}`
            }
          >
            <PiExamBold size={24} />
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/app/study"
            className={({ isActive }) =>
              `p-2 ${isActive ? "text-blue-500" : "hover:text-gray-400"}`
            }
          >
            <PiStudentBold size={24} />
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/app/profile/myPosts"
            className={({ isActive }) =>
              `p-1 ${isActive ? "" : "hover:opacity-80"}`
            }
          >
            <img
              src={user?.photoURL || "https://i.ibb.co.com/990my6Yq/avater.png"}
              alt="profile"
              className="w-8 h-8 rounded-full object-cover"
            />
          </NavLink>
        </li>
      </ul>

      {/* Modal for Create */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white text-black rounded-xl shadow-lg w-11/12 max-w-4xl p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">Create New Post</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-600 hover:text-red-500 text-2xl font-bold"
              >
                ✕
              </button>
            </div>
            <UploadForm></UploadForm>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
