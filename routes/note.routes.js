import express from 'express';
import controller from '../controller/note.controller.js';
import { ensureAuthenticated, fetchUserLocalInfo } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/notes', ensureAuthenticated, fetchUserLocalInfo, controller.getAllNotes);
router.post('/notes', ensureAuthenticated, fetchUserLocalInfo, controller.createNote);
router.get('/notes/public', ensureAuthenticated, fetchUserLocalInfo, controller.fetchPublicNotes);
router.get('/notes/:noteId', ensureAuthenticated, fetchUserLocalInfo, controller.getNoteById);
router.put('/notes/:noteId', ensureAuthenticated, fetchUserLocalInfo, controller.updateNote);
router.delete('/notes/:noteId', ensureAuthenticated, fetchUserLocalInfo, controller.deleteNote);

export default router;
