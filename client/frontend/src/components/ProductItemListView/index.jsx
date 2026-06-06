import React, { useContext } from "react";
import "../ProductItem/style.css";
import { Link, useParams } from "react-router-dom";
import Rating from "@mui/material/Rating";
import { FaRegHeart } from "react-icons/fa";

import { MdOutlineZoomOutMap } from "react-icons/md";
import { Button } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

import { MyContext } from "../../App";
import { postData } from "../../utils/api";
import { useEffect } from "react";

//Home Page Productslider Items (1st)
const ProductItem = (props) => {
  const { id } = useParams();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const context = useContext(MyContext);
  const { item } = props;
  const API_URL = import.meta.env.VITE_API_URL;

  const addToMyList = (id) => {
    if (context.isLogin === true) {
      const data = {
        productTitle: item?.name,
        image: item?.images[0],
        rating: item?.rating,
        price: item?.price,
        oldPrice: item?.oldPrice,
        brand: item?.brand,
        discount: item?.discount,
        productId: item?._id,
      };

      postData(`/api/myList/add`, data).then((res) => {
        if (res.status !== false) {
          context.openAlertBox("success", "Product added to My List!");

          if (context.setMyListCount)
            context.setMyListCount(context.myListCount + 1);
        } else {
          context.openAlertBox("error", res.message);
        }
      });
    } else {
      context.openAlertBox("error", "Please Login to continue");
    }
  };

  return (
    <div
      className="productItem shadow-lg rounded-md overflow-hidden border-1 
      border-[rgba(0,0,0,0.1)] flex items-center bg-[#f1f1f1]"
    >
      {/*-- Product Slider Images Function --*/}
      <div
        className="group imgWrapper w-[25%] overflow-hidden rounded-md relative flex items-center 
      justify-center p-2"
      >
        <Link to={`/product/${item?._id}`}>
          <div
  className="img overflow-hidden w-full h-[350px] bg-white flex items-center justify-center relative "
>
  {" "}
  <img
    src={
      item?.images?.[0]
        ? item.images[0].startsWith("http")
          ? item.images[0]
          : `${API_URL}${item.images[0]}` 
        : "https://placehold.co/500x500?text=No+Image"
    }
    className="w-full h-full object-contain p-1 transition-all duration-700 rounded-xl"
    alt={item?.name}
  />
  
  {/* Hover Image (Second Image) */}
  <img
    src={
      item?.images?.[1]
        ? item.images[1].startsWith("http")
          ? item.images[1]
          : `${API_URL}${item.images[1]}` 
        : item?.images?.[0]
        ? item.images[0].startsWith("http")
          ? item.images[0]
          : `${API_URL}${item.images[0]}`
        : "https://placehold.co/500x500?text=No+Image"
    }
    className="w-full h-full object-contain  transition-all duration-700 absolute top-0 left-0 opacity-0 group-hover:opacity-100 p-1 bg-white rounded-lg"
    alt={item?.name}
  />
</div>
        </Link>

        {item?.discount > 0 && (
          <span
            className="discount flex items-center absolute top-[10px] left-[10px] 
          z-50 bg-[#ff5252] text-white rounded-lg p-1 text-[13px] font-[600]"
          >
            {item?.discount}%
          </span>
        )}

        {/*-- Product Slider  3-Button Function --*/}
        <div
          className="actions absolute top-[-200px] right-[13px] z-50 flex items-center gap-2
        flex-col w-[20px] transition-all duration-300 group-hover:top-[15px]"
        >
          <Tooltip title="View" placement="right-end">
            <Button
              className="!w-[33px] !h-[33px] !min-w-[33px] !rounded-full !bg-[#fff] 
           text-black hover:!bg-[#ff5252] hover:text-white group"
              onClick={() => context.viewProductDetails(item)}
            >
              <MdOutlineZoomOutMap
                className="text-[18px] !text-black group-hover:text-white
            hover:!text-white"
              />
            </Button>
          </Tooltip>

          <Button
            className="!w-[33px] !h-[33px] !min-w-[33px] !rounded-full !bg-[#fff]
           text-black hover:!bg-[#ff5252] hover:text-white group"
            onClick={() => addToMyList(item?._id)}
          >
            <FaRegHeart
              className="text-[18px] !text-black group-hover:text-white
            hover:!text-white"
            />
          </Button>
        </div>
      </div>

      {/*-- Product Slider Text Function --*/}
      <div className="info p-3 py-5 px-7 w-[75%]">
        <h6 className="text-[15px] font-[500]">
          <Link to={`/product/${item?._id}`} className="link transition-all">
            {item?.brand}
          </Link>
        </h6>
        <h3 className="text-[19px] title mt-3 font-[600] mb-1 text-[#000]">
          <Link to={`/product/${item?._id}`} className="link transition-all">
            {item?.name}
          </Link>
        </h3>

        <p className="text-[14px] mt-2 line-clamp-2">{item?.description}</p>

        <Rating
          name="size-small"
          value={item?.rating || 0}
          size="small"
          readOnly
          className="mt-2"
        />

        <div className="flex items-center gap-5 mt-2">
          {item?.oldPrice > 0 && (
            <span className="oldPrice line-through text-gray-500 text-[14px] font-[500]">
              ${item?.oldPrice}
            </span>
          )}
          <span className="price text-[#ff8a65] text-[16px] font-[700]">
            ${item?.price}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
