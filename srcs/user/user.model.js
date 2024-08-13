import { pool } from "../../config/db.js";
import { userLogout } from "./user.controller.js";
import { sql } from "./user.sql.js";
import jwt from "jsonwebtoken";
const { JWT_SECRET, JWT_REFRESH_SECRET } = process.env;

export const UserModel = {
  findById: async (userId) => {
    try {
      console.log(sql.findUserById);
      console.log("userID:", userId);
      const [results] = await pool.query(sql.findUserById, userId);
      return results[0];
    } catch (error) {
      throw new Error("유저 조회 실패");
    }
  },

  updateNickname: async (userId, nicknameData) => {
    try {
      await pool.query(sql.updateNicknameSQL, [nicknameData, userId]);
    } catch (error) {
      throw new Error("닉네임 변경 실패");
    }
  },

  patchStatus: async (userId) => {
    try {
      await pool.query(sql.updateStatusSQL, ["inactive", userId]);
    } catch (error) {
      throw new Error("회원 탈퇴 실패");
    }
  },

  signup: async (signupInfo) => {
    try {
      const email = signupInfo.email;
      const [result] = await pool.query(sql.checkIdOverlap, email);
      if (result.length === 0) {
        console.log(signupInfo.email);
        await pool.query(sql.postNewUser, [
          signupInfo.email,
          signupInfo.password,
          "기본값",
          "active",
          "00000000000",
        ]);
        return "회원가입 성공";
      } else {
        return "회원가입 실패";
      }
    } catch (error) {
      throw new Error("회원 가입 실패");
    }
  },

  loginGeneral: async (loginInfo) => {
    try {
      const userInfo = await pool.query(sql.loginGeneralSQL, [
        loginInfo.email,
        loginInfo.password,
      ]);
      if (userInfo.length >= 1) {
        const payload = {
          id: userInfo[0][0].user_id,
          email: userInfo[0][0].email,
        };
        const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
        const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
          expiresIn: "7d",
        });
        await pool.query(sql.postRefreshToken, [
          refreshToken,
          userInfo[0][0].user_id,
        ]);
        return { accessToken, refreshToken };
      } else {
        return false;
      }
    } catch (error) {
      throw new Error("로그인 실패");
    }
  },

  logoutUser: async (userId) => {
    try {
      console.log(sql.logoutUserSQL);
      console.log(userId);
      await pool.query(sql.logoutUserSQL, ["", userId]);
    } catch {
      throw new Error("로그인 실패");
    }
  },

  updateProfile: async (userId, profileURL) => {
    try {
      await pool.query(sql.updateProfileSQL, [profileURL, userId]);
    } catch (error) {
      throw new Error("프로필변경 실패");
    }
  },
};
