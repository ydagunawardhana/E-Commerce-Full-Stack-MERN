import React from "react";
import "../BannerBoxV2/style.css";
import { Link } from "react-router-dom";

// BannerBox V2 Functions
const BannerBoxV2 = (props) => {
  return (
    <div className="bannerBoxV2 w-full overflow-hidden rounded-md group relative">
      <img
        src={props.image}
        className="w-full transition-all duration-150
      group-hover:scale-105"
      />

      <div
        className={`info absolute p-5 top-0 ${
          props.info === "right" ? "right-0" : "left-0"
        } w-[52%] h-[100%] z-50 flex items-center justify-center flex-col gap-1`}
      >
        <h2 className="text-[20px] font-[650]">
          Buy All Products with Low Price
        </h2>

        <span className="text-[30px] text-[#ff5252] font-[700] w-full">
          $30
        </span>

        <div className="w-full">
          <Link to="/productListing" className="text-[16px] font-[600] link">
            SHOP NOW
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BannerBoxV2;
