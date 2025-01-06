import Note from "../models/Note.js";
import { encrypt, decrypt, keys } from "../utils/encryption.js";

class Controller {
    createNote = async (req, res) => {
        try {
            const { title, description, privacy } = req.body;
            const key = privacy === 'public' ? keys.sharedKey : keys.privateKey;

            const encryptedTitle = encrypt(title, key);
            const encryptedDescription = encrypt(description, key);
            const note = new Note({ ...req.body, title: encryptedTitle, description: encryptedDescription });
            await note.save();
            res.status(201).json(note);
        } catch (error) {
            res.status(400).json({ message: 'Error creating note', error });
        }
    };

    getAllNotes = async (req, res) => {
        try {
            const notes = await Note.find();
            const decryptedNotes = notes.map(note => {
                const key = note.privacy === 'public' ? keys.sharedKey : keys.privateKey;

                let decryptedTitle = note.title;
                let decryptedDescription = note.description;

                try {
                    if (note.title) {
                        decryptedTitle = decrypt(note.title, key);
                    }
                    if (note.description) {
                        decryptedDescription = decrypt(note.description, key);
                    }
                } catch (error) {
                    console.error("Decryption error:", error);
                }

                return { ...note._doc, title: decryptedTitle, description: decryptedDescription };
            });
            res.status(200).json(decryptedNotes);
        } catch (error) {
            console.error("Error getting notes:", error);
            res.status(400).json({ message: 'Error getting notes', error });
        }
    };

    updateNote = async (req, res) => {
        try {
            const { title, description, privacy } = req.body;
            const key = privacy === 'public' ? keys.sharedKey : keys.privateKey;

            const encryptedTitle = encrypt(title, key);
            const encryptedDescription = encrypt(description, key);
            const note = await Note.findByIdAndUpdate(req.params.noteId, { ...req.body, title: encryptedTitle, description: encryptedDescription }, { new: true });
            res.status(200).json(note);
        } catch (error) {
            res.status(400).json({ message: 'Error Updating note', error });
        }
    };

    deleteNote = async (req, res) => {
        try {
            const note = await Note.findByIdAndDelete(req.params.noteId);
            res.status(200).json({ message: "Note Deleted Successfully" });
        } catch (error) {
            res.status(400).json({ message: 'Error getting notes', error });
        }
    };
}

export default new Controller();