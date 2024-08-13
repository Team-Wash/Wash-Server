// srcs/auth/auth.route.js
import express from "express";
import { handleKakaoLogin, handleNaverLogin, handleTokenRefresh } from "./auth.controller.js";

const authRouter = express.Router();

authRouter.post('/kakao', handleKakaoLogin);
authRouter.post('/naver', handleNaverLogin);
authRouter.post('/refresh', handleTokenRefresh);

export default authRouter;
