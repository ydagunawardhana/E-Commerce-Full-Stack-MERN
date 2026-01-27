import React, { useEffect, useState } from "react";
import OtpBox from "../../components/OtpBox";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { postData } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import { useContext } from "react";

/*-- Verify Page Function --*/
const Verify = () => {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      setEmail(userEmail);
    }
  }, []);

  const handleOtpChange = (value) => {
    setOtp(value);
  };

  // Forword to Forgot password page
  const history = useNavigate();
  const context = useContext(MyContext);

  const verifyOTP = (e) => {
    e.preventDefault();

    const actionType = localStorage.getItem("actionType");

    if (actionType !== "forgot-password") {
      postData("/api/user/verifyEmail", {
        email: localStorage.getItem("userEmail"),
        otp: otp,
      }).then((res) => {
        if (res?.error === false) {
          context.openAlertBox("success", res?.message);
          localStorage.removeItem("userEmail"),
            localStorage.removeItem("actionType");
          history("/login");
        } else {
          context.openAlertBox("error", res?.message);
        }
      });
    } else {
      postData("/api/user/verify-forgot-password-otp", {
        email: localStorage.getItem("userEmail"),
        otp: otp,
      }).then((res) => {
        if (res?.error === false) {
          context.openAlertBox("success", res?.message);

          localStorage.removeItem("actionType");
          history("/forgot-password");
        } else {
          context.openAlertBox("error", res?.message);
        }
      });
    }
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
          <div className="text-center flex items-center justify-center">
            <img src="/Verify.gif" width={100} />
          </div>
          <h3 className="text-center text-[18px] text-[#000] mt-4 mb-5">
            Verify OTP
          </h3>

          <p className="text-center mb-3">
            OTP send to{" "}
            <span className="text-[#ff5252] font-bold">
              {email ? email : "your email"}
            </span>
          </p>

          <form onSubmit={verifyOTP}>
            <OtpBox length={6} onChange={handleOtpChange} />

            <div className="flex items-center justify-center mt-5 px-1">
              <Button type="submit" className="w-full btn-org btn-lg">
                Verify OTP
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Verify;
