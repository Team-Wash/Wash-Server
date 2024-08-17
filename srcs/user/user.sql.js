export const sql = {
  findUserById: `SELECT user_id, nickname, social_provider, email FROM user WHERE user_id = ?`,
  updateNicknameSQL: `UPDATE user SET nickname = ? WHERE user_id = ?`,
  updateStatusSQL: `UPDATE user SET status = ? WHERE user_id = ?`,
  checkIdOverlap: `SELECT email FROM user WHERE email = ?`,
  postNewUser: `INSERT INTO user (email, password, nickname, status,name) VALUES (?, ?, ?, ?,?)`,
  loginGeneralSQL: `SELECT user_id, email FROM user WHERE email = ? AND password = ?;`,
  findUserByEmail: `SELECT user_id, email FROM user WHERE email= ?`,
  postRefreshToken: `UPDATE user SET refresh_token = ? WHERE user_id = ?`,
  logoutUserSQL: `UPDATE user SET refresh_token = ? WHERE user_id = ?`,
  updateProfileSQL: `UPDATE user SET profile_image_url = ? WHERE user_id = ?`,
};
