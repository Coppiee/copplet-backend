import { ERROR_CODES, MESSAGE } from "../global/global.vars.js";
import { PATH_TO } from '../global/iprepapp.global.vars.js';
import Crud from '../utils/crud.utils.js';
import { getDBRef } from '../db/db.js';

class Controller{
	setUserMood = (req, res) => {
		const { mood, description } = req.body;
		const uid = res.locals.uid;
		const timestamp = Date.now();

		if (!uid || !mood) {
		  return res.status(400).json({ status: 400, message: MESSAGE[400], errorCode: ERROR_CODES.BAD_REQUEST });
		}
		const userMoodData = {
		  mood,
		  description: description || ''
		};
		const moodHistoryData = {
		  ...userMoodData,
		  timestamp
		};

		const crud = new Crud(getDBRef);
		crud.updateValueAsync(`${PATH_TO.users}/${uid}/mood`, userMoodData, (error) => {
		  if (error) {
			return res.status(401).json({ status: 401, message: MESSAGE[401], errorCode: ERROR_CODES.UNAUTHORIZED });
		  }
		  crud.setValueAsync(`mood_history/${uid}/${timestamp}`, moodHistoryData, (error) => {
			if (error) {
			  return res.status(500).json({ status: 500, message: MESSAGE[500], errorCode: ERROR_CODES.SERVER_ERROR });
			}
			return res.status(200).json({ status: 200, message: MESSAGE[200] });
		  });
		});
	  };

	  getUserMood = (req, res) =>{
		try {
		  const uid = res.locals.uid;
		  if (!uid){
			return res.status(400).json({ status: 400, message: MESSAGE[400], errorCode: ERROR_CODES.BAD_REQUEST });
		  }
		  const crud = new Crud(getDBRef);
		  crud.getValueAsync(`${PATH_TO.users}/${uid}/mood`, (error, userMood) =>{
			if (error) return res.status(401).json({status: 401, message: MESSAGE[401], errorCode: ERROR_CODES.UNAUTHORIZED});
			if (!userMood) return res.status(404).json({status: 404, message: MESSAGE[404], errorCode: ERROR_CODES.DATA_NOT_FOUND});
			return res.status(200).json({status: 200, message: MESSAGE[200], data: userMood});
		  });
		} catch (error) {
		  return res.status(500).json({status: 500, message: MESSAGE[500], errorCode: ERROR_CODES.SERVER_ERROR});
		}
	  };

	  updateOnPath = (req, res) => {
		const { moods } = req.body;

		if (moods.length == 0) {
		  return res.status(400).json({ status: 400, message: MESSAGE[400], errorCode: ERROR_CODES.BAD_REQUEST });
		}

		const crud = new Crud(getDBRef);
		crud.setValueAsync('/static_maps/moods', moods, (error) => {
		  if (error) {
			return res.status(500).json({ status: 500, message: MESSAGE[500], errorCode: ERROR_CODES.SERVER_ERROR });
		  }
		  return res.status(200).json({ status: 200, message: MESSAGE[200] });
		});
	  };

	  getOnPath = (req, res) =>{
		const crud = new Crud(getDBRef);
		crud.getValueAsync('/static_maps/moods', (error, moods) =>{
		  if (error){
			return res.status(500).json({ status: 500, message: MESSAGE[500], errorCode: ERROR_CODES.SERVER_ERROR });
		  }
		  return res.status(200).json({ status: 200, message: MESSAGE[200], data: moods});
		});
	  };
}

export default new Controller();