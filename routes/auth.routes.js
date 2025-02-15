import { Router } from 'express';
import Controller from '../controller/auth.controller.js';
import { ensureAuthenticated } from '../middleware/auth.middleware.js';

const router = Router();
const controller = new Controller();

router.get('/', controller.home);
router.post('/loginWithEmail', controller.loginWithEmail);
router.post('/signupWithEmail', controller.signupWithEmail);
router.post('/logout', ensureAuthenticated, controller.logout);
router.post('/refreshIdToken', controller.refreshIdToken);
router.post('/resetPassword', controller.resetPassword); // Todo: work on this
router.delete('/delete', ensureAuthenticated, controller.delete); // Todo: work on this

export default router;
