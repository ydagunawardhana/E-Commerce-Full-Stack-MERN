import React, { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import { CircularProgress } from "@mui/material";
import { postData } from "../../utils/api";

/*-- Login Page Function --*/
const ForgotPassword = () => {
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [isPasswordShow2, setIsPasswordShow2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formFields, setFormFieIds] = useState({
    email: localStorage.getItem("userEmail"),
    newPassword: "",
    confirmPassword: "",
  });

  const context = useContext(MyContext);
  const history = useNavigate();

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFieIds(() => {
      return {
        ...formFields,
        [name]: value,
      };
    });
  };

  const valideVa1ue = Object.values(formFields).every((el) => el);

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);

    if (formFields.newPassword === "") {
      context.openAlertBox("error", "Please enter New Password");
      setIsLoading(false);
      return false;
    }

    if (formFields.confirmPassword === "") {
      context.openAlertBox("error", "Please enter Confirm Password");
      setIsLoading(false);
      return false;
    }

    if (formFields.confirmPassword !== formFields.newPassword) {
      context.openAlertBox("error", "Password and Confirm Password not match!");
      setIsLoading(false);
      return false;
    }

    postData(`/api/user/reset-password`, formFields).then((res) => {
      console.log(res);
      if (res?.error === false) {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("actionType");
        context.openAlertBox("success", res?.message);
        setIsLoading(false);
        history("/login");
      } else {
        context.openAlertBox("error", res?.message);
      }
    });
  };

  return (
    <section
      className=" section py-10 w-full flex items-center 
    justify-center bg-[#f1f1f1] relative overflow-hidden"
    >
      {/* Top Right Circle */}
      <div
        className="absolute -top-[150px] -right-[150px] w-[500px] h-[500px]
       bg-[#ffccbc67] rounded-full z-0 pointer-events-none"
      ></div>

      {/* Bottom Left Circle */}
      <div
        className="absolute -bottom-[150px] -left-[150px] w-[450px] h-[450px]
       bg-[#ffccbc67] rounded-full z-0 pointer-events-none"
      ></div>

      <div className="container">
        <div
          className="card shadow-md w-[400px] m-auto rounded-md bg-[#fff]
        p-5 px-12 relative z-10"
        >
          <div className="text-center flex items-center justify-center mb-3">
            <img src="/Forgot Password.gif" width={100} />
          </div>
          <h3 className="text-center text-[18px] text-[#000]">
            Forgot Password
          </h3>

          <form className="w-full mt-5" onSubmit={handleSubmit}>
            <div className="form-group w-full mb-5 relative">
              <TextField
                type={isPasswordShow === false ? "password" : "text"}
                id="password"
                label="New Password"
                value={formFields.newPassword}
                disabled={isLoading === true ? true : false}
                variant="outlined"
                className="w-full"
                color="warning"
                name="newPassword"
                onChange={onChangeInput}
              />
              <Button
                className="!absolute top-[10px] right-[10px] z-50 !w-[35px] !min-w-[35px]
              !rounded-full !text-[#000]"
                onClick={() => {
                  setIsPasswordShow(!isPasswordShow);
                }}
              >
                {isPasswordShow === false ? (
                  <IoMdEye className="text-[25px] opacity-75" />
                ) : (
                  <IoMdEyeOff className="text-[25px] opacity-75" />
                )}
              </Button>
            </div>

            <div className="form-group w-full mb-5 relative">
              <TextField
                type={isPasswordShow2 === false ? "password" : "text"}
                id="confirm_password"
                label="Confirm Password"
                value={formFields.confirmPassword}
                disabled={isLoading === true ? true : false}
                variant="outlined"
                className="w-full"
                color="warning"
                name="confirmPassword"
                onChange={onChangeInput}
              />
              <Button
                className="!absolute top-[10px] right-[10px] z-50 !w-[35px] !min-w-[35px]
              !rounded-full !text-[#000]"
                onClick={() => {
                  setIsPasswordShow2(!isPasswordShow2);
                }}
              >
                {isPasswordShow2 === false ? (
                  <IoMdEye className="text-[25px] opacity-75" />
                ) : (
                  <IoMdEyeOff className="text-[25px] opacity-75" />
                )}
              </Button>
            </div>

            <div className="flex items-center w-full mt-3 mb-3">
              <Button
                type="submit"
                disabled={!valideVa1ue}
                className="btn-org btn-lg w-full flex gap-3"
              >
                {isLoading === true ? (
                  <CircularProgress color="inherit" />
                ) : (
                  "Change Password"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
