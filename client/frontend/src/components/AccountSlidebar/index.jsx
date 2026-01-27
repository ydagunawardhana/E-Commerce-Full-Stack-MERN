import { Button } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { LuMapPinCheck } from "react-icons/lu";
import { FaCloudUploadAlt, FaRegHeart } from "react-icons/fa";
import { IoBagCheckOutline, IoLogOutOutline } from "react-icons/io5";
import { NavLink, useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import CircularProgress from "@mui/material/CircularProgress";
import { fetchDataFromApi, uploadImage } from "../../utils/api";

const AccountSlidebar = () => {
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);

  const context = useContext(MyContext);
  const history = useNavigate();

  useEffect(() => {
    const userAvatar = [];
    if (
      context?.userData?.avatar !== "" &&
      context?.userData?.avatar !== undefined
    )
      userAvatar.push(context?.userData?.avatar);
    setPreviews(userAvatar);
  }, [context?.userData]);

  let selectedImages = [];

  const formdata = new FormData();

  const onChangeFile = async (e, apiEndPoint) => {
    try {
      setPreviews([]);

      const files = e.target.files;
      setUploading(true);
      console.log(files);

      // upload image
      for (var i = 0; i < files.length; i++) {
        if (
          files[i] &&
          (files[i].type === "image/jpeg" ||
            files[i].type === "image/jpg" ||
            files[i].type === "image/png" ||
            files[i].type === "image/webp")
        ) {
          const file = files[i];
          selectedImages.push(file);
          formdata.append("avatar", file);
        } else {
          context.openAlertBox(
            "error",
            "Please select a valid image file (jpeg, jpg, png or webp)"
          );
          setUploading(false);
          return false;
        }
      }

      uploadImage("/api/user/user-avatar", formdata).then((res) => {
        setUploading(false);
        let avatar = [];
        avatar.push(res?.data?.avatar);
        setPreviews(avatar);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    fetchDataFromApi(
      `/api/user/logout?token=${localStorage.getItem("accesstoken")}`,
      { withCredentials: true }
    ).then((res) => {
      console.log(res);
      if (res?.error === false) {
        context.openAlertBox("success", "Logout Successfully!");

        context.setIsLogin(false);
        localStorage.removeItem("accesstoken");
        localStorage.removeItem("refreshToken");
        history("/");
      }
    });
  };

  return (
    <div className="card bg-[#fff] shadow-md rounded-md sticky top-[210px] z-50">
      <div className="w-full p-5 flex items-center justify-center flex-col">
        <div
          className="w-[130px] h-[130px] rounded-full overflow-hidden relative group 
              cursor-pointer border border-gray-200 flex items-center justify-center
              bg-[#0000002f]"
        >
          {uploading === true ? (
            <CircularProgress color="inherit" />
          ) : (
            <>
              {previews?.length !== 0 ? (
                previews?.map((img, index) => {
                  return (
                    <img
                      src={img}
                      key={index}
                      className="w-full h-full object-cover"
                    />
                  );
                })
              ) : (
                <img
                  src={"/profile_image_default.png"}
                  className="w-full h-full"
                />
              )}
            </>
          )}

          {/* Upload Overlay */}
          <div
            className="overlay absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.6)]
                flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <FaCloudUploadAlt className="text-white text-[25px]" />
            <input
              type="file"
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              accept="image/*"
              onChange={(e) => onChangeFile(e, "/api/user/user-avatar")}
              name="avatar"
            />
          </div>
        </div>

        <h3 className="text-[16px] font-bold mt-3">
          {context?.userData?.name}
        </h3>
        <h6 className="text-[14px] font-[600] text-gray-500">
          {context?.userData?.email}
        </h6>
      </div>

      {/* Navigation Menu */}
      <ul className="list-none w-full pb-5 bg-[#f1f1f1] myAccountTabs">
        {/* My Profile (Active) */}
        <li className="w-full">
          <NavLink to="/my-account" exact={true} activeClassName="isActive">
            <Button
              className="w-full text-left !px-5 !py-2 flex items-center gap-3 
                !text-[#000000e5] !font-[600] !border-l-4 !capitalize !justify-start"
            >
              <CgProfile className="text-[22px]" /> My Profile
            </Button>
          </NavLink>
        </li>

        {/* Address */}
        <li className="w-full">
          <NavLink to="/address" exact={true} activeClassName="isActive">
            <Button
              className="w-full text-left !px-5 !py-2 flex items-center gap-3 
                !text-[#000000e5] !font-[600] !border-l-4 !capitalize !justify-start"
            >
              <LuMapPinCheck className="text-[22px]" /> Address
            </Button>
          </NavLink>
        </li>

        {/* My Orders */}
        <li className="w-full">
          <NavLink to="/my-orders" exact={true} activeClassName="isActive">
            <Button
              className="w-full text-left !px-5 !py-2 flex items-center gap-3 
                !text-[#000000d3] !font-[600] !border-l-4 !capitalize !justify-start"
            >
              <IoBagCheckOutline className="text-[23px]" /> My Orders
            </Button>
          </NavLink>
        </li>

        {/* My Wishlist */}
        <li className="w-full">
          <NavLink to="/my-list" exact={true} activeClassName="isActive">
            <Button
              className="w-full text-left !px-5 !py-2 flex items-center gap-3 
                !text-[#000000d5] !font-[600] !border-l-4 !capitalize !justify-start"
            >
              <FaRegHeart className="text-[21px]" /> My List
            </Button>
          </NavLink>
        </li>

        {/* Logout */}
        <li className="w-full">
          <Button
            className="w-full text-left !px-5 !py-2 flex items-center gap-3 
                !text-[#000000d5] !font-[600] !border-l-4 !capitalize !justify-start"
            onClick={logout}
          >
            <IoLogOutOutline className="text-[24px]" /> Logout
          </Button>
        </li>
      </ul>
    </div>
  );
};

export default AccountSlidebar;
