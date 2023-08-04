import React, { useEffect, useState } from "react";
import SuccessAnimation from "../../assets/success.json";
import Lottie from "lottie-react";

function Success(props) {
  return (
    <div
      style={{
        width: 400,
        height: 400,
        borderRadius: 10,
      }}
    >
      <Lottie
        animationData={SuccessAnimation}
        loop={true}
        onLoopComplete={() => {
          console.log("Yeet");
          props.onComplete("/uploaded-cables");
        }}
      />
    </div>
  );
}

export default Success;
