import React from "react";
import useAuth from "../../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { FcGoogle } from "react-icons/fc";
// import useAxios from "../../../hooks/useAxios";

const SocialLogin = () => {
  const { signInWithGoogle } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/app/home";
//   const axiosInstance = useAxios();

  const handleGoogleSignIn = () => {
    signInWithGoogle()
      .then(async(res) => {
        const user = res.user;
        // console.log(user);
        Swal.fire({
          title: `${user.displayName} Login Successful!`,
          icon: "success",
          confirmButtonColor: "#CAEB66",
        });

        //update userinfo in the database
        // const userInfo = {
        //   email: user.email,
        //   role: "user", // default role
        //   created_at: new Date().toISOString(),
        //   last_logged_in: new Date().toISOString(),
        // };

        // const result = await axiosInstance.post('/users', userInfo);
        //console.log('user update info', result.data);

        navigate(from);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <button
        onClick={handleGoogleSignIn}
        className="w-full flex items-center justify-center border border-gray-300 py-2 rounded hover:bg-gray-100 hover:text-black transition"
      >
        <FcGoogle className="text-xl mr-2" />
        Login with Google
      </button>
    </div>
  );
};

export default SocialLogin;
