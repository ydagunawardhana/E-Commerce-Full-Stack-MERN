import React from "react";
import { IoTimerOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";

const BlogItem = ({ image, title, date, description }) => {
  return (
    <div className="blogItem group">
      <div className="imgWrapper w-full overflow-hidden rounded-md cursor-pointer relative">
        <img
          src={image}
          className="w-full h-[250px] object-cover transition-all group-hover:scale-105 group-hover:rotate-1"
          alt="blog image"
        />

        <span
          className="flex items-center justify-center text-white absolute bottom-[10px]
        right-[10px] z-50 bg-primary rounded-md p-1 text-[13px] font-[600] gap-2"
        >
          <IoTimerOutline className="text-[18px]" /> {date}
        </span>
      </div>

      <div className="info py-4">
        <h2 className="text-[15px] font-[600] text-black mb-1">
          <Link to="/" className="link">
            {title}
          </Link>
        </h2>
        <p className="text-[13px] font-[400] text-black mb-4 line-clamp-3">
          {description}
        </p>

        <Link className="link font-[500] text-[15px] flex items-center gap-1">
          Read More <IoIosArrowForward />
        </Link>
      </div>
    </div>
  );
};

export default BlogItem;
