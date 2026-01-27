import React, { useEffect, useContext, useRef, useState } from "react";
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";

const PaymentSuccess = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const isProcessed = useRef(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const paymentId = queryParams.get("session_id");

    const pendingOrder = localStorage.getItem("pendingOrder");

    if (pendingOrder && isProcessed.current === false) {
      isProcessed.current = true;
      const orderData = JSON.parse(pendingOrder);

      orderData.paymentId = paymentId;
      orderData.paymentStatus = "paid";
      orderData.status = "Confirmed";

      saveOrder(orderData);
    } else {
      setLoading(false);
    }
  }, []);

  const saveOrder = async (orderData) => {
    try {
      const res = await postData("/api/orders/create", orderData);

      if (res.error === false) {
        context.setCartItems([]);
        localStorage.removeItem("pendingOrder");
        context.openAlertBox("success", "Payment Successful! Order Placed.");
      } else {
        context.openAlertBox(
          "error",
          "Payment Received but Order Creation Failed."
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center pt-10">
      {/* Success Icon */}
      <div
        className="w-[80px] h-[80px] rounded-full bg-[#e8f5e9] flex items-center
       justify-center mb-5"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#2e7d32"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </div>

      <h1 className="text-[25px] font-bold text-gray-800 mb-2">
        Your order is placed!
      </h1>
      <p className="text-[#000] font-[600] mb-6">
        Thank you for your payment. <br /> Your order has been recorded
        successfully.
      </p>

      <Link to="/">
        <Button className="btn-org btn-lg !bg-[#ff5252] !text-white px-8">
          BACK TO HOME
        </Button>
      </Link>

      <br />
      <Link
        to="/my-orders"
        className="text-[14px] font-[700] mt-4 underline text-gray-600 "
      >
        View Order Status
      </Link>
    </div>
  );
};

export default PaymentSuccess;
