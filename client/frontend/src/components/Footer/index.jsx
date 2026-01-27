import React, { useContext } from "react";
import { FaShippingFast } from "react-icons/fa";
import { MdOutlineAssignmentReturn } from "react-icons/md";
import { RiSecurePaymentLine } from "react-icons/ri";
import { FaGifts } from "react-icons/fa6";
import { BiSupport } from "react-icons/bi";
import { Link } from "react-router-dom";
import { PiChatsBold } from "react-icons/pi";
import { Button } from "@mui/material";

import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { FaFacebookF } from "react-icons/fa";
import { FiYoutube } from "react-icons/fi";
import { FaPinterestP } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";

import Drawer from "@mui/material/Drawer";
import CancelIcon from "@mui/icons-material/Cancel";
import { MyContext } from "../../App";
import CartPanel from "../CartPanel";

//Footer Functions
const Footer = () => {
  const context = useContext(MyContext);
  return (
    <>
      <footer className="py-1 bg-[#fff] border-t-[3px] border-[#ffccbc]">
        {/*-- Footer Upper Icons-4 Function --*/}
        <div className="container">
          <div className="flex items-center justify-center gap-2 pt-6 pb-3">
            <div className="col flex items-center justify-center flex-col group w-[20%]">
              <FaShippingFast
                className="text-[60px] font-[600] transition-all duration-300 group-hover:text-[#ff5252]
            group-hover:-translate-y-3"
              />
              <h3 className="text-[18px] font-[600] mt-3">Free Shipping</h3>
              <p className="text-[14px] font-[500] mt-2">
                For all Orders Over $200
              </p>
            </div>

            <div className="col flex items-center justify-center flex-col group w-[20%]">
              <MdOutlineAssignmentReturn
                className="text-[60px] transition-all duration-300 group-hover:text-[#ff5252]
            group-hover:-translate-y-3"
              />
              <h3 className="text-[18px] font-[600] mt-3">30 Days Returns</h3>
              <p className="text-[14px] font-[500] mt-2">
                For an Exchange Product
              </p>
            </div>

            <div className="col flex items-center justify-center flex-col group w-[20%]">
              <RiSecurePaymentLine
                className="text-[60px] transition-all duration-300 group-hover:text-[#ff5252]
            group-hover:-translate-y-3"
              />
              <h3 className="text-[18px] font-[600] mt-3">Secured Payment</h3>
              <p className="text-[14px] font-[500] mt-2">
                Payment Cards Accepted
              </p>
            </div>

            <div className="col flex items-center justify-center flex-col group w-[20%]">
              <FaGifts
                className="text-[60px] transition-all duration-300 group-hover:text-[#ff5252]
            group-hover:-translate-y-3"
              />
              <h3 className="text-[18px] font-[600] mt-3">Special Gifts</h3>
              <p className="text-[14px] font-[500] mt-2">
                Our First Product Order
              </p>
            </div>

            <div className="col flex items-center justify-center flex-col group w-[20%]">
              <BiSupport
                className="text-[60px] transition-all duration-300 group-hover:text-[#ff5252]
            group-hover:-translate-y-3"
              />
              <h3 className="text-[18px] font-[600] mt-3">Support 24/7</h3>
              <p className="text-[14px] font-[500] mt-2">Contact us Anytime</p>
            </div>
          </div>
          <br />

          <hr />

          {/*-- Footer Bottom Functions --*/}
          <div className="footer flex py-10">
            {/*-- Footer - (Contact Us) Functions --*/}
            <div className="part1 w-[25%] border-r border-[rgba(0,0,0,0.1)]">
              <h2 className="text-[22px] font-[650] mb-2">Contact Us</h2>
              <p className="text-[15px] font-[500] pb-3">
                NEXAMART - Mega Super Store
                <br />
                510-Union Trade center Colombo-03
              </p>

              <Link className="link" to="mailto:someone@example.com">
                Sales@nexamartcompany.com
              </Link>

              <span className="text-[21px] font-[600] block w-full mt-2 mb-4 text-[#ff5252]">
                (+94 790-234-674){" "}
              </span>

              <div className="flex items-center gap-2">
                <PiChatsBold className="text-[45px] text-[#ff5252]" />
                <span className="text-[16px] font-[600] pl-5">
                  Online Chat
                  <br />
                  Get Expert Help
                </span>
              </div>
            </div>

            <div className="part2 w-[40%] flex pl-8">
              {/*-- Footer - (Products) Functions --*/}
              <div className="part2_col1 w-[50%]">
                <h2 className="text-[22px] font-[650] mb-2">Products</h2>

                <ul className="list">
                  <li className="list-none text-[15px] font-[400] w-full mb-2">
                    <Link to="/" className="link">
                      Prices Drop
                    </Link>
                  </li>

                  <li className="list-none text-[15px] font-[400] w-full mb-2">
                    <Link to="/" className="link">
                      New Products
                    </Link>
                  </li>

                  <li className="list-none text-[15px] font-[400] w-full mb-2">
                    <Link to="/" className="link">
                      Best Sales
                    </Link>
                  </li>

                  <li className="list-none text-[15px] font-[400] w-full mb-2">
                    <Link to="/" className="link">
                      Contact Us
                    </Link>
                  </li>

                  <li className="list-none text-[15px] font-[400] w-full mb-2">
                    <Link to="/" className="link">
                      Sitemap
                    </Link>
                  </li>

                  <li className="list-none text-[15px] font-[400] w-full mb-2">
                    <Link to="/" className="link">
                      Stores
                    </Link>
                  </li>
                </ul>
              </div>

              {/*-- Footer - (Our Company) Functions --*/}
              <div className="part2_col2 w-[50%]">
                <h2 className="text-[22px] font-[650] mb-2">Our Company</h2>

                <ul className="list">
                  <li className="list-none text-[15px] font-[400] w-full mb-2">
                    <Link to="/" className="link">
                      Delivery
                    </Link>
                  </li>

                  <li className="list-none text-[15px] font-[400] w-full mb-2">
                    <Link to="/" className="link">
                      Legal Notice
                    </Link>
                  </li>

                  <li className="list-none text-[15px] font-[400] w-full mb-2">
                    <Link to="/" className="link">
                      Terms and Conditions of Use
                    </Link>
                  </li>

                  <li className="list-none text-[15px] font-[400] w-full mb-2">
                    <Link to="/" className="link">
                      About Us
                    </Link>
                  </li>

                  <li className="list-none text-[15px] font-[400] w-full mb-2">
                    <Link to="/" className="link">
                      Secure Payment
                    </Link>
                  </li>

                  <li className="list-none text-[15px] font-[400] w-full mb-2">
                    <Link to="/" className="link">
                      Login
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/*-- Footer - (Subscribe to newsletter) Functions --*/}
            <div className="part2 w-[35%] flex-col pl-10 pr-8">
              <h2 className="text-[22px] font-[650] mb-2">
                Subscribe to newsletter
              </h2>
              <p className="text-[15px]">
                Subscribe to our latest newsletter to get news about special
                discounts.
              </p>

              <form className="mt-5">
                <input
                  type="text"
                  className="w-full h-[45px] border outline-none pl-4 pr-4
                rounded-sm mb-4 focus:border-[rgba(0,0,0,0.3)]"
                  placeholder="Your Email Address"
                />

                {/*-- Footer - (Subscribe/Checkbox) Button --*/}
                <Button className="btn-org">Subscribe</Button>

                <FormControlLabel
                  control={<Checkbox />}
                  label="I agree to the terms and conditions and the privacy policy"
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      fontSize: "13px",
                      fontWeight: 300,
                      color: "rgba(0,0,0,0.8)",
                    },
                  }}
                />
              </form>
            </div>
          </div>
        </div>
      </footer>

      {/*-- Footer Bottom Section Function --*/}
      <div className="bottomStrip border-t-[3px] border-[#ffccbc] py-2 bg-[#ffffff]">
        <div className="container  flex items-center justify-between">
          <ul className="flex items-center gap-3">
            <li className="list-none">
              <Link
                to="/"
                target="_blank"
                className="w-[35px] h-[35px] rounded-full border border-[rgba(0,0,0,0.1)]
              flex items-center justify-center group hover:bg-[#ff5252] transition-all"
              >
                <FaFacebookF className="text-[20px] group-hover:text-[#ffffff]" />
              </Link>
            </li>

            <li className="list-none">
              <Link
                to="/"
                target="_blank"
                className="w-[35px] h-[35px] rounded-full border border-[rgba(0,0,0,0.1)]
              flex items-center justify-center group hover:bg-[#ff5252] transition-all"
              >
                <FiYoutube className="text-[20px] group-hover:text-[#ffffff]" />
              </Link>
            </li>

            <li className="list-none">
              <Link
                to="/"
                target="_blank"
                className="w-[35px] h-[35px] rounded-full border border-[rgba(0,0,0,0.1)]
              flex items-center justify-center group hover:bg-[#ff5252] transition-all"
              >
                <FaPinterestP className="text-[20px] group-hover:text-[#ffffff]" />
              </Link>
            </li>

            <li className="list-none">
              <Link
                to="/"
                target="_blank"
                className="w-[35px] h-[35px] rounded-full border border-[rgba(0,0,0,0.1)]
              flex items-center justify-center group hover:bg-[#ff5252] transition-all"
              >
                <FaInstagram className="text-[20px] group-hover:text-[#ffffff]" />
              </Link>
            </li>
          </ul>

          <p className="text-[14px] text-center mb-0">
            © 2026 - Ecommerce NEXAMART Template
          </p>

          <div className="flex items-center">
            <img src="Footer_1.png" alt="image" />
            <img src="Footer_2.png" alt="image" />
            <img src="Footer_3.png" alt="image" />
            <img src="Footer_4.png" alt="image" />
            <img src="Footer_5.png" alt="image" />
          </div>
        </div>
      </div>

      {/*-- CartPanel Drawer --*/}
      <Drawer
        open={context.openCartPanel}
        onClose={context.toggleCartPanel(false)}
        anchor={"right"}
        className="cartPanel"
      >
        <div
          className="flex items-center justify-between py-3 px-4 gap-3 border-b 
        border-[rgba(0,0,0,0.1)]"
        >
          <h4>Shopping Cart ({context.cartItems?.length || 0})</h4>
          <CancelIcon
            className="text-[20px] cursor-pointer"
            onClick={context.toggleCartPanel(false)}
          />
        </div>

        <CartPanel />
      </Drawer>
    </>
  );
};

export default Footer;
