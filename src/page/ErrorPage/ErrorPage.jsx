import { Link, useNavigate, useRouteError } from "react-router";
import { FaExclamationTriangle } from "react-icons/fa";
import Lottie from "lottie-react";
import ErrorLottie from "../../assets/lottie/Error.json";

const ErrorPage = () => {
   const navigate = useNavigate();
  const error = useRouteError();
  // console.error(error);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center p-6">
      {/* lottie */}
      <div className="flex items-center justify-center">
          <Lottie animationData={ErrorLottie} loop={true}></Lottie>
        </div>

      {/* Heading */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
        Something Went Wrong!
      </h1>

      {/* Error message */}
      <p className="text-gray-600 max-w-xl mb-4">
        {error?.statusText ||
          error?.message ||
          "We couldn't process your request right now."}
      </p>

      {/* Optional error code */}
      {error?.status && (
        <p className="text-sm text-gray-500 mb-6">Error Code: {error.status}</p>
      )}

      {/* Back to home button */}
      <Link onClick={() => navigate(-1)}
        className="inline-block px-6 py-3 bg-gray-800 hover:bg-gray-900 font-semibold rounded-lg transition text-white"
      >
        ⇦ Back
      </Link>
    </div>
  );
};

export default ErrorPage;
