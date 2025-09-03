import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import Lottie from "lottie-react";
import FadeIn from "react-fade-in";
import resetLottie from "../../../assets/lottie/reset.json";
import Logo from "../../../sharedItem/logo";
import ThemeButton from "../../../sharedItem/ThemeButton";
import Footer from "../../../sharedItem/Footer";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../firebase/firebase.init";
import Swal from "sweetalert2";

const ResetPass = () => {
  const emailRef = useRef();
  const navigate = useNavigate();

  const handleForgetPassword = (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    // console.log(email);

    sendPasswordResetEmail(auth, email)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Check your inbox",
          text: "A password reset email has been sent.",
          confirmButtonColor: "#01AFF7",
        }).then(() => {
          window.open("https://mail.google.com", "_blank");
          navigate("/login");
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

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left: Lottie Section */}
      <div className="hidden flex-1 bg-white lg:flex items-center justify-center p-4">
        <div className="flex items-center justify-center">
          <Lottie animationData={resetLottie} loop={true} />
        </div>
      </div>

      {/* Right: Form Section */}
      {/* onSubmit={handleSubmit(onSubmit)} */}
      <form className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <FadeIn>
            <div>
              <Logo></Logo>
            </div>

            <ThemeButton></ThemeButton>

            {/* Email */}
            <input
              type="email"
              ref={emailRef}
              placeholder="Email address"
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Submit */}
            <button
              onClick={handleForgetPassword}
              type="submit"
              className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition"
            >
              Send Reset Link
            </button>

            {/* Message after submit */}
            {/* {submitted && (
              <p className="mt-4 text-green-600 text-sm text-center">
                If this email exists in our system, a reset link has been sent.
              </p>
            )} */}

            {/* Back to login */}
            <p className="text-center text-sm mt-6 pb-10">
              Remember your password?{" "}
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

export default ResetPass;
