import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";

//Home Sliders Functions
const HomeSlider = (props) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;
  return (
    <div className="homeslider py-6">
      <div className="container">
        <Swiper
          loop={true}
          spaceBetween={10}
          navigation={true}
          modules={[Navigation, Autoplay]}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          className="sliderHome"
        >
          {props.data?.length > 0 ? (
            props.data.map((banner, index) => {
              return (
                <SwiperSlide key={index}>
                 <div className="item rounded-[25px] overflow-hidden">
  <img
    src={
      banner.image
        ? `${IMAGE_URL}${banner.image}`
        : "https://via.placeholder.com/1200x400"
    }
    alt="Banner slider"
    className="w-full md:h-[455px] object-cover"
  />
</div>
                </SwiperSlide>
              );
            })
          ) : (
            <SwiperSlide>
              <div
                className="item rounded-[25px] overflow-hidden bg-gray-200 h-[455px] flex 
              items-center justify-center"
              >
                <p className="text-gray-500">Loading Banners...</p>
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>
    </div>
  );
};

export default HomeSlider;
