import React from "react";
import { Button } from "@mui/material";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { Link } from "react-router-dom";

// Drawer Panel Product Page
const CategoryCollapse = ({ closePanel }) => {
  const [submenuIndex, setSubmenuIndex] = React.useState(null);
  const [innersubmenuIndex, setinnerSubmenuIndex] = React.useState(null);

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

  // All Pages Category Panel
  return (
    <>
      <div className="scroll">
        <ul className="w-full">
          {/*-- Category Panel - Fashion --*/}
          <li className="list-none flex items-center relative flex-col">
            <Link
              to="/productListing/Fashion"
              className="w-full"
              onClick={closePanel}
            >
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
                  <Link
                    to="/productListing?subCategory=Men"
                    className="w-full"
                    onClick={closePanel}
                  >
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
                          to="/productListing/T-Shirts"
                          className="link !p-2 w-full !item-left !justify-start !px-4 !rounded-full !font-[600]
                        transition text-[14px]"
                          onClick={closePanel}
                        >
                          T-Shirts
                        </Link>
                      </li>

                      <li className="list-none relative mb-1">
                        <Link
                          to="/productListing/jeans"
                          className="link !p-2 w-full !item-left !justify-start !px-4 !rounded-full !font-[600]
                        transition text-[14px]"
                          onClick={closePanel}
                        >
                          Jeans
                        </Link>
                      </li>

                      <li className="list-none relative mb-1">
                        <Link
                          to="/productListing/shoes"
                          className="link !p-2 w-full !item-left !justify-start !px-4 !rounded-full !font-[600]
                        transition text-[14px]"
                          onClick={closePanel}
                        >
                          Shoes
                        </Link>
                      </li>

                      <li className="list-none relative mb-1">
                        <Link
                          to="/productListing/watches"
                          className="link !p-2 w-full !item-left !justify-start !px-4 !rounded-full !font-[600]
                        transition text-[14px]"
                          onClick={closePanel}
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
                  <Link
                    to="/productListing?subCategory=Women"
                    className="w-full"
                    onClick={closePanel}
                  >
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
                  <Link
                    to="/productListing?subCategory=Kids"
                    className="w-full"
                    onClick={closePanel}
                  >
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
                  <Link
                    to="/productListing?subCategory=Girls"
                    className="w-full"
                    onClick={closePanel}
                  >
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
                  <Link
                    to="/productListing?subCategory=Boys"
                    className="w-full"
                    onClick={closePanel}
                  >
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
            <Link
              to="/productListing/Electronics"
              className="w-full"
              onClick={closePanel}
            >
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
                  <Link
                    to="/productListing?subCategory=Smart Watches"
                    className="w-full"
                    onClick={closePanel}
                  >
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
                          to="/productListing?thirdLevelCategory=Smart Watch"
                          className="link !p-2 w-full !item-left !justify-start !px-4 !rounded-full !font-[600]
                        transition text-[14px]"
                          onClick={closePanel}
                        >
                          Smart Watch
                        </Link>
                      </li>

                      <li className="list-none relative mb-1">
                        <Link
                          to="/productListing?thirdLevelCategory=Leather Watch"
                          className="link !p-2 w-full !item-left !justify-start !px-4 !rounded-full !font-[600]
                        transition text-[14px]"
                          onClick={closePanel}
                        >
                          Leather Watch
                        </Link>
                      </li>

                      <li className="list-none relative mb-1">
                        <Link
                          to="/productListing?thirdLevelCategory=Rolling Diamond"
                          className="link !p-2 w-full !item-left !justify-start !px-4 !rounded-full !font-[600]
                        transition text-[14px]"
                          onClick={closePanel}
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
                  <Link
                    to="/productListing?subCategory=Laptops"
                    className="w-full"
                    onClick={closePanel}
                  >
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
                  <Link
                    to="/productListing?subCategory=Mobiles"
                    className="w-full"
                    onClick={closePanel}
                  >
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
            <Link
              to="/productListing/Bags"
              className="w-full"
              onClick={closePanel}
            >
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
                  <Link
                    to="/productListing?subCategory=Women Bag"
                    className="w-full"
                    onClick={closePanel}
                  >
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
                  <Link
                    to="/productListing?subCategory=Men Bag"
                    className="w-full"
                    onClick={closePanel}
                  >
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
            <Link
              to="/productListing/Footwear"
              className="w-full"
              onClick={closePanel}
            >
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
                  <Link
                    to="/productListing?subCategory=Women Footwear"
                    className="w-full"
                    onClick={closePanel}
                  >
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
                  <Link
                    to="/productListing?subCategory=Men Footwear"
                    className="w-full"
                    onClick={closePanel}
                  >
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
            <Link
              to="/productListing/Groceries"
              className="w-full"
              onClick={closePanel}
            >
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
            <Link
              to="/productListing/Beauty"
              className="w-full"
              onClick={closePanel}
            >
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
            <Link
              to="/productListing/Wellness"
              className="w-full"
              onClick={closePanel}
            >
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
            <Link
              to="/productListing/Jewellery"
              className="w-full"
              onClick={closePanel}
            >
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
    </>
  );
};

export default CategoryCollapse;
