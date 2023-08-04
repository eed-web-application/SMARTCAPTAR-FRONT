import React, { useEffect, useState } from "react";
import LoadingAnimation from "../../assets/loading.json";
import Lottie from "lottie-react";

function Loading(props) {
  return (
    <div
      style={{
        width: 400,
        height: 400,
        borderRadius: 10,
      }}
    >
      <Lottie animationData={LoadingAnimation} loop={true} />
    </div>
  );
}

export default Loading;
