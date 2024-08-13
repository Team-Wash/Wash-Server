import { status } from "../../config/response.status.js";
import { response } from "../../config/response.js";
import { UserService } from "./user.service.js";
import {
  singupUserDTO,
  loginUserDTO,
  errorResponseDTO,
  getInfoResponseDTO,
  patchNicknameResponseDTO,
  patchUserStatusrResponseDTO,
  userLogoutDTO,
  patchProfileResponseDTO,
} from "./user.response.dto.js";

//유저 정보 가져오기
export const getInfo = async (req, res) => {
  try {
    const userId = req.userId;
    const userInfo = await UserService.getInfo(userId);
    if (userInfo) {
      res.send(response(status.SUCCESS, getInfoResponseDTO(userInfo)));
    } else {
      res.send(
        response(
          status.NOT_FOUND,
          errorResponseDTO("유저정보를 찾을 수 없습니다.")
        )
      );
    }
  } catch (error) {
    res.send(response(status.BAD_REQUEST, errorResponseDTO("Invalid request")));
  }
};

//닉네임 변경
export const patchNickname = async (req, res) => {
  try {
    const userId = req.userId; 
    const nicknameData = req.body.newNickname;
    await UserService.editNickname(userId, nicknameData);
    res.send(
      response(status.SUCCESS, patchNicknameResponseDTO("닉네임 변경 성공"))
    );
  } catch (error) {
    res.send(response(status.BAD_REQUEST, errorResponseDTO("Invalid request")));
  }
};

//회원 탈퇴 (softdelete - status 변경)
export const deleteUser = async (req, res) => {
  try {
    const userId = req.userId;
    await UserService.inactiveUser(userId);
    res.send(
      response(status.SUCCESS, patchUserStatusrResponseDTO("비활성화 성공"))
    );
  } catch (error) {
    res.send(response(status.BAD_REQUEST, errorResponseDTO("Invalid request")));
  }
};

//로그아웃
export const userLogout = async (req, res) => {
  try {
    const userId = req.userId;
    await UserService.logoutUser(userId);
    res.send(response(status.SUCCESS, userLogoutDTO("로그아웃 성공")));
  } catch (error) {
    res.send(response(status.BAD_REQUEST, errorResponseDTO("Invalid request")));
  }
};

//회원가입
export const signupUser = async (req, res) => {
  try {
    const signupInfo = req.body;
    const isSusccess = await UserService.postUser(signupInfo);
    res.send(response(status.SUCCESS, singupUserDTO(isSusccess)));
  } catch (error) {
    res.send(response(status.BAD_REQUEST, errorResponseDTO("Invalid request")));
  }
};

//로그인
export const loginUser = async (req, res) => {
  try {
    const loginInfo = req.body;
    const token = await UserService.loginGeneral(loginInfo);
    console.log(token.accessToken);
    res.send(response(status.SUCCESS, loginUserDTO(token)));
  } catch (error) {
    res.send(response(status.BAD_REQUEST, errorResponseDTO("Invalid request")));
  }
};

//프로필 사진 변경
export const patchProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const profileURL = req.body.profileURL;
    await UserService.editProfile(userId, profileURL);
    res.send(
      response(status.SUCCESS, patchProfileResponseDTO("프로필 사진 변경 성공"))
    );
  } catch (error) {
    res.send(response(status.BAD_REQUEST, errorResponseDTO("Invalid request")));
  }
};
