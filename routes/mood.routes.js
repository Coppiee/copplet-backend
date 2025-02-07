import express from "express";
import controller from "../controller/mood.controller.js";
import { ensureAuthenticated } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/setMood', ensureAuthenticated, controller.setUserMood);
router.get('/getMood', ensureAuthenticated, controller.getUserMood);
router.post('/updateOnPath', controller.updateOnPath);
router.get('/getOnPath', controller.getOnPath);

export default router;