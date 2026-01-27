import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Search from "../Search";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { LuGitCompareArrows, LuMapPinCheck } from "react-icons/lu";
import { FaRegHeart } from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";
import Navigation from "./Navigation";
import { MyContext } from "../../App";
import { Button } from "@mui/material";
import { CgProfile } from "react-icons/cg";
import { IoBagCheckOutline } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { fetchDataFromApi } from "../../utils/api";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: "0 4px",
  },
}));

// Header Component
const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const context = useContext(MyContext);
  const history = useNavigate();

  const logout = () => {
    setAnchorEl(null);

    fetchDataFromApi(
      `/api/user/logout?token=${localStorage.getItem("accesstoken")}`,
      { withCredentials: true }
    ).then((res) => {
      console.log(res);
      if (res?.error === false) {
        context.openAlertBox("success", "Logout Successfully!");

        context.setIsLogin(false);
        localStorage.removeItem("accesstoken");
        localStorage.removeItem("refreshToken");
        history("/");
      }
    });
  };

  return (
    <header className="bg-[#ffffff] sticky top-0 z-[100] shadow-md">
      <div className="top-strip  border-t-[1px] border-[#ffccbc] border-b-[2px]">
        <div className="container">
          <div className="flex items-center justify-between">
            <div className="col1 w-[50%]">
              <p className="text-[14px] font-[500]">
                Get up to 50% off new season styles, Limited time only!
              </p>
            </div>

            <div className="col2 flex items-center justify-end">
              <ul className="flex items-center gap-3">
                <li className="list-none">
                  <Link
                    to="/help-center"
                    className="text-[14px] link font-[500]
                            transition"
                  >
                    Help Center
                  </Link>
                </li>
                <li className="list-none">
                  <Link
                    to="/order-tracking"
                    className="text-[14px] link font-[500]
                            transition"
                  >
                    Order Tracking
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/*-- Logo Function --*/}
      <div className="header py-2 border-b-[2px] border-[#ffccbc]">
        <div className="container flex items-center justify-around">
          <div className="col1 w-[16%]">
            <Link to={"/"}>
              <img src="/logo.png" />
            </Link>
          </div>

          <div className="col2 w-[45%] pl-10">
            <Search />
          </div>

          {/*-- Login / Register Function --*/}
          <div className="col3 w-[30%] flex items-center pl-7">
            <ul className="flex items-center justify-end gap-5 w-full">
              {context.isLogin === false ? (
                <li className="list-none">
                  <Link
                    to="/login"
                    className="link transition text-[15px] link font-[600]"
                  >
                    Login
                  </Link>{" "}
                  |&nbsp;
                  <Link
                    to="/register"
                    className="link transition text-[15px] link font-[600]"
                  >
                    Register
                  </Link>
                </li>
              ) : (
                <>
                  <Button
                    className="myAccountWrap flex items-center gap-3 cursor-pointer 
                  !text-[#00000075]"
                    component="div"
                    onClick={handleClick}
                  >
                    <Button
                      className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-full
                  !bg-[#f1f1f1] !text-[#00000075]"
                    >
                      <CgProfile className="!text-[30px] text-[#0000009f]" />
                    </Button>

                    <div className="info flex flex-col">
                      <h4
                        className="text-[14px] mb-0 uppercase text-left justify-start
                    text-[#000] font-[600] leading-3"
                      >
                        {context?.userData?.name}
                      </h4>
                      <span
                        className="text-[13px] text-left justify-start text-[#000]
                    font-[500] capitalize"
                      >
                        {context?.userData?.email}
                      </span>
                    </div>
                  </Button>

                  {/*-- Account Menu (My Profile) Button Function --*/}
                  <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    slotProps={{
                      paper: {
                        elevation: 0,
                        sx: {
                          overflow: "visible",
                          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                          mt: 1.5,
                          "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                          },
                          "&::before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                          },
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    <Link to="/my-account" className="w-full block">
                      <MenuItem
                        onClick={handleClose}
                        className="flex gap-2 !py-2"
                      >
                        <CgProfile className="text-[19px]" />
                        <span className="text-[15px] font-[500]">
                          My account
                        </span>
                      </MenuItem>
                    </Link>

                    <Link to="/address" className="w-full block">
                      <MenuItem
                        onClick={handleClose}
                        className="flex gap-2 !py-2"
                      >
                        <LuMapPinCheck className="text-[20px]" />
                        <span className="text-[15px] font-[500]">Address</span>
                      </MenuItem>
                    </Link>

                    <Link to="/my-orders" className="w-full block">
                      <MenuItem
                        onClick={handleClose}
                        className="flex gap-2 !py-2"
                      >
                        <IoBagCheckOutline className="text-[20px]" />
                        <span className="text-[15px] font-[500]">Orders</span>
                      </MenuItem>
                    </Link>

                    <Link to="/my-list" className="w-full block">
                      <MenuItem
                        onClick={handleClose}
                        className="flex gap-2 !py-2"
                      >
                        <FaRegHeart className="text-[17px]" />
                        <span className="text-[15px] font-[500]">My List</span>
                      </MenuItem>
                    </Link>

                    <MenuItem onClick={logout} className="flex gap-2 !py-2">
                      <IoLogOutOutline className="text-[20px]" />
                      <span className="text-[15px] font-[500]">Log out</span>
                    </MenuItem>
                  </Menu>
                </>
              )}

              {/*-- Header Icons Function --*/}

              <li>
                <Tooltip title="Wishlist">
                  <Link to="/my-list">
                    <IconButton aria-label="wishlist">
                      <StyledBadge
                        badgeContent={context.myListCount}
                        color="secondary"
                      >
                        <FaRegHeart className="text-[#1a1a1a] text-[25px]" />
                      </StyledBadge>
                    </IconButton>
                  </Link>
                </Tooltip>
              </li>

              <li>
                <Tooltip title="Cart">
                  <IconButton
                    aria-label="cart"
                    onClick={() => context.setOpenCartPanel(true)}
                  >
                    <StyledBadge
                      badgeContent={context.cartItems?.length}
                      color="secondary"
                    >
                      <MdOutlineShoppingCartCheckout className="text-[#1a1a1a] text-[25px]" />
                    </StyledBadge>
                  </IconButton>
                </Tooltip>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Navigation />
    </header>
  );
};

export default Header;
