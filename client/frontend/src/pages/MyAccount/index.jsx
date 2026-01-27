import { Button, TextField } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AccountSlidebar from "../../components/AccountSlidebar";
import { MyContext } from "../../App";
import { editData, postData } from "../../utils/api";
import CircularProgress from "@mui/material/CircularProgress";
import { Collapse } from "react-collapse";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

// My Account Page Function
const MyAccount = () => {
  //Goto Page Top(Optional)
  const { id } = useParams();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [userld, setUserld] = useState("");
  const [isChangePasswordFormShow, setIsChangePasswordFormShow] =
    useState(false);
  const [phone, setPhone] = useState("");

  const [formFields, setFormFieIds] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const [changePassword, setChangePassword] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const context = useContext(MyContext);
  const history = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accesstoken");

    if (token === null) {
      history("/");
    }
  }, [context?.isLogin]);

  useEffect(() => {
    if (context?.userData?._id !== "" && context?.userData?._id !== undefined) {
      setUserld(context?.userData?._id);
      setFormFieIds({
        name: context?.userData?.name || "",
        email: context?.userData?.email || "",
        mobile: context?.userData?.mobile || "",
      });
      const ph = `"${context?.userData?.mobile}"`;
      setPhone(ph);

      setChangePassword({
        email: context?.userData?.email || "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [context?.userData]);

  const onChangeInput = (e) => {
    const { name, value } = e.target;

    // Profile Form fields
    if (name === "name" || name === "email" || name === "mobile") {
      setFormFieIds((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }

    // Password Form fields
    if (
      name === "oldPassword" ||
      name === "newPassword" ||
      name === "confirmPassword"
    ) {
      setChangePassword((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // Validations (Messages)
  const valideVa1ue = Object.values(formFields).every((el) => el);

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);

    if (formFields.name === "") {
      context.openAlertBox("error", "Please enter Full Name");
      setIsLoading(false);
      return false;
    }

    if (formFields.email === "") {
      context.openAlertBox("error", "Please enter Email ID");
      setIsLoading(false);
      return false;
    }

    if (formFields.mobile === "") {
      context.openAlertBox("error", "Please enter Phone Numbder");
      setIsLoading(false);
      return false;
    }

    editData(`/api/user/${userld}`, formFields, { withCredentials: true }).then(
      (res) => {
        console.log(res);

        if (res?.error !== true) {
          setIsLoading(false);
          context.openAlertBox("success", res?.message);
          const updatedUser = {
            ...context.userData,
            name: formFields.name,
            email: formFields.email,
            mobile: formFields.mobile,
          };

          context.setUserData(updatedUser);
        } else {
          context.openAlertBox("error", res?.message);
          setIsLoading(false);
        }
      }
    );
  };

  // Validations (Messages) Change Password
  const valideVa1ue2 = Object.values(changePassword).every((el) => el);

  const handleSubmitChangePassword = (e) => {
    e.preventDefault();

    setIsLoading2(true);

    if (context?.userData?.signUpWithGoogle === false) {
      if (changePassword.oldPassword === "") {
        context.openAlertBox("error", "Please enter Old Password");
        setIsLoading2(false);
        return false;
      }
    }

    if (changePassword.newPassword === "") {
      context.openAlertBox("error", "Please enter New Password");
      setIsLoading2(false);
      return false;
    }

    if (changePassword.confirmPassword === "") {
      context.openAlertBox("error", "Please enter Confirm Password");
      setIsLoading2(false);
      return false;
    }

    if (changePassword.confirmPassword !== changePassword.newPassword) {
      context.openAlertBox(
        "error",
        "New Password & Confirm Password Not Match!"
      );
      setIsLoading2(false);
      return false;
    }

    postData(`/api/user/reset-password`, changePassword, {
      withCredentials: true,
    }).then((res) => {
      console.log(res);
      if (res?.error !== true) {
        setIsLoading2(false);
        context.openAlertBox("success", res?.message);

        setChangePassword({
          email: context?.userData?.email || "",
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        context.openAlertBox("error", res?.message);
        setIsLoading2(false);
      }
    });
  };

  return (
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
              <h2 className=" text-[22px] font-[700] pb-0 uppercase">
                My Profile
              </h2>
              <Button
                className="!ml-auto !text-[14px] !text-[#000] !font-[600] 
                hover:!text-[#ff5252] hover:!bg-[#e0e0e077] !rounded-md"
                onClick={() =>
                  setIsChangePasswordFormShow(!isChangePasswordFormShow)
                }
              >
                Change Password
              </Button>
            </div>
            <hr />

            <form className="mt-8" onSubmit={handleSubmit}>
              <div className="flex items-center gap-5 mb-5">
                {/* Full Name */}
                <div className="w-[50%]">
                  <TextField
                    label="Full Name"
                    variant="outlined"
                    name="name"
                    value={formFields.name}
                    disabled={isLoading === true ? true : false}
                    className="w-full"
                    size="small"
                    color="warning"
                    onChange={onChangeInput}
                  />
                </div>

                {/* Email */}
                <div className="w-[50%]">
                  <TextField
                    type="email"
                    label="Email"
                    name="email"
                    value={formFields.email}
                    disabled={true}
                    variant="outlined"
                    className="w-full"
                    size="small"
                    color="warning"
                    onChange={onChangeInput}
                  />
                </div>
              </div>

              <div className="flex items-center gap-5 mb-5">
                {/* Phone Number */}
                <div className="w-[50%] ">
                  <PhoneInput
                    defaultCountry="lk"
                    value={phone}
                    className="rounded-md"
                    disabled={isLoading == true ? true : false}
                    onChange={(phone) => {
                      setPhone(phone);
                      setFormFieIds((prevState) => ({
                        ...prevState,
                        mobile: phone,
                      }));
                    }}
                  />
                </div>
                <div className="w-[50%]"></div>
              </div>

              <br />

              <div className="flex gap-4 ">
                <Button
                  type="submit"
                  disabled={!valideVa1ue}
                  className="btn-lg btn-org !font-bold w-[150px] capitalize"
                >
                  {isLoading === true ? (
                    <CircularProgress color="inherit" />
                  ) : (
                    "Update Profile"
                  )}
                </Button>
              </div>
            </form>
          </div>

          <Collapse isOpened={isChangePasswordFormShow}>
            <div className="card bg-[#fff] shadow-md rounded-md p-5">
              <div className="flex items-center  pb-3">
                <h2 className=" text-[20px] font-[700] pb-0 uppercase">
                  Change Password
                </h2>
              </div>
              <hr />

              <form className="mt-8" onSubmit={handleSubmitChangePassword}>
                <div className="grid grid-cols-2 gap-5 mb-5">
                  {context?.userData?.signUpWithGoogle === false && (
                    <div className="col">
                      <TextField
                        label="Old Password"
                        variant="outlined"
                        name="oldPassword"
                        value={changePassword.oldPassword}
                        disabled={isLoading2 === true ? true : false}
                        className="w-full"
                        size="small"
                        color="warning"
                        onChange={onChangeInput}
                      />
                    </div>
                  )}

                  {/* New Password */}
                  <div className="col">
                    <TextField
                      type="text"
                      label="New Password"
                      name="newPassword"
                      value={changePassword.newPassword}
                      disabled={isLoading2 === true ? true : false}
                      variant="outlined"
                      className="w-full"
                      size="small"
                      color="warning"
                      onChange={onChangeInput}
                    />
                  </div>

                  {/* Confirm Passowrd */}
                  <div className="col">
                    <TextField
                      label="Confirm Password"
                      name="confirmPassword"
                      value={changePassword.confirmPassword}
                      disabled={isLoading2 === true ? true : false}
                      variant="outlined"
                      className="w-full"
                      size="small"
                      color="warning"
                      onChange={onChangeInput}
                    />
                  </div>
                </div>

                <br />

                <div className="flex gap-4 ">
                  <Button
                    type="submit"
                    className="btn-lg btn-org !font-bold w-[170px] capitalize"
                  >
                    {isLoading2 === true ? (
                      <CircularProgress color="inherit" />
                    ) : (
                      "Change Password"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </Collapse>
        </div>
      </div>
    </section>
  );
};

export default MyAccount;
