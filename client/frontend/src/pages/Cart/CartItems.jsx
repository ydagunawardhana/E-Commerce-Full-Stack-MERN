import React, { useState } from "react";

import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import { GoTriangleDown } from "react-icons/go";

import Rating from "@mui/material/Rating";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";
import { useEffect } from "react";

/*-- Cart Items Size & Quantity Menu Function --*/
const CartItems = (props) => {
  const [sizeAnchorEl, setSizeAnchorEl] = useState(null);
  const [qtyAnchorEl, setQtyAnchorEl] = useState(null);

  // Local States
  const [selectedSize, setSelectedSize] = useState(props.item?.size);
  const openSize = Boolean(sizeAnchorEl);
  const openQty = Boolean(qtyAnchorEl);

  const productSizes = props.item?.productId?.size || [];

  useEffect(() => {
    setSelectedSize(props.item?.size);
  }, [props.item?.size]);

  const handleClickSize = (event) => {
    setSizeAnchorEl(event.currentTarget);
  };

  const handleCloseSize = (value) => {
    setSizeAnchorEl(null);
    if (value) {
      setSelectedSize(value);
      props.updateCartItem(props.item._id, props.item.quantity, value);
    }
  };

  //  Quantity Menu Functions
  const handleClickQty = (event) => {
    setQtyAnchorEl(event.currentTarget);
  };

  const handleCloseQty = (val) => {
    setQtyAnchorEl(null);
    if (val) {
      props.updateCartItem(
        props.item._id,
        val,
        selectedSize || props.item.size
      );
    }
  };

  // Cart Item Details
  return (
    <div
      className="cartItem w-full p-3 flex items-center gap-6 pb-5
                !border-b !border-[rgba(0,0,0,0.1)]"
    >
      {/*-- Cart Page Product Iamge --*/}
      <div
        className="img w-[15%] rounded-md overflow-hidden bg-white border
       border-gray-200 p-2"
      >
        <Link
          to={`/product/${props.item?.productId?._id}`}
          className="group h-[250px]"
        >
          <img
            src={
              props.item?.productId?.images?.[0]
                ? props.item?.productId?.images[0].startsWith("http")
                  ? props.item?.productId?.images[0]
                  : `http://localhost:5000${props.item?.productId?.images[0]}`
                : "https://placehold.co/100x100"
            }
            className=" object-contain group-hover:scale-105 transition-all !rounded-md"
            alt={props.item?.productId?.name}
          />
        </Link>
      </div>

      {/*-- Cart Page  Product Details --*/}
      <div className="info w-[85%] relative">
        <HighlightOffOutlinedIcon
          className="cursor-pointer absolute -top-[5px] right-[0px] text-[25px] 
          hover:text-[#ff5252] transition-all"
          onClick={() =>
            props.deleteItem(props.item?._id, props.item?.productId?._id)
          }
        />

        <span className="text-[13px] text-gray-500 font-[500] uppercase">
          {props.item?.productId?.brand}
        </span>

        <h3 className="text-[16px]">
          <Link
            to={`/product/${props.item?.productId?._id}`}
            className="link hover:text-[#ff5252]"
          >
            {props.item?.productId?.name}
          </Link>
        </h3>

        <div className="mt-2 mb-3">
          <Rating
            name="read-only"
            value={props.item?.productId?.rating || 0}
            size="small"
            readOnly
          />
        </div>

        {/* 3. Dropdowns Row (Size & Qty) */}
        <div className="flex items-center gap-4">
          {/* Size Dropdown */}
          {productSizes.length > 0 && (
            <div className="relative">
              <span
                className="flex items-center justify-center bg-[#f1f1f1] text-[12px] 
                font-[600] py-1 px-3 rounded-md cursor-pointer border hover:border-[#ccc] 
                transition-all"
                onClick={handleClickSize}
              >
                Size: {selectedSize || "Select"}
                <GoTriangleDown className="ml-1 text-[14px]" />
              </span>
              <Menu
                anchorEl={sizeAnchorEl}
                open={openSize}
                onClose={() => handleCloseSize(null)}
                MenuListProps={{ "aria-labelledby": "basic-button" }}
              >
                {productSizes.map((size, index) => (
                  <MenuItem
                    key={index}
                    onClick={() => handleCloseSize(size)}
                    className="!text-[13px]"
                  >
                    {size}
                  </MenuItem>
                ))}
              </Menu>
            </div>
          )}

          {/*  Quantity Dropdown */}
          <div className="relative">
            <span
              className="flex items-center justify-center bg-[#f1f1f1] text-[12px] 
              font-[600] py-1 px-3 rounded-md cursor-pointer border hover:border-[#ccc] 
              transition-all"
              onClick={handleClickQty}
            >
              Qty: {props.item?.quantity}{" "}
              <GoTriangleDown className="ml-1 text-[14px]" />
            </span>
            <Menu
              anchorEl={qtyAnchorEl}
              open={openQty}
              onClose={() => handleCloseQty(null)}
              PaperProps={{
                style: { maxHeight: 200, width: "10ch" },
              }}
            >
              {[...Array(10)].map((_, i) => (
                <MenuItem
                  key={i + 1}
                  onClick={() => handleCloseQty(i + 1)}
                  className="!text-[13px]"
                >
                  {i + 1}
                </MenuItem>
              ))}
            </Menu>
          </div>
        </div>

        {/* Price Section (Old Price, New Price, Discount) */}
        <div className="flex items-center gap-5 mt-3">
          <span className="text-[16px] font-[700] text-[#ff5252]">
            ${props.item?.productId?.price}
          </span>

          {props.item?.productId?.oldPrice > 0 && (
            <span className="line-through text-gray-400 text-[15px] font-[500]">
              ${props.item?.productId?.oldPrice}
            </span>
          )}

          {props.item?.productId?.discount > 0 && (
            <span className="text-[14px] font-[700] text-green-600 bg-green-50 px-5 py-[2px] rounded-sm border border-green-100">
              {props.item?.productId?.discount}% OFF
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartItems;
