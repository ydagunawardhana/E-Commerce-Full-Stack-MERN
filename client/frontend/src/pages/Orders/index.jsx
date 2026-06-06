import React, { useEffect, useState } from "react";
import AccountSlidebar from "../../components/AccountSlidebar";
import { Button } from "@mui/material";

import { FaAngleDown } from "react-icons/fa6";
import { FaAngleUp } from "react-icons/fa6";
import Badge from "../../components/Badge";
import { fetchDataFromApi } from "../../utils/api";
import axios from "axios";
import io from "socket.io-client";

// My Orders page Functions
const Orders = () => {
  const [isOpenOrderdProduct, setIsOpenOrderdProduct] = useState(null);
  const [orders, setOrders] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  //  Orders API
  const fetchOrders = () => {
    fetchDataFromApi("/api/orders").then((res) => {
      if (res && res.success !== false) {
        setOrders(res.data);
      }
    });
  };

  // Socket.io useEffect
  useEffect(() => {
    fetchOrders();

    const API_URL = import.meta.env.VITE_API_URL;
    
    const socket = io(API_URL);

    socket.on("order_updated", () => {
      fetchOrders();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const isShowOrderdProduct = (index) => {
    if (isOpenOrderdProduct === index) {
      setIsOpenOrderdProduct(null);
    } else {
      setIsOpenOrderdProduct(index);
    }
  };

  return (
    <section className="py-10 w-full bg-[#f1f1f1] relative">
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

      <div className="container mx-auto w-[80%] flex gap-5 relative z-10">
        {/* --- LEFT SIDEBAR (PROFILE NAVIGATION) --- */}
        <div className="col1 w-[20%]">
          <AccountSlidebar />
        </div>

        {/* --- RIGHT SIDE (CONTENT AREA) --- */}
        <div className=" col2 w-[92%]">
          <div className="shadow-md rounded-md bg-[#fff]">
            <div className="py-4 px-4 border-b !border-[rgba(0,0,0,0.1)]">
              <h2 className="text-[22px] uppercase font-[700]">My Orders</h2>{" "}
              <p className="mt-0 text-[15px] font-[500] mb-4">
                There are{" "}
                <span className="font-bold text-[#ff5252]">
                  {orders?.length || 0}
                </span>{" "}
                Orders
              </p>
              {/* --- Orders Table--- */}
              <div
                className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs 
              rounded-base mt-5"
              >
                <table className="w-full text-sm text-left rtl:text-right text-body">
                  <thead
                    className="text-[14px] text-[600] bg-neutral-secondary-soft border-b 
                    rounded-base 
                  border-default uppercase bg-[#f1f1f1]"
                  >
                    {/* Table Heading */}
                    <tr>
                      <th className="px-4 py-3">&nbsp;</th>
                      <th className="px-4 py-3 whitespace-nowrap">Order ID</th>
                      <th className="px-4 py-3 whitespace-nowrap">
                        Payment Method
                      </th>
                      <th className="px-4 py-3 whitespace-nowrap">Products</th>
                      <th className="px-4 py-3 whitespace-nowrap">Name</th>
                      <th className="px-4 py-3 whitespace-nowrap">Phone</th>
                      <th className="px-4 py-3 whitespace-nowrap">Address</th>
                      <th className="px-4 py-3 whitespace-nowrap">
                        Total Amount
                      </th>
                      <th className="px-6 py-3 whitespace-nowrap">Status</th>
                      <th className="px-6 py-3 whitespace-nowrap">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* --- Table Data --- */}
                    {orders?.length > 0 ? (
                      orders.map((order, index) => (
                        <React.Fragment key={index}>
                          <tr className="bg-white border-b hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <Button
                                className="!min-w-[30px] !w-[30px] !h-[30px] !rounded-full 
                                !bg-gray-200 !text-black"
                                onClick={() => isShowOrderdProduct(index)}
                              >
                                {isOpenOrderdProduct === index ? (
                                  <FaAngleUp />
                                ) : (
                                  <FaAngleDown />
                                )}
                              </Button>
                            </td>
                            <td className="px-4 py-3 font-medium text-red-500">
                              {order._id}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className="text-gray-600 font-bold text-[12px] 
                              border px-2 py-1 rounded-sm uppercase border-gray-300"
                              >
                                {order?.paymentType || "COD"}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-medium">
                              {order.products?.length} Items
                            </td>
                            <td className="px-4 py-3">
                              {order.addressId?.name || order.userId?.name}
                            </td>
                            <td className="px-4 py-3">
                              {order.addressId?.mobile}
                            </td>
                            <td className="px-4 py-3 max-w-[200px] truncate">
                              {order.addressId?.address_line},{" "}
                              {order.addressId?.city}
                            </td>
                            <td className="px-8 py-3 font-bold text-black">
                              ${order.amount}
                            </td>
                            <td className="px-4 py-3">
                              <Badge status={order.status?.toLowerCase()} />
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                          </tr>

                          {/* --- Orders product Table (Colapse Table)--- */}
                          {isOpenOrderdProduct === index && (
                            <tr>
                              <td colSpan="9" className="p-4 bg-gray-50">
                                <div className="bg-white rounded-md shadow-sm border p-4">
                                  <h4 className="font-bold mb-3 text-gray-700">
                                    Order Items
                                  </h4>
                                  <table className="w-full text-sm">
                                    <thead className="bg-gray-100 text-xs uppercase">
                                      <tr>
                                        <th className="px-3 py-2">Image</th>
                                        <th className="px-3 py-2">
                                          Product Name
                                        </th>
                                        <th className="px-3 py-2">Qty</th>
                                        <th className="px-3 py-2">Price</th>
                                        <th className="px-3 py-2">SubTotal</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {order.products?.map((item, i) => (
                                        <tr
                                          key={i}
                                          className="border-b last:border-0"
                                        >
                                          <td className="px-3 py-2">
                                            <img
  src={
    item.image?.startsWith("http")
      ? item.image
      : `${API_URL}${item.image}` 
  }
  className="w-[50px] h-[50px] object-contain !rounded-md hover:scale-110 transition-all duration-300"
/>
                                          </td>
                                          <td className="px-3 py-2 font-medium">
                                            {item.productId?.name ||
                                              "Product Name"}
                                          </td>
                                          <td className="px-3 py-2">
                                            {item.quantity}
                                          </td>
                                          <td className="px-3 py-2">
                                            ${item.price}
                                          </td>
                                          <td className="px-3 py-2 font-bold">
                                            ${item.price * item.quantity}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="text-center py-5">
                          No Orders Found!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Orders;
