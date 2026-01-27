import { Router } from "express";
import {
  authWithGoogle,
  forgotPasswordController,
  loginUsercontroller,
  logoutController,
  refreshToken,
  registerUserController,
  removeImageFromCloudinary,
  resetPassword,
  updateUserDetails,
  userAvatarController,
  userDetails,
  verifyEmailController,
  verifyforgotPasswordOtp,
} from "../controllers/user.controller.js";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

const userRouter = Router();
userRouter.post("/register", registerUserController);
userRouter.post("/verifyEmail", verifyEmailController);
userRouter.post("/login", loginUsercontroller);
userRouter.post("/authWithGoogle", authWithGoogle);
userRouter.get("/logout", auth, logoutController);
userRouter.put(
  "/user-avatar",
  auth,
  upload.array("avatar"),
  userAvatarController
);
userRouter.delete("/deteleImage", auth, removeImageFromCloudinary);
userRouter.put("/:id", auth, updateUserDetails);
userRouter.post("/forgot-password", forgotPasswordController);
userRouter.post("/verify-forgot-password-otp", verifyforgotPasswordOtp);
userRouter.post("/reset-password", resetPassword);
userRouter.post("/refresh-token", refreshToken);
userRouter.get("/user-details", auth, userDetails);

export default userRouter;
