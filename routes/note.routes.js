import express from "express";
import controller from "../controller/note.controller.js";

const router = express.Router();

router.post("/notes", controller.createNote);
router.get("/notes", controller.getAllNotes);
router.put("/notes/:noteId", controller.updateNote);
router.delete("/notes/:noteId", controller.deleteNote);

export default router;
