import { httpRequest } from './common.utils.js';

/* This file contains all DB queries from firebase authentication */
class Auth {
  constructor(getAuthIprepApp) {
    this.getAuthIprepApp = getAuthIprepApp;
  }

  getUserByToken = (token) => {
    const checkRevoked = true;
    return new Promise((resolve, reject) => {
      this.getAuthIprepApp()
        .verifyIdToken(token, checkRevoked)
        .then((decodeToken) => {
          return resolve(decodeToken);
        })
        .catch((error) => {
          return reject(error);
        });
    });
  };

  getUserByUid = (uid) => {
    return new Promise((resolve, reject) => {
      this.getAuthIprepApp()
        .getUser(uid)
        .then((userRecord) => {
          return resolve(userRecord);
        })
        .catch((error) => {
          return reject(error);
        });
    });
  };

  getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
      this.getAuthIprepApp()
        .getUserByEmail(email)
        .then((userRecord) => {
          return resolve(userRecord);
        })
        .catch((error) => {
          return reject(error);
        });
    });
  };

  getUserbyPhoneNumber = (phoneNumber) => {
    return new Promise((resolve, reject) => {
      this.getAuthIprepApp()
        .getUserByPhoneNumber(phoneNumber)
        .then((userRecord) => {
          return resolve(userRecord);
        })
        .catch((error) => {
          return reject(error);
        });
    });
  };

  refreshIdToken = async (refreshToken) => {
    const options = {
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      method: 'POST',
      url: `https://securetoken.googleapis.com/v1/token?key=${process.env.FIREBASE_API_KEY}`,
      body: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      },
      json: true,
    };
    const { body: data } = await httpRequest(options);
    return data;
  };

  updateUserAuthValue = async (uid, data) => {
    return new Promise((resolve, reject) => {
      this.getAuthIprepApp()
        .updateUser(uid, data)
        .then((userRecord) => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
}

export default Auth;
