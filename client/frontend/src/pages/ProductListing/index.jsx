import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import ProductItem from "../../components/ProductItem";
import ProductItemListView from "../../components/ProductItemListView";
import { Button, Typography } from "@mui/material";
import { IoGrid } from "react-icons/io5";
import { TiThMenu } from "react-icons/ti";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import Tooltip from "@mui/material/Tooltip";
import { useLocation, useParams } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api";

// ProductItem Page Functions
const ProductListing = () => {
  //Goto Page Top(Optional)
  const { id } = useParams();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const [itemView, setItemView] = useState("grid");
  const [products, setProducts] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [sortBy, setSortBy] = useState("name_asc");

  // Filter States
  const [filterCatIds, setFilterCatIds] = useState([]);
  const [priceRange, setPriceRange] = useState([10, 30000]);
  const [rating, setRating] = useState([]);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("q");
  const subCategory = searchParams.get("subCategory");
  const thirdLevelCategory = searchParams.get("thirdLevelCategory");
  const categoryFromUrl = searchParams.get("category");

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Filter Data
  const filterData = (type, value) => {
    if (type === "CATEGORY") {
      setFilterCatIds(value);
    }
    if (type === "PRICE") {
      setPriceRange(value);
    }
    if (type === "RATING") {
      setRating(value);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    let url = `/api/products?minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}&sort=${sortBy}`;

    if (searchQuery) url += `&q=${searchQuery}`;
    if (subCategory) url += `&subCategory=${subCategory}`;
    if (thirdLevelCategory) url += `&thirdLevelCategory=${thirdLevelCategory}`;
    if (rating.length > 0) url += `&rating=${rating.join(",")}`;

    // Category Filter Logic
    if (filterCatIds.length > 0) {
      url += `&category=${filterCatIds.join(",")}`;
    } else if (categoryFromUrl) {
      url += `&category=${categoryFromUrl}`;
    } else if (id && !searchQuery && !subCategory) {
      url += `&category=${id}`;
    }

    fetchDataFromApi(url).then((res) => {
      if (Array.isArray(res)) {
        setProducts(res);
      } else if (res && Array.isArray(res.data)) {
        setProducts(res.data);
      } else {
        setProducts([]);
      }
    });
  }, [
    id,
    priceRange,
    sortBy,
    filterCatIds,
    rating,
    searchQuery,
    subCategory,
    thirdLevelCategory,
    categoryFromUrl,
    location.search,
  ]);

  return (
    <section className="py-4 pb-0">
      <div className="container">
        {/*-- ProductListing Page TOP Function --*/}
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            underline="hover"
            color="inherit"
            href="/"
            className="link transition"
            fontWeight="600"
          >
            Home
          </Link>
          <Link
            underline="hover"
            color="inherit"
            href="/productListing"
            className="link transition"
            fontWeight="600"
          >
            Products
          </Link>

          {id && (
            <Typography color="inherit" fontWeight="600" className="capitalize">
              {id}
            </Typography>
          )}
        </Breadcrumbs>
      </div>

      {/*-- SildeBar Function --*/}
      <div className="bg-[#fff] p-2 mt-4">
        <div className="container flex gap-3 items-start">
          <div
            className="sidebarwrapper w-[20%] h-full bg-[#fff] sticky top-[170px] 
          z-10 self-start"
          >
            <Sidebar filterData={filterData} />
          </div>

          {/*-- ProductSlider Bar Function --*/}
          <div className="rightContent w-[80%] py-3 px-5">
            <div
              className="bg-[#f1f1f1] p-2 w-full mb-4 rounded-full flex items-center 
            justify-between"
            >
              {/*-- Slider Bar (2  Icon Buttons) Function --*/}
              <div className="col1 flex items-center itemViewActions">
                <Tooltip title="List View" placement="top-end">
                  <Button
                    className={`!w-[30px] !h-[30px] !main-w-[30px] !rounded-full !text-[#000] ${
                      itemView === "list" && "active"
                    }`}
                    onClick={() => setItemView("list")}
                  >
                    <TiThMenu className="text-[rgba(0,0,0,0.7)]" />
                  </Button>
                </Tooltip>

                <Tooltip title="Grid View" placement="top-end">
                  <Button
                    className={`!w-[30px] !h-[30px] !main-w-[30px] !rounded-full !text-[#000] ${
                      itemView === "grid" && "active"
                    }`}
                    onClick={() => setItemView("grid")}
                  >
                    <IoGrid className="text-[rgba(0,0,0,0.7)]" />
                  </Button>
                </Tooltip>

                <span className="text-[14px] font-[500] pl-3">
                  There are {products?.length} products.
                </span>
              </div>

              {/*-- Slider Bar (Sort by Buttons) Function --*/}
              <div className="col2 ml-auto flex items-center justify-end gap-3 pr-3">
                <span className="text-[14px] font-[500] pl-3">Sort By</span>

                <Button
                  id="basic-button"
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                  className="!bg-[#fff] !text-[13px] !text-[#000] !rounded-full !font-[550]
                  !capitalize !border-2 !border-[#000]"
                >
                  {sortBy === "name_asc" && "Name, A to Z"}
                  {sortBy === "name_desc" && "Name, Z to A"}
                  {sortBy === "price_asc" && "Price, Low to High"}
                  {sortBy === "price_desc" && "Price, High to Low"}
                </Button>

                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  slotProps={{
                    list: {
                      "aria-labelledby": "basic-button",
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      setSortBy("name_asc");
                      handleClose();
                    }}
                    className="!text-[13px] !text-[#000] !capitalize"
                  >
                    Name, A to Z
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setSortBy("name_desc");
                      handleClose();
                    }}
                    className="!text-[13px] !text-[#000] !capitalize"
                  >
                    Name, Z to A
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setSortBy("price_asc");
                      handleClose();
                    }}
                    className="!text-[13px] !text-[#000] !capitalize"
                  >
                    Price, Low to High
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setSortBy("price_desc");
                      handleClose();
                    }}
                    className="!text-[13px] !text-[#000] !capitalize"
                  >
                    Price, High to Low
                  </MenuItem>
                </Menu>
              </div>
            </div>

            {/*-- Product Items Display (List/Grid Views) --*/}
            <div
              className={`grid ${
                itemView === "grid" ? "grid-cols-4" : "grid-cols-1"
              } gap-4`}
            >
              {products?.length > 0 ? (
                products.map((item, index) => (
                  <div key={index}>
                    {" "}
                    {/* Wrapper Div */}
                    {itemView === "grid" ? (
                      <ProductItem item={item} />
                    ) : (
                      <ProductItemListView item={item} />
                    )}
                  </div>
                ))
              ) : (
                <div className="w-full text-center p-5">
                  No products found in this category.
                </div>
              )}
            </div>

            {/*-- Pagination View --*/}
            <div className="flex items-center justify-center mt-10">
              <Pagination count={10} showFirstButton showLastButton />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductListing;
