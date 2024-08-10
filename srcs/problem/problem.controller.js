import { status } from "../../config/response.status.js";
import { ProblemService } from "./problem.service.js";
import { response } from "../../config/response.js";
import { 
  setScaleResponseDTO, 
  getProblemListResponseDTO, 
  getProblemResponseDTO, 
  editProblemResponseDTO, 
  errorResponseDTO,
  addProblemResponseDTO, 
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
    const userId = 1; // TODO : jwt 토큰에서 userId 추출
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
      res.send(response(status.SUCCESS, getProblemResponseDTO(problem)));
    } else {
      res.send(response(status.NOT_FOUND, errorResponseDTO("데이터를 찾을 수 없습니다.")));
    }
  } catch (error) {
    res.send(response(status.BAD_REQUEST, errorResponseDTO("잘못된 요청 본문")));
  }
};

export const editProblem = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { problemText, answerText, mainCategory, category, subCategory } = req.body;
    const files = req.files || {}; // 문제 이미지 파일들

    // 1. 문제 텍스트 및 정답 업데이트
    await ProblemService.updateProblemTextAndAnswer(problemId, problemText, answerText);

    // 2. 문제 이미지 업데이트 (하나의 함수로 통합)
    await ProblemService.updateProblemImages(problemId, files);

    // 3. 추가 이미지 업데이트
    await ProblemService.updateAdditionalProblemImages(problemId, files.additionalProblemImage);

    // 4. 문제 유형 업데이트
    await ProblemService.updateProblemTypes(problemId, mainCategory, category, subCategory);

    res.send(response(status.SUCCESS, editProblemResponseDTO()));
  } catch (error) {
    console.error("문제 수정 실패:", error.message);
    res.send(response(status.BAD_REQUEST, errorResponseDTO("잘못된 요청 본문")));
  }
};

// 문제 등록
export const addProblem = async (req, res) => {
  try {
    const problemData = req.body;
    await ProblemService.addProblem(problemData);
    res.send(response(status.SUCCESS, addProblemResponseDTO("문제 등록 성공")));
  } catch (error) {
    res.send(response(status.BAD_REQUEST, errorResponseDTO("문제 등록 실패")));
  }
};