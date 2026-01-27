import React, { useState } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import "../Sidebar/style.css";
import { Collapse } from "react-collapse";
import { FaAngleDown } from "react-icons/fa6";
import { FaAngleUp } from "react-icons/fa6";
import { Button } from "@mui/material";

import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

import Rating from "@mui/material/Rating";
import { fetchDataFromApi } from "../../utils/api";
import { useEffect } from "react";

//Side Bar (Category) Filter
const Sidebar = (props) => {
  const [isOpenCategoryFilter, setIsOpenCategoryFilter] = useState(true);
  const [catData, setCatData] = useState([]);
  const [filterCat, setFilterCat] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 30000]);
  const [filterRating, setFilterRating] = useState([]);

  // Categories Data Fetching Filter
  useEffect(() => {
    fetchDataFromApi("/api/category").then((res) => {
      setCatData(res.categoryList || res.data || []);
    });
  }, []);

  //  Category Checkbox
  const handleChangeCategory = (event, category) => {
    const { checked } = event.target;
    let newCatArr = [...filterCat];

    if (checked) {
      newCatArr.push(category);
    } else {
      newCatArr = newCatArr.filter((id) => id !== category);
    }

    setFilterCat(newCatArr);
    props.filterData("CATEGORY", newCatArr);
  };

  // Price Slider
  const handlePriceChange = (value) => {
    setPriceRange(value);
    props.filterData("PRICE", value);
  };

  const handleChangeRating = (event, value) => {
    const { checked } = event.target;
    let newRatingArr = [...filterRating];

    if (checked) {
      newRatingArr.push(value);
    } else {
      newRatingArr = newRatingArr.filter((r) => r !== value);
    }

    setFilterRating(newRatingArr);
    props.filterData("RATING", newRatingArr);
  };

  return (
    <aside className="sidebar py-5">
      {/*-- Category By Collapse Function --*/}
      <div className="box mt-2">
        <h3 className="w-full mb-3 text-[16px] font-[600] flex items-center pr-5">
          Shop By Category
          <Button
            className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-[#000]"
            onClick={() => setIsOpenCategoryFilter(!isOpenCategoryFilter)}
          >
            {isOpenCategoryFilter === true ? <FaAngleUp /> : <FaAngleDown />}
          </Button>
        </h3>
        <Collapse isOpened={isOpenCategoryFilter}>
          {/*-- Shop By Category Collapse Function --*/}
          <div className="scroll px-4 relative -left-[13px]">
            {catData?.length !== 0 &&
              catData?.map((cat, index) => {
                return (
                  <div key={index} className="w-full">
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          onChange={(e) => handleChangeCategory(e, cat.name)}
                        />
                      }
                      label={cat.name}
                      className="w-full"
                      sx={{
                        "& .MuiFormControlLabel-label": {
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "black",
                        },
                      }}
                    />
                  </div>
                );
              })}
          </div>
        </Collapse>
      </div>

      {/*-- Price By Filter Function --*/}
      <div className="box mt-4">
        <h3 className="w-full mb-3 text-[16px] font-[600] flex items-center pr-5">
          Filter By Price
        </h3>

        <RangeSlider
          value={priceRange}
          onInput={handlePriceChange}
          min={0}
          max={30000}
          step={500}
        />
        <div className="flex pt-4 pb-2 priceRange">
          <span className="text-[14px]">
            From: <strong className="text-dark">$: {priceRange[0]}</strong>
          </span>
          <span className="ml-auto text-[14px]">
            To: <strong className="text-dark">$ {priceRange[1]}</strong>
          </span>
        </div>
      </div>

      {/*-- Filter By Rating  Function --*/}
      <div className="box mt-4">
        <h3 className="w-full mb-3 text-[16px] font-[600]">Filter By Rating</h3>

        <div className="w-full flex flex-col px-4">
          {[5, 4, 3, 2, 1].map((rate) => (
            <div
              key={rate}
              className="flex items-center justify-between w-full"
            >
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    onChange={(e) => handleChangeRating(e, rate)}
                  />
                }
                label={
                  <div className="flex items-center">
                    <Rating
                      name="read-only"
                      value={rate}
                      size="small"
                      readOnly
                    />
                  </div>
                }
              />
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
