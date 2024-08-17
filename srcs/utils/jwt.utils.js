// srcs/utils/jwt.utils.js
import jwt from "jsonwebtoken";

const { JWT_SECRET, JWT_REFRESH_SECRET } = process.env;

const extractTokenFromHeader = (req) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("Authorization header missing or invalid");
    }
    return authHeader.split(" ")[1];
};

const generateTokens = (userId, socialId) => {
    if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
        throw new Error('JWT_SECRET or JWT_REFRESH_SECRET is missing');
    }
    return {
        accessToken: jwt.sign({ id: userId, social_id: socialId }, JWT_SECRET, { expiresIn: "1h" }),
        refreshToken: jwt.sign({ id: userId, social_id: socialId }, JWT_REFRESH_SECRET, { expiresIn: "30d" })
    };
};


export { extractTokenFromHeader, generateTokens };
