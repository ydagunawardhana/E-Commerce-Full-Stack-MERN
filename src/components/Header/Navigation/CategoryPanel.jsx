import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { Button } from "@mui/material";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { Link } from "react-router-dom";

// Drawer Panel
const CategoryPanel = (props) => {
  const [submenuIndex, setSubmenuIndex] = React.useState(null);
  const [innersubmenuIndex, setinnerSubmenuIndex] = React.useState(null);

  const toggleDrawer = (newOpen) => () => {
    props.setIsOpenCatPanel(newOpen);
  };

  const openSubmenu = (index) => {
    if (submenuIndex === index) {
      setSubmenuIndex(null);
    } else {
      setSubmenuIndex(index);
    }
  };

  const openinnerSubmenu = (index) => {
    if (innersubmenuIndex === index) {
      setinnerSubmenuIndex(null);
    } else {
      setinnerSubmenuIndex(index);
    }
  };

  //Drawer List
  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" className="categoryPanel">
      <h3
        className="p-3 font-[600] text-[18px] flex items-center justify-between 
      top-strip py-3.5 border-t-[px] border-[#ff8a65] border-b-[4px]"
      >
        Shop By Categories
        <IoMdCloseCircleOutline
          onClick={toggleDrawer(false)}
          className="cursor-pointer text-[23px]  hover:text-[#d84315]"
        />
      </h3>

      {/*-- Category Panel Function --*/}
      <div className="scroll">
        <ul className="w-full">
          {/*-- Category Panel - Fashion --*/}
          <li className="list-none flex items-center relative flex-col">
            <Link to="/" className="w-full">
              <Button className="!p-3 w-full !item-left !justify-start !px-4 !rounded-full !text-[#0f0f0f] hover:!text-[#d84315] !font-[600]">
                FASHION
              </Button>
            </Link>

            {submenuIndex === 0 ? (
              <FaMinus
                className="absolute top-[15px] right-[15px] cursor-pointer hover:text-[#d84315]"
                onClick={() => openSubmenu(0)}
              />
            ) : (
              <FaPlus
                className="absolute top-[15px] right-[15px] cursor-pointer hover:text-[#d84315]"
                onClick={() => openSubmenu(0)}
              />
            )}

            {submenuIndex === 0 && (
              <ul className="submenu w-full pl-3 pr-3">
                <li className="list-none relative">
                  <Link to="/" className="w-full">
                    <Button className="!p-1 w-full !item-left !justify-start !px-4 !rounded-full !text-[#0f0f0f] !font-[550]">
                      Men
                    </Button>
                  </Link>

                  {innersubmenuIndex === 0 ? (
                    <FaMinus
                      className="absolute top-[8px] right-[15px] cursor-pointer hover:text-[#d84315]"
                      onClick={() => openinnerSubmenu(0)}
                    />
                  ) : (
                    <FaPlus
                      className="absolute top-[8px] right-[15px] cursor-pointer hover:text-[#d84315]"
                      onClick={() => openinnerSubmenu(0)}
                    />
                  )}

                  {innersubmenuIndex === 0 && (
                    <ul className="inner_submenu w-full pl-3 pr-3">
                      <li className="list-none relative mb-1">
                        <Link
                          to="/"
                          className="link !p-2 w-full !item-left !justify-start !px-4 !rounded-full !font-[600]
                        transition text-[14px]"
                        >
                          T-Shirts
                        </Link>
                      </li>

                      <li className="list-none relative mb-1">
                        <Link
                          to="/"
                          className="link !p-2 w-full !item-left !justify-start !px-4 !rounded-full !font-[600]
                        transition text-[14px]"
                        >
                          Jeans
                        </Link>
                      </li>

                      <li className="list-none relative mb-1">
                        <Link
                          to="/"
                          className="link !p-2 w-full !item-left !justify-start !px-4 !rounded-full !font-[600]
                        transition text-[14px]"
                        >
                          Shoes
                        </Link>
                      </li>

                      <li className="list-none relative mb-1">
                        <Link
                          to="/"
                          className="link !p-2 w-full !item-left !justify-start !px-4 !rounded-full !font-[600]
                        transition text-[14px]"
                        >
                          Watches
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
              </ul>
            )}

            {submenuIndex === 0 && (
              <ul className="submenu w-full pl-3 pr-3">
                <li className="list-none relative">
                  <Link to="/" className="w-full">
                    <Button className="!p-1 w-full !item-left !justify-start !px-4 !rounded-full !text-[#0f0f0f] !font-[550]">
                      Women
                    </Button>
                  </Link>
                </li>
              </ul>
            )}

            {submenuIndex === 0 && (
              <ul className="submenu w-full pl-3 pr-3">
                <li className="list-none relative">
                  <Link to="/" className="w-full">
                    <Button className="!p-1 w-full !item-left !justify-start !px-4 !rounded-full !text-[#0f0f0f] !font-[550]">
                      Kids
                    </Button>
                  </Link>
                </li>
              </ul>
            )}

            {submenuIndex === 0 && (
              <ul className="submenu w-full pl-3 pr-3">
                <li className="list-none relative">
                  <Link to="/" className="w-full">
                    <Button className="!p-1 w-full !item-left !justify-start !px-4 !rounded-full !text-[#0f0f0f] !font-[550]">
                      Girls
                    </Button>
                  </Link>
                </li>
              </ul>
            )}

            {submenuIndex === 0 && (
              <ul className="submenu w-full pl-3 pr-3">
                <li className="list-none relative">
                  <Link to="/" className="w-full">
                    <Button className="!p-1 w-full !item-left !justify-start !px-4 !rounded-full !text-[#0f0f0f] !font-[550]">
                      Boys
                    </Button>
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/*-- Category Panel - Electronics --*/}
          <li className="list-none flex items-center relative flex-col">
            <Link to="/" className="w-full">
              <Button className="!p-3 w-full !item-left !justify-start !px-4 !rounded-full !text-[#0f0f0f] hover:!text-[#d84315] !font-[600]">
                ELECTRONICS
              </Button>
            </Link>

            {submenuIndex === 1 ? (
              <FaMinus
                className="absolute top-[15px] right-[15px] cursor-pointer hover:text-[#d84315]"
                onClick={() => openSubmenu(1)}
              />
            ) : (
              <FaPlus
                className="absolute top-[15px] right-[15px] cursor-pointer hover:text-[#d84315]"
                onClick={() => openSubmenu(1)}
              />
            )}

            {submenuIndex === 1 && (
              <ul className="submenu w-full pl-3 pr-3">
                <li className="list-none relative">
                  <Link to="/" className="w-full">
                    <Button className="!p-1 w-full !item-left !justify-start !px-4 !rounded-full !text-[#0f0f0f] !font-[550]">
                      Smart Watches
                    </Button>
                  </Link>

                  {innersubmenuIndex === 1 ? (
                    <FaMinus
                      className="absolute top-[8px] right-[15px] cursor-pointer hover:text-[#d84315]"
                      onClick={() => openinnerSubmenu(1)}
                    />
                  ) : (
                    <FaPlus
                      className="absolute top-[8px] right-[15px] cursor-pointer hover:text-[#d84315]"
                      onClick={() => openinnerSubmenu(1)}
                    />
                  )}

                  {innersubmenuIndex === 1 && (
                    <ul className="inner_submenu w-full pl-3 pr-3">
                      <li className="list-none relative mb-1">
                        <Link
                          to="/"
                          className="link !p-2 w-full !item-left !justify-start !px-4 !rounded-full !font-[600]
                        transition text-[14px]"
                        >
                          Apple Watch
                        </Link>
                      </li>

                      <li className="list-none relative mb-1">
                        <Link
                          to="/"
                          className="link !p-2 w-full !item-left !justify-start !px-4 !rounded-full !font-[600]
                        transition text-[14px]"
                        >
                          Leather Watch
                        </Link>
                      </li>

                      <li className="list-none relative mb-1">
                        <Link
                          to="/"
                          className="link !p-2 w-full !item-left !justify-start !px-4 !rounded-full !font-[600]
                        transition text-[14px]"
                        >
                          Rolling Diamond
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
              </ul>
            )}

            {submenuIndex === 1 && (
              <ul className="submenu w-full pl-3 pr-3">
                <li className="list-none relative">
                  <Link to="/" className="w-full">
                    <Button className="!p-1 w-full !item-left !justify-start !px-4 !rounded-full !text-[#0f0f0f] !font-[550]">
                      Laptops
                    </Button>
                  </Link>
                </li>
              </ul>
            )}

            {submenuIndex === 1 && (
              <ul className="submenu w-full pl-3 pr-3">
                <li className="list-none relative">
                  <Link to="/" className="w-full">
                    <Button className="!p-1 w-full !item-left !justify-start !px-4 !rounded-full !text-[#0f0f0f] !font-[550]">
                      Mobiles
                    </Button>
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/*-- Category Panel - Bags --*/}
          <li className="list-none flex items-center relative flex-col">
            <Link to="/" className="w-full">
              <Button className="!p-3 w-full !item-left !justify-start !px-4 !rounded-full !text-[#0f0f0f] hover:!text-[#d84315] !font-[600]">
                BAGS
              </Button>
            </Link>

            {submenuIndex === 2 ? (
              <FaMinus
                className="absolute top-[15px] right-[15px] cursor-pointer hover:text-[#d84315]"
                onClick={() => openSubmenu(2)}
              />
            ) : (
              <FaPlus
                className="absolute top-[15px] right-[15px] cursor-pointer hover:text-[#d84315]"
                onClick={() => openSubmenu(2)}
              />
            )}

            {submenuIndex === 2 && (
              <ul className="submenu w-full pl-3 pr-3">
                <li className="list-none relative">
                  <Link to="/" className="w-full">
                    <Button className="!p-1 w-full !item-left !justify-start !px-4 !rounded-full !text-[#0f0f0f] !font-[550]">
                      Women Bags
                    </Button>
                  </Link>
                </li>
              </ul>
            )}

            {submenuIndex === 2 && (
              <ul className="submenu w-full pl-3 pr-3">
                <li className="list-none relative">
                  <Link to="/" className="w-full">
                    <Button className="!p-1 w-full !item-left !justify-start !px-4 !rounded-full !text-[#0f0f0f] !font-[550]">
                      Men Bags
                    </Button>
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/*-- Category Panel - Footwear --*/}
          <li className="list-none flex items-center relative flex-col">
            <Link to="/" className="w-full">
              <Button className="!p-3 w-full !item-left !justify-start !px-4 !rounded-full !text-[#0f0f0f] hover:!text-[#d84315] !font-[600]">
                FOOTWEAR
              </Button>
            </Link>

            {submenuIndex === 3 ? (
              <FaMinus
                className="absolute top-[15px] right-[15px] cursor-pointer hover:text-[#d84315]"
                onClick={() => openSubmenu(3)}
              />
            ) : (
              <FaPlus
                className="absolute top-[15px] right-[15px] cursor-pointer hover:text-[#d84315]"
                onClick={() => openSubmenu(3)}
              />
            )}

            {submenuIndex === 3 && (
              <ul className="submenu w-full pl-3 pr-3">
                <li className="list-none relative">
                  <Link to="/" className="w-full">
                    <Button className="!p-1 w-full !item-left !justify-start !px-4 !rounded-full !text-[#0f0f0f] !font-[550]">
                      Women Footwear
                    </Button>
                  </Link>
                </li>
              </ul>
            )}

            {submenuIndex === 3 && (
              <ul className="submenu w-full pl-3 pr-3">
                <li className="list-none relative">
                  <Link to="/" className="w-full">
                    <Button className="!p-1 w-full !item-left !justify-start !px-4 !rounded-full !text-[#0f0f0f] !font-[550]">
                      Men Footwear
                    </Button>
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/*-- Category Panel - Groceries --*/}
          <li className="list-none flex items-center relative flex-col">
            <Link to="/" className="w-full">
              <Button className="!p-3 w-full !item-left !justify-start !px-4 !rounded-full !text-[#0f0f0f] hover:!text-[#d84315] !font-[600]">
                GROCERIES
              </Button>
            </Link>

            {submenuIndex === 4 ? (
              <FaMinus
                className="absolute top-[15px] right-[15px] cursor-pointer hover:text-[#d84315]"
                onClick={() => openSubmenu(4)}
              />
            ) : (
              <FaPlus
                className="absolute top-[15px] right-[15px] cursor-pointer hover:text-[#d84315]"
                onClick={() => openSubmenu(4)}
              />
            )}
          </li>

          {/*-- Category Panel - Beauty --*/}
          <li className="list-none flex items-center relative flex-col">
            <Link to="/" className="w-full">
              <Button className="!p-3 w-full !item-left !justify-start !px-4 !rounded-full !text-[#0f0f0f] hover:!text-[#d84315] !font-[600]">
                BEAUTY
              </Button>
            </Link>

            {submenuIndex === 5 ? (
              <FaMinus
                className="absolute top-[15px] right-[15px] cursor-pointer hover:text-[#d84315]"
                onClick={() => openSubmenu(5)}
              />
            ) : (
              <FaPlus
                className="absolute top-[15px] right-[15px] cursor-pointer hover:text-[#d84315]"
                onClick={() => openSubmenu(5)}
              />
            )}
          </li>

          {/*-- Category Panel - Wellness --*/}
          <li className="list-none flex items-center relative flex-col">
            <Link to="/" className="w-full">
              <Button className="!p-3 w-full !item-left !justify-start !px-4 !rounded-full !text-[#0f0f0f] hover:!text-[#d84315] !font-[600]">
                WELLNESS
              </Button>
            </Link>

            {submenuIndex === 6 ? (
              <FaMinus
                className="absolute top-[15px] right-[15px] cursor-pointer hover:text-[#d84315]"
                onClick={() => openSubmenu(6)}
              />
            ) : (
              <FaPlus
                className="absolute top-[15px] right-[15px] cursor-pointer hover:text-[#d84315]"
                onClick={() => openSubmenu(6)}
              />
            )}
          </li>

          {/*-- Category Panel - Jewellery --*/}
          <li className="list-none flex items-center relative flex-col">
            <Link to="/" className="w-full">
              <Button className="!p-3 w-full !item-left !justify-start !px-4 !rounded-full !text-[#0f0f0f] hover:!text-[#d84315] !font-[600]">
                JEWELLERY
              </Button>
            </Link>

            {submenuIndex === 7 ? (
              <FaMinus
                className="absolute top-[15px] right-[15px] cursor-pointer hover:text-[#d84315]"
                onClick={() => openSubmenu(7)}
              />
            ) : (
              <FaPlus
                className="absolute top-[15px] right-[15px] cursor-pointer hover:text-[#d84315]"
                onClick={() => openSubmenu(7)}
              />
            )}
          </li>
        </ul>
      </div>
    </Box>
  );

  // Drawer Open Close
  return (
    <>
      <Drawer open={props.isOpenCatPanel} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </>
  );
};

export default CategoryPanel;
