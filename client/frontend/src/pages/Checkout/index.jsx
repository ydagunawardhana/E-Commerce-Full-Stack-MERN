import React, { useContext, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { IoBagHandle } from "react-icons/io5";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { deleteData, fetchDataFromApi, postData } from "../../utils/api";
import { MyContext } from "../../App";
import { HiDotsVertical } from "react-icons/hi";
import { DialogTitle, Radio } from "@mui/material";
import { LuMapPinPlus } from "react-icons/lu";
import Dialog from "@mui/material/Dialog";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { BsStripe } from "react-icons/bs";
import CircularProgress from "@mui/material/CircularProgress";

const stripePromise = await loadStripe(
  "pk_test_51SmtBkFDot0lizJL7l78C1nxaWRDqj3UdJhcyznfQTTXP8Wj4XN1VB6Sm6gJ5W96vtVYhJvIRHOY62D8Ec6QpUEB00US12zzWT"
);

const Checkout = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const [showStripe, setShowStripe] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  // ADDRESS MANAGEMENT LOGIC
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("Home");
  const [isOpenModel, setIsOpenModel] = useState(false);
  const [address, setAddress] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const open = Boolean(anchorEl);
  const [isCODLoading, setIsCODLoading] = useState(false);

  const [selectedAddress, setSelectedAddress] = useState("");

  const [formFields, setFormFields] = useState({
    address_line: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    mobile: "",
    status: "Home",
  });

  // CART TOTAL CALCULATION
  const cartTotal =
    context.cartItems?.length > 0
      ? context.cartItems.reduce(
          (acc, item) =>
            acc +
            parseInt(item.productId?.price || 0) * parseInt(item.quantity),
          0
        )
      : 0;

  // FETCH ADDRESSES
  useEffect(() => {
    if (context?.userData?._id !== "" && context?.userData?._id !== undefined) {
      fetchDataFromApi(
        `/api/address/get?userId=${context?.userData?._id}`
      ).then((res) => {
        setAddress(res.data);

        if (res.data.length > 0 && !selectedId) {
          setSelectedId(res.data[0]._id);
        }
      });
    }
  }, [context?.userData]);

  const handleChange = (e, index) => {
    if (e.target.checked) {
      setlsChecked(index);
      setSelectedAddress(e.target.value);
    }
  };

  //  MENU FUNCTIONS
  const handleClickMenu = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

  // DELETE FUNCTION
  const handleDeleteAddress = () => {
    handleCloseMenu();

    deleteData(`/api/address/delete/${selectedId}`).then((res) => {
      if (res?.error !== true) {
        context.openAlertBox("success", "Address Deleted Successfully!");

        const newAddressList = address.filter(
          (item) => item._id !== selectedId
        );
        setAddress(newAddressList);
      } else {
        context.openAlertBox("error", res?.message || "Failed to delete");
      }
    });
  };

  const handleClose = () => {
    setIsOpenModel(false);
  };

  const handleChangeStatus = (event) => {
    setStatus(event.target.value);
    setFormFields((prevState) => ({
      ...prevState,
      status: event.target.value,
    }));
  };

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields(() => {
      return {
        ...formFields,
        [name]: value,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);

    if (formFields.address_line === "") {
      context.openAlertBox("error", "Please enter Address line");
      setIsLoading(false);
      return false;
    }

    if (formFields.city === "") {
      context.openAlertBox("error", "Please enter City Name");
      setIsLoading(false);
      return false;
    }

    if (formFields.state === "") {
      context.openAlertBox("error", "Please enter your State");
      setIsLoading(false);
      return false;
    }

    if (formFields.pincode === "") {
      context.openAlertBox("error", "Please enter Pin Code");
      setIsLoading(false);
      return false;
    }

    if (formFields.country === "") {
      context.openAlertBox("error", "Please enter your Country");
      setIsLoading(false);
      return false;
    }

    if (formFields.mobile === "" || formFields.mobile.length < 5) {
      context.openAlertBox("error", "Please enter valid Mobile Number");
      setIsLoading(false);
      return false;
    }

    console.log(formFields);

    postData(`/api/address/add`, formFields, { withCredentials: true }).then(
      (res) => {
        console.log(res);
        if (res?.error !== true) {
          setIsLoading(false);
          context.openAlertBox("success", res?.message);

          setIsOpenModel(false);
          setStatus("Home");

          // Form clear
          setFormFields({
            address_line: "",
            city: "",
            state: "",
            pincode: "",
            country: "",
            mobile: "",
            status: "Home",
          });
          setPhone("");

          fetchDataFromApi(
            `/api/address/get?userId=${context?.userData?._id}`
          ).then((res) => {
            setAddress(res.data);
          });
        } else {
          context.openAlertBox("error", res?.message);
          setIsLoading(false);
        }
      }
    );
  };

  //  PLACE ORDER (CASH ON DELIVERY)
  const handleCOD = async () => {
    if (context.cartItems?.length === 0) {
      context.openAlertBox("error", "Your Cart is Empty! Please add products.");
      return;
    }

    if (!selectedId) {
      context.openAlertBox("error", "Please select a delivery address!");
      return;
    }

    setIsCODLoading(true);

    localStorage.removeItem("pendingOrder");

    const orderPayload = {
      userId: context.userData._id,
      paymentType: "COD",
      addressId: selectedId,
      products: context.cartItems,
      amount: cartTotal,
    };

    try {
      const res = await postData("/api/orders/create", orderPayload);
      if (res.error === false) {
        context.openAlertBox("success", "Order Placed Successfully!");
        context.setCartItems([]);

        setTimeout(() => {
          setIsCODLoading(false);
          navigate("/payment/success");
        }, 8000);
      } else {
        setIsCODLoading(false);
        context.openAlertBox("error", res.message || "Order Failed");
      }
    } catch (error) {
      setIsCODLoading(false);
      console.log(error);
      context.openAlertBox("error", "Something went wrong!");
    }
  };

  //  ONLINE PAYMENT (STRIPE)
  const handleOnlinePayment = async (e) => {
    if (context.cartItems?.length === 0) {
      context.openAlertBox("error", "Your Cart is Empty!");
      return;
    }

    if (!selectedId) {
      context.openAlertBox("error", "Please select a delivery address!");
      return;
    }

    const body = {
      products: context.cartItems,
      addressId: selectedId,
      userId: context.userData._id,
    };

    const orderDetails = {
      userId: context.userData._id,
      paymentType: "Online (Stripe)",
      addressId: selectedId,
      products: context.cartItems,
      amount: cartTotal,
    };
    localStorage.setItem("pendingOrder", JSON.stringify(orderDetails));

    
    const API_URL = import.meta.env.VITE_API_URL;

    try {
     
      const response = await fetch(
        `${API_URL}/api/payment/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        context.openAlertBox("error", data.error || "Payment Failed");
        return;
      }

      setClientSecret(data.clientSecret);
      setShowStripe(true);
    } catch (error) {
      console.log(error);
      context.openAlertBox("error", "Server Error. Please try again.");
    }
  };

  return (
    <section className="py-10 bg-[#f1f1f1] relative">
      <div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Top Right Circle */}
          <div
            className="absolute -top-[150px] -right-[150px] w-[500px] h-[500px] 
          bg-[#ffccbcb4] rounded-full opacity-50"
          ></div>
          {/* Bottom Left Circle */}
          <div
            className="absolute -bottom-[150px] -left-[150px] w-[450px] h-[450px] 
          bg-[#ffccbcad] rounded-full opacity-50"
          ></div>
        </div>

        <div className="container w-[80%] max-w-[80%] mx-auto flex gap-5 relative z-10">
          {/*  LEFT SIDE (CONTENT AREA) */}
          <div className=" col2 w-[65%]">
            <div className="card bg-[#fff] shadow-md rounded-md p-5 mb-5">
              <div className="flex items-center  pb-3">
                <h2 className=" text-[22px] font-[700] pb-0 uppercase ">
                  Address
                </h2>
              </div>
              <hr />

              <div className="w-full ">
                {/* Add Address Button */}
                <div
                  className="flex items-center justify-center p-5 rounded-md border border-dashed
                 border-[rgba(0,0,0,0.2)] bg-[#f1faff] hover:bg-[#e7f3f9] cursor-pointer mt-2
                 "
                  onClick={() => setIsOpenModel(true)}
                >
                  <span className="text-[15px] font-[600] text-[#363636] flex items-center gap-3 ">
                    <LuMapPinPlus className="!text-[22px] !font-[700] text-[#000]" />
                    Add Address
                  </span>
                </div>

                {/* Address Details Save */}
                <div className="flex flex-col gap-4 mt-5">
                  {address?.length > 0 &&
                    address.map((item, index) => {
                      const isSelected = selectedId === item._id;

                      return (
                        <div
                          key={index}
                          className={`w-full p-4 border rounded-md flex items-center justify-between
                           hover:shadow-md transition-all cursor-pointer
                          ${
                            isSelected
                              ? "bg-[#ebebeb7a] border-[#a0a0a0]"
                              : "bg-white border-[rgba(0,0,0,0.1)]"
                          }`}
                          onClick={() => setSelectedId(item._id)}
                        >
                          <div className="flex items-start gap-3 w-full">
                            {/* --- RADIO BUTTON --- */}
                            <div className="-mt-2">
                              <Radio
                                checked={isSelected}
                                onChange={() => setSelectedId(item._id)}
                                value={item._id}
                                name="address-radio"
                                inputProps={{ "aria-label": item._id }}
                                size="small"
                                color="warning"
                              />
                            </div>

                            {/* --- INFO SECTION --- */}
                            <div className="info w-full">
                              <span
                                className="bg-[#f1f1f1] text-[11px] px-3 py-1 
                                rounded-md font-[600] uppercase tracking-wide text-gray-600"
                              >
                                {item.status ? "Home" : "Work"}
                              </span>

                              <div className="flex items-center gap-4 mt-3">
                                <h6 className="text-[16px] font-[700] text-gray-800">
                                  {context.userData?.name || "User"}
                                </h6>
                                <span className="text-[14px] font-[600] text-gray-700">
                                  {item.mobile}
                                </span>
                              </div>

                              <p className="text-[14px] font-[500] text-[#555] mt-1 leading-6">
                                {item.address_line}, {item.city}, {item.state} -{" "}
                                {item.pincode}
                              </p>
                              <p className="text-[15px] font-[600] text-[#555]">
                                {item.country}
                              </p>
                            </div>
                          </div>

                          {/* --- ACTION MENU --- */}
                          <div className="action pl-4 border-l border-gray-200 ml-4">
                            <Button
                              className="!min-w-[35px] !w-[35px] !h-[35px] !rounded-full !text-[#000] hover:!bg-[#f1f1f1]"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleClickMenu(e, item._id);
                              }}
                            >
                              <HiDotsVertical className="text-[20px] opacity-70" />
                            </Button>

                            <Menu
                              anchorEl={anchorEl}
                              open={open}
                              onClose={handleCloseMenu}
                              onClick={handleCloseMenu}
                              transformOrigin={{
                                horizontal: "right",
                                vertical: "top",
                              }}
                              anchorOrigin={{
                                horizontal: "right",
                                vertical: "bottom",
                              }}
                            >
                              <MenuItem
                                onClick={handleDeleteAddress}
                                className="!text-[#ff5252]"
                              >
                                <MdDelete className="mr-2 text-[18px]" /> Delete
                              </MenuItem>
                            </Menu>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>

          {/* Add Address Dialog Box */}
          <Dialog open={isOpenModel}>
            <DialogTitle className="text-[22px] !font-[700] pb-0 uppercase ">
              Add Address
            </DialogTitle>

            <form className="p-8 py-3 pb-4" onSubmit={handleSubmit}>
              <div className="flex items-center gap-5 pb-5">
                <div className=" col w-[100%]">
                  <TextField
                    className="w-full"
                    label="Address line"
                    variant="outlined"
                    size="small"
                    color="warning"
                    name="address_line"
                    onChange={onChangeInput}
                    value={formFields.address_line}
                  />
                </div>
              </div>

              <div className="flex items-center gap-5 pb-5">
                <div className=" col w-[50%]">
                  <TextField
                    className="w-full"
                    label="City"
                    variant="outlined"
                    size="small"
                    color="warning"
                    name="city"
                    onChange={onChangeInput}
                    value={formFields.city}
                  />
                </div>

                <div className=" col w-[50%]">
                  <TextField
                    className="w-full"
                    label="State"
                    variant="outlined"
                    size="small"
                    color="warning"
                    name="state"
                    onChange={onChangeInput}
                    value={formFields.state}
                  />
                </div>
              </div>

              <div className="flex items-center gap-5 pb-5">
                <div className=" col w-[50%]">
                  <TextField
                    className="w-full"
                    label="Pincode"
                    variant="outlined"
                    size="small"
                    color="warning"
                    name="pincode"
                    onChange={onChangeInput}
                    value={formFields.pincode}
                  />
                </div>

                <div className=" col w-[50%]">
                  <TextField
                    className="w-full"
                    label="Country"
                    variant="outlined"
                    size="small"
                    color="warning"
                    name="country"
                    onChange={onChangeInput}
                    value={formFields.country}
                  />
                </div>
              </div>

              <div className="flex items-center gap-5 pb-5">
                <div className=" col w-[50%]">
                  <PhoneInput
                    defaultCountry="lk"
                    value={phone}
                    className="rounded-md"
                    onChange={(phone) => {
                      setPhone(phone);
                      setFormFields((prevState) => ({
                        ...prevState,
                        mobile: phone,
                      }));
                    }}
                  />
                </div>

                <div className=" col w-[50%]">
                  <Select
                    color="warning"
                    value={status}
                    onChange={handleChangeStatus}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    size="small"
                    className="w-full"
                  >
                    <MenuItem value={"home"}>Home</MenuItem>
                    <MenuItem value={"work"}>Work</MenuItem>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <Button
                  type="submit"
                  className="btn-org btn-lg w-full !h-[45px] !font-bold flex gap-3 !mb-3"
                >
                  Save
                </Button>

                <Button
                  className="btn-org btn-border btn-lg w-full !h-[45px] !font-bold 
            flex gap-3 !mb-3"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Dialog>

          {/* --- RIGHT COLUMN (YOUR ORDERS) --- */}
          <div className="rightCol w-[35%]">
            <div className="card bg-[#ffffff] shadow-md p-5 rounded-md top-[230px] sticky">
              <h2 className="text-[20px] font-bold mb-3 border-b pb-2">
                YOUR ORDER
              </h2>

              {/* Product List Header */}
              <div className="flex justify-between border-b pb-2 mb-3">
                <span className="font-[600] text-[14px]">PRODUCT</span>
                <span className="font-[600] text-[14px]">SUBTOTAL</span>
              </div>

              {/* Scrollable Product List */}
              <div
                className="scrollDiv max-h-[250px] overflow-y-scroll overflow-x-hidden 
              pr-3 custom-scroll"
              >
                {/* Product Item 1 */}
                {context.cartItems?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between mb-3 border-b pb-3 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="img w-[70px] h-[70px] rounded-md overflow-hidden border">
                        <img
                          src={
                            item.productId?.images?.[0]
                              ? item.productId.images[0].startsWith("http")
                                ? item.productId.images[0]
                                : `http://localhost:5000${item.productId.images[0]}`
                              : "https://placehold.co/60x60"
                          }
                          className=" object-contain hover:scale-110 transition-all"
                          alt="product"
                        />
                      </div>
                      <div className="info">
                        <h4 className="text-[14px] font-[600] leading-4 line-clamp-2 w-[150px]">
                          {item.productId?.name}
                        </h4>
                        <span className="text-[14px] font-[600] text-gray-500">
                          Qty: {item.quantity} × ${item.productId?.price}
                        </span>
                      </div>
                    </div>
                    <span className="text-[15px] font-[650] text-[#ff5252]">
                      $
                      {(
                        parseInt(item.productId?.price) *
                        parseInt(item.quantity)
                      ).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals Section */}
              <div className="mt-4 group relative">
                <div className="flex justify-between border-t pt-2 mb-3">
                  <span className="text-[18px] font-[700]">Total</span>
                  <span className="text-[18px] font-[700] text-[#ff5252]">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Place Order Button */}
              <Button
                type="submit"
                className="btn-org btn-lg w-full !h-[45px] !font-bold flex gap-3 !mb-3"
                onClick={handleOnlinePayment}
              >
                <BsStripe className="text-[22px] " />
                Checkout (Stripe Payment)
              </Button>

              <Button
                className="btn-org btn-border btn-lg w-full !h-[45px] !font-bold flex gap-3"
                onClick={handleCOD}
                disabled={isCODLoading}
              >
                {isCODLoading ? (
                  <CircularProgress size={25} color="inherit" />
                ) : (
                  <>
                    <IoBagHandle className="text-[23px]" /> Cash on delivery
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
        {/* Stripe Payment Dialog */}
        <Dialog
          open={showStripe}
          onClose={() => setShowStripe(false)}
          maxWidth="lg"
          fullWidth
        >
          <div className="p-3 ">
            {clientSecret && (
              <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={{ clientSecret }}
              >
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            )}
          </div>
        </Dialog>
      </div>
    </section>
  );
};

export default Checkout;
