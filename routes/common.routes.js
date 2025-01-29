import { Router } from 'express';
import Controller from '../controller/common.controller.js';
import { ensureAuthenticated } from '../middleware/auth.middleware.js';

const router = Router();
const controller = new Controller();

router.post('/saveUser', ensureAuthenticated, controller.saveUser);
router.get('/userInfo', ensureAuthenticated, controller.fetchUserInfo);
router.get('/location', ensureAuthenticated, controller.listenToLocationChanges);

export default router;
