import Button from "@mui/material/Button";
import React, { useEffect, useState } from "react";
import { RiMenuFold2Fill } from "react-icons/ri";
import { FaAngleDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MdRocketLaunch } from "react-icons/md";
import CategoryPanel from "./CategoryPanel";
import "../Navigation/style.css";
import { fetchDataFromApi } from "../../../utils/api";

// Header Navigation Function
const Navigation = () => {
  // Drawer Panel Open
  const [isOpenCatPanel, setIsOpenCatPanel] = React.useState(false);
  const [catData, setCatData] = useState([]);

  const openCategoryPanel = () => {
    setIsOpenCatPanel(true);
  };

  useEffect(() => {
    fetchDataFromApi("/api/category").then((res) => {
      if (res && res.data && Array.isArray(res.data)) {
        setCatData(res.data);
      } else if (Array.isArray(res)) {
        setCatData(res);
      } else {
        console.log("No categories found or wrong format");
      }
    });
  }, []);

  return (
    <>
      {" "}
      {/*-- Shop by Categories Button --*/}
      <nav>
        <div className="container flex items-center justify-end gap-10 py-2">
          <div className="col_1 w-[23%]">
            <Button
              className="!text-[#0f0f0f] !font-[550] hover:!text-[#d84315] !rounded-full gap-2 w-full"
              onClick={openCategoryPanel}
            >
              <RiMenuFold2Fill className="text-[20px] text-[#0f0f0f]" />
              Shop By Categories
              <FaAngleDown className="text-[18px] text-[#0f0f0f] ml-auto font-bold hover:!text-[#d84315]" />
            </Button>
          </div>

          {/*-- Home Button Function --*/}
          <div className="col_2 w-[85%]">
            <ul className="flex items-center gap-5 nav">
              <li className="list-none">
                <Link to="/" className="link transition link font-[600]">
                  <Button
                    className="link transition !font-[550] text-[#0f0f0f] 
                        hover:!text-[#d84315] !text-[14px] !rounded-full !py-1"
                  >
                    HOME
                  </Button>
                </Link>
              </li>

              {/*  Categories Loop */}
              {catData?.length > 0 &&
                catData.map((cat, index) => (
                  <li className="list-none relative group z-100" key={index}>
                    <Link
                      to={`/productListing?category=${cat.name}`}
                      className="link transition 
                  link font-[600]"
                    >
                      <Button
                        className="link transition !font-[550] text-[#0f0f0f] 
                    hover:!text-[#d84315] !text-[14px] !rounded-full !py-1 !uppercase"
                      >
                        {cat.name}
                      </Button>
                    </Link>

                    {/* Sub Categories */}
                    {cat.subCategories?.length > 0 && (
                      <div
                        className="submenu absolute top-[100%] left-0 min-w-[200px] 
                      bg-[#ffffff] shadow-lg opacity-0 invisible group-hover:opacity-100 
                      group-hover:visible transition-all z-100 p-3 rounded-md border
                       border-gray-100"
                      >
                        <ul className="block">
                          {cat.subCategories.map((subCat, subIndex) => (
                            <li
                              className="list-none w-full mb-1"
                              key={subIndex}
                            >
                              <Link
                                to={`/productListing?category=${cat.name}&subCategory=${subCat.name}`}
                                className="w-full block"
                              >
                                <Button
                                  className="!text-[#0f0f0f] w-full !text-left 
                                !justify-start !rounded-md !capitalize !font-[500] 
                                !text-[14px] hover:!bg-[#f1f1f1] hover:!text-[#d84315]"
                                >
                                  {subCat.name}
                                </Button>
                              </Link>

                              {/* Third Level Categories  */}
                              {subCat.thirdLevelCategories?.length > 0 && (
                                <div
                                  className="submenu absolute top-[0%] left-[100%] min-w-[150px] 
                                bg-[#ffffff] shadow-md opacity-0 transition-all"
                                >
                                  <ul>
                                    {subCat.thirdLevelCategories.map(
                                      (thirdLvl, tIndex) => (
                                        <li
                                          className="list-none w-full"
                                          key={tIndex}
                                        >
                                          <Link
                                            to={`/productListing?category=${cat.name}&subCategory=${subCat.name}&thirdLevelCategory=${thirdLvl}`}
                                            className="w-full"
                                          >
                                            <Button
                                              className="!text-[#0f0f0f] w-full !text-left 
                                            !justify-start !rounded-none !capitalize 
                                            !font-[600]"
                                            >
                                              {thirdLvl}
                                            </Button>
                                          </Link>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
            </ul>
          </div>

          {/*-- Text --*/}
          <div className="col_3 w-[23%]">
            <p className="text-[15px] font-[550] flex items-center gap-3 mb-0 mt-0">
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
