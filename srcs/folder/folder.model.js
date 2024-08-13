import { pool } from "../../config/db.js"; 
import { sql } from "./folder.sql.js"; 

export const FolderModel = {
  findAll: async () => {
    try {
      const [results] = await pool.query(sql.getAllFolders);
      return results;
    } catch (error) {
      throw new Error("폴더 조회 실패");
    }
  },

  updateOrder: async (order) => {
    try {
        const queries = order.map((folderId, index) => {
          return pool.query(sql.updateFolderOrder, [index, folderId]);
        });
        await Promise.all(queries);
    } catch (error) {
      throw new Error("폴더 순서 조정 실패");
    }
  },

  rename: async (folderId, folderName) => {
    try {
      const [result] = await pool.query(sql.updateFolderName, [folderName, folderId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error("폴더 이름 수정 실패");
    }
  },

  delete: async (folderId) => {
    try {
      const [result] = await pool.query(sql.deleteFolder, [folderId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error("폴더 삭제 실패");
    }
  },

  findProblemsByFolderId: async (folderId) => {
    try {
      const [results] = await pool.query(sql.getFolderProblems, [folderId]);
      return results.length > 0 ? results : null;
    } catch (error) {
      throw new Error("폴더 속 문제 조회 실패");
    }
  },

  getMaxOrderValue: async () => {
    try {
      const [results] = await pool.query(sql.getMaxOrderValue);
      return results[0].maxOrderValue || 0;
    } catch (error) {
      throw new Error("최대 orderValue 조회 실패");
    }
  },

  create: async (folderName, orderValue) => {
    try {
      const [result] = await pool.query(sql.addFolder, [folderName, orderValue]);
      return result.insertId;
    } catch (error) {
      throw new Error("폴더 추가 실패");
    }
  }

};
