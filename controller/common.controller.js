import { getUserAuth } from '../db/db.js';
import { password_reset_template } from '../global/global.template.js';
import { MESSAGE, ERROR_CODES } from '../global/global.vars.js';
import { PATH_TO } from '../global/iprepapp.global.vars.js';
import Auth from '../utils/auth.utils.js';
import { getResponseObj, httpRequest, referralCode, sendMail } from '../utils/common.utils.js';
import Crud from '../utils/crud.utils.js';
import { getDBRef } from '../db/db.js';
import { error } from 'node:console';

class Controller {
  saveUser = (req, res) => {
    const userData = req.body;
    const uid = res.locals.uid;
    if (!uid || !Object.keys(userData).length)
      return res.status(400).json({ status: 400, message: MESSAGE[400], errorCode: ERROR_CODES.BAD_REQUEST });
    const crud = new Crud(getDBRef);
    crud.updateValueAsync(`${PATH_TO.users}/${uid}`, userData, (error) => {
      if (error) return res.status(500).json({ status: 500, message: MESSAGE[500], errorCode: ERROR_CODES.SERVER_ERROR });
      return res.status(200).json({ status: 200, message: MESSAGE[200], errorCode: ERROR_CODES.SUCCESS });
    });
  };

  fetchUserInfo = (req, res) => {
    const uid = res.locals.uid;
    if (!uid) {
      return res.status(400).json({ status: 400, message: MESSAGE[400], errorCode: ERROR_CODES.BAD_REQUEST });
    }
    try {
      const crud = new Crud(getDBRef);
      crud.getValueAsync(`${PATH_TO.users}/${uid}`, (error, userDoc) => {
        if (error) return res.status(401).json({ status: 401, message: MESSAGE[401], errorCode: ERROR_CODES.UNAUTHORIZED });
        if (!userDoc) return res.status(404).json({ status: 404, message: MESSAGE[404], errorCode: ERROR_CODES.DATA_NOT_FOUND });
        return res.status(200).json({ status: 200, message: MESSAGE[200], data: userDoc });
      });
    } catch (error) {
      return res.status(500).json({ status: 500, message: MESSAGE[500], errorCode: ERROR_CODES.SERVER_ERROR });
    }
  };
}

export default Controller;
