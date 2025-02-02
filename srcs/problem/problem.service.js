import { ProblemModel } from "./problem.model.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";

export const ProblemService = {


  addProblem: async (problemData, userId) => {
    try {
      const {
        folderId,
        problemText,
        answer,
        status,
        memo,
        mainTypeId,
        midTypeId,
        subTypeIds,
        photos // photos는 컨트롤러에서 `res.locals.publicUrls`로 설정된 이미지 URL이 포함됩니다.
      } = problemData;
  
      // 문제 생성
      const problemMaxOrderValue = await ProblemModel.getProblemMaxOrderValue(userId, folderId);
      const newProblemOrderValue = problemMaxOrderValue + 1;
  
      const newProblem = await ProblemModel.create({
        folderId,
        userId,
        problemText,
        answer,
        status,
        orderValue: newProblemOrderValue,
        memo
      });
  
      // 문제 유형 추가
      if (mainTypeId) {
        await ProblemModel.addProblemTypeAssignment(newProblem.problemId, mainTypeId);
      }
  
      if (midTypeId) {
        await ProblemModel.addProblemTypeAssignment(newProblem.problemId, midTypeId);
      }
  
      if (subTypeIds && Array.isArray(subTypeIds)) {
        for (const subTypeId of subTypeIds) {
          await ProblemModel.addProblemTypeAssignment(newProblem.problemId, subTypeId);
        }
      }
  
      // 문제 사진 추가
      const { problemImage, solutionImages, passageImages, additionalImages } = photos;
  
      // 필수 이미지 추가
      if (problemImage && problemImage.length > 0) {
        console.log("Adding problem image:", problemImage);
        await ProblemModel.addPhotos(newProblem.problemId, [{ photoUrl: problemImage[0], photoType: 'problem' }]);
      } else {
        throw new BaseError(status.BAD_REQUEST, "문제 이미지는 필수입니다.");
      }
  
      // 선택적 이미지 추가
      if (solutionImages && solutionImages.length > 0) {
        console.log("Adding solution images:", solutionImages);
        await ProblemModel.addPhotos(newProblem.problemId, solutionImages.map(url => ({ photoUrl: url, photoType: 'solution' })));
      }
  
      if (passageImages && passageImages.length > 0) {
        console.log("Adding passage images:", passageImages);
        await ProblemModel.addPhotos(newProblem.problemId, passageImages.map(url => ({ photoUrl: url, photoType: 'passage' })));
      }
  
      if (additionalImages && additionalImages.length > 0) {
        console.log("Adding additional images:", additionalImages);
        await ProblemModel.addPhotos(newProblem.problemId, additionalImages.map(url => ({ photoUrl: url, photoType: 'additional' })));
      }
  
      return { problemId: newProblem.problemId };
    } catch (error) {
      console.error("문제 추가 실패:", error);
      throw new BaseError(status.BAD_REQUEST, "문제 추가 실패");
    }
  },   

  updateProblem : async (problemData, userId) => {
    try {
      const {
        problemId,
        problemText,
        answer,
        status,
        memo,
        photos
      } = problemData;
      await ProblemModel.updateProblem(problemId, problemText, answer, status, memo);
      if (photos) {
        const photoTypes = Object.keys(photos);
        for (const photoType of photoTypes) {
          const cleanedPhotoType = photoType.replace(/images?$/i, ''); 
          const photoUrls = photos[photoType];
          for (const photoUrl of photoUrls) {
            await ProblemModel.addPhoto(problemId, photoUrl, cleanedPhotoType);
          }
        }
      }
      
    } catch (error) {
      console.error("문제 수정 실패:", error);
      throw new BaseError(status.BAD_REQUEST, "문제 수정 실패");
    }
  },

  getMainTypes: async (userId) => {
    try {
      const mainTypes = await ProblemModel.getMainTypes(userId);
      return mainTypes;
    } catch (error) {
      throw new BaseError(status.BAD_REQUEST, "대분류 조회 실패");
    }
  },

  getMidTypes: async (parentTypeId, userId) => {
    try {
      const midTypes = await ProblemModel.getMidTypes(parentTypeId, userId);
      return midTypes;
    } catch (error) {
      throw new BaseError(status.BAD_REQUEST, "중분류 조회 실패");
    }
  },

  getSubTypes: async (parentTypeId, userId) => {
    try {
      const subTypes = await ProblemModel.getSubTypes(parentTypeId, userId);
      return subTypes;
    } catch (error) {
      throw new BaseError(status.BAD_REQUEST, "소분류 조회 실패");
    }
  },

  addProblemType: async (typeName, parentTypeId, typeLevel, userId) => {
    try {
      const newType = await ProblemModel.addProblemType(typeName, parentTypeId, typeLevel, userId);
      return newType;
    } catch (error) {
      if (typeLevel === 1) {
        throw new BaseError(status.BAD_REQUEST, "대분류 추가 실패");
      } else if (typeLevel === 2) {
        throw new BaseError(status.BAD_REQUEST, "중분류 추가 실패");
      } else if (typeLevel === 3) {
        throw new BaseError(status.BAD_REQUEST, "소분류 추가 실패");
      }
    }
  },

  deleteTotalProblem: async (problemId) => {
    try {
      // 관련된 사진 삭제
      await ProblemModel.deletePhotosByProblemId(problemId);
      console.log('Service - deleteTotalProblem: 사진 삭제 완료');
    } catch (error) {
      console.error("문제 삭제 실패:", error.message);
      throw new Error("문제 삭제 실패");
    }
  },

  deleteProblem: async (problemId, userId) => {
    try {
      const deleted = await ProblemModel.delete(problemId, userId);
      return deleted;
    } catch (error) {
      throw new BaseError(status.BAD_REQUEST, "문제 삭제 실패");
    }
  },

  deleteMainType: async (typeId, userId) => {
    try {
      console.log('Service - deleteMainType:', { typeId, userId });
  
      // 1. 대분류에 연결된 중분류 찾기
      const midTypes = await ProblemModel.getMidTypesByMainType(typeId, userId);
      
      // 2. 각 중분류에 연결된 소분류 삭제
      for (const midType of midTypes) {
        await ProblemModel.deleteSubTypesByMidType(midType.type_id, userId);
      }
      
      // 3. 대분류에 연결된 중분류 삭제
      await ProblemModel.deleteMidTypesByMainType(typeId, userId);
      
      // 4. 대분류 삭제
      await ProblemModel.deleteMainType(typeId, userId);
  
    } catch (error) {
      console.error('대분류 삭제 실패:', error.message);
      throw new BaseError(status.BAD_REQUEST, "대분류 삭제 실패");
    }
  },  

  deleteSubTypesByMidType: async (midTypeId, userId) => {
    try {
      console.log('Service - deleteSubTypesByMidType:', { midTypeId, userId });

      await ProblemModel.deleteSubTypesByMidType(midTypeId, userId);
    } catch (error) {
      console.error('중분류에 연관된 소분류 삭제 실패:', error.message);
      throw new BaseError(status.BAD_REQUEST, "중분류에 연관된 소분류 삭제 실패");
    }
  },

  deleteMidType: async (typeId, userId) => {
    try {
      console.log('Service - deleteMidType:', { typeId, userId });

      await ProblemModel.deleteMidType(typeId, userId);
    } catch (error) {
      console.error('중분류 삭제 실패:', error.message);
      throw new BaseError(status.BAD_REQUEST, "중분류 삭제 실패");
    }
  },

  deleteSubType: async (typeId, userId) => {
    try {
      console.log('Service - deleteSubType:', { typeId, userId });

      await ProblemModel.deleteSubType(typeId, userId);
    } catch (error) {
      console.error('소분류 삭제 실패:', error.message);
      throw new BaseError(status.BAD_REQUEST, "소분류 삭제 실패");
    }
  },
};
