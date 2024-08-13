export const getInfoResponseDTO = (userInfo) => ({
  id: userInfo.user_id,
  nickname: userInfo.nickname,
  name: userInfo.name,
  provider: userInfo.social_provider,
  email: userInfo.email,
});

export const errorResponseDTO = (message) => ({
  errorMessage: message.message,
});

export const patchNicknameResponseDTO = (message) => ({
  message,
});

export const patchUserStatusrResponseDTO = (message) => ({
  message,
});

export const singupUserDTO = (message) => ({
  message,
});

export const loginUserDTO = (token) => ({
  accesstoken: token.accessToken,
  refreshtoken: token.refreshToken,
});

export const userLogoutDTO = (message) => ({
  message,
});

export const patchProfileResponseDTO = (message) => ({
  message,
});
