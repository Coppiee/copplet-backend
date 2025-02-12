import { ERROR_CODES, MESSAGE } from '../global/global.vars.js';
import Note from '../models/note.js';
import { encrypt, decrypt, keys } from '../utils/encryption.js';

class Controller {
  createNote = async (req, res) => {
    try {
      const { title, description, privacy } = req.body;
      const key = privacy === 'public' ? keys.sharedKey : keys.privateKey;

      const encryptedTitle = encrypt(title, key);
      const encryptedDescription = encrypt(description, key);
      const note = new Note({ ...req.body, title: encryptedTitle, description: encryptedDescription });
      await note.save();
      return res.status(201).json({ status: 201, message: MESSAGE[201], data: note });
    } catch (error) {
      return res.status(400).json({ status: 400, message: MESSAGE[400], error: ERROR_CODES.BAD_REQUEST });
    }
  };

  getAllNotes = async (req, res) => {
    try {
      const notes = await Note.find();
      const decryptedNotes = notes.map((note) => {
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
          return res.status(400).json({ status: 400, message: MESSAGE[400], error: ERROR_CODES.BAD_REQUEST });
        }

        return { ...note._doc, title: decryptedTitle, description: decryptedDescription };
      });
      return res.status(200).json({ status: 200, message: MESSAGE[200], data: decryptedNotes });
    } catch (error) {
      return res.status(500).json({ status: 500, message: MESSAGE[500], errorCode: ERROR_CODES.SERVER_ERROR });
    }
  };

  updateNote = async (req, res) => {
    try {
      const { title, description, privacy } = req.body;
      const key = privacy === 'public' ? keys.sharedKey : keys.privateKey;

      const encryptedTitle = encrypt(title, key);
      const encryptedDescription = encrypt(description, key);
      const note = await Note.findByIdAndUpdate(
        req.params.noteId,
        { ...req.body, title: encryptedTitle, description: encryptedDescription },
        { new: true }
      );
      return res.status(200).json({ status: 200, message: MESSAGE[200], data: note });
    } catch (error) {
      return res.status(400).json({ status: 400, message: MESSAGE[400], error: ERROR_CODES.BAD_REQUEST });
    }
  };

  deleteNote = async (req, res) => {
    try {
      const note = await Note.findByIdAndDelete(req.params.noteId);
      return res.status(200).json({ status: 200, message: MESSAGE[200] });
    } catch (error) {
      return res.status(400).json({ status: 400, message: MESSAGE[400], error: ERROR_CODES.BAD_REQUEST });
    }
  };
}

export default new Controller();
