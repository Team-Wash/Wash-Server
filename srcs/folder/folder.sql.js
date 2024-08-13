export const sql = {
    getAllFolders: `SELECT folder_id AS folderId, folder_name AS folderName FROM folder`,
    updateFolderOrder: `UPDATE folder SET order_value = ? WHERE folder_id = ?`,
    updateFolderName: `UPDATE folder SET folder_name = ? WHERE folder_id = ?`,
    deleteFolder: `DELETE FROM folder WHERE folder_id = ?`,
    getFolderProblems: `SELECT p.problem_id AS problemId, p.problem_text AS problemText, ph.photo_url AS problemImage, f.folder_name AS folderName FROM problem p JOIN folder f ON p.folder_id = f.folder_id LEFT JOIN photo ph ON p.problem_id = ph.problem_id AND ph.photo_type = '문제' WHERE f.folder_id = ?`,
    getMaxOrderValue: 'SELECT COALESCE(MAX(order_value), 0) AS maxOrderValue FROM folder',
    addFolder: `INSERT INTO folder (folder_name, order_value) VALUES (?, ?)`,
  };
  