import { getUserAuth } from '../db/db.js';
import { password_reset_template } from '../global/global.template.js';
import { MESSAGE, ERROR_CODES } from '../global/global.vars.js';
import { PATH_TO } from '../global/iprepapp.global.vars.js';
import Auth from '../utils/auth.utils.js';
import { getResponseObj, httpRequest, referralCode, sendMail } from '../utils/common.utils.js';
import Crud from '../utils/crud.utils.js';
import { getDBRef } from '../db/db.js';

class Controller {
  saveUser = (req, res) => {
    const userData = req.body;
    const uid = res.locals.uid;
    if (!uid || !Object.keys(userData).length)
      return res.status(400).json({ status: 400, message: 'Either user id or user data is required', errorCode: ERROR_CODES.BAD_REQUEST });
    const crud = new Crud(getDBRef);
    crud.updateValueAsync(`${PATH_TO.users}/${uid}`, userData, (error) => {
      if (error) return res.status(500).json({ status: 500, message: 'Failed to save user data', errorCode: ERROR_CODES.SERVER_ERROR });
      return res.status(200).json({ status: 200, message: 'User data saved successfully', errorCode: ERROR_CODES.SUCCESS });
    });
  };

  fetchUserInfo = (req, res) => {
    const uid = res.locals.uid;
    if (!uid) {
      return res.status(400).json({ status: 400, message: 'UID not found', errorCode: ERROR_CODES.BAD_REQUEST });
    }
    try {
      const crud = new Crud(getDBRef);
      crud.getValueAsync(`${PATH_TO.users}/${uid}`, (error, userDoc) => {
        if (error) return res.status(401).json({ status: 401, message: 'Unauthorized', errorCode: ERROR_CODES.UNAUTHORIZED });
        if (!userDoc) return res.status(404).json({ status: 404, message: 'User not found', errorCode: ERROR_CODES.DATA_NOT_FOUND });
        return res.status(200).json({ status: 200, message: 'User data fetched successfully', errorCode: ERROR_CODES.SUCCESS, data: userDoc });
      });
    } catch (error) {
      console.error('Error fetching user info:', error);
      return res.status(500).json({ status: 500, message: 'Internal Server Error', errorCode: ERROR_CODES.SERVER_ERROR });
    }
  };

  connectAccounts = (req, res) => {
    const uid = res.locals.uid;
    const userInfo = res.locals.userInfo;
    if (!uid) return res.status(400).json({ status: 400, message: 'Uid not found', errorCode: ERROR_CODES.BAD_REQUEST });
    const { connectionCode } = req.body;
    const crud = new Crud(getDBRef);
    crud.updateValueAsync(`${PATH_TO.connection}/${uid}`, connectionCode, (error) => {
      if (error) return res.status(401).json({ status: 401, message: 'Unauthorized', errorCode: ERROR_CODES.UNAUTHORIZED });
    });
  };
}

const referralCode = async (uid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const path = PATH_TO.user_types;
      if (!path) return reject({ status: 400, errorCode: ERROR_CODES['400'], msg: 'Bad Request' });
      const userPath = PATH_TO.user_maps;
      if (!userPath) return reject({ status: 400, errorCode: ERROR_CODES['400'], msg: 'Bad Request' });
      const crud = new Crud(getDBRef);
      let generateReferralCode;
      const options = {
        method: 'GET',
        url: `${process.env.DATABASE_URL}/${userPath}/referral_code_user_relation.json?shallow=true`,
        json: true,
      };
      const { body: referralCodeObj } = await httpRequest(options);
      do {
        generateReferralCode = generateAlphanumeric();
      } while (referralCodeObj?.hasOwnProperty(generateReferralCode));

      const userReferralObj = {
        referralCode: generateReferralCode,
        timeOfCreation: +new Date(),
        uid,
      };
      try {
        crud.getValueAsync(`${userPath}/user_referral_code_relation/${uid}`, (error, data) => {
          if (data) {
            return reject('Referral Code already exists');
          }
          crud.setValueAsync(`${userPath}/referral_code_user_relation/${generateReferralCode}`, uid, (error) => {
            crud.setValueAsync(`${userPath}/user_referral_code_relation/${uid}`, userReferralObj, (error) => {
              return resolve({ status: 201, message: MESSAGE['201'], referralCode: generateReferralCode });
            });
          });
        });
      } catch (error) {
        return reject({
          status: 500,
          message: MESSAGE['500'],
          errorCode: ERROR_CODES['SERVER_ERROR'],
        });
      }
    } catch (error) {
      return reject({ status: 500, message: MESSAGE['500'], errorCode: ERROR_CODES['SERVER_ERROR'] });
    }
  });
};

export default Controller;
