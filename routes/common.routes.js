import { Router } from 'express';
import Controller from '../controller/common.controller.js';
import { ensureAuthenticated } from '../middleware/auth.middleware.js';

const router = Router();
const controller = new Controller();

router.get('/', controller.home);
router.post('/loginWithEmail', controller.loginWithEmail);
router.post('/signupWithEmail', controller.signupWithEmail);
router.post('/logout', ensureAuthenticated, controller.logout);
router.post('/refreshIdToken', controller.refreshIdToken);
router.post('/resetPassword', controller.resetPassword);
router.delete('/delete', ensureAuthenticated, controller.delete);

export default router;
