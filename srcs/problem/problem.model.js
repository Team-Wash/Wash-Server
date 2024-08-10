import { pool } from "../../config/db.js"; 
import { sql } from "./problem.sql.js"; 

export const ProblemModel = {

  searchAll: async (query) => {
    try {
      console.log("searchAll");
      const [results] = await pool.query(sql.searchProblem, [`%${query}%`]);
      return results;
    } catch (error) {
      console.error("문제 검색 실패:", error.message);
      throw new Error("문제 검색 실패");
    }
  },

  searchByFolder: async (query, folderId) => {
    try {
      const [results] = await pool.query(sql.searchProblemByFolder, [`%${query}%`, folderId]);
      return results;
    } catch (error) {
      console.error("문제 검색 실패:", error.message);
      throw new Error("문제 검색 실패");
    }
  },

  checkSubscriptionStatus: async (userId) => {
    try {
      const [results] = await pool.query(sql.checkSubscriptionStatus, [userId]);
      return results.length > 0;
    } catch (error) {
      console.error("구독 상태 확인 실패:", error.message);
      throw new Error("구독 상태 확인 실패");
    }
  },



  findById: async (problemId) => {
    try {
      const [results] = await pool.query(sql.findProblemById, [problemId]);
      if (results.length === 0) {
        return null;
      }
      return results[0];
    } catch (error) {
      console.error("문제 조회 실패:", error.message);
      throw new Error("문제 조회 실패");
    }
  },

  findPhotosByProblemId: async (problemId) => {
    try {
      const [results] = await pool.query(sql.findPhotosByProblemId, [problemId]);
      return results;
    } catch (error) {
      console.error("사진 조회 실패:", error.message);
      throw new Error("사진 조회 실패");
    }
  },



  // 문제 업데이트
  updateProblem: async (problemId, problemText, answerText) => {
    try {
      await pool.query(sql.updateProblem, [problemText, answerText, problemId]);
    } catch (error) {
      console.error("문제 텍스트 및 정답 업데이트 실패:", error.message);
      throw new Error("문제 텍스트 및 정답 업데이트 실패");
    }
  },

  updateProblemImages: async (problemId, problemImageUrl, solutionImageUrl, passageImageUrl) => {
    try {
      await pool.query(sql.updateProblemImages, [
        problemImageUrl || null,
        solutionImageUrl || null,
        passageImageUrl || null,
        problemId,
      ]);
    } catch (error) {
      console.error("이미지 업데이트 실패:", error.message);
      throw new Error("이미지 업데이트 실패");
    }
  },

  deleteAdditionalProblemImages: async (problemId) => {
    try {
      await pool.query(sql.deleteAdditionalProblemImages, [problemId]);
    } catch (error) {
      console.error("추가 이미지 삭제 실패:", error.message);
      throw new Error("추가 이미지 삭제 실패");
    }
  },

  addAdditionalProblemImage: async (problemId, photoUrl) => {
    try {
      await pool.query(sql.addAdditionalProblemImage, [problemId, photoUrl]);
    } catch (error) {
      console.error("추가 이미지 삽입 실패:", error.message);
      throw new Error("추가 이미지 삽입 실패");
    }
  },

  deleteProblemTypeAssignment: async (problemId) => {
    try {
      await pool.query(sql.deleteProblemTypeAssignment, [problemId]);
    } catch (error) {
      console.error("유형 할당 삭제 실패:", error.message);
      throw new Error("유형 할당 삭제 실패");
    }
  },

  addProblemTypeAssignment: async (problemId, typeId) => {
    try {
      await pool.query(sql.addProblemTypeAssignment, [problemId, typeId]);
    } catch (error) {
      console.error("유형 할당 추가 실패:", error.message);
      throw new Error("유형 할당 추가 실패");
    }
  },

  findProblemTypeIdByNameAndLevel: async (typeName, typeLevel) => {
    try {
      const [results] = await pool.query(sql.findProblemTypeIdByNameAndLevel, [typeName, typeLevel]);
      return results[0] ? results[0].type_id : null;
    } catch (error) {
      console.error("유형 ID 조회 실패:", error.message);
      throw new Error("유형 ID 조회 실패");
    }
  },
  
  updateProblemImages: async (problemId, problemImageUrl, solutionImageUrl, passageImageUrl) => {
    try {
      await pool.query(sql.updateProblemImages, [
        problemImageUrl || null,
        solutionImageUrl || null,
        passageImageUrl || null,
        problemId,
      ]);
    } catch (error) {
      console.error("이미지 업데이트 실패:", error.message);
      throw new Error("이미지 업데이트 실패");
    }
  },


  create: async (problemData) => {
    try {
      const {
        folderId, folderName, subscriptionPlan, problemText, answer,
        mainCategory, category, subCategory, problemImage,
        solutionImage, passageImage, additionalProblemImage
      } = problemData;

      await pool.query(sql.addProblem, [
        folderId, folderName, subscriptionPlan, problemText, answer,
        mainCategory, category, subCategory, problemImage,
        solutionImage, passageImage, additionalProblemImage
      ]);
    } catch (error) {
      console.error("문제 추가 실패: ", error);
      throw new Error("문제 추가 실패");
    }
  },
  
};
