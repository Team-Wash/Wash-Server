import { status } from "../../config/response.status.js";
import { ProblemService } from "./problem.service.js";
import { ChatService } from "../chat/chat.service.js";
import { response } from "../../config/response.js";
import { createMulter, getPublicUrl } from "../utils/image/image.upload.js";
import { 
  setScaleResponseDTO, 
  getProblemListResponseDTO, 
  getProblemResponseDTO, 
  editProblemResponseDTO, 
  errorResponseDTO,
  addProblemResponseDTO,
  problemTypeResponseDTO ,
  addProblemTypeResponseDTO,
  deleteProblemResponseDTO,
  getStatisticIncorrectProblemDTO,
  getStatisticIncorrectTypeDTO,
  getStatisticIncorrectRatioDTO, 
} from "./problem.reponse.dto.js";

export const setScale = async (req, res) => {
  try {
    const { scale } = req.query;
    const result = await ProblemService.setScale(parseFloat(scale));
    res.send(response(status.SUCCESS, setScaleResponseDTO(result)));
  } catch (error) {
    res.send(response(status.BAD_REQUEST, errorResponseDTO("잘못된 요청 본문")));
  }
};

export const searchProblems = async (req, res) => {
  try {
    const { query, folderId } = req.query;
    const userId = req.userId;
    const problems = await ProblemService.searchProblems(query, folderId, userId);
    res.send(response(status.SUCCESS, getProblemListResponseDTO(problems)));
  } catch (error) {
    if (error.message === "구독 계정만 이용 가능합니다.") {
      res.status(403).send(response(status.FORBIDDEN, errorResponseDTO(error.message)));
    } else {
      console.log(error);
      res.status(400).send(response(status.BAD_REQUEST, errorResponseDTO("잘못된 요청 본문")));
    }
  }
};


export const getProblem = async (req, res) => {
  try {
    const { problemId } = req.params;
    const problem = await ProblemService.getProblem(problemId);
    if (problem) {
      const sessionKey = await ChatService.getSessionKey(problemId);
      res.send(response(status.SUCCESS, getProblemResponseDTO(problem, sessionKey)));
    } else {
      res.send(response(status.NOT_FOUND, errorResponseDTO("데이터를 찾을 수 없습니다.")));
    }
  } catch (error) {
    res.send(response(status.BAD_REQUEST, errorResponseDTO("잘못된 요청 본문")));
  }
};

export const editProblem = async (req, res, next) => {
  try {
    const {
      problemId,
      problemText,
      answer,
      status: problemStatus,
      memo,
    } = JSON.parse(req.body.data);
    const userId = req.userId;
    await ProblemService.deleteTotalProblem(problemId);


    const { problemImage, solutionImages, passageImages, additionalImages } = res.locals.publicUrls;
    const photos = [
      ...problemImage.map(url => ({ photoUrl: url, photoType: 'problem' })),
      ...solutionImages.map(url => ({ photoUrl: url, photoType: 'solution' })),
      ...passageImages.map(url => ({ photoUrl: url, photoType: 'passage' })),
      ...additionalImages.map(url => ({ photoUrl: url, photoType: 'additional' }))
    ];

    const problemData = {
      problemId,
      problemText,
      answer,
      status: problemStatus,
      memo,
      photos
    };

    await ProblemService.updateProblem(problemData, userId);

  res.send(response(status.SUCCESS, editProblemResponseDTO("문제 수정 성공")));
  } catch (error) {
    res.send(response(status.BAD_REQUEST, errorResponseDTO("잘못된 요청 본문")));
  }
};

