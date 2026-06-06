import React, { useContext } from "react";
import { Link } from "react-router-dom";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Button } from "@mui/material";
import { MyContext } from "../../App";
import { deleteData } from "../../utils/api";

// Cart Panel Drawer Function
const CartPanel = (closeCart) => {
  const context = useContext(MyContext);
  const API_URL = import.meta.env.VITE_API_URL;

  const deleteItem = (id, productId) => {
    const data = { _id: id, productId: productId };

    deleteData(`/api/cart/remove`, data).then((res) => {
      if (res.success === true) {
        context.openAlertBox("success", "Item removed!");
        context.getCartData();
      }
    });
  };

  // Total Price
  const totalPrice =
    context.cartItems?.length > 0
      ? context.cartItems.reduce(
          (acc, item) =>
            acc +
            parseInt(item.size) *
              parseInt(item.quantity) *
              parseInt(item.productId?.price || 0),
          0
        )
      : 0;

  return (
    <>
      {/*-- CartPanel Drawer (TOP) --*/}
      <div
        className="scroll w-full max-h-[630px] overflow-y-scroll overflow-x-hidden 
      py-3 px-4"
      >
        {context.cartItems?.length !== 0 ? (
          context.cartItems?.map((item, index) => {
            return (
              <div
                key={index}
                className="cartItem w-full flex items-center gap-4 border-b 
                border-[rgba(0,0,0,0.1)] pb-3"
              >
                {/* Image Section */}
                <div className="img w-[25%] overflow-hidden h-[90px] rounded-md bg-gray-100">
  <Link
    to={`/product/${item.productId._id}`}
    onClick={() => context.setOpenCartPanel(false)}
  >
    <img
      src={
        item.productId.images?.[0]
          ? item.productId.images[0].startsWith("http")
            ? item.productId.images[0]
            : `${API_URL}${item.productId.images[0]}` 
          : "https://placehold.co/100x100?text=No+Img"
      }
      className=" object-contain rounded-md hover:scale-105 transition-all duration-400"
      alt={
        item.productId.name?.length > 10
          ? item.productId.name.substr(0, 20) + "..."
          : item.productId.name
      }
      onError={(e) => {
        e.target.src = "https://placehold.co/100x100?text=Error";
      }}
    />
  </Link>
</div>

                <div className="info w-[75%] pr-5 relative">
                  <h4 className="text-[14px] font-[500]">
                    <Link
                      to={`/product/${item?.productId?._id}`}
                      className="link transition-all"
                      onClick={() => context.setOpenCartPanel(false)}
                    >
                      {item?.productId?.name}
                    </Link>
                  </h4>
                  <p className="flex items-center gap-5 mt-2 mb-2">
                    {item?.size && (
                      <span
                        className="text-[14px] bg-gray-100 px-2 py-1 
                       text-gray-600 font-[550]"
                      >
                        Size: {item.size}
                      </span>
                    )}
                    <span className=" text-gray-600 font-[550]">
                      Qty: <span>{item?.quantity}</span>
                    </span>
                    <span className="text-[#ff5252] font-bold">
                      Price: ${item?.productId?.price}
                    </span>
                  </p>
                  <DeleteOutlineIcon
                    onClick={() => deleteItem(item?._id, item?.productId?._id)}
                    className="!absolute top-[10px] -right-[10px] cursor-pointer
                    !text-[20px] text-gray-500 hover:text-red-500 transition-all"
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-10">Cart is Empty!</div>
        )}
      </div>

      <br />

      {/*-- CartPanel Drawer (BOTTOM) --*/}

      <div className="bottomSec absolute bottom-[10px] left-[0px] w-full pr-4 pl-4 bg-white">
        <div className="bottomInfo w-full py-3 px-4 border-t border-[rgba(0,0,0,0.1)] flex items-center justify-between flex-col">
          {/* Row 1: Item Count */}
          <div className="flex items-center justify-between w-full mb-4">
            <span className="text-[14px] font-[600]">
              {context.cartItems?.length || 0} items
            </span>
            <span className="text-[#ff5252] font-bold">
              ${" "}
              {context.cartItems?.length > 0
                ? context.cartItems
                    .reduce((acc, item) => {
                      if (!item?.productId) return acc;

                      const qty = parseInt(item.quantity) || 0;
                      const price = parseFloat(item.productId.price) || 0;

                      return acc + qty * price;
                    }, 0)
                    .toFixed(2)
                : "0.00"}
            </span>
          </div>

          {/* Row 2: Total (tax excl.) */}
          <div className="flex items-center justify-between w-full mb-2">
            <span className="text-[14px] font-[600]">Total (tax excl.)</span>
            <span className="text-[#ff5252] font-bold">
              ${" "}
              {context.cartItems?.length > 0
                ? context.cartItems
                    .reduce((acc, item) => {
                      if (!item?.productId) return acc;

                      const qty = parseInt(item.quantity) || 0;
                      const price = parseFloat(item.productId.price) || 0;

                      return acc + qty * price;
                    }, 0)
                    .toFixed(2)
                : "0.00"}
            </span>
          </div>

          <br />

          {/*-- CartPanel Drawer (Buttons) --*/}
          <div className="flex items-center justify-between w-full gap-5">
            <Link to="/cart" className="w-[50%]">
              <Button
                className="btn-org w-full"
                onClick={() => context.setOpenCartPanel(false)}
              >
                View Cart
              </Button>
            </Link>
            <Link to="/checkout" className="w-[50%]">
              <Button
                className="btn-org btn-border w-full"
                onClick={() => context.setOpenCartPanel(false)}
              >
                Checkout
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPanel;
