import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { BsBagCheckFill } from "react-icons/bs";
import { Button } from "@mui/material";
import CartItems from "./CartItems";
import { MyContext } from "../../App";
import { deleteData, editData } from "../../utils/api";

/*-- Cart Page Function --*/
const CartPage = () => {
  //Goto Page Top(Optional)
  const { id } = useParams();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const context = useContext(MyContext);

  // Total Price
  const cartTotal =
    context.cartItems?.length > 0
      ? context.cartItems.reduce(
          (acc, item) =>
            acc +
            parseInt(item.productId?.price || 0) * parseInt(item.quantity),
          0
        )
      : 0;

  //  Quantity Update Function
  const updateCartItem = (id, newQty, newSize) => {
    const data = {
      _id: id,
      qty: newQty,
      size: newSize,
    };
    editData(`/api/cart/update-qty`, data).then((res) => {
      if (res.success === true) {
        context.openAlertBox(
          "success",
          res.message || "Cart Updated Successfully!"
        );
        context.getCartData();
      }
    });
  };

  // Delete Item Function
  const deleteCartItem = (id, productId) => {
    const data = { _id: id, productId: productId };
    deleteData(`/api/cart/remove`, data).then((res) => {
      if (res.success === true) {
        context.openAlertBox("success", "Item removed from cart");
        context.getCartData();
        context.setOpenCartPanel(false);
      }
    });
  };

  return (
    <section className="section py-10 pb-10 bg-[#f1f1f1] relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top Right Circle */}
        <div
          className="absolute -top-[100px] -right-[100px] w-[500px] h-[500px] 
          bg-[#ffccbcb4] rounded-full opacity-50"
        ></div>
        {/* Bottom Left Circle */}
        <div
          className="absolute -bottom-[100px] -left-[100px] w-[450px] h-[450px] 
          bg-[#ffccbcad] rounded-full opacity-50"
        ></div>
      </div>

      <div className="container w-[80%] max-w-[80%] flex gap-5 items-start relative z-10">
        <div className="leftPart w-[70%]">
          <div className="shadow-md rounded-md bg-[#fff]">
            <div className="py-4 px-4 border-b !border-[rgba(0,0,0,0.1)]">
              <h2 className="text-[22px] uppercase font-[700]">Your Cart</h2>
              <p className="mt-0 text-[15px] font-[500]">
                There are{" "}
                <span className="font-bold text-[#ff5252]">
                  {context.cartItems?.length || 0}
                </span>{" "}
                products in your cart
              </p>
            </div>

            {/* Cart Items */}
            {context.cartItems?.length > 0 ? (
              context.cartItems.map((item, index) => (
                <CartItems
                  key={index}
                  item={item}
                  qty={item.quantity}
                  updateCartItem={updateCartItem}
                  deleteItem={deleteCartItem}
                />
              ))
            ) : (
              <div className="text-center py-10 font-bold text-gray-400">
                Your Cart is Empty
              </div>
            )}
          </div>
        </div>

        {/*-- Cart Page Cart Total --*/}
        <div className="rightPart w-[30%] sticky top-[210px] z-50">
          <div className="shadow-md rounded-md bg-[#fff] p-5">
            <h3 className="pb-4 text-[20px] uppercase !font-[700]">
              Cart Totals
            </h3>
            <hr />

            <p className="flex items-center justify-between pb-1">
              <span className="text-[16px] font-[500]">Subtotal</span>
              <span className="text-[18px] text-[#ff5252] font-bold">
                ${cartTotal.toFixed(2)}
              </span>
            </p>

            <p className="flex items-center justify-between pb-1">
              <span className="text-[16px] font-[500]">Shipping</span>
              <span className="text-[15px] font-bold">Free</span>
            </p>

            <p className="flex items-center justify-between">
              <span className="text-[16px] font-[500]">Estimate for</span>
              <span className="text-[15px] font-bold">Sri Lanka</span>
            </p>

            <p className="flex items-center justify-between">
              <span className="text-[16px] font-[500]">Total</span>
              <span className="text-[18px] text-[#ff5252] font-bold">
                ${cartTotal.toFixed(2)}
              </span>
            </p>

            <br />

            <Link to="/checkout">
              <Button
                className="btn-org btn-lg w-full flex gap-2"
                disabled={context.cartItems?.length === 0}
              >
                <BsBagCheckFill className="text-[20px]" /> Checkout
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartPage;
