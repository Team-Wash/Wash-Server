import { status } from "../../config/response.status.js";
import { FolderService } from "./folder.service.js";
import { response } from "../../config/response.js";
import { 
    getFoldersResponseDTO, 
    orderFoldersResponseDTO,
    renameFolderResponseDTO,
    getFolderProblemsResponseDTO,
    deleteFolderResponseDTO,
    errorResponseDTO, 
    createFolderResponseDTO} from "./folder.response.dto.js";

export const getAllFolders = async (req, res) => {
  try {
    const userId = req.userId;
    const folders = await FolderService.getFolders(userId);
    res.send(response(status.SUCCESS, getFoldersResponseDTO(folders)));
  } catch (error) {
    res.send(response(status.BAD_REQUEST, errorResponseDTO("잘못된 요청 본문")));
  }
};

export const orderFolders = async (req, res) => {
  try {
    const { order } = req.body;
    const userId = req.userId;
    await FolderService.orderFolders(order, userId);
    res.send(response(status.SUCCESS, orderFoldersResponseDTO("폴더 순서 조정 성공")));
  } catch (error) {
    res.send(response(status.BAD_REQUEST, errorResponseDTO("잘못된 요청 본문")));
  }
};

export const renameFolder = async (req, res) => {
    try {
      const { folderId } = req.params;
      const { folderName } = req.body;
      const userId = req.userId;
      const updated = await FolderService.renameFolder(folderId, folderName, userId);
      if (updated) {
        res.send(response(status.SUCCESS, renameFolderResponseDTO("폴더 이름 수정 성공")));
      } else {
        res.send(response(status.NOT_FOUND, errorResponseDTO("데이터를 찾을 수 없습니다.")));
      }
    } catch (error) {
      res.send(response(status.BAD_REQUEST, errorResponseDTO("잘못된 요청 본문")));
    }
};
  

export const deleteFolder = async (req, res) => {
    try {
      const { folderId } = req.params;
      const userId = req.userId;
      const deleted = await FolderService.deleteFolder(folderId, userId);
      if (deleted) {
        res.send(response(status.SUCCESS, deleteFolderResponseDTO("폴더 삭제 성공")));
      } else {
        res.send(response(status.NOT_FOUND, errorResponseDTO("데이터를 찾을 수 없습니다.")));
      }
    } catch (error) {
      res.send(response(status.BAD_REQUEST, errorResponseDTO("잘못된 요청 본문")));
    }
};

export const getFolderProblems = async (req, res) => {
    try {
      const { folderId } = req.params;
      const userId = req.userId;
      const folderProblems = await FolderService.getFolderProblems(folderId, userId);
      if (folderProblems) {
        res.send(response(status.SUCCESS, getFolderProblemsResponseDTO(folderProblems)));
      } else {
        res.send(response(status.NOT_FOUND, errorResponseDTO("데이터를 찾을 수 없습니다.")));
      }
    } catch (error) {
      res.send(response(status.BAD_REQUEST, errorResponseDTO("잘못된 요청 본문")));
    }
};

export const addFolder = async (req, res) => {
    try {
      const { folderName } = req.body;
      const userId = req.userId;
      const folderId = await FolderService.addFolder(folderName, userId);
      res.send(response(status.SUCCESS, createFolderResponseDTO(folderId)));
    } catch (error) {
      res.send(response(status.BAD_REQUEST, errorResponseDTO("잘못된 요청 본문")));
    }
};
  
  
  
  
  