// srcs/auth/auth.service.js
import axios from 'axios';
import qs from 'qs';
import jwt from 'jsonwebtoken';
import { getUserBySocialId, signUp, updateRefreshToken } from './auth.model.js';
import { generateTokens } from '../utils/jwt.utils.js';

const { JWT_REFRESH_SECRET } = process.env;

const authenticateWithProvider = async (token, url, provider) => {
    try {
        const response = await axios.post(url, qs.stringify({ access_token: token }), {
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('API Response:', response.data);

        const data = response.data;
        let providerId, name, email;
        if (provider === 'kakao') {
            providerId = data.id;
            name = data.properties.nickname;
            email = data.kakao_account.email;
        } else if (provider === 'naver') {
            providerId = data.response.id;
            name = data.response.name;
            email = data.response.email;
        }

        if (!providerId || !name || !email) throw new Error("KEY_ERROR");

        let user = await getUserBySocialId(providerId, provider);
        const userId = user ? user.user_id : await signUp(name, providerId, provider, email);
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
