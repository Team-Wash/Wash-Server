import express from 'express';
import { selectFolder, getProgress, checkAnswer, getProblemById } from './study.controller.js';

export const studyRouter = express.Router();

studyRouter.get('/folders/:folderId', selectFolder);
studyRouter.get('/folders/:folderId/progress', getProgress);
studyRouter.get('/folders/:folderId/problems/:problemId', getProblemById);
studyRouter.post('/folders/check-answer', checkAnswer);
