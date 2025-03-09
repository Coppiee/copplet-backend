import Auth from '../utils/auth.utils.js';
import { getResponseObj } from '../utils/common.utils.js';
import { ERROR_CODES } from '../global/global.vars.js';
import { getDBRef, getUserAuth } from '../db/db.js';
import { PATH_TO } from '../global/iprepapp.global.vars.js';
import Crud from '../utils/crud.utils.js';
import { keys } from '../utils/encryption.js';

export const ensureAuthenticated = (req, res, next) => {
  //const apiKey = req.header('X-API-Key');
  //if (apiKey) {
  //  return apiKey === process.env.API_KEY
  //    ? next()
  //    : res.status(400).json({ status: 400, message: 'Bad request', errorCode: ERROR_CODES.BAD_REQUEST });
  //}
  if (!req.header('Authorization')) return res.status(400).json({ status: 400, message: 'Bad request', errorCode: ERROR_CODES.BAD_REQUEST });
  const token = req.header('Authorization').split(' ')[1];
  const auth = new Auth(getUserAuth);
  auth
    .getUserByToken(token)
    .then((decodeToken) => {
      const uid = decodeToken.uid;
      if (!uid) return res.status(400).json({ status: 400, message: 'Some error occured. Please try again', errorCode: ERROR_CODES.UNAUTHORIZED });
      res.locals.uid = uid;
      auth
        .getUserByUid(uid)
        .then((data) => {
          if (data.disabled) {
            throw { code: ERROR_CODES.USER_DISABLED };
          } else if (data?.providerData?.[0]?.providerId !== 'phone' && !data.emailVerified) {
            throw { code: ERROR_CODES.UNVERIFIED };
          } else {
            next();
          }
        })
        .catch((error) => {
          const resObj = getResponseObj(error);
          return res.status(resObj.status || 500).json(resObj);
        });
    })
    .catch((error) => {
      const resObj = getResponseObj(error);
      return res.status(resObj.status || 500).json(resObj);
    });
};

export const fetchUserLocalInfo = (req, res, next) => {
  const uid = res.locals.uid;
  if (!uid) return res.status(400).json({ status: 400, message: 'Uid not found', errorCode: ERROR_CODES.BAD_REQUEST });
  const crud = new Crud(getDBRef);
  crud.getValueAsync(`${PATH_TO.users}/${uid}`, (error, userData) => {
    if (error) return res.status(401).json({ status: 401, message: 'Unauthorized', errorCode: ERROR_CODES.UNAUTHORIZED });
    if (!userData) return res.status(404).json({ status: 404, message: 'User not found', errorCode: ERROR_CODES.DATA_NOT_FOUND });
    res.locals.userInfo = userData;
    next();
  });
};

export const checkKeys = (req, res, next) => {
  try {
    if (!keys.sharedKey) {
      throw new Error('Shared key does not exist');
    }
    if (!keys.privateKey) {
      throw new Error('Private key does not exist');
    }
    next();
  } catch (error) {
    console.error('Key validation error:', error);
    res.status(500).json({ status: 500, message: error.message });
  }
};
