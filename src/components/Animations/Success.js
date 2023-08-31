import React, { useEffect, useState } from "react";
import SuccessAnimation from "../../assets/success.json";
import Lottie from "lottie-react";
//Success Loading component that triggers a reroute when the animation is over
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
          //Pass in which page to travel to once the success animation is done
          props.onComplete("/uploaded-cables");
        }}
      />
    </div>
  );
}

export default Success;
