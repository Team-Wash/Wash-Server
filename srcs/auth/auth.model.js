// srcs/auth/auth.model.js
import { pool } from "../../config/db.js";

const getUserBySocialId = async (socialId, provider) => {
    const [rows] = await pool.query(
        `SELECT user_id, nickname, status, name, email, social_provider, social_id, refresh_token
         FROM user
         WHERE social_id = ? AND social_provider = ?`, 
        [socialId, provider]
    );
    return rows[0];
};

export const generateRandomNickname = () => {
    const adjectives = [
        '빨간', '빛나는', '활발한', '멋진', '재미있는', '빠른', '귀여운',
        '강한', '용감한', '부드러운', '영리한', '재빠른', '창의적인', '따뜻한',
        '매력적인', '스마트한', '고요한', '신비로운', '우아한', '열정적인'
    ];
    
    const nouns = [
        '호랑이', '여우', '사자', '독수리', '거북이', '곰', '토끼', '고양이',
        '물고기', '올빼미', '늑대', '코끼리', '기린', '펭귄', '사슴',
        '거위', '원숭이', '늑대', '다람쥐', '여우', '토끼', '해바라기', '바람'
    ];
    
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0'); 
    
    return `${randomAdjective}${randomNoun}#${randomNumber}`;
};

const isNicknameExists = async (nickname) => {
    const [rows] = await pool.query(
        `SELECT COUNT(*) as count FROM user WHERE nickname = ?`,
        [nickname]
    );
    return rows[0].count > 0;
};

const generateUniqueNickname = async () => {
    let isUnique = false;
    let nickname;

    while (!isUnique) {
        nickname = generateRandomNickname();
        isUnique = !(await isNicknameExists(nickname));
    }

    return nickname;
};


const signUp = async (name, socialId, provider, email) => {
    const existingUser = await getUserBySocialId(socialId, provider);
    if (existingUser) {
        return existingUser.user_id; 
    }

    const nickname = await generateUniqueNickname();

    const [result] = await pool.query(
        `INSERT INTO user (
            nickname, status, name, email, social_provider, social_id, refresh_token, created_at, updated_at
        ) VALUES (?, 'active', ?, ?, ?, ?, NULL, NOW(), NOW())`,
        [nickname, name, email, provider, socialId]
    );
    return result.insertId;
};


const updateRefreshToken = async (userId, refreshToken) => {
    const [result] = await pool.query(
        `UPDATE user SET refresh_token = ? WHERE user_id = ?`,
        [refreshToken, userId]
    );
    if (result.affectedRows === 0) {
        throw new Error("User not found or refresh token update failed");
    }
};

export { getUserBySocialId, signUp, updateRefreshToken };
