// srcs/auth/auth.route.js
import express from "express";
import {
  handleKakaoLogin,
  handleNaverLogin,
  handleTokenRefresh,
} from "./auth.controller.js";
import { loginUser, signupUser } from "../user/user.controller.js";

const authRouter = express.Router();

authRouter.post("/kakao", handleKakaoLogin);
authRouter.post("/naver", handleNaverLogin);
authRouter.post("/refresh", handleTokenRefresh);

authRouter.post("/login/signUp", signupUser);
authRouter.post("/login/general", loginUser);

export default authRouter;
