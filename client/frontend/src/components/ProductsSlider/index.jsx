import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

import { Navigation } from "swiper/modules";
import ProductItem from "../ProductItem";

// Home Product Slider (1st)
const ProductsSlider = (props) => {
  return (
    <div className="productSlider py-3">
      <Swiper
        slidesPerView={props.items}
        spaceBetween={15}
        navigation={true}
        modules={[Navigation]}
        className="mySwiper"
      >
        {props.products?.map((item, index) => (
          <SwiperSlide key={index}>
            <ProductItem item={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductsSlider;
