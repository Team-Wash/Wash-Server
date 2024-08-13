import { ProblemModel } from "./problem.model.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";

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

  editProblem: async (problemId, problemData) => {
    try {
      await ProblemModel.update(problemId, problemData);
    } catch (error) {
      throw new BaseError(status.BAD_REQUEST, "문제 수정 실패");
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

  getStatisticIncorrectProblem: async () => {
    try{
      const userId = 1;
      return await ProblemModel.getIncorrectProblemStatistic(userId);
    } catch (error) {
      throw new BaseError(status.INTERNAL_SERVER_ERROR,"틀린 문제 통계 조회 실패")
    }
  },

  getStatisticIncorrectType: async () => {
    try{
      const userId =1;
      return await ProblemModel.getIncorrectTypeStatistic(userId);

    } catch (error) {
      throw new BaseError(status.INTERNAL_SERVER_ERROR,"틀린 문제 유형 통계 조회 실패");
    }

  },

  getStatisticIncorrectRatio: async () => {
    try{
      const userId =1;
      return await ProblemModel.getIncorrectRatioStatistic(userId);

    } catch (error) {
      throw new BaseError(status.INTERNAL_SERVER_ERROR,"틀린 문제 비율 통계 조회 실패");
    }

  },


};
