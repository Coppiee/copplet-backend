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
    const userData = req.body;
    const uid = res.locals.uid;
    if (!Object.keys(userData).length)
      return res.status(400).json({ status: 400, message: 'User data is required', errorCode: ERROR_CODES.BAD_REQUEST });
    const crud = new Crud(getDBRef);
    crud.updateValueAsync(`${PATH_TO.users}/${uid}`, userData, (error) => {
      if (error) return res.status(500).json({ status: 500, message: 'Failed to save user data', errorCode: ERROR_CODES.SERVER_ERROR });
      return res.status(200).json({ status: 200, message: 'User data saved successfully', errorCode: ERROR_CODES.SUCCESS });
    });
  };

  getUserInfo = async (req, res) =>{
    try {
      const userId = req.body.id;
      const userDoc = await getDBRef().child(`users/${userId}`).get();
      if (!userDoc.exists()) {
        return res.status(404).json({ status: 404, message: "User not found", errorCode: "user/not-found"});
      }
      const userInfo = userDoc.val();
      res.status(200).json(userInfo);
    } catch (error) {
      console.error("Error fetching user info:", error);
      res.status(500).json({ status: 500, message: "Internal Server Error", errorCode: "code/internal-server-error" });
    }
  };
}

export default Controller;
