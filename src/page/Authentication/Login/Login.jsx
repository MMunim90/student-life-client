import React from "react";
import { Link, useLocation, useNavigate } from "react-router";
import Lottie from "lottie-react";
import loginLottie from "../../../assets/lottie/Login.json";
import FadeIn from "react-fade-in";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Logo from "../../../sharedItem/logo";
import ThemeButton from "../../../sharedItem/ThemeButton";
import Footer from "../../../sharedItem/Footer";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import SocialLogin from "../SocialLogin/SocialLogin";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm();
  const { signIn } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/app/home";

  const onSubmit = (data) => {
    signIn(data.email, data.password)
      .then((result) => {
        //console.log(result.user);
        const user = result.user;
        Swal.fire({
          title: `${user.displayName} Login Successful!`,
          icon: "success",
          confirmButtonColor: "#01AFF7",
        });
        navigate(from);
      })
      .catch((error) => {
        const errorcode = error.code;

        if (error) {
          Swal.fire({
            title: "Incorrect Username or Password",
            icon: "error",
            draggable: true,
          });
        }
        setError(errorcode);
      });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row ">
      {/* Left: Lottie Section */}
      <div className="hidden flex-1 bg-white lg:flex items-center justify-center p-4">
        <div className="flex items-center justify-center">
          <Lottie animationData={loginLottie} loop={true}></Lottie>
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

            {/* Email */}
            <input
              type="email"
              {...register("email", { required: true })}
              placeholder="Email address"
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error && <p className="text-red-600 text-xs">Incorrect Email</p>}

            {/* Password */}
            <div className="relative mb-2">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", { required: true })}
                placeholder="Password"
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </div>
            </div>
            {error && (
              <p className="text-red-600 text-xs">Incorrect Password</p>
            )}

            {/* Remember & Forgot */}
            <div className="flex justify-between items-center mb-6 text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Remember me
              </label>
              <Link to="/reset" className="text-blue-500 hover:underline">
                Forgot password
              </Link>
            </div>

            {/* Sign In */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition"
            >
              Log in
            </button>

            {/* OR */}
            <div className="flex items-center my-4">
              <div className="flex-grow h-px bg-gray-300"></div>
              <span className="px-2 text-gray-500 text-sm">OR</span>
              <div className="flex-grow h-px bg-gray-300"></div>
            </div>

            {/* Google Sign In */}
            <SocialLogin></SocialLogin>

            {/* Signup Link */}
            <p className="text-center text-sm mt-6 pb-10">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-blue-500 hover:underline pl-1"
              >
                Sign up
              </Link>
            </p>
          </FadeIn>
        </div>
      </form>
      <Footer></Footer>
    </div>
  );
};

export default Login;
