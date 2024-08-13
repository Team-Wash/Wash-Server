// srcs/auth/auth.controller.js
import {
    kakaoLogin,
    naverLogin,
    refreshTokens
} from "./auth.service.js";
import { response } from "../../config/response.js";
import { extractTokenFromHeader } from '../utils/jwt.utils.js';

const handleLogin = async (providerLogin, providerName, req, res) => {
    try {
        const token = extractTokenFromHeader(req);
        const { accessToken, refreshToken } = await providerLogin(token);

        res.setHeader("Authorization", `Bearer ${accessToken}`);
        return res.status(200).json(response(
            { isSuccess: true, code: 200, message: `${providerName} 로그인 성공` },
            { refreshToken }
        ));
    } catch (error) {
        console.error(`${providerName} login error:`, error);
        return res.status(400).json(response(
            { isSuccess: false, code: 400, message: `${providerName} 로그인 실패` },
            {}
        ));
    }
};

const handleKakaoLogin = (req, res) => handleLogin(kakaoLogin, "kakao", req, res);
const handleNaverLogin = (req, res) => handleLogin(naverLogin, "naver", req, res);

const handleTokenRefresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json(response(
                { isSuccess: false, code: 400, message: "리프레시 토큰이 누락되었습니다" },
                {}
            ));
        }
        const { accessToken, newRefreshToken } = await refreshTokens(refreshToken);

        res.setHeader("Authorization", `Bearer ${accessToken}`);
        return res.status(200).json(response(
            { isSuccess: true, code: 200, message: "토큰 재발급 성공" },
            { newRefreshToken }
        ));
    } catch (error) {
        console.error("Token refresh error:", error);
        return res.status(400).json(response(
            { isSuccess: false, code: 400, message: "토큰 재발급 실패" },
            {}
        ));
    }
};

export {
    handleKakaoLogin,
    handleNaverLogin,
    handleTokenRefresh
};
