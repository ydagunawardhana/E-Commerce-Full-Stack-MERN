import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/styles.min.css";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { useRef, useState } from "react";

// ProductZoom Functions
const ProductZoom = (props) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const zoomSliderBig = useRef();
  const zoomSliderSml = useRef();

  const goto = (index) => {
    setSlideIndex(index);
    zoomSliderSml.current.swiper.slideTo(index);
    zoomSliderBig.current.swiper.slideTo(index);
  };

  return (
    <>
      <div className="flex gap-3">
        {/*-- ProductSide Slider Function --*/}
        <div className="slider w-[15%]">
          <Swiper
            ref={zoomSliderSml}
            slidesPerView={4}
            spaceBetween={50}
            navigation={true}
            modules={[Navigation]}
            direction={"vertical"}
            className="zoomProductSliderThumbs h-[500px] overflow-hidden"
          >
            {props.images?.map((img, index) => (
              <SwiperSlide key={index}>
                <div
                  className={`item rounded-md overflow-hidden cursor-pointer group border-2 ${
                    slideIndex === index
                      ? "border-[#ff5252] opacity-100"
                      : "border-transparent opacity-50"
                  }`}
                  onClick={() => goto(index)}
                >
                  <img
                    src={img}
                    alt={`thumb-${index}`}
                    className="w-full transition-all group-hover:scale-105 h-[100px] object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/*-- ProductSide Slider Large Image Function --*/}
        <div className="zoomContainer w-[80%] h-[500px] overflow-hidden rounded-md">
          <Swiper
            ref={zoomSliderBig}
            slidesPerView={1}
            spaceBetween={0}
            navigation={false}
            onSlideChange={(swiper) => setSlideIndex(swiper.activeIndex)}
          >
            {props.images?.map((img, index) => (
              <SwiperSlide key={index}>
                <InnerImageZoom zoomType="hover" zoomScale={1} src={img} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default ProductZoom;
