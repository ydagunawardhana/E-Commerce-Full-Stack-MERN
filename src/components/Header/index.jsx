import React from "react";
import { Link } from "react-router-dom";
import Search from "../Search";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { LuGitCompareArrows } from "react-icons/lu";
import { FaRegHeart } from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";
import Navigation from "./Navigation";

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
  return (
    <header className="bg-[#ffffff]">
      <div className="top-strip py-2 border-t-[1px] border-[#ffccbc] border-b-[4px]">
        <div className="container">
          <div className="flex items-center justify-between">
            <div className="col1 w-[50%]">
              <p className="text-[15px] font-[500]">
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
      <div className="header py-4 border-b-[4px] border-[#ffccbc]">
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

                {/*-- Header Icons Function --*/}
              <li>
                <Tooltip title="Compare">
                  <IconButton aria-label="compare">
                    <StyledBadge badgeContent={4} color="secondary">
                      <LuGitCompareArrows className="text-[#1a1a1a] text-[25px]" />
                    </StyledBadge>
                  </IconButton>
                </Tooltip>
              </li>

              <li>
                <Tooltip title="Wishlist">
                  <IconButton aria-label="wishlist">
                    <StyledBadge badgeContent={0} color="secondary">
                      <FaRegHeart className="text-[#1a1a1a] text-[25px]" />
                    </StyledBadge>
                  </IconButton>
                </Tooltip>
              </li>

              <li>
                <Tooltip title="Cart">
                  <IconButton aria-label="cart">
                    <StyledBadge badgeContent={0} color="secondary">
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
