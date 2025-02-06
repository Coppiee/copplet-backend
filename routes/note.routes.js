import express from "express";
import controller from "../controller/note.controller.js";
import { checkKeys } from '../middleware/auth.middleware.js';


const router = express.Router();

router.post("/notes", checkKeys, controller.createNote);
router.get("/notes", checkKeys, controller.getAllNotes);
router.put("/notes/:noteId", checkKeys, controller.updateNote);
router.delete("/notes/:noteId", checkKeys, controller.deleteNote);

export default router;
