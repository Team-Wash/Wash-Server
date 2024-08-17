import { FolderModel } from "./folder.model.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";

export const FolderService = {
  getFolders: async (userId) => {
    try {
      const folders = await FolderModel.findAll(userId);
      return folders;
    } catch (error) {
        throw new BaseError(status.BAD_REQUEST, "폴더 조회 실패");
    }
  },

  orderFolders: async (order, userId) => {
    try {
      await FolderModel.updateOrder(order, userId);
    } catch (error) {
      throw new BaseError(status.BAD_REQUEST, "폴더 순서 조정 실패");
    }
  },

  renameFolder: async (folderId, folderName, userId) => {
    try {
      const updated = await FolderModel.rename(folderId, folderName, userId);
      return updated;
    } catch (error) {
      throw new BaseError(status.BAD_REQUEST, "폴더 이름 수정 실패");
    }
  },

  deleteFolder: async (folderId, userId) => {
    try {
      const deleted = await FolderModel.delete(folderId, userId);
      return deleted;
    } catch (error) {
      throw new BaseError(status.BAD_REQUEST, "폴더 삭제 실패");
    }
  },

  getFolderProblems: async (folderId, userId) => {
    try {
      const folderProblems = await FolderModel.findProblemsByFolderId(folderId, userId);
      return folderProblems;
    } catch (error) {
      throw new BaseError(status.BAD_REQUEST, "폴더 속 문제 조회 실패");
    }
  },

  addFolder: async (folderName, userId) => {
    try {
      const maxOrderValue = await FolderModel.getMaxOrderValue(userId);
      const newOrderValue = maxOrderValue + 1;
      const newFolder = await FolderModel.create(folderName, newOrderValue, userId);
      return newFolder;
    } catch (error) {
      throw new BaseError(status.BAD_REQUEST, "폴더 추가 실패");
    }
  }
    


};
