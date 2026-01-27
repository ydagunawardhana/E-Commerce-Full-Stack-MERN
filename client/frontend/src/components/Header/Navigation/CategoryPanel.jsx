import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import CategoryCollapse from "../../CategoryCollapse";

// Drawer Panel
const CategoryPanel = (props) => {
  const toggleDrawer = (newOpen) => () => {
    props.setIsOpenCatPanel(newOpen);
  };

  //Drawer List
  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" className="categoryPanel">
      <div className="col1 flex items-center w-full h-[60px] px-9">
        <Link to={"/"}>
          <img src="/logo.png" />
        </Link>
      </div>

      <h3
        className="p-3 font-[600] text-[18px] flex items-center justify-between 
      top-strip py-3.5 border-t-[2px] border-[#ff8a65] border-b-[2px]"
      >
        Shop By Categories
        <IoMdCloseCircleOutline
          onClick={toggleDrawer(false)}
          className="cursor-pointer text-[23px]  hover:text-[#d84315] "
        />
      </h3>

      {/*-- Category Panel Function --*/}
      <CategoryCollapse closePanel={() => props.setIsOpenCatPanel(false)} />
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
