import React, { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { Link, useParams } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useEffect } from "react";
import { postData } from "../../utils/api";
import { MyContext } from "../../App";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";

import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../../firebase";

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

/*-- Register Page Function --*/
const Register = () => {
  //Goto Page Top(Optional)
  const { id } = useParams();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formFields, setFormFieIds] = useState({
    name: "",
    email: "",
    password: "",
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

  // Validations (Messages)
  const valideVa1ue = Object.values(formFields).every((el) => el);

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);

    if (formFields.name === "") {
      context.openAlertBox("error", "Please enter Full Name");
      return false;
    }

    if (formFields.email === "") {
      context.openAlertBox("error", "Please enter Email ID");
      return false;
    }

    if (formFields.password === "") {
      context.openAlertBox("error", "Please enter Password");
      return false;
    }

    postData("/api/user/register", formFields).then((res) => {
      if (res?.error !== true) {
        setIsLoading(false);
        context.openAlertBox("success", res?.message);
        localStorage.setItem("userEmail", formFields.email);
        setFormFieIds({
          name: "",
          email: "",
          password: "",
        });

        localStorage.setItem("actionType", "register");
        history("/verify");
      } else {
        context.openAlertBox("error", res?.message);
        setIsLoading(false);
      }
    });
  };

  const authWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;

        const user = result.user;

        if (!user) {
          context.openAlertBox("error", "Google user data not found!");
          setIsLoading(false);
          return;
        }

        const fields = {
          name:
            user?.displayName ||
            user?.providerData?.[0]?.displayName ||
            "Google User",
          email: user?.email || user?.providerData?.[0]?.email,
          password: null,
          avatar: user?.photoURL || user?.providerData?.[0]?.photoURL || "",
          mobile:
            user?.phoneNumber || user?.providerData?.[0]?.phoneNumber || "",
          role: "USER",
        };

        if (!fields.email) {
          context.openAlertBox("error", "Email information not available!");
          setIsLoading(false);
          return;
        }

        postData("/api/user/authWithGoogle", fields).then((res) => {
          if (res?.error !== true) {
            setIsLoading(false);
            context.openAlertBox("success", res?.message);
            localStorage.setItem("userEmail", fields.email);
            localStorage.setItem("accesstoken", res?.data?.accesstoken);
            localStorage.setItem("refreshToken", res?.data?.refreshToken);

            context.setIsLogin(true);

            history("/");
          } else {
            context.openAlertBox("error", res?.message);
            setIsLoading(false);
          }
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        const email = error.customData.email;

        const credential = GoogleAuthProvider.credentialFromError(error);
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
            <img src="/registration.gif" width={100} />
          </div>
          <h3 className="text-center text-[18px] text-[#000]">
            Register with a new account
          </h3>

          <form className="w-full mt-5" onSubmit={handleSubmit}>
            <div className="form-group w-full mb-5">
              <TextField
                type="text"
                id="name"
                name="name"
                value={formFields.name}
                disabled={isLoading === true ? true : false}
                label="Full Name"
                variant="outlined"
                className="w-full"
                color="warning"
                onChange={onChangeInput}
              />
            </div>

            <div className="form-group w-full mb-5">
              <TextField
                type="email"
                id="email"
                name="email"
                label="Email Id"
                value={formFields.email}
                disabled={isLoading === true ? true : false}
                variant="outlined"
                className="w-full"
                color="warning"
                onChange={onChangeInput}
              />
            </div>

            <div className="form-group w-full mb-5 relative">
              <TextField
                type={isPasswordShow === false ? "password" : "text"}
                id="password"
                name="password"
                label="Password"
                value={formFields.password}
                disabled={isLoading === true ? true : false}
                variant="outlined"
                className="w-full"
                color="warning"
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

            <div className="flex items-center w-full mt-3 mb-3">
              <Button
                type="submit"
                disabled={!valideVa1ue}
                className="btn-org btn-lg w-full flex gap-3"
              >
                {isLoading === true ? (
                  <CircularProgress color="inherit" />
                ) : (
                  "Register"
                )}
              </Button>
            </div>

            <p className="text-center font-[500]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="link text-[14px] font-[700] text-[#ff5252]"
              >
                Login
              </Link>
            </p>

            <p className="text-center font-[500]">
              Or continue with social account
            </p>

            <Button
              className="flex gap-3 w-full !bg-[#f1f1f1] btn-lg !text-[#000] !font-[550]"
              onClick={authWithGoogle}
            >
              <FcGoogle className="text-[22px]" />
              Sign Up with Google
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;
