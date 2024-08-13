import { ProblemModel } from "./problem.model.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { uploadFiles } from "../../config/upload.js";

export const ProblemService = {
  setScale: async (scale) => {
    return scale;
  },

  searchProblems: async (query, folderId, userId) => {
    const isSubscribed = await ProblemModel.checkSubscriptionStatus(userId);
    if (!isSubscribed) {
      throw new Error("구독 계정만 이용 가능합니다.");
    }
    if (folderId) {
      return await ProblemModel.searchByFolder(query, folderId);
    } else {
      return await ProblemModel.searchAll(query);
    }
  },


  getProblem: async (problemId) => {
    try {
      const problem = await ProblemModel.findById(problemId);
      if (!problem) return null;

      const photos = await ProblemModel.findPhotosByProblemId(problemId);
      const types = await ProblemModel.findTypesByProblemId(problemId);
      return {
        ...problem,
        photos,
        types
      };
    } catch (error) {
      throw new Error("문제 조회 실패");
    }
  },

  // 문제 수정

  // 문제 텍스트 및 정답 업데이트
  updateProblemTextAndAnswer: async (problemId, problemText, answerText) => {
    await ProblemModel.updateProblem(problemId, problemText, answerText);
  },

  // 이미지들을 조건에 따라 업데이트
  updateProblemImages: async (problemId, files) => {
    const problemImageUrl = files.problemImage ? await uploadFiles(files.problemImage) : null;
    const solutionImageUrl = files.solutionImage ? await uploadFiles(files.solutionImage) : null;
    const passageImageUrl = files.passageImage ? await uploadFiles(files.passageImage) : null;

    await ProblemModel.updateProblemImages(problemId, problemImageUrl, solutionImageUrl, passageImageUrl);
  },

  // 추가 이미지 업데이트
  updateAdditionalProblemImages: async (problemId, additionalProblemImage) => {
    if (additionalProblemImage && additionalProblemImage.length > 0) {
      await ProblemModel.deleteAdditionalProblemImages(problemId);
      for (let image of additionalProblemImage) {
        const photoUrl = await uploadFiles(image);
        await ProblemModel.addAdditionalProblemImage(problemId, photoUrl);
      }
    }
  },

  // 문제 유형 업데이트
  updateProblemTypes: async (problemId, mainCategory, category, subCategory) => {
    await ProblemModel.deleteProblemTypeAssignment(problemId);

    const typeLevels = [
      { typeName: mainCategory, typeLevel: 1 },
      { typeName: category, typeLevel: 2 },
      { typeName: subCategory, typeLevel: 3 }
    ];

    for (let { typeName, typeLevel } of typeLevels) {
      if (typeName) {
        const typeId = await ProblemModel.findProblemTypeIdByNameAndLevel(typeName, typeLevel);
        if (typeId) {
          await ProblemModel.addProblemTypeAssignment(problemId, typeId);
        }
      }
    }
  },

  addProblem: async (problemData) => {
    try {
      await ProblemModel.create(problemData);
    } catch (error) {
      console.error("문제 추가 실패:", error);
      throw new BaseError(status.BAD_REQUEST, "문제 추가 실패");
    }
  },

  getMainTypes: async () => {
    try {
      const mainTypes = await ProblemModel.getMainTypes();
      return mainTypes;
    } catch (error) {
      throw new BaseError(status.BAD_REQUEST, "대분류 조회 실패");
    }
  },

  getMidTypes: async (parentTypeId) => {
    try {
      const midTypes = await ProblemModel.getMidTypes(parentTypeId);
      return midTypes;
    } catch (error) {
      throw new BaseError(status.BAD_REQUEST, "중분류 조회 실패");
    }
  },

  getSubTypes: async (parentTypeId) => {
    try {
      const subTypes = await ProblemModel.getSubTypes(parentTypeId);
      return subTypes;
    } catch (error) {
      throw new BaseError(status.BAD_REQUEST, "소분류 조회 실패");
    }
  },

  addMainType: async (typeName) => {
    try {
      await ProblemModel.addMainType(typeName);
    } catch (error) {
      throw new BaseError(status.BAD_REQUEST, "대분류 추가 실패");
    }
  },

  addMidType: async (typeName, parentTypeId) => {
    try {
      await ProblemModel.addMidType(typeName, parentTypeId);
    } catch (error) {
      throw new BaseError(status.BAD_REQUEST, "중분류 추가 실패");
    }
  },

  addSubType: async (typeName, parentTypeId) => {
    try {
      await ProblemModel.addSubType(typeName, parentTypeId);
    } catch (error) {
      throw new BaseError(status.BAD_REQUEST, "소분류 추가 실패");
    }
  },


};
