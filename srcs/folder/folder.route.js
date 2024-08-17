import express from "express";
import authenticateToken from "../../config/jwt.middleware.js";
import { getAllFolders, orderFolders, renameFolder, deleteFolder, getFolderProblems, addFolder } from "./folder.controller.js";

export const folderRouter = express.Router();

// folderRouter.use(authenticateToken)

folderRouter.get("/", getAllFolders);
folderRouter.patch("/order", orderFolders);
folderRouter.patch("/:folderId", renameFolder);
folderRouter.delete("/:folderId", deleteFolder);
folderRouter.get("/:folderId/problems", getFolderProblems);
folderRouter.post("/", addFolder);