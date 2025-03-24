import { getDBRef } from '../db/db.js';
import { ERROR_CODES, MESSAGE } from '../global/global.vars.js';
import { PATH_TO } from '../global/iprepapp.global.vars.js';
import Crud from '../utils/crud.utils.js';
import { encrypt, decrypt, keys } from '../utils/encryption.js';

class Controller {
  createNote = async (req, res) => {
    try {
      const { title, description, private: isPrivate } = req.body;
      const uid = res?.locals?.uid;
      const sharedKey = res?.locals?.userInfo?.sharedKey;
      let key = isPrivate ? keys.privateKey : sharedKey || keys.privateKey;
      if (!uid) return res.status(400).json({ status: 400, message: MESSAGE[400], error: ERROR_CODES.BAD_REQUEST });

      const encryptedTitle = encrypt(title, key);
      const encryptedDescription = encrypt(description, key);
      const currentTime = +new Date();
      const crud = new Crud(getDBRef);
      const notes = {
        title: encryptedTitle,
        description: encryptedDescription,
        private: isPrivate || false,
        uid,
        timestamp: currentTime,
      };

      const noteId = await crud.getPushKey(`${PATH_TO.notes}/${uid}`);
      await crud.setValueSync(`${PATH_TO.notes}/${uid}/${noteId}`, { ...notes, noteId });
      return res.status(201).json({ status: 201, message: MESSAGE[201], data: { noteId } });
    } catch (error) {
      return res.status(400).json({ status: 400, message: MESSAGE[400], error: ERROR_CODES.BAD_REQUEST });
    }
  };

  getAllNotes = async (req, res) => {
    try {
      const uid = res?.locals?.uid;
      const crud = new Crud(getDBRef);
      const notes = await crud.getValueSync(`${PATH_TO.notes}/${uid}/`);
      const decryptedNotes = notes.map((note) => {
        const key = note.private ? keys.privateKey : keys.sharedKey;

        let decryptedTitle = note.title;
        let decryptedDescription = note.description;

        try {
          decryptedTitle = decrypt(note.title, key);
          decryptedDescription = decrypt(note.description, key);
        } catch (error) {
          return res.status(400).json({ status: 400, message: MESSAGE[400], error: ERROR_CODES.BAD_REQUEST });
        }

        return { ...note, title: decryptedTitle, description: decryptedDescription };
      });
      return res.status(200).json({ status: 200, message: MESSAGE[200], data: decryptedNotes });
    } catch (error) {
      return res.status(500).json({ status: 500, message: MESSAGE[500], errorCode: ERROR_CODES.SERVER_ERROR });
    }
  };

  getNoteById = async (req, res) => {
    try {
      const uid = res?.locals?.uid;
      const noteId = req.params.noteId;
      const crud = new Crud(getDBRef);

      const { data: note } = await crud.getValueSync(`${PATH_TO.notes}/${uid}/${noteId}`);
      if (!note) return res.status(404).json({ status: 404, message: MESSAGE[404], errorCode: ERROR_CODES.DATA_NOT_FOUND });
      const key = note.private ? keys.privateKey : keys.sharedKey;

      let decryptedTitle = note.title;
      let decryptedDescription = note.description;

      decryptedTitle = decrypt(note.title, key);
      decryptedDescription = decrypt(note.description, key);

      return res
        .status(200)
        .json({ status: 200, message: MESSAGE[200], data: { ...note, title: decryptedTitle, description: decryptedDescription } });
    } catch (error) {
      return res.status(500).json({ status: 500, message: MESSAGE[500], errorCode: ERROR_CODES.SERVER_ERROR });
    }
  };

  updateNote = async (req, res) => {
    try {
      const { noteId, title, description, private: isPrivate } = req.body;
      const uid = res?.locals?.uid;
      if (!noteId) return res.status(400).json({ status: 400, message: MESSAGE[400], error: ERROR_CODES.BAD_REQUEST });

      const key = isPrivate ? keys.privateKey : keys.sharedKey;
      const encryptedTitle = encrypt(title, key);
      const encryptedDescription = encrypt(description, key);
      const crud = new Crud(getDBRef);
      await crud.updateValueSync(`${PATH_TO.notes}/${uid}/${noteId}`, { ...req.body, title: encryptedTitle, description: encryptedDescription });
      const { data: note } = await crud.getValueSync(`${PATH_TO.notes}/${uid}/${noteId}`);
      return res.status(200).json({ status: 200, message: MESSAGE[200], data: note });
    } catch (error) {
      return res.status(400).json({ status: 400, message: MESSAGE[400], error: ERROR_CODES.BAD_REQUEST });
    }
  };

  deleteNote = async (req, res) => {
    try {
      const uid = res?.locals?.uid;
      const noteId = req.params.noteId;
      const crud = new Crud(getDBRef);
      await crud.deleteValueSync(`${PATH_TO.notes}/${uid}/${noteId}`);
      return res.status(200).json({ status: 200, message: MESSAGE[200] });
    } catch (error) {
      return res.status(400).json({ status: 400, message: MESSAGE[400], error: ERROR_CODES.BAD_REQUEST });
    }
  };
}

export default new Controller();
