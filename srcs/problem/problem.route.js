import express from "express";
import { setScale, searchProblems, getProblem, editProblem, addProblem, deleteProblem, getProblemTypes, addProblemType } from "./problem.controller.js";
import authenticateToken from "../../config/jwt.middleware.js";

export const problemRouter = express.Router();

problemRouter.patch("/scale", setScale);
problemRouter.get("/search", searchProblems);
problemRouter.get("/:problemId", getProblem);
problemRouter.patch("/:problemId/edit", editProblem);

problemRouter.use(authenticateToken);

problemRouter.post("/", addProblem);
problemRouter.get("/types/:typeLevel", getProblemTypes);
problemRouter.post('/types', addProblemType);
problemRouter.delete("/:problemId", deleteProblem);