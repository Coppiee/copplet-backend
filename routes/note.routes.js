import express from 'express';
import controller from '../controller/note.controller.js';
import { ensureAuthenticated } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/notes', ensureAuthenticated, controller.getAllNotes);
router.post('/notes', ensureAuthenticated, controller.createNote);
router.get('/notes/:noteId', ensureAuthenticated, controller.getNoteById);
router.put('/notes/:noteId', ensureAuthenticated, controller.updateNote);
router.delete('/notes/:noteId', ensureAuthenticated, controller.deleteNote);

export default router;
