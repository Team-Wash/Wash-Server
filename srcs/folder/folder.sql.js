export const sql = {
    getAllFolders: 'SELECT folder_id AS folderId, folder_name AS folderName, order_value AS orderValue FROM folder WHERE user_id = ?',
    updateFolderOrder: 'UPDATE folder SET order_value = ? WHERE folder_id = ? AND user_id = ?',
    updateFolderName: `UPDATE folder SET folder_name = ? WHERE folder_id = ? AND user_id = ?`,
    deleteFolder: 'DELETE FROM folder WHERE folder_id = ? AND user_id = ?',
    getFolderProblems: `SELECT p.problem_id AS problemId, p.problem_text AS problemText, ph.photo_url AS problemImage, f.folder_name AS folderName, p.order_value AS orderValue FROM problem p JOIN folder f ON p.folder_id = f.folder_id LEFT JOIN photo ph ON p.problem_id = ph.problem_id AND ph.photo_type = '문제' WHERE f.folder_id = ? AND f.user_id = ?`,
    getMaxOrderValue: 'SELECT COALESCE(MAX(order_value), -1) AS maxOrderValue FROM folder WHERE user_id = ?',
    addFolder: `INSERT INTO folder (folder_name, order_value, user_id) VALUES (?, ?, ?)`,
  };
  