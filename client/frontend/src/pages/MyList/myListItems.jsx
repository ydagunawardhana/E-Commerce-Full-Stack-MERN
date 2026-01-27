import React, { useEffect, useState } from "react";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import Rating from "@mui/material/Rating";
import { Link, useParams } from "react-router-dom";

/*--  My List Menu Function --*/
const MyListItems = (props) => {
  //Goto Page Top(Optional)
  const { id } = useParams();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const { item } = props;

  // My List Item Details
  return (
    <div
      className="cartItem w-full p-3 flex items-center gap-4 pb-3
                !border-b !border-[rgba(0,0,0,0.1)]"
    >
      {/*-- Mylist Page Product Iamge --*/}

      <div className="img w-[12%] rounded-md overflow-hidden">
        <Link to={`/product/${item?.productId}`} className="group">
          <img
            src={
              item?.image
                ? item.image.startsWith("http")
                  ? item.image
                  : `http://localhost:5000${item.image}`
                : "https://placehold.co/100x100?text=No+Img"
            }
            className="w-full group-hover:scale-105 transition-all"
            alt={item?.productTitle}
          />
        </Link>
      </div>

      {/*-- Mylist Page  Product Details --*/}
      <div className="info w-[85%] relative">
        <HighlightOffOutlinedIcon
          className="cursor-pointer absolute -top-[20px] right-[0px] !text-[27px]
                link transition-all"
          onClick={() => props.removeItem(item?._id)}
        />
        <span className="text-[14px]">{item?.brand}</span>
        <h3 className="text-[16px]">
          <Link to={`/product/${item?.productId}`} className="link">
            {item?.productTitle}
          </Link>
        </h3>

        <Rating
          name="size-small"
          value={item?.rating || 0}
          size="small"
          readOnly
        />

        <div className="flex items-center gap-4 mt-3 mb-2">
          <span className="price text-[#ff5252] text-[15px] font-[700]">
            ${item?.price}
          </span>
          {item?.oldPrice > 0 && (
            <span className="oldPrice line-through text-gray-500">
              ${item?.oldPrice}
            </span>
          )}
          <span className="price text-[#ff5252] text-[15px] font-[700]">
            {`(${item?.discount}% OFF)`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MyListItems;
