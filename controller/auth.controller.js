import { getUserAuth } from '../db/db.js';
import { password_reset_template } from '../global/global.template.js';
import { MESSAGE, ERROR_CODES } from '../global/global.vars.js';
import { PATH_TO } from '../global/iprepapp.global.vars.js';
import Auth from '../utils/auth.utils.js';
import { getResponseObj, httpRequest, referralCode, sendMail } from '../utils/common.utils.js';
import Crud from '../utils/crud.utils.js';
import { getDBRef } from '../db/db.js';

class Controller {
  home = (req, res) => {
    res.send(`<center><h1>Copplet Server is running</h1></center>`);
  };

  signupWithEmail = async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) return res.status(401).json({ status: 401, message: 'Missing Params', errorCode: ERROR_CODES.MISSING_PARAMS });
    getUserAuth()
      .createUser({
        email,
        emailVerified: true, // TODO: Change this to false after testing
        password,
        displayName: name,
        disabled: false,
      })
      .then((userRecord) => {
        const crud = new Crud(getDBRef);
        const userData = { emailVerified: true, name, email };
        crud.updateValueAsync(`${PATH_TO.users}/${userRecord.uid}`, userData, (error) => {
          if (error) return res.status(500).json({ status: 500, message: 'Failed to update', errorCode: ERROR_CODES.SERVER_ERROR });
          referralCode(userRecord.uid)
            .then(({ referralCode }) => {
              this.loginWithEmail(req, res, referralCode);
            })
            .catch((e) => {
              res.status(500).json({ status: 500, message: 'Failed to update', errorCode: ERROR_CODES.SERVER_ERROR });
            });
        });
      })
      .catch((error) => {
        return res.status(error.status || 401).json({
          status: error.status || 401,
          message: error.message || MESSAGE['401'],
          errorCode: error.errorCode || ERROR_CODES.UNAUTHORIZED,
        });
      });
  };

  loginWithEmail = async (req, res, referralCode) => {
    try {
      // email, password, platformType, app_language and fcmToken are available in the req.body
      const email = req.body.email || res.locals.email;
      const password = req.body.password || res.locals.password;

      if (!email || !password) throw { status: 401, message: 'Missing Params', errorCode: ERROR_CODES.MISSING_PARAMS };

      const options = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        url: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
        body: {
          email,
          password,
          returnSecureToken: true,
        },
        json: true,
      };

      const { body: user } = await httpRequest(options);
      if (user.error) throw { status: 401, message: 'Invalid credentials!', errorCode: ERROR_CODES.UNAUTHORIZED };
      const token = user.idToken;
      const refreshToken = user.refreshToken;

      try {
        const auth = new Auth(getUserAuth);

        auth
          .getUserByToken(token)
          .then((decodeToken) => {
            const emailVerified = decodeToken.email_verified;
            const response_obj = { token, emailVerified, refreshToken, referralCode };
            return res.json({ status: 200, message: 'User logged in', data: response_obj });
          })
          .catch((error) => {
            return res.status(401).json({ status: 401, message: 'User not authorized', errorCode: ERROR_CODES.UNAUTHORIZED });
          });
      } catch (error) {
        return res.status(error.status || 500).json({
          status: error.status || 500,
          message: error.message || MESSAGE['500'],
          errorCode: error.errorCode || ERROR_CODES.SERVER_ERROR,
        });
      }
    } catch (error) {
      return res.status(error.status || 500).json({
        status: error.status || 500,
        message: error.message || MESSAGE['500'],
        errorCode: error.errorCode || ERROR_CODES.SERVER_ERROR,
      });
    }
  };

  refreshIdToken = async (req, res) => {
    try {
      const refreshToken = req.body.refreshToken;
      if (!refreshToken) throw { status: 400, message: 'Token unavailable', errorCode: ERROR_CODES.AUTH_TOKEN_UNAVAILABLE };
      const auth = new Auth(getUserAuth);
      const data = await auth.refreshIdToken(refreshToken);
      if (!data) throw { status: 404, message: 'Error while refreshing token', errorCode: ERROR_CODES.AUTH_TOKEN_UNAVAILABLE };
      const newToken = data.id_token;
      if (data.error?.message === 'TOKEN_EXPIRED' || !newToken)
        throw { status: 400, message: 'Invalid Refresh Token', errorCode: ERROR_CODES.INVALID_ARGUMENT };
      res.json({ status: 200, message: MESSAGE['200'], data: { token: newToken } });
    } catch (error) {
      return res.status(error.status || 500).json({
        status: error.status || 500,
        message: error.message || MESSAGE['500'],
        errorCode: error.errorCode || ERROR_CODES.SERVER_ERROR,
      });
    }
  };

  delete = async (req, res) => {
    try {
      const uid = res.locals.uid;
      const { userFeedback } = req.body;
      if (!userFeedback) throw { status: 400, message: 'Missing Parrams', errorCode: ERROR_CODES.BAD_REQUEST };
      const crud = new Crud(getDatabaseRefIprepSuperApp);
      crud.getValueAsync(`${PATH_TO.users}/${uid}`, async (error, userData) => {
        if (error) return res.status(401).json({ status: 401, message: MESSAGE['401'], errorCode: ERROR_CODES.UNAUTHORIZED });
        if (!userData) return res.status(404).json({ status: 404, message: MESSAGE['404'], errorCode: ERROR_CODES.DATA_NOT_FOUND });
        crud.updateValueAsync(`${PATH_TO.users}/${uid}`, { is_deleted: true }, async (error) => {});
        crud.updateValueAsync(`${PATH_TO.user_maps}/deleted_users/iprep_app/${uid}`, { ...userData, user_feedback: userFeedback }, () => {});
      });
      getUserAuth()
        .updateUser(uid, { disabled: true })
        .then(() => {
          return res.status(200).json({ status: 200, message: 'User deleted successfully' });
        })
        .catch((error) => {
          return res.status(500).json({
            status: 500,
            message: 'Unable to delete account',
            errorCode: ERROR_CODES.SERVER_ERROR,
          });
        });
    } catch (error) {
      return res.status(error.status || 500).json({
        status: error.status || 500,
        message: error.message || MESSAGE['500'],
        errorCode: error.errorCode || ERROR_CODES.SERVER_ERROR,
      });
    }
  };

  resetPassword = async (req, res) => {
    try {
      let email = req.body.email;
      let userName = '';
      if (email) {
        const { displayName, emailVerified } = await getUserAuth().getUserByEmail(email);
        if (!emailVerified) throw { status: 401, message: 'Email not verified', errorCode: ERROR_CODES.UNVERIFIED };
        userName = displayName;
      } else if (req.header('Authorization')) {
        const token = req.header('Authorization').split(' ')[1];
        const auth = new Auth(getUserAuth);
        const { email: decodedEmail, name, email_verified } = await auth.getUserByToken(token);
        if (!email_verified) throw { status: 401, message: 'Email not verified', errorCode: ERROR_CODES.UNVERIFIED };
        email = decodedEmail;
        userName = name;
      } else {
        throw { status: 400, message: 'Missing Params', errorCode: ERROR_CODES.MISSING_PARAMS };
      }

      const link = await getUserAuth().generatePasswordResetLink(email);
      const mailOptions = password_reset_template({ email, reset_link: link, name: userName });

      sendMail(mailOptions)
        .then(() => {
          return res.json({ status: 200, message: 'Email sent successfully!' });
        })
        .catch((error) => {
          return res.status(422).json({ status: 422, message: 'Error while sending email!', errorCode: error.errorCode });
        });
    } catch (error) {
      const resObj = getResponseObj(error);
      res.status(resObj.status).json(resObj);
    }
  };

  logout = (req, res) => {
    try {
      const uid = res.locals.uid;
      getUserAuth()
        .revokeRefreshTokens(uid)
        .then(() => {
          return getUserAuth().getUser(uid);
        })
        .then((userRecord) => {
          res.json({ status: 200, message: 'Signed out' });
        })
        .catch((error) => {
          return res.status(error.status || 500).json({
            status: error.status || 500,
            message: error.message || MESSAGE['500'],
            errorCode: error.errorCode || ERROR_CODES.SERVER_ERROR,
          });
        });
    } catch (error) {
      return res.status(error.status || 500).json({
        status: error.status || 500,
        message: error.message || MESSAGE['500'],
        errorCode: error.errorCode || ERROR_CODES.SERVER_ERROR,
      });
    }
  };
}

export default Controller;
