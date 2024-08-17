import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { userLogout } from "./user.controller.js";
import { UserModel } from "./user.model.js";

export const UserService = {
  getInfo: async (userId) => {
    try {
      const userInfo = await UserModel.findById(userId);
      if (!userInfo) {
        throw new BaseError(status.NOT_FOUND, "회원을 찾을 수 없습니다.");
      }
      return userInfo;
    } catch (error) {
      console.error("getInfo Error:", error);
      throw new BaseError(status.BAD_REQUEST, "회원 조회 실패");
    }
  },

  editNickname: async (userId, nicknameData) => {
    try {
      await UserModel.updateNickname(userId, nicknameData);
    } catch (error) {
      throw new BaseError(status.BAD_REQUEST, "닉네임 변경 실패");
    }
  },

  inactiveUser: async (userId) => {
    try {
      await UserModel.patchStatus(userId);
    } catch (error) {
      throw new BaseError(status.BAD_REQUEST, "회원 비활성화 실패");
    }
  },

  postUser: async (signupInfo) => {
    try {
      const { email, password } = signupInfo;

      //이름, 아이디, 패스워드가 모두 있으면
      if (email && password) {
        const isSusccess = await UserModel.signup(signupInfo);
        return isSusccess;
      }
    } catch (error) {
      throw new BaseError(status.BAD_REQUEST, "회원가입 실패");
    }
  },

  loginGeneral: async (loginInfo) => {
    try {
      const token = await UserModel.loginGeneral(loginInfo);
      if (token) {
        return token;
      }
    } catch (error) {
      throw new BaseError(status.BAD_REQUEST, "로그인 실패");
    }
  },

  logoutUser: async (userId) => {
    try {
      await UserModel.logoutUser(userId);
    } catch (error) {
      throw new BaseError(status.BAD_REQUEST, "로그인 실패");
    }
  },

  editProfile: async (userId, profileURL) => {
    try {
      await UserModel.updateProfile(userId, profileURL);
    } catch (error) {
      throw new BaseError(status.BAD_REQUEST, "프로필 변경 실패");
    }
  },
};
