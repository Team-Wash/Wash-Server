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
    const folders = await FolderService.getFolders();
    res.send(response(status.SUCCESS, getFoldersResponseDTO(folders)));
  } catch (error) {
    res.send(response(status.BAD_REQUEST, errorResponseDTO("잘못된 요청 본문")));
  }
};

export const orderFolders = async (req, res) => {
  try {
    const { order } = req.body;
    await FolderService.orderFolders(order);
    res.send(response(status.SUCCESS, orderFoldersResponseDTO("폴더 조정 성공")));
  } catch (error) {
    res.send(response(status.BAD_REQUEST, errorResponseDTO("잘못된 요청 본문")));
  }
};

export const renameFolder = async (req, res) => {
    try {
      const { folderId } = req.params;
      const { folderName } = req.body;
      const updated = await FolderService.renameFolder(folderId, folderName);
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
      const deleted = await FolderService.deleteFolder(folderId);
      if (deleted) {
        // res.status(204).send();
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
      const folderProblems = await FolderService.getFolderProblems(folderId);
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
      const folderId = await FolderService.addFolder(folderName);
      res.send(response(status.SUCCESS, createFolderResponseDTO(folderId)));
    } catch (error) {
      res.send(response(status.BAD_REQUEST, errorResponseDTO("잘못된 요청 본문")));
    }
};
  
  
  
  
  