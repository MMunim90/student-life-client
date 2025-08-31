import React from 'react';
import Lottie from "lottie-react";
import LoadingLottie from "../assets/lottie/loading.json";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <Lottie animationData={LoadingLottie} loop={true} />
    </div>
  );
};

export default Loading;
