// srcs/auth/auth.service.js
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { getUserBySocialId, signUp, updateRefreshToken } from './auth.model.js';
import { generateTokens } from '../utils/jwt.utils.js';

const { JWT_REFRESH_SECRET } = process.env;

const authenticateWithProvider = async (token, url, provider) => {
    try {
        const { data } = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` }
        });

        let providerId, name;
        if (provider === 'kakao') {
            providerId = data.id;
            name = data.properties.nickname;
        } else if (provider === 'naver') {
            providerId = data.response.id;
            name = data.response.name;
        }

        if (!providerId || !name) throw new Error("KEY_ERROR");

        let user = await getUserBySocialId(providerId, provider);
        const userId = user ? user.user_id : await signUp(name, providerId, provider);
        const { accessToken, refreshToken } = generateTokens(userId, providerId);

        await updateRefreshToken(userId, refreshToken);
        return { accessToken, refreshToken };
    } catch (error) {
        console.error(`${provider} login error:`, error);
        throw new Error(`${provider} login failed`);
    }
};

const kakaoLogin = (token) => authenticateWithProvider(token, "https://kapi.kakao.com/v2/user/me", "kakao");
const naverLogin = (token) => authenticateWithProvider(token, "https://openapi.naver.com/v1/nid/me", "naver");

const refreshTokens = async (refreshToken) => {
    try {
        const { id: userId, socialId } = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
        const { accessToken, refreshToken: newRefreshToken } = generateTokens(userId, socialId);

        await updateRefreshToken(userId, newRefreshToken);
        return { accessToken, newRefreshToken };
    } catch (error) {
        console.error("Error in refreshTokens:", error);
        throw new Error("Invalid or expired refresh token");
    }
};

export { kakaoLogin, naverLogin, refreshTokens };
