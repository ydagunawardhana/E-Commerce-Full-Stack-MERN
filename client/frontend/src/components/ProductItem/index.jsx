import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useContext, useState } from "react";
import "../ProductItem/style.css";
import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import { FaRegHeart } from "react-icons/fa";
import {
  MdOutlineShoppingCartCheckout,
  MdOutlineZoomOutMap,
} from "react-icons/md";
import { Button } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";

//Home Page Productslider Items (1st)
const ProductItem = (props) => {
  const context = useContext(MyContext);
  const { item } = props;
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const addToMyList = (id) => {
    if (context.isLogin === true) {
      const data = {
        productTitle: props.item?.name,
        image: props.item?.images[0],
        rating: props.item?.rating,
        price: props.item?.price,
        oldPrice: props.item?.oldPrice,
        brand: props.item?.brand,
        discount: props.item?.discount,
        productId: props.item?._id,
      };

      postData(`/api/myList/add`, data).then((res) => {
        if (res.status !== false) {
          context.openAlertBox("success", "Product added to My List!");
          context.setMyListCount(context.myListCount + 1);
        } else {
          context.openAlertBox("error", res.message);
        }
      });
    } else {
      context.openAlertBox("error", "Please Login to continue");
    }
  };

  const addToCart = (id) => {
    if (context.isLogin === true) {
      setLoading(true);
      const data = {
        productId: id,
      };

      postData(`/api/cart/add`, data).then((res) => {
        if (res.success === true) {
          context.openAlertBox("success", "Item Added to Cart!");

          // Cart Data
          context.getCartData();

          //  Cart Panel
          context.setOpenCartPanel(true);
        } else {
          context.openAlertBox("error", res.message);
        }
        setLoading(false);
      });
    } else {
      context.openAlertBox("error", "Please Login to continue");
    }
  };

  return (
    <div
      className="productItem shadow-lg relative rounded-md overflow-hidden border-1 
    border-[rgba(0,0,0,0.1)] bg-[#f1f1f1]"
    >
      {/*-- Product Slider Images Function --*/}
      <div className="group imgWrapper w-[100%] overflow-hidden rounded-md relative">
        <Link to={`/product/${item?._id}`}>
          <div className="img h-[220px] overflow-hidden">
  <img
    src={
      item?.images?.[0]
        ? item.images[0].startsWith("http")
          ? item.images[0]
          : `${API_URL}${item.images[0]}` 
        : "https://placehold.co/220x220?text=No+Image"
    }
    className="w-full h-full object-cover object-top"
    alt={item?.name}
    onError={(e) => {
      e.target.src =
        "https://placehold.co/220x220?text=Error+Loading";
    }}
  />

  {item?.images?.length > 1 && (
    <img
      src={
        item.images[1].startsWith("http")
          ? item.images[1]
          : `${API_URL}${item.images[1]}` 
      }
      className="w-full h-full object-cover object-top transition-all duration-700 absolute top-0 left-0 opacity-0 group-hover:opacity-100 group-hover:scale-105"
      alt={item?.name}
    />
  )}
</div>
        </Link>
        {item?.discount > 0 && (
          <span className="discount flex items-center absolute top-[10px] left-[10px] z-50 bg-[#ff5252] text-white rounded-lg p-1 text-[13px] font-[600]">
            {item.discount}%
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

          <Tooltip title="Wishlist" placement="right-end">
            <Button
              className="!w-[33px] !h-[33px] !min-w-[33px] !rounded-full !bg-[#fff]
           text-black hover:!bg-[#ff5252] hover:text-white group"
              onClick={() => addToMyList(props.item?._id)}
            >
              <FaRegHeart
                className="text-[18px] !text-black group-hover:text-white
            hover:!text-white"
              />
            </Button>
          </Tooltip>
        </div>
      </div>

      {/*-- Product Slider Text Function --*/}
      <div className="info p-3 py-5">
        <h6 className="text-[13px] font-[500]">
          <Link
            to={`/product/${item?._id}`}
            className="link transition-all uppercase"
          >
            {item?.brand || "Brand"}
          </Link>
        </h6>
        <h3 className="text-[14px] title mt-1 font-[600] mb-1 text-[#000] line-clamp-2 min-h-[42px]">
          <Link to={`/product/${item?._id}`} className="link transition-all">
            {item?.name}
          </Link>
        </h3>

        <Rating
          name="size-small"
          value={item?.rating || 0}
          size="small"
          readOnly
        />

        <div className="flex items-center justify-between gap-5 mb-3 mt-1">
          {item?.oldPrice > 0 && (
            <span className="oldPrice line-through text-gray-500 text-[15px] font-[500]">
              ${parseFloat(item.oldPrice).toFixed(2)}
            </span>
          )}
          <span className="price text-[#ff5252] text-[16px] font-[600]">
            ${parseFloat(item?.price).toFixed(2)}
          </span>
        </div>

        <Button
          className="btn-org btn-border btn-lg w-full gap-2"
          onClick={() => addToCart(item?._id)}
          disabled={loading}
        >
          <MdOutlineShoppingCartCheckout className="text-[18px]" />
          {loading ? "Adding..." : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
};

export default ProductItem;