// 문제 추가
export const addProblem = async (req, res) => {
  try {
      const {
          folderId,
          problemText,
          answer,
          status: problemStatus,
          memo,
          mainTypeId,
          midTypeId,
          subTypeIds,
          problemImage,
          solutionImages,
          passageImages,
          additionalImages
      } = req.body;

      const userId = req.userId;

      if (typeof mainTypeId !== 'number' && mainTypeId !== undefined && mainTypeId !== null) {
          return res.send(response(status.BAD_REQUEST, errorResponseDTO("잘못된 요청 본문")));
      }

      if (typeof midTypeId !== 'number' && midTypeId !== undefined && midTypeId !== null) {
          return res.send(response(status.BAD_REQUEST, errorResponseDTO("잘못된 요청 본문")));
      }

      if (subTypeIds !== undefined && subTypeIds !== null) {
          if (typeof subTypeIds === 'number') {
              subTypeIds = [subTypeIds];
          } else if (!Array.isArray(subTypeIds) || subTypeIds.length > 5) {
              return res.send(response(status.BAD_REQUEST, errorResponseDTO("잘못된 요청 본문")));
          }
      }

      const problemData = {
          folderId,
          problemText,
          answer,
          status: problemStatus,
          memo,
          mainTypeId,
          midTypeId,
          subTypeIds,
          photos: {
              problemImage,
              solutionImages,
              passageImages,
              additionalImages
          }
      };

      console.log("Problem Data:", problemData);

      const addedProblem = await ProblemService.addProblem(problemData, userId);
      console.log("추가된 문제:", addedProblem);

      res.send(response(status.SUCCESS, { problemId: addedProblem.problemId }));
  } catch (error) {
      console.error('문제 추가 실패:', error);
      return res.status(400).send(response(status.BAD_REQUEST, errorResponseDTO("잘못된 요청 본문")));
  }
};

// 문제 유형 목록 조회
export const getProblemTypes = async (req, res) => {
  try {
    const { typeLevel } = req.params;
    const { parentTypeId } = req.query;
    const userId = req.userId;

    let types;

    if (typeLevel === '1') {
      types = await ProblemService.getMainTypes(userId);
    } else if (typeLevel === '2') {
      if (!parentTypeId) {
        return res.send(response(status.BAD_REQUEST, errorResponseDTO("잘못된 요청 본문")));
      }
      types = await ProblemService.getMidTypes(parentTypeId, userId);
    } else if (typeLevel === '3') {
      if (!parentTypeId) {
        return res.send(response(status.BAD_REQUEST, errorResponseDTO("잘못된 요청 본문")));
      }
      types = await ProblemService.getSubTypes(parentTypeId, userId);
    } else {
      return res.send(response(status.BAD_REQUEST, errorResponseDTO("잘못된 요청 본문")));
    }

    if (types && types.length > 0) {
      res.send(response(status.SUCCESS, problemTypeResponseDTO(types)));
    } else {
      res.send(response(status.NOT_FOUND, errorResponseDTO("데이터를 찾을 수 없습니다.")));
    }
  } catch (error) {
    res.send(response(status.BAD_REQUEST, errorResponseDTO("잘못된 요청 본문")));
  }
};

// 문제 유형 추가
export const addProblemType = async (req, res) => {
  try {
    const { typeName, parentTypeId, typeLevel } = req.body;
    const userId = req.userId;

    if (typeLevel === 1) {
      const newType = await ProblemService.addProblemType(typeName, null, typeLevel, userId);
      res.send(response(status.SUCCESS, addProblemTypeResponseDTO(newType.typeId, typeName)));
    } else if (typeLevel === 2) {
      if (!parentTypeId) {
        return res.send(response(status.BAD_REQUEST, errorResponseDTO("잘못된 요청 본문")));
      }
      const newType = await ProblemService.addProblemType(typeName, parentTypeId, typeLevel, userId);
      res.send(response(status.SUCCESS, addProblemTypeResponseDTO(newType.typeId, typeName)));
    } else if (typeLevel === 3) {
      if (!parentTypeId) {
        return res.send(response(status.BAD_REQUEST, errorResponseDTO("잘못된 요청 본문")));
      }
      const newType = await ProblemService.addProblemType(typeName, parentTypeId, typeLevel, userId);
      res.send(response(status.SUCCESS, addProblemTypeResponseDTO(newType.typeId, typeName)));
    } else {
      res.send(response(status.BAD_REQUEST, errorResponseDTO("잘못된 요청 본문")));
    }
  } catch (error) {
    console.error("문제 유형 추가 중 에러:", error.message);
    res.send(response(status.BAD_REQUEST, errorResponseDTO("잘못된 요청 본문")));
  }
};

