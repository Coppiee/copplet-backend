import { ERROR_CODES, MESSAGE } from "../global/global.vars.js";
import { PATH_TO } from '../global/iprepapp.global.vars.js';
import Crud from '../utils/crud.utils.js';
import { getDBRef } from '../db/db.js';
import { rejects } from "node:assert";
import { resolve } from "node:path";

class Controller{
	setUserMood = (req, res) => {
		const { mood, description, reason } = req.body;
		const uid = res.locals.uid;
		const timestamp = Date.now();

		if (!uid || !mood) {
		  return res.status(400).json({ status: 400, message: MESSAGE[400], errorCode: ERROR_CODES.BAD_REQUEST });
		}
		const userMoodData = {
		  mood,
		  description: description || '',
		  reason: reason || ''
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
		const { moods, reasons } = req.body;
		if (moods.length == 0 || reasons.length == 0) {
		  return res.status(400).json({ status: 400, message: MESSAGE[400], errorCode: ERROR_CODES.BAD_REQUEST });
		}

		const crud = new Crud(getDBRef);
		crud.setValueAsync('/static_maps/moods', moods, (moodError) => {
			if (moodError) {
			  return res.status(500).json({ status: 500, message: MESSAGE[500], errorCode: ERROR_CODES.SERVER_ERROR });
			}
			crud.setValueAsync('/static_maps/reasons', reasons, (reasonError) => {
			  if (reasonError) {
				return res.status(500).json({ status: 500, message: MESSAGE[500], errorCode: ERROR_CODES.SERVER_ERROR });
			  }
			  return res.status(200).json({ status: 200, message: MESSAGE[200] });
			});
		  });
		};

	  getOnPath = (req, res) =>{
		const crud = new Crud(getDBRef);

		const fetchMoods = () =>{
			return new Promise((resolve, reject) =>{
				crud.getValueAsync('/static_maps/moods', (error, moods) =>{
					if (error){
					  return res.status(500).json({ status: 500, message: MESSAGE[500], errorCode: ERROR_CODES.SERVER_ERROR });
					}
					resolve(moods);
				  });
			});
		};
		const fetchReasons  = () =>{
			return new Promise((resolve, reject) =>{
				crud.getValueAsync('/static_maps/reasons', (error, reasons) =>{
					if (error){
						return res.status(500).json({ status: 500, message: MESSAGE[500], errorCode: ERROR_CODES.SERVER_ERROR });
					}
					resolve(reasons);
				});
			});
		};

		Promise.all([fetchMoods(), fetchReasons()]).then(([moods, reasons]) =>{return res.status(200).json({ status: 200, message: MESSAGE[200], data: { moods, reasons } });}).catch((error) =>{
			return res.status(error.status).json(error);
		});
	  };

	  calculateMoodPercentages = async (req, res) => {
		const uid = res.locals.uid;

		if (!uid) {
		  return res.status(400).json({ status: 400, message: MESSAGE[400], errorCode: ERROR_CODES.BAD_REQUEST });
		}

		const crud = new Crud(getDBRef);
		try {
		  crud.getValueAsync(`/mood_history/${uid}`, (error, moodHistory) => {
			if (error) {
			  return res.status(500).json({ status: 500, message: MESSAGE[500], errorCode: ERROR_CODES.SERVER_ERROR });
			}

			if (!moodHistory) {
			  return res.status(404).json({ status: 404, message: MESSAGE[404], errorCode: ERROR_CODES.DATA_NOT_FOUND });
			}

			const moodCountsOverall = {
			  "very happy": 0,
			  "happy": 0,
			  "okay": 0,
			  "tired": 0,
			  "sad": 0,
			  "angry": 0
			};
			const moodCountsWeekly = { ...moodCountsOverall };
			const moodCountsMonthly = { ...moodCountsOverall };

			const now = new Date();

			const dayOfWeek = now.getDay();
			const sunday = new Date(now);
			sunday.setDate(now.getDate() - dayOfWeek);
			const sundayTimestamp = sunday.getTime();

			const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
			const firstOfMonthTimestamp = firstOfMonth.getTime();

			Object.values(moodHistory).forEach(entry => {
			  if (moodCountsOverall.hasOwnProperty(entry.mood)) {
				moodCountsOverall[entry.mood]++;
			  }
			  if (entry.timestamp >= sundayTimestamp && moodCountsWeekly.hasOwnProperty(entry.mood)) {
				moodCountsWeekly[entry.mood]++;
			  }
			  if (entry.timestamp >= firstOfMonthTimestamp && moodCountsMonthly.hasOwnProperty(entry.mood)) {
				moodCountsMonthly[entry.mood]++;
			  }
			});

			const totalMoodsOverall = Object.values(moodHistory).length;
			const totalMoodsWeekly = Object.values(moodHistory).filter(entry => entry.timestamp >= sundayTimestamp).length;
			const totalMoodsMonthly = Object.values(moodHistory).filter(entry => entry.timestamp >= firstOfMonthTimestamp).length;

			const calculatePercentages = (moodCounts, totalMoods) => {
			  const percentages = {};
			  for (const mood in moodCounts) {
				percentages[mood] = ((moodCounts[mood] / totalMoods) * 100).toFixed(2);
			  }
			  return percentages;
			};

			const moodPercentagesOverall = calculatePercentages(moodCountsOverall, totalMoodsOverall);
			const moodPercentagesWeekly = calculatePercentages(moodCountsWeekly, totalMoodsWeekly);
			const moodPercentagesMonthly = calculatePercentages(moodCountsMonthly, totalMoodsMonthly);

			return res.status(200).json({
			  status: 200,
			  message: MESSAGE[200],
			  data: {
				overall: moodPercentagesOverall,
				weekly: moodPercentagesWeekly,
				monthly: moodPercentagesMonthly
			  }
			});
		  });
		} catch (error) {
		  return res.status(500).json({ status: 500, message: MESSAGE[500], errorCode: ERROR_CODES.SERVER_ERROR });
		}
	  };
}

export default new Controller();