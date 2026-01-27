import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ProductListing from "./pages/ProductListing";
import ProductDetails from "./pages/ProductDetails";
import ProductZoom from "./components/ProductZoom";
import React, { createContext, useEffect, useState } from "react";

import { IoMdCloseCircle } from "react-icons/io";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import ProductDialogBox from "./components/ProductDialogBox";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CartPage from "./pages/Cart";
import Verify from "./pages/Verify";
import toast, { Toaster } from "react-hot-toast";
import ForgotPassword from "./pages/ForgotPassword";
import Checkout from "./pages/Checkout";
import MyAccount from "./pages/MyAccount";
import MyList from "./pages/MyList";
import Orders from "./pages/Orders";
import { fetchDataFromApi } from "./utils/api";
import Address from "./pages/MyAccount/address";
import PaymentSuccess from "./pages/Payment/PaymentSuccess";

const MyContext = createContext();

function App() {
  {
    /*-- Product Details Dialog Box Function --*/
  }
  const [openProductDetailsModel, setOpenProductDetailsModel] = useState(false);
  const [maxWidth, setMaxWidth] = useState("lg");
  const [fullWidth, setFullWidth] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [address, setAddress] = useState([]);
  const apiurl = import.meta.env.VITE_API_URL;
  const [productData, setProductData] = useState(null);
  const [openCartPanel, setOpenCartPanel] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [myListCount, setMyListCount] = useState(0);

  const viewProductDetails = (data) => {
    setProductData(data);
    setOpenProductDetailsModel(true);
  };

  const handleCloseProductDetailsModel = () => {
    setOpenProductDetailsModel(false);
    setProductData(data);
  };

  /*-- Cart Drawer Panel Function --*/
  const toggleCartPanel = (newOpen) => () => {
    setOpenCartPanel(newOpen);
  };

  useEffect(() => {
    if (isLogin) {
      // Login Only Get Wishlist Count
      fetchDataFromApi("/api/myList").then((res) => {
        setMyListCount(res.data?.length || 0);
      });
    } else {
      setMyListCount(0);
    }
  }, [isLogin]);

  useEffect(() => {
    const token = localStorage.getItem("accesstoken");

    if (token !== undefined && token !== null && token !== "") {
      setIsLogin(true);

      fetchDataFromApi("/api/user/user-details").then((res) => {
        setUserData(res.data);
        console.log(res?.error);
        if (res?.error === true) {
          if (res?.message === "You have not login") {
            localStorage.removeItem("accesstoken");
            localStorage.removeItem("refreshToken");

            openAlertBox(
              "error",
              "Your session is closed, Please login agian!"
            );

            setIsLogin(false);
          }
        }
      });
    } else {
      setIsLogin(false);
    }
  }, [isLogin]);

  const openAlertBox = (status, msg) => {
    if (status === "success") {
      toast.success(msg);
    }
    if (status === "error") {
      toast.error(msg);
    }
  };

  // Cart Items Function
  const getCartData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("userInfo"));

      const res = await fetchDataFromApi(`/api/cart/list`);

      if (res.status !== false) {
        setCartItems(res.data);
      }
    } catch (error) {
      console.log("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    if (isLogin === true) {
      getCartData();
    } else {
      setCartItems([]);
    }
  }, [isLogin]);

  /*-- Open Pages Function --*/
  const values = {
    setOpenProductDetailsModel,
    viewProductDetails,
    setOpenCartPanel,
    toggleCartPanel,
    openCartPanel,
    openAlertBox,
    isLogin,
    setIsLogin,
    setUserData,
    userData,
    address,
    setAddress,
    myListCount,
    setMyListCount,
    cartItems,
    setCartItems,
    getCartData,
  };

  /*-- Main Application Component (Pages) --*/
  return (
    <>
      <BrowserRouter>
        <MyContext.Provider value={values}>
          <Header />
          <Routes>
            <Route path={"/"} exact={true} element={<Home />} />

            {/* Product List Page */}
            <Route
              path={"/productListing"}
              exact={true}
              element={<ProductListing />}
            />

            {/* Product List Get Category */}
            <Route
              path="/productListing/:id"
              exact={true}
              element={<ProductListing />}
            />

            {/* Product Details Page */}
            <Route
              path={"/product/:id"}
              exact={true}
              element={<ProductDetails />}
            />

            {/* Login Page */}
            <Route path={"/login"} exact={true} element={<Login />} />

            {/* Register Page */}
            <Route path={"/register"} exact={true} element={<Register />} />

            {/* Verify Page */}
            <Route path={"/verify"} exact={true} element={<Verify />} />

            {/* Forgot-Password Page */}
            <Route
              path={"/forgot-password"}
              exact={true}
              element={<ForgotPassword />}
            />

            {/* Cart Page */}
            <Route path={"/cart"} exact={true} element={<CartPage />} />

            {/* Checkout Page */}
            <Route path={"/checkout"} exact={true} element={<Checkout />} />

            {/* My Account Page */}
            <Route path={"/my-account"} exact={true} element={<MyAccount />} />

            {/* My List Page */}
            <Route path={"/my-list"} exact={true} element={<MyList />} />

            {/* Address Page */}
            <Route path={"/address"} exact={true} element={<Address />} />

            {/* Orders Page */}
            <Route path={"/my-orders"} exact={true} element={<Orders />} />

            {/* Payment success Page */}
            <Route path="/payment/success" element={<PaymentSuccess />} />
          </Routes>

          {/*-- Product Details Dialog Box --*/}
          <Dialog
            open={openProductDetailsModel}
            fullWidth={fullWidth}
            maxWidth={maxWidth}
            onClose={handleCloseProductDetailsModel}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            className="productDetailsModel"
          >
            <DialogContent>
              <div className="flex items-center w-full productDetailsModel relative">
                <Button
                  className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[#000]
            !absolute -top-[13px] -right-[8px] !bg-[#f1f1f1]"
                  onClick={handleCloseProductDetailsModel}
                >
                  <IoMdCloseCircle className="text-[40px]" />
                </Button>
                <div className="col1 w-[40%]">
                  <ProductZoom images={productData?.images} />
                </div>

                <div className="col2 w-[60%] py-8 px-10 items-center productContext">
                  <ProductDialogBox data={productData} />
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Footer />
        </MyContext.Provider>
      </BrowserRouter>

      <Toaster />
    </>
  );
}

export default App;

export { MyContext };
