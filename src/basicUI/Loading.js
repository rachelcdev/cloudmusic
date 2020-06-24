import styled, { keyframes } from "styled-components";
import style from "../styles/global-style";
import React from "react";

const loading = keyframes`
  0%, 100% {
    transform: scale(0.0);
  }
  50% {
    transform: scale(1.0);
  }

  `;
const LoadingWrapper = styled.div`
  .circle {
    position: fixed;
    z-index: 1000;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 60px;
    height: 60px;
    opacity: 0.6;
    border-radius: 50%;
    background-color: ${style["theme-color"]};
    animation: ${loading} 2.5s infinite ease-in;
  }
  .circle-delay {
    animation-delay: -0.7s;
  }
`;
function Loading() {
  return (
    <LoadingWrapper>
      <div className="circle"></div>
      <div className="circle circle-delay"></div>
    </LoadingWrapper>
  );
}
export default Loading;
