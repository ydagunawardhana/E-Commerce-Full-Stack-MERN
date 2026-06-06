import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";

// Home Category slider Functions
const HomeCategorySlider = (props) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;
  return (
    <div className="homecategoryslider pt-5 py-8">
      <div className="container">
        <Swiper
          slidesPerView={8}
          spaceBetween={10}
          navigation={true}
          modules={[Navigation]}
          className="mySwiper"
        >
          {props.categories?.length > 0
            ? props.categories?.map((cat, index) => {
                return (
                  <SwiperSlide key={index}>
                    <Link to={`/productListing/${cat.name}`}>
                      <div className="item py-5 px-3 bg-[#ffffff] rounded-lg text-center flex items-center justify-center flex-col">
                        <div className="w-[65px] h-[65px] mx-auto mb-2">
  <img
    src={
      cat.image
        ? `${IMAGE_URL}${cat.image}`
        : "https://placehold.co/50x50?text=No+Img"
    }
    alt={cat.name}
    className="w-full h-full object-cover"
  />
</div>
                        <h3 className="text-[16px] font-[600] mt-3">
                          {cat.name}
                        </h3>
                      </div>
                    </Link>
                  </SwiperSlide>
                );
              })
            : [...Array(10)].map((_, index) => (
                <SwiperSlide key={`skeleton-${index}`}>
                  <div className="item py-5 px-3 bg-[#ffffff] rounded-lg text-center flex items-center justify-center flex-col">
                    {/*  (Loading Circle) */}
                    <div className="w-[65px] h-[65px] bg-[#e5e7eb] rounded-full animate-pulse mx-auto mb-2"></div>
                    {/* (Loading Bar) */}
                    <div className="h-4 w-20 bg-[#e5e7eb] rounded animate-pulse mt-3 mx-auto"></div>
                  </div>
                </SwiperSlide>
              ))}
        </Swiper>
      </div>
    </div>
  );
};

export default HomeCategorySlider;
