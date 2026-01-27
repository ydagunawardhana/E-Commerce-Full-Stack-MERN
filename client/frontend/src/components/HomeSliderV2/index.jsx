import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

// import required modules
import { EffectFade, Navigation, Pagination, Autoplay } from "swiper/modules";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

// Home Slider V2 Function
const HomeSliderV2 = () => {
  return (
    <Swiper
      loop={true}
      spaceBetween={30}
      effect={"fade"}
      navigation={true}
      pagination={{
        clickable: true,
      }}
      autoplay={{
        delay: 3500,
        disableOnInteraction: false,
      }}
      modules={[EffectFade, Navigation, Pagination, Autoplay]}
      className="homeSliderV2"
    >
      {/*-- HomeSlider V2-Banner_01 Function --*/}
      <SwiperSlide>
        <div className="item w-full rounded-md overflow-hidden relative">
          <img src="HomeSliderV2_Banner_1.jpg" />
          <div
            className="info absolute top-20 -right-[100%] opacity-0 w-[50%] z-70 p-10 flex items-center flex-col
          justify-center transition-all duration-700"
          >
            <h4
              className="text-[20px] font-[550] w-full mb-2 relative -right-[100%]
            opacity-0"
            >
              Big Saving Days Sale
            </h4>

            <h2 className="text-[30px] font-[700] w-full mb-3 relative -right-[100%] opacity-0">
              Buy New Trend Women Black Cotton Blend Top <br />
              Top for Women...
            </h2>

            <h3 className="flex items-center gap-3 text-[20px] font-[550] w-full text-left mb-3 relative -right-[100%] opacity-0">
              Starting at Only{" "}
              <span className="text-[#ff5252] text-[35px] font-[700]">$15</span>
            </h3>

            <div className="w-full relative -right-[100%] opacity-0 btn_">
              <Link to="/productListing/Fashion">
                <Button className="btn-org">SHOP Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </SwiperSlide>

      {/*-- HomeSlider V2-Banner_02 Function --*/}
      <SwiperSlide>
        <div className="item w-full rounded-md overflow-hidden">
          <img src="HomeSliderV2_Banner_2.jpg" />
          <div
            className="info absolute top-20 -right-[100%] opacity-0 w-[50%] z-70 p-10 flex items-center flex-col
          justify-center transition-all duration-700"
          >
            <h4 className="text-[20px] font-[550] w-full mb-2 relative -right-[100%] opacity-0">
              Big Saving Days Sale
            </h4>

            <h2 className="text-[30px] font-[700] w-full mb-3 relative -right-[100%] opacity-0">
              Apple iPhone 13 128 GB, Pink
            </h2>

            <h3 className="flex items-center gap-3 text-[20px] font-[550] w-full text-left mb-3 relative -right-[100%] opacity-0">
              Starting at Only{" "}
              <span className="text-[#ff5252] text-[35px] font-[700]">
                $2000
              </span>
            </h3>

            <div className="w-full relative -right-[100%] opacity-0 btn_">
              <Link to="/productListing/Electronics">
                <Button className="btn-org">SHOP Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default HomeSliderV2;
