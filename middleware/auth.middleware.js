import Auth from '../utils/auth.utils.js';
import { getResponseObj } from '../utils/common.utils.js';
import { ERROR_CODES } from '../global/global.vars.js';
import { getUserAuth } from '../db/db.js';

export const ensureAuthenticated = (req, res, next) => {
  const apiKey = req.header('X-API-Key');
  if (apiKey) {
    return apiKey === process.env.API_KEY
      ? next()
      : res.status(400).json({ status: 400, message: 'Bad request', errorCode: ERROR_CODES.BAD_REQUEST });
  }
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
