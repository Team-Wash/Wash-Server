// 전체 폴더 조회 응답 DTO
export const getFoldersResponseDTO = (folders) => folders.map(folder => ({
    folderId: folder.folderId,
    folderName: folder.folderName,
}));

// 폴더 순서 조정 응답 DTO
export const orderFoldersResponseDTO = (message) => ({
    message,
});

// 폴더 이름 수정 응답 DTO
export const renameFolderResponseDTO = (message) => ({
    message,
});

// 폴더 삭제 응답 DTO
export const deleteFolderResponseDTO = (message) => ({
    message,
});

// 폴더 속 문제 조회 응답 DTO
export const getFolderProblemsResponseDTO = (problems) => ({
    folderName: problems[0].folderName,
    problems: problems.map(problem => ({
      problemId: problem.problemId,
      problemText: problem.problemText,
      problemImage: problem.problemImage,
    }))
});  

// 폴더 추가 응답 DTO
export const createFolderResponseDTO = (folderId) => ({
    message: "폴더 추가 성공",
    folderId
});
  
export const errorResponseDTO = (message) => ({
    message,
});
