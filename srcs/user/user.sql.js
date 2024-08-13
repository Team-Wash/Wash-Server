export const sql = {
  findUserById: `SELECT user_id, nickname, social_provider, email FROM USER WHERE user_id = ?`,
  updateNicknameSQL: `UPDATE USER SET nickname = ? WHERE user_id = ?`,
  updateStatusSQL: `UPDATE USER SET status = ? WHERE user_id = ?`,
  checkIdOverlap: `SELECT email FROM USER WHERE email = ?`,
  postNewUser: ` INSERT INTO USER (email, password, nickname,status,phone_number) VALUES (?,?,?,?,?)`,
  loginGeneralSQL: `SELECT user_id, email FROM USER WHERE email = ? AND password = ?;`,
  findUserByEmail: `SELECT user_id, email FROM USER WHERE email= ?`,
  postRefreshToken: `UPDATE USER SET refresh_token = ? WHERE user_id = ?`,
  logoutUserSQL: `UPDATE USER SET refresh_token = ? WHERE user_id = ?`,
  updateProfileSQL: `UPDATE USER SET profile_image_url = ? WHERE user_id = ?`,
};