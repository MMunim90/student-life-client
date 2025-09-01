import React from "react";
import { Link, useLocation, useNavigate } from "react-router";
import Lottie from "lottie-react";
import registerLottie from "../../../assets/lottie/register.json";
import FadeIn from "react-fade-in";
import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useForm } from "react-hook-form";
import Logo from "../../../sharedItem/logo";
import ThemeButton from "../../../sharedItem/ThemeButton";
import Footer from "../../../sharedItem/Footer";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import axios from "axios";
import SocialLogin from "../SocialLogin/SocialLogin";
// import useAxios from "../../../hooks/useAxios";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
//   const axiosInstance = useAxios();

  const { createUser, updateUserProfile } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/app/home";

  const onSubmit = (data) => {
    //console.log(data);
    createUser(data.email, data.password)
      .then(async (result) => {
        //console.log(result.user);
        const user = result.user;

        //update userinfo in the database
        // const userInfo = {
        //   displayName: data.name,
        //   email: data.email,
        //   role: "user", // default role
        //   created_at: new Date().toISOString(),
        //   last_logged_in: new Date().toISOString(),
        // };

        // const userRes = await axiosInstance.post("/users", userInfo);
        //console.log(userRes.data);

        // update user profile in firebase
        const userProfile = {
          displayName: data.name,
          photoURL: profilePic,
        };
        updateUserProfile(userProfile)
          .then(() => {
            //console.log("profile name pic updated");
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

        Swal.fire({
          title: `${user.displayName} Registration Successful!`,
          icon: "success",
          confirmButtonColor: "#01AFF7",
        });
        navigate(from);
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

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    //console.log(image);
    const formData = new FormData();
    formData.append("image", image);

    const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${
      import.meta.env.VITE_image_upload_key
    }`;
    const res = await axios.post(imageUploadUrl, formData);
    setProfilePic(res.data.data.url);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left: Lottie Section */}
      <div className="hidden flex-1 bg-white lg:flex items-center justify-center p-4">
        <div className="flex items-center justify-center">
          <Lottie animationData={registerLottie} loop={true}></Lottie>
        </div>
      </div>

      {/* Right: Form Section */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-1 flex items-center justify-center p-8"
      >
        <div className="w-full max-w-md">
          <FadeIn>
            <div>
              <Logo></Logo>
            </div>

            <ThemeButton></ThemeButton>

            {/* Name */}
            <input
              type="text"
              {...register("name", { required: true })}
              placeholder="Full Name"
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name?.type === "required" && (
              <p className="text-red-500 mb-4">Name is required</p>
            )}

            {/* Photo Upload */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full mb-4 text-sm file:px-4 file:py-2 border border-gray-300 rounded file:bg-blue-500 file:text-white file:cursor-pointer file:hover:bg-blue-600"
            />

            {/* Email */}
            <input
              type="email"
              {...register("email", { required: true })}
              placeholder="Email address"
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email?.type === "required" && (
              <p className="text-red-500 mb-4">Email is required</p>
            )}

            {/* Password */}
            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                  validate: {
                    hasCapitalLetter: (value) =>
                      /[A-Z]/.test(value) ||
                      "Must include at least one capital letter",
                    hasSpecialChar: (value) =>
                      /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                      "Must include at least one special character",
                  },
                })}
                placeholder="Password"
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div
                className="absolute right-4 top-1/2 transform -translate-y-1/2  cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </div>
            </div>

            {/* Error Messages */}
            {errors.password && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.password.message}
              </p>
            )}

            {/* Register Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition"
            >
              Sign up
            </button>
            {/* OR Divider */}
            <div className="flex items-center my-4">
              <div className="flex-grow h-px bg-gray-300"></div>
              <span className="px-2 text-gray-500 text-sm">OR</span>
              <div className="flex-grow h-px bg-gray-300"></div>
            </div>

            {/* Google Register */}
            <SocialLogin></SocialLogin>

            {/* Signin Link */}
            <p className="text-center text-sm mt-6 pb-10">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                Sign in
              </Link>
            </p>
          </FadeIn>
        </div>
      </form>
      <Footer></Footer>
    </div>
  );
};

export default Register;
