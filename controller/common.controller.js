import { getUserAuth } from '../db/db.js';
import { password_reset_template } from '../global/global.template.js';
import { MESSAGE, ERROR_CODES } from '../global/global.vars.js';
import { PATH_TO } from '../global/iprepapp.global.vars.js';
import Auth from '../utils/auth.utils.js';
import { getResponseObj, httpRequest, referralCode, sendMail } from '../utils/common.utils.js';
import Crud from '../utils/crud.utils.js';
import { getDBRef } from '../db/db.js';

class Controller {
  saveUser = async (req, res) => {
    const { name, email } = req.body;
    const userData = { name, email };
    const crud = new Crud(getDBRef);
    crud.updateValueAsync(`${PATH_TO.users}/${user.uid}`, userData, (error) => {
      if (error) return res.status(500).json({ status: 500, message: 'Failed to save user data', errorCode: ERROR_CODES.SERVER_ERROR });
      return res.status(200).json({ status: 200, message: 'User data saved successfully', errorCode: ERROR_CODES.SUCCESS });
    });
  };
}

export default Controller;
