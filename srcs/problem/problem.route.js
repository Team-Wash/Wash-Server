import express from "express";
import { setScale, searchProblems, getProblem, editProblem, addProblem, getMainTypes, getMidTypes, getSubTypes, addMainType, addMidType, addSubType } from "./problem.controller.js";
import { setScale, searchProblems, getProblem, editProblem, addProblem, getStatisticIncorrectProblem, getStatisticIncorrectType, getStatisticIncorrectRatio } from "./problem.controller.js";
import { setScale, searchProblems, getProblem, editProblem, addProblem, deleteProblem, getProblemTypes, addProblemType } from "./problem.controller.js";
import authenticateToken from "../../config/jwt.middleware.js";

export const problemRouter = express.Router();

problemRouter.patch("/scale", setScale);
problemRouter.get("/search", searchProblems);
problemRouter.get("/:problemId", getProblem);
problemRouter.patch("/:problemId/edit", editProblem);

// problemRouter.use(authenticateToken);

problemRouter.post("/", addProblem);
problemRouter.get("/types/main", getMainTypes);
problemRouter.get("/types/mid/:parentTypeId", getMidTypes);
problemRouter.get("/types/sub/:parentTypeId", getSubTypes);
problemRouter.post('/types/main', addMainType);
problemRouter.post('/types/mid', addMidType);
problemRouter.post('/types/sub', addSubType);
problemRouter.post("/folders/problems", addProblem);
problemRouter.get("/statistics/mistakes",getStatisticIncorrectProblem);
problemRouter.get("/statistics/types",getStatisticIncorrectType);
problemRouter.get("/statistics/ratios",getStatisticIncorrectRatio);

problemRouter.get("/types/:typeLevel", getProblemTypes);
problemRouter.post('/types', addProblemType);
problemRouter.delete("/:problemId", deleteProblem);