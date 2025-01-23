import { Router } from 'express';
import Controller from '../controller/common.controller.js';
import { ensureAuthenticated, fetchUserLocalInfo } from '../middleware/auth.middleware.js';

const router = Router();
const controller = new Controller();

router.post('/saveUser', ensureAuthenticated, controller.saveUser);
router.get('/userInfo', ensureAuthenticated, controller.fetchUserInfo);
router.post('/connectedAccounts', ensureAuthenticated, fetchUserLocalInfo, controller.connectAccounts);

export default router;
