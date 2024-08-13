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

const generateTokens = (userId, socialId) => ({
    accessToken: jwt.sign({ id: userId, social_id : socialId }, JWT_SECRET, { expiresIn: "1h" }),
    refreshToken: jwt.sign({ id: userId, social_id : socialId }, JWT_REFRESH_SECRET, { expiresIn: "30d" })
});

export { extractTokenFromHeader, generateTokens };