// 문제 삭제
export const deleteProblem = async (req, res) => {
  try {
    const { problemId } = req.params;
    const userId = req.userId;
    const deleted = await ProblemService.deleteProblem(problemId, userId);
    if (deleted) {
      res.send(response(status.SUCCESS, deleteProblemResponseDTO("문제 삭제 성공")));
    } else {
      res.send(response(status.NOT_FOUND, errorResponseDTO("데이터를 찾을 수 없습니다.")));
    }
  } catch (error) {
    res.send(response(status.BAD_REQUEST, errorResponseDTO("잘못된 요청 본문")));
  }
};

// 문제 유형 삭제
export const deleteProblemType = async (req, res) => {
  try {
    const { typeId } = req.params;
    const { typeLevel } = req.query;
    const userId = req.userId;

    if (!typeId || !typeLevel) {
      res.send(response(status.BAD_REQUEST, "잘못된 요청 본문"));
    }

    switch (parseInt(typeLevel, 10)) {
      case 1:
        // 대분류 삭제
        await ProblemService.deleteMainType(typeId, userId);
        res.send(response(status.SUCCESS, "대분류 삭제 성공"));
        break;
      case 2:
        // 중분류에 연관된 소분류 삭제
        await ProblemService.deleteSubTypesByMidType(typeId, userId);
        // 중분류 삭제
        await ProblemService.deleteMidType(typeId, userId);
        res.send(response(status.SUCCESS, "중분류 삭제 성공"));
        break;
      case 3:
        // 소분류 삭제
        await ProblemService.deleteSubType(typeId, userId);
        res.send(response(status.SUCCESS, "소분류 삭제 성공"));
        break;
      default:
        res.send(response(status.BAD_REQUEST, "잘못된 요청 본문"));
        break;
    }
  } catch (error) {
    console.error("문제 유형 삭제 중 에러:", error.message);
    res.send(response(status.INTERNAL_SERVER_ERROR));
  }
};

// 가장 많이 틀린 문제 가져오기
export const getStatisticIncorrectProblem = async (req, res) => {
    try{
    const userId = req.userId;
    const statistic = await ProblemService.getStatisticIncorrectProblem(userId);

    res.send(response(status.PROBLEM_STATISTIC_SUCCESS,statistic));
    //res.send(response(status.PROBLEM_STATISTIC_SUCCESS,getStatisticIncorrectProblemDTO(statistic)));

    } catch (error){
      res.send(response(status.INTERNAL_SERVER_ERROR));
  }
}

export const getStatisticIncorrectType = async (req, res) => {
  try {
      const userId = req.userId;
      const statistic = await ProblemService.getStatisticIncorrectType(userId);
      
      if (!statistic) {
          return res.send(response(status.NO_CONTENT, null));  // 틀린 문제가 없는 경우 처리
      }

      // DTO로 변환하여 응답
      const statisticDTO = getStatisticIncorrectTypeDTO(statistic);
      res.send(response(status.PROBLEM_STATISTIC_SUCCESS, statisticDTO));
  } catch (error) {
      res.send(response(status.INTERNAL_SERVER_ERROR));
  }
}



export const getStatisticIncorrectRatio = async (req, res) => {
  try {
      const userId = req.userId;
      const { categoryId } = req.params;  // category_id를 파라미터로 받음

      if (!categoryId) {
          return res.send(response(status.BAD_REQUEST, "카테고리 ID가 필요합니다."));
      }

      const statistic = await ProblemService.getStatisticIncorrectRatio(userId, categoryId);

      if (!statistic || statistic.length === 0) {
          return res.send(response(status.NO_CONTENT, null));  // 데이터가 없는 경우 처리
      }

      // DTO로 변환하여 응답
      const statisticDTO = getStatisticIncorrectRatioDTO(statistic);
      res.send(response(status.PROBLEM_STATISTIC_SUCCESS, statisticDTO));
  } catch (error) {
      res.send(response(status.INTERNAL_SERVER_ERROR));
  }
}