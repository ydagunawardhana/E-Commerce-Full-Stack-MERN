import React, { useContext, useEffect, useState } from "react";
import AccountSlidebar from "../../components/AccountSlidebar";
import { MyContext } from "../../App";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { Button } from "@mui/material";
import { deleteData, fetchDataFromApi, postData } from "../../utils/api";
import { HiDotsVertical } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import { LuMapPinPlus } from "react-icons/lu";
import Radio from "@mui/material/Radio";

const Address = () => {
  const context = useContext(MyContext);

  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("home");
  const [isOpenModel, setIsOpenModel] = useState(false);
  const [address, setAddress] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const open = Boolean(anchorEl);

  const [formFields, setFormFields] = useState({
    address_line: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    mobile: "",
    status: false,
  });

  useEffect(() => {
    if (context?.userData?._id !== "" && context?.userData?._id !== undefined) {
      fetchDataFromApi(
        `/api/address/get?userId=${context?.userData?._id}`
      ).then((res) => {
        setAddress(res.data);

        if (res.data.length > 0 && !selectedId) {
          setSelectedId(res.data[0]._id);
        }
      });
    }
  }, [context?.userData]);

  //  MENU FUNCTIONS
  const handleClickMenu = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

  // DELETE FUNCTION
  const handleDeleteAddress = () => {
    handleCloseMenu();

    deleteData(`/api/address/delete/${selectedId}`).then((res) => {
      if (res?.error !== true) {
        context.openAlertBox("success", "Address Deleted Successfully!");

        const newAddressList = address.filter(
          (item) => item._id !== selectedId
        );
        setAddress(newAddressList);
      } else {
        context.openAlertBox("error", res?.message || "Failed to delete");
      }
    });
  };

  const handleClose = () => {
    setIsOpenModel(false);
  };

  const handleChangeStatus = (event) => {
    setStatus(event.target.value);
    setFormFields((prevState) => ({
      ...prevState,
      status: event.target.value,
    }));
  };

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields(() => {
      return {
        ...formFields,
        [name]: value,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);

    if (formFields.address_line === "") {
      context.openAlertBox("error", "Please enter Address line");
      setIsLoading(false);
      return false;
    }

    if (formFields.city === "") {
      context.openAlertBox("error", "Please enter City Name");
      setIsLoading(false);
      return false;
    }

    if (formFields.state === "") {
      context.openAlertBox("error", "Please enter your State");
      setIsLoading(false);
      return false;
    }

    if (formFields.pincode === "") {
      context.openAlertBox("error", "Please enter Pin Code");
      setIsLoading(false);
      return false;
    }

    if (formFields.country === "") {
      context.openAlertBox("error", "Please enter your Country");
      setIsLoading(false);
      return false;
    }

    if (formFields.mobile === "" || formFields.mobile.length < 5) {
      context.openAlertBox("error", "Please enter valid Mobile Number");
      setIsLoading(false);
      return false;
    }

    console.log(formFields);

    postData(`/api/address/add`, formFields, { withCredentials: true }).then(
      (res) => {
        console.log(res);
        if (res?.error !== true) {
          setIsLoading(false);
          context.openAlertBox("success", res?.message);

          setIsOpenModel(false);

          // Form clear
          setFormFields({
            address_line: "",
            city: "",
            state: "",
            pincode: "",
            country: "",
            mobile: "",
            status: false,
          });
          setPhone("");

          fetchDataFromApi(
            `/api/address/get?userId=${context?.userData?._id}`
          ).then((res) => {
            setAddress(res.data);
          });
        } else {
          context.openAlertBox("error", res?.message);
          setIsLoading(false);
        }
      }
    );
  };

  return (
    <>
      <section className="py-10 w-full bg-[#f1f1f1] relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Top Right Circle */}
          <div
            className="absolute -top-[100px] -right-[100px] w-[500px] h-[500px] 
          bg-[#ffccbcb4] rounded-full opacity-50"
          ></div>
          {/* Bottom Left Circle */}
          <div
            className="absolute -bottom-[100px] -left-[100px] w-[450px] h-[450px] 
          bg-[#ffccbcad] rounded-full opacity-50"
          ></div>
        </div>

        <div className="container mx-auto w-[80%] flex gap-5 relative z-10">
          {/* --- LEFT SIDEBAR (PROFILE NAVIGATION) --- */}
          <div className="col1 w-[20%]">
            <AccountSlidebar />
          </div>

          {/* --- RIGHT SIDE (CONTENT AREA) --- */}
          <div className=" col2 w-[65%]">
            <div className="card bg-[#fff] shadow-md rounded-md p-5 mb-5">
              <div className="flex items-center  pb-3">
                <h2 className=" text-[22px] font-[700] pb-0 uppercase ">
                  Address
                </h2>
              </div>
              <hr />

              <div className="w-full ">
                {/* Add Address Button */}
                <div
                  className="flex items-center justify-center p-5 rounded-md border border-dashed
                 border-[rgba(0,0,0,0.2)] bg-[#f1faff] hover:bg-[#e7f3f9] cursor-pointer mt-2
                 "
                  onClick={() => setIsOpenModel(true)}
                >
                  <span className="text-[15px] font-[600] text-[#363636] flex items-center gap-3 ">
                    <LuMapPinPlus className="!text-[22px] !font-[700] text-[#000]" />
                    Add Address
                  </span>
                </div>

                {/* Address Details Save */}
                <div className="flex flex-col gap-4 mt-5">
                  {address?.length > 0 &&
                    address.map((item, index) => {
                      const isSelected = selectedId === item._id;

                      return (
                        <div
                          key={index}
                          className={`w-full p-4 border rounded-md flex items-center justify-between
                           hover:shadow-md transition-all cursor-pointer
                          ${
                            isSelected
                              ? "bg-[#ebebeb7a] border-[#a0a0a0]"
                              : "bg-white border-[rgba(0,0,0,0.1)]"
                          }`}
                          onClick={() => setSelectedId(item._id)}
                        >
                          <div className="flex items-start gap-3 w-full">
                            {/* --- RADIO BUTTON --- */}
                            <div className="-mt-2">
                              <Radio
                                checked={isSelected}
                                onChange={() => setSelectedId(item._id)}
                                value={item._id}
                                name="address-radio"
                                inputProps={{ "aria-label": item._id }}
                                size="small"
                                color="warning"
                              />
                            </div>

                            {/* --- INFO SECTION --- */}
                            <div className="info w-full">
                              <span className="bg-[#f1f1f1] text-[11px] px-3 py-1 rounded-md font-[600] uppercase tracking-wide text-gray-600">
                                Home / Work
                              </span>

                              <div className="flex items-center gap-4 mt-3">
                                <h6 className="text-[16px] font-[700] text-gray-800">
                                  {context.userData?.name || "User"}
                                </h6>
                                <span className="text-[14px] font-[600] text-gray-700">
                                  {item.mobile}
                                </span>
                              </div>

                              <p className="text-[14px] font-[500] text-[#555] mt-1 leading-6">
                                {item.address_line}, {item.city}, {item.state} -{" "}
                                {item.pincode}
                              </p>
                              <p className="text-[15px] font-[600] text-[#555]">
                                {item.country}
                              </p>
                            </div>
                          </div>

                          {/* --- ACTION MENU --- */}
                          <div className="action pl-4 border-l border-gray-200 ml-4">
                            <Button
                              className="!min-w-[35px] !w-[35px] !h-[35px] !rounded-full !text-[#000] hover:!bg-[#f1f1f1]"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleClickMenu(e, item._id);
                              }}
                            >
                              <HiDotsVertical className="text-[20px] opacity-70" />
                            </Button>

                            <Menu
                              anchorEl={anchorEl}
                              open={open}
                              onClose={handleCloseMenu}
                              onClick={handleCloseMenu}
                              transformOrigin={{
                                horizontal: "right",
                                vertical: "top",
                              }}
                              anchorOrigin={{
                                horizontal: "right",
                                vertical: "bottom",
                              }}
                            >
                              <MenuItem
                                onClick={handleDeleteAddress}
                                className="!text-[#ff5252]"
                              >
                                <MdDelete className="mr-2 text-[18px]" /> Delete
                              </MenuItem>
                            </Menu>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add Address Dialog Box */}
      <Dialog open={isOpenModel}>
        <DialogTitle className="text-[22px] !font-[700] pb-0 uppercase ">
          Add Address
        </DialogTitle>

        <form className="p-8 py-3 pb-4" onSubmit={handleSubmit}>
          <div className="flex items-center gap-5 pb-5">
            <div className=" col w-[100%]">
              <TextField
                className="w-full"
                label="Address line"
                variant="outlined"
                size="small"
                color="warning"
                name="address_line"
                onChange={onChangeInput}
                value={formFields.address_line}
              />
            </div>
          </div>

          <div className="flex items-center gap-5 pb-5">
            <div className=" col w-[50%]">
              <TextField
                className="w-full"
                label="City"
                variant="outlined"
                size="small"
                color="warning"
                name="city"
                onChange={onChangeInput}
                value={formFields.city}
              />
            </div>

            <div className=" col w-[50%]">
              <TextField
                className="w-full"
                label="State"
                variant="outlined"
                size="small"
                color="warning"
                name="state"
                onChange={onChangeInput}
                value={formFields.state}
              />
            </div>
          </div>

          <div className="flex items-center gap-5 pb-5">
            <div className=" col w-[50%]">
              <TextField
                className="w-full"
                label="Pincode"
                variant="outlined"
                size="small"
                color="warning"
                name="pincode"
                onChange={onChangeInput}
                value={formFields.pincode}
              />
            </div>

            <div className=" col w-[50%]">
              <TextField
                className="w-full"
                label="Country"
                variant="outlined"
                size="small"
                color="warning"
                name="country"
                onChange={onChangeInput}
                value={formFields.country}
              />
            </div>
          </div>

          <div className="flex items-center gap-5 pb-5">
            <div className=" col w-[50%]">
              <PhoneInput
                defaultCountry="lk"
                value={phone}
                className="rounded-md"
                onChange={(phone) => {
                  setPhone(phone);
                  setFormFields((prevState) => ({
                    ...prevState,
                    mobile: phone,
                  }));
                }}
              />
            </div>

            <div className=" col w-[50%]">
              <Select
                color="warning"
                value={status}
                onChange={handleChangeStatus}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                size="small"
                className="w-full"
              >
                <MenuItem value={"home"}>Home</MenuItem>
                <MenuItem value={"work"}>Work</MenuItem>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <Button
              type="submit"
              className="btn-org btn-lg w-full !h-[45px] !font-bold flex gap-3 !mb-3"
            >
              Save
            </Button>

            <Button
              className="btn-org btn-border btn-lg w-full !h-[45px] !font-bold 
            flex gap-3 !mb-3"
              onClick={handleClose}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
};

export default Address;
