import { Router } from 'express';
import Controller from '../controller/common.controller.js';
import { ensureAuthenticated } from '../middleware/auth.middleware.js';

const router = Router();
const controller = new Controller();

router.post('/saveUser', ensureAuthenticated, controller.saveUser);
router.get('/userInfo', ensureAuthenticated, controller.fetchUserInfo);
router.post('/setMood', ensureAuthenticated, controller.setUserMood);
router.get('/getMood', ensureAuthenticated, controller.getUserMood);
router.post('/updateOnPath', controller.updateOnPath);
router.get('/getOnPath', controller.getOnPath);

export default router;
