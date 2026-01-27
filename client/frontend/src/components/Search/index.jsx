import React, { useState } from "react";
import "./style.css";
import Button from "@mui/material/Button";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

// Search Bar Component
const Search = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const onChangeInput = (e) => {
    setQuery(e.target.value);
  };

  const searchProducts = () => {
    if (query.trim().length > 0) {
      navigate(`/productListing?q=${query}`);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      searchProducts();
    }
  };

  return (
    <div className="searchBox w-[100%] h-[50px] bg-[#e5e5e5] rounded-[15px] relative p-2">
      <input
        type="text"
        placeholder="Search for products,brands and more...."
        className="w-full h-[35px]
        focus:outline-none bg-[#e5e5e5] p-2 text-[15px] font-[350]"
        onChange={onChangeInput}
        onKeyDown={handleKeyDown}
        value={query}
      />
      <Button
        className="!absolute top-[5px] right-[5px] z-50 !w-[40px] !min-w-[40px] 
        h-[40px] !rounded-full !text-black"
        onClick={searchProducts}
      >
        <IoSearch className="text-[#bf360c] text-[25px]" />
      </Button>
    </div>
  );
};

export default Search;
