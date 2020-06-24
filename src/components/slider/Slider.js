import React, { useState, useEffect } from "react";
import { SliderContainer } from "./style";
import Swiper from "swiper";
import "swiper/css/swiper.css";

function Slider({ bannerList }) {
  const [sliderSwiper, setSliderSwiper] = useState(null);
  useEffect(() => {
    if (bannerList.length && !sliderSwiper) {
      let newSlider = new Swiper(".slider-container", {
        loop: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        pagination: { el: ".swiper-pagination" },
      });
      setSliderSwiper(newSlider);
    }
  }, [bannerList.length, sliderSwiper]);
  return (
    <SliderContainer>
      <div className="before"></div>
      <div className="slider-container">
        <div className="swiper-wrapper">
          {bannerList.map((banner) => (
            <div key={banner.imageUrl} className="swiper-slide">
              <div className="slider-nav">
                <img
                  src={banner.imageUrl}
                  width="100%"
                  height="100%"
                  alt="recommend"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="swiper-pagination"></div>
      </div>
    </SliderContainer>
  );
}
export default React.memo(Slider);
