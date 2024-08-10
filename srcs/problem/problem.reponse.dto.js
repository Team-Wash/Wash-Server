// 문제 스케일 설정 응답 DTO
export const setScaleResponseDTO = (scale) => ({
    scale,
  });
  
  // 문제 검색 응답 DTO
  export const getProblemListResponseDTO = (problems) => {
    return problems.map(problem => ({
      problemId: problem.problem_id.toString(),
      problemImage: problem.problemImage || null,
      problemText: problem.problem_text
    }));
  };
  
  // 문제 조회 응답 DTO
  export const getProblemResponseDTO = (problem) => ({
    problemId: problem.problem_id.toString(),
    problemImage: problem.photos.find(photo => photo.photo_type === 'problem')?.photo_url || null,
    answer: problem.answer,
    solutionImage: problem.photos.find(photo => photo.photo_type === 'solution')?.photo_url || null,
    passageImage: problem.photos.find(photo => photo.photo_type === 'passage')?.photo_url || null,
    additionalProblemImage: problem.photos.filter(photo => photo.photo_type === 'additional').map(photo => photo.photo_url),
    problemText: problem.problem_text,
    gptSessionKey: problem.gpt_session_key,
  
    problemType: {
      대분류: problem.types.filter(type => type.type_level === 1).map(type => type.type_name).join(', '),
      중분류: problem.types.filter(type => type.type_level === 2).map(type => type.type_name).join(', '),
      소분류: problem.types.filter(type => type.type_level === 3).map(type => type.type_name).join(', ')
    },
    statistics: {
      wrongCount: problem.incorrect_count,
      solvedCount: problem.correct_count
    }
  });
  
  
  // 문제 수정 응답 DTO
  export const editProblemResponseDTO = () => ({
    message: "문제 수정 성공",
  });
  
  // 공통 에러 응답 DTO
  export const errorResponseDTO = (message) => ({
    message,
  });

  export const addProblemResponseDTO = (message) => ({
    message,
  });
