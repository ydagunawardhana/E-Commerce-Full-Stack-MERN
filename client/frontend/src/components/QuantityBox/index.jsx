import { Button } from "@mui/material";
import React, { useState } from "react";

import { FaAngleUp } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa";

// Quantity Box Functtions
const QuantityBox = ({ quantity, selectedVal }) => {
  const [inputVal, setInputVal] = useState(1);

  const plus = () => {
    const newVal = inputVal + 1;
    setInputVal(newVal);
    selectedVal(newVal);
  };

  const minus = () => {
    if (inputVal > 1) {
      const newVal = inputVal - 1;
      setInputVal(newVal);
      selectedVal(newVal);
    }
  };

  return (
    <div className="quantityBox flex items-center relative">
      <input
        type="number"
        className="w-full h-[40px] p-2 pl-5 text-[15px] focus:outline-none
      border border-[#0003] rounded-md"
        value={inputVal}
      />

      <div
        className="flex items-center flex-col justify-between h-[40px] absolute top-0
      right-0 z-50"
      >
        <Button
          className="!min-w-[30px] !w-[30px] !h-[20px] !text-[#000] !rounded-none
          hover:!bg-[#f1f1f1]"
          onClick={plus}
        >
          <FaAngleUp className="text-[13px] opacity-55" />
        </Button>

        <Button
          className="!min-w-[30px] !w-[30px] !h-[20px] !text-[#000] !rounded-none
          hover:!bg-[#f1f1f1]"
          onClick={minus}
        >
          <FaAngleDown className="text-[13px] opacity-55" />
        </Button>
      </div>
    </div>
  );
};

export default QuantityBox;
