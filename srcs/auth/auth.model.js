// srcs/auth/auth.model.js
import { pool } from "../../config/db.js";

const getUserBySocialId = async (socialId, provider) => {
    const [rows] = await pool.query(
        `SELECT user_id, nickname, status, name, email, social_provider, social_id, refresh_token
         FROM USER
         WHERE social_id = ? AND social_provider = ?`, 
        [socialId, provider]
    );
    return rows[0];
};

const signUp = async (name, socialId, provider) => {
    const [result] = await pool.query(
        `INSERT INTO USER (
            nickname, status, name, email, social_provider, social_id, refresh_token, created_at, updated_at
        ) VALUES (?, 'active', ?, 'test@google.com', ?, ?, NULL, NOW(), NOW())`,
        ["모오", name, provider, socialId]
    );
    return result.insertId;
};

const updateRefreshToken = async (userId, refreshToken) => {
    const [result] = await pool.query(
        `UPDATE USER SET refresh_token = ? WHERE user_id = ?`,
        [refreshToken, userId]
    );
    if (result.affectedRows === 0) {
        throw new Error("User not found or refresh token update failed");
    }
};

export { getUserBySocialId, signUp, updateRefreshToken };
