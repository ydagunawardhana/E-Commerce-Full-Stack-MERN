import { Button } from "@mui/material";
import React from "react";
import { RiMenuFold2Fill } from "react-icons/ri";
import { FaAngleDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MdRocketLaunch } from "react-icons/md";
import CategoryPanel from "./CategoryPanel";

import "../Navigation/style.css";

// Header Navigation Function
const Navigation = () => {
  // Drawer Panel Open
  const [isOpenCatPanel, setIsOpenCatPanel] = React.useState(false);

  const openCategoryPanel = () => {
    setIsOpenCatPanel(true);
  };
  return (
    <>
      {" "}
      {/*-- Shop by Categories Button --*/}
      <nav className="py-2">
        <div className="container flex items-center justify-end gap-10 ">
          <div className="col_1 w-[23%]">
            <Button
              className="!text-[#0f0f0f] !font-[700] hover:!text-[#d84315] !rounded-full gap-2 w-full"
              onClick={openCategoryPanel}
            >
              <RiMenuFold2Fill className="text-[20px] text-[#0f0f0f]" />
              Shop By Categories
              <FaAngleDown className="text-[18px] text-[#0f0f0f] ml-auto font-bold hover:!text-[#d84315]" />
            </Button>
          </div>

          {/*-- Home Button Function --*/}
          <div className="col_2 w-[85%]">
            <ul className="flex items-center gap-6 nav">
              <li className="list-none">
                <Link to="/" className="link transition link font-[600]">
                  <Button
                    className="link transition !font-[700] text-[#0f0f0f] 
                        hover:!text-[#d84315] !text-[15px] !rounded-full"
                  >
                    Home
                  </Button>
                </Link>
              </li>

              {/*-- Fashion Button Function --*/}
              <li className="list-none relative">
                <Link to="/" className="link transition link font-[600]">
                  <Button
                    className="link transition !font-[700] text-[#0f0f0f] 
                        hover:!text-[#d84315] !text-[15px] !rounded-full"
                  >
                    Fashion
                  </Button>
                </Link>

                <div
                  className="submenu absolute top-[120%] left-[0%] min-w-[150px] bg-[#ffffff]
                            shadow-md opacity-0 transition-all"
                >
                  <ul>
                    <li className="list-none w-full relative">
                      <Link to="/" className="w-full">
                        <Button
                          className=" text-[#0f0f0f] w-full !text-left
                                        !justify-start !rounded-none "
                        >
                          Men
                        </Button>

                        <div
                          className="submenu absolute top-[0%] left-[100%] min-w-[150px] bg-[#ffffff]
                                shadow-md opacity-0 transition-all"
                        >
                          <ul>
                            <li className="list-none w-full">
                              <Link to="/" className="w-full">
                                <Button
                                  className=" text-[#0f0f0f] w-full !text-left
                                        !justify-start !rounded-none"
                                >
                                  T-Shirts
                                </Button>
                              </Link>
                            </li>
                            <li className="list-none w-full">
                              <Link to="/" className="w-full">
                                <Button
                                  className=" text-[#0f0f0f] w-full !text-left
                                        !justify-start !rounded-none"
                                >
                                  Jeans
                                </Button>
                              </Link>
                            </li>
                            <li className="list-none w-full">
                              <Link to="/" className="w-full">
                                <Button
                                  className=" text-[#0f0f0f] w-full !text-left
                                        !justify-start !rounded-none"
                                >
                                  Footwear
                                </Button>
                              </Link>
                            </li>
                            <li className="list-none w-full">
                              <Link to="/" className="w-full">
                                <Button
                                  className=" text-[#0f0f0f] w-full !text-left
                                        !justify-start !rounded-none"
                                >
                                  Watches
                                </Button>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </Link>
                    </li>
                    <li className="list-none w-full">
                      <Link to="/" className="w-full">
                        <Button
                          className=" text-[#0f0f0f] w-full !text-left
                                        !justify-start !rounded-none"
                        >
                          Women
                        </Button>
                      </Link>
                    </li>
                    <li className="list-none w-full">
                      <Link to="/" className="w-full">
                        <Button
                          className=" text-[#0f0f0f] w-full !text-left
                                        !justify-start !rounded-none"
                        >
                          Kids
                        </Button>
                      </Link>
                    </li>
                    <li className="list-none w-full">
                      <Link to="/" className="w-full">
                        <Button
                          className=" text-[#0f0f0f] w-full !text-left
                                        !justify-start !rounded-none"
                        >
                          Girls
                        </Button>
                      </Link>
                    </li>
                    <li className="list-none w-full">
                      <Link to="/" className="w-full">
                        <Button
                          className=" text-[#0f0f0f] w-full !text-left
                                        !justify-start !rounded-none"
                        >
                          Boys
                        </Button>
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>

              {/*-- Electronics Button Function --*/}
              <li className="list-none relative">
                <Link to="/" className="link transition link font-[600]">
                  <Button
                    className="link transition !font-[700]  text-[#0f0f0f] 
                        hover:!text-[#d84315] !text-[15px] !rounded-full"
                  >
                    Electronics
                  </Button>
                </Link>

                <div
                  className="submenu absolute top-[120%] left-[0%] min-w-[150px] bg-[#ffffff]
                            shadow-md opacity-0 transition-all"
                >
                  <ul>
                    <li className="list-none w-full">
                      <Link to="/" className="w-full">
                        <Button
                          className=" text-[#0f0f0f] w-full !text-left
                                        !justify-start !rounded-none"
                        >
                          Smart Watches
                        </Button>
                      </Link>
                    </li>

                    <li className="list-none w-full">
                      <Link to="/" className="w-full">
                        <Button
                          className=" text-[#0f0f0f] w-full !text-left
                                        !justify-start !rounded-none"
                        >
                          Laptops
                        </Button>
                      </Link>
                    </li>

                    <li className="list-none w-full">
                      <Link to="/" className="w-full">
                        <Button
                          className=" text-[#0f0f0f] w-full !text-left
                                        !justify-start !rounded-none"
                        >
                          Mobiles
                        </Button>
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>

              {/*-- Bags Button Function --*/}
              <li className="list-none relative">
                <Link to="/" className="link transition link font-[600]">
                  <Button
                    className="link transition !font-[700]  text-[#0f0f0f] 
                        hover:!text-[#d84315] !text-[15px] !rounded-full"
                  >
                    Bags
                  </Button>
                </Link>

                <div
                  className="submenu absolute top-[120%] left-[0%] min-w-[150px] bg-[#ffffff]
                            shadow-md opacity-0 transition-all"
                >
                  <ul>
                    <li className="list-none w-full">
                      <Link to="/" className="w-full">
                        <Button
                          className=" text-[#0f0f0f] w-full !text-left
                                        !justify-start !rounded-none"
                        >
                          Women Bags
                        </Button>
                      </Link>
                    </li>

                    <li className="list-none w-full">
                      <Link to="/" className="w-full">
                        <Button
                          className=" text-[#0f0f0f] w-full !text-left
                                        !justify-start !rounded-none"
                        >
                          Men Bags
                        </Button>
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>

              {/*-- Footwear Button Function --*/}
              <li className="list-none relative">
                <Link to="/" className="link transition link font-[600]">
                  <Button
                    className="link transition !font-[700]  text-[#0f0f0f] 
                        hover:!text-[#d84315] !text-[15px] !rounded-full"
                  >
                    Footwear
                  </Button>
                </Link>

                <div
                  className="submenu absolute top-[120%] left-[0%] min-w-[150px] bg-[#ffffff]
                            shadow-md opacity-0 transition-all"
                >
                  <ul>
                    <li className="list-none w-full">
                      <Link to="/" className="w-full">
                        <Button
                          className=" text-[#0f0f0f] w-full !text-left
                                        !justify-start !rounded-none"
                        >
                          Women Footwears
                        </Button>
                      </Link>
                    </li>

                    <li className="list-none w-full">
                      <Link to="/" className="w-full">
                        <Button
                          className=" text-[#0f0f0f] w-full !text-left
                                        !justify-start !rounded-none"
                        >
                          Men Footwears
                        </Button>
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>

              {/*-- Groceries Button Function --*/}
              <li className="list-none">
                <Link to="/" className="link transition link font-[600]">
                  <Button
                    className="link transition !font-[700]  text-[#0f0f0f] 
                        hover:!text-[#d84315] !text-[15px] !rounded-full"
                  >
                    Groceries
                  </Button>
                </Link>
              </li>

              {/*-- Beauty Button Function --*/}
              <li className="list-none">
                <Link to="/" className="link transition link font-[600]">
                  <Button
                    className="link transition !font-[700]  text-[#0f0f0f] 
                        hover:!text-[#d84315] !text-[15px] !rounded-full"
                  >
                    Beauty
                  </Button>
                </Link>
              </li>

              {/*-- Wellness Button Function --*/}
              <li className="list-none">
                <Link to="/" className="link transition link font-[600]">
                  <Button
                    className="link transition !font-[700]  text-[#0f0f0f] 
                        hover:!text-[#d84315] !text-[15px] !rounded-full"
                  >
                    Wellness
                  </Button>
                </Link>
              </li>

              {/*-- Jewellery Button Function --*/}
              <li className="list-none">
                <Link to="/" className="link transition  link font-[600]">
                  <Button
                    className="link transition !font-[700]  text-[#0f0f0f] 
                        hover:!text-[#d84315] !text-[15px] !rounded-full"
                  >
                    Jewellery
                  </Button>
                </Link>
              </li>
            </ul>
          </div>

          {/*-- Text --*/}
          <div className="col_3 w-[23%]">
            <p className="text-[15px] font-[600] flex items-center gap-3 mb-0 mt-0">
              <MdRocketLaunch className="text-[#bf360c] text-[27px]" />
              Free International Delivery
            </p>
          </div>
        </div>
      </nav>
      {/*-- Category Panel --*/}
      <CategoryPanel
        isOpenCatPanel={isOpenCatPanel}
        setIsOpenCatPanel={setIsOpenCatPanel}
      />
    </>
  );
};

export default Navigation;
