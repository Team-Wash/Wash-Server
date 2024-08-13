import express from "express";
import {
  getInfo,
  patchNickname,
  deleteUser,
  userLogout,
  signupUser,
  loginUser,
  patchProfile,
} from "./user.controller.js";
import authenticateToken from "../../config/jwt.middleware.js";

export const userRouter = express.Router();

userRouter.use(authenticateToken);

userRouter.get("/info", getInfo);
userRouter.patch("/info/nickname", patchNickname);
userRouter.patch("/delete", deleteUser);
userRouter.patch("/logout", userLogout);
userRouter.patch("/info/profileImage", patchProfile);

userRouter.post("/login/signUp", signupUser);
userRouter.post("/login/general", loginUser);
