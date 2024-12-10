import request from 'request';
import crypto from 'node:crypto';
import { ERROR_CODES, MESSAGE } from '../global/global.vars.js';
import Crud from './crud.utils.js';
import { getDBRef } from '../db/db.js';
import { PATH_TO } from '../global/iprepapp.global.vars.js';

const get_id_origin = (link) => {
  let videoid = link.split('/');
  let origin = videoid[2];
  videoid = videoid[videoid.length - 1];
  return { videoid, origin };
};

const getFinalResult = (individualId, modifiedObj) => {
  let final_Response = {};
  for (let contentId in modifiedObj) {
    let topicArr = Object.keys(modifiedObj[contentId]);
    let topicLength = topicArr.length;
    let indDetails = modifiedObj[contentId][topicArr[topicLength - 1]];
    final_Response[indDetails[individualId]] = {
      attempt_count: topicLength,
      page_read: indDetails['page_read'],
      total_page: indDetails['total_pages'],
      duration: indDetails['duration'],
      updated_time: indDetails['updated_time'],
      mastery: indDetails['mastery'],
      video_total_duration: indDetails['video_total_duration'],
    };
  }
  return final_Response;
};

/**
 * request is deprecated
 * May consider to update to axios
 * https://nodejs.dev/en/learn/making-http-requests-with-nodejs/
 */
const httpRequest = (options) => {
  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error) return reject({ error });
      return resolve({ body, response });
    });
  });
};

const generateRandomNumber = (str) => {
  return Math.floor(100000 + Math.random() * 900000);
};

const sendMail = (mailOptions) => {
  return new Promise((resolve, reject) => {
    if (!mailOptions) return reject({ status: 400, message: 'Missing Params', errorCode: ERROR_CODES.MISSING_PARAMS });
    // use callback
    const options = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'api-key': process.env.SEND_IN_BLUE_API_KEY,
      },
      method: 'POST',
      url: 'https://api.sendinblue.com/v3/smtp/email',
      body: {
        tags: ['1'],
        sender: {
          name: 'iPrep',
          email: 'support@idreameducation.org',
        },
        to: mailOptions.to,
        htmlContent: mailOptions.html,
        textContent: mailOptions.text,
        subject: mailOptions.subject,
        replyTo: {
          email: 'no-reply@idreameducation.org',
          name: 'iPrep',
        },
      },
      json: true,
    };
    httpRequest(options)
      .then((response) => {
        return resolve({ messageId: response?.body?.messageId });
      })
      .catch((error) => {
        return reject({ status: 401, message: 'Error While sending Email', errorCode: 'code/failed-dependency' });
      });
  });
};

const getResponseObj = (error) => {
  let resObj;
  if (error.code === 'auth/argument-error' || error.code === 'auth/id-token-expired') {
    resObj = {
      status: 401,
      message: 'Token Expired',
      errorCode: ERROR_CODES.AUTH_TOKEN_EXPIRED,
    };
  } else if (error.code === ERROR_CODES.USER_DISABLED || error.code === 'auth/id-token-revoked') {
    resObj = {
      status: 401,
      message: 'Token revoked',
      errorCode: 'auth/token-revoked',
    };
  } else if (error.errorCode === ERROR_CODES.USER_DISABLED) {
    resObj = {
      status: 401,
      message: 'User disabled',
      errorCode: ERROR_CODES.USER_DISABLED,
    };
  } else if (error.code === 'auth/argument-error' || error.code === ERROR_CODES.AUTH_USER_NOT_FOUND || error.errorCode === ERROR_CODES.UNAUTHORIZED) {
    resObj = {
      status: 401,
      message: 'Unauthorized',
      errorCode: ERROR_CODES.UNAUTHORIZED,
    };
  } else if (error.code === ERROR_CODES.BAD_REQUEST || error.errorCode === ERROR_CODES.BAD_REQUEST) {
    resObj = {
      status: 400,
      message: error.message || 'Bad Request',
      errorCode: ERROR_CODES.BAD_REQUEST,
    };
  } else if (error.code === ERROR_CODES.UNVERIFIED || error.errorCode === ERROR_CODES.UNVERIFIED) {
    resObj = {
      status: 401,
      message: 'Unverified',
      errorCode: ERROR_CODES.UNVERIFIED,
    };
  } else if (error.code === ERROR_CODES.MISSING_PARAMS || error.errorCode === ERROR_CODES.MISSING_PARAMS) {
    resObj = {
      status: 400,
      message: 'Bad request',
      errorCode: ERROR_CODES.MISSING_PARAMS,
    };
  } else if (error.errorCode === ERROR_CODES.INVALID_ARGUMENT) {
    resObj = {
      status: 401,
      message: 'Invlaid Argument',
      errorCode: ERROR_CODES.INVALID_ARGUMENT,
    };
  } else if (error.code === 'auth/internal-error') {
    resObj = {
      status: 429,
      message: 'Limit exceeded',
      errorCode: 'auth/limit-exceeded',
    };
  } else {
    resObj = {
      status: 500,
      message: 'Internal server error',
      errorCode: ERROR_CODES.SERVER_ERROR,
    };
  }

  return resObj;
};

const insertionSort = (arr, n) => {
  let i, index, keyObj, j;
  for (i = 1; i < n; i++) {
    keyObj = arr[i];
    index = arr[i].index;
    j = i - 1;

    /* Move elements of arr[0..i-1], that are greater than key, to one position aheadof their current position */
    while (j >= 0 && arr[j].index > index) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    arr[j + 1] = keyObj;
  }
  return arr;
};

const sortObjectWithKey = (obj, keyName) => {
  if (!obj || typeof obj != 'object') return {};

  // Convert the object into an array of key-value pairs
  const entries = Object.entries(obj);

  // Sort the array based on the keyName property
  entries.sort(([, valueA], [, valueB]) => valueA[keyName] - valueB[keyName]);

  // Convert the sorted array back into an object and return
  return Object.fromEntries(entries);
};

const getRandomInteger = (min, max) => {
  // Add 1 to the difference between max and min
  // and multiply it by Math.random().
  // Finally, take the floor value to get an integer.
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const set_ip_user_cookie = (ip_user, res) => {
  try {
    const expiryDate = new Date(Number(new Date()) + 315360000000);
    if (process.env.NODE_ENV == 'development') {
      res.cookie('ip_user', ip_user, {
        domain: 'localhost',
        path: '/',
        expires: expiryDate,
      });
    } else {
      res.cookie('ip_user', ip_user, {
        domain: '.iprep.in',
        path: '/',
        expires: expiryDate,
      });
    }
    console.log('Cookies set');
  } catch (error) {
    console.log('Cookies set error: ', error);
  }
};

const expire_ip_user_cookie = (cookies, res) => {
  try {
    const { ip_user } = cookies;
    const expiryDate = new Date();
    if (process.env.NODE_ENV == 'development') {
      res.cookie('ip_user', ip_user, {
        domain: 'localhost',
        path: '/',
        expires: expiryDate,
        httpOnly: true,
      });
    } else {
      res.cookie('ip_user', ip_user, {
        domain: '.iprep.in',
        path: '/',
        secure: true,
        expires: expiryDate,
        httpOnly: true,
      });
    }
    console.log('Cookies expired successfully on logout');
  } catch (error) {
    console.log('Cookies expiry error: ', error);
  }
};

const isDateValid = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date);
};

const generateRandomString = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < 16; i++) {
    randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomString;
};

const encrypt = (text, password, ivStr, algorithm) => {
  const key = Buffer.alloc(32);
  key.write(password, 'utf8');

  const iv = Buffer.alloc(16);
  iv.write(ivStr, 'utf8');

  let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return encrypted.toString('hex');
};

const decrypt = (encryptedData, password, ivStr, algorithm) => {
  const key = Buffer.alloc(32);
  key.write(password, 'utf8');

  const iv = Buffer.alloc(16);
  iv.write(ivStr, 'utf8');

  let encryptedText = Buffer.from(encryptedData, 'hex');
  let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
};

const saveReportsDeviceFormat = (uid, raw_usage) => {
  try {
    const board = raw_usage?.board_id;
    const lang = raw_usage?.language_id;
    const cls = raw_usage?.class_id;

    const boardLangClsKey = `${board}_75S_${lang}_75S_${cls}`;

    const crud = new Crud(getDBRef);
    const currentDate = +new Date(new Date(Date.now()).toDateString());

    crud.getValueAsync(`${PATH_TO.reports}/deviceFormat/${uid}/${boardLangClsKey}`, (error, currentReport) => {
      if (error) console.log(error);
      const category_wise_subject_wise_time_spent = categoryWiseSubjectWiseTime(
        currentReport?.category_wise_subject_wise_time_spent,
        raw_usage,
        currentDate
      );

      const category_wise_subject_wise_usage = categoryWiseSubjectWiseUsage(currentReport?.category_wise_subject_wise_usage, raw_usage, currentDate);

      if (!currentReport) currentReport = { category_wise_subject_wise_time_spent, category_wise_subject_wise_usage };

      crud.updateValueAsync(`${PATH_TO.reports}/deviceFormat/${uid}/${boardLangClsKey}`, currentReport, (error) => {});
    });
  } catch (error) {
    return { error: error.message };
  }
};

const generateAlphanumeric = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 7; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

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

export {
  referralCode,
  generateAlphanumeric,
  get_id_origin,
  httpRequest,
  generateRandomNumber,
  sendMail,
  getFinalResult,
  getResponseObj,
  insertionSort,
  getRandomInteger,
  set_ip_user_cookie,
  expire_ip_user_cookie,
  isDateValid,
  sortObjectWithKey,
  generateRandomString,
  encrypt,
  saveReportsDeviceFormat,
};

const categoryWiseSubjectWiseTime = (
  finalReportObject = {
    category_wise_time_spent: {},
    subject_wise_time_spent: {},
    total_learning_days: {},
    total_learning_time: 0,
  },
  raw_usage,
  currentDate
) => {
  const { lvl5: category_id, lvl4: subject_id, duration: rawDuration } = raw_usage;
  const duration = parseInt(rawDuration, 10);
  const parent_id = raw_usage.parent_id;
  if (!finalReportObject.subject_wise_time_spent?.[parent_id]) finalReportObject.subject_wise_time_spent[parent_id] = {};

  const categoryData = finalReportObject.category_wise_time_spent[category_id] || { count: 0, time_spent: 0 };
  categoryData.count += 1;
  categoryData.time_spent += duration;
  finalReportObject.category_wise_time_spent[category_id] = categoryData;

  const subjectData = finalReportObject.subject_wise_time_spent?.[parent_id]?.[subject_id] || { time: 0, parent_id };
  subjectData.time += duration;
  finalReportObject.subject_wise_time_spent[parent_id][subject_id] = subjectData;

  finalReportObject.total_learning_days[currentDate] = true;
  finalReportObject.total_learning_time += duration;

  return finalReportObject;
};

const categoryWiseSubjectWiseUsage = (finalReportObject = {}, raw_usage, currentDate) => {
  const { lvl5: category_id, lvl4: subject_id, lvl6: topic_id, topic_name, content_name, duration, page_read, mastery, marks } = raw_usage;
  const content_id = content_name || topic_id;
  const currentTime = +new Date();
  const time_spent = parseInt(duration, 10);
  const topicId = topic_name || topic_id;

  finalReportObject[category_id] = finalReportObject[category_id] || {};
  finalReportObject[category_id][subject_id] = finalReportObject[category_id][subject_id] || {};
  finalReportObject[category_id][subject_id][topicId] = finalReportObject[category_id][subject_id][topicId] || {};
  finalReportObject[category_id][subject_id][topicId][content_id] = finalReportObject[category_id][subject_id][topicId][content_id] || {};

  finalReportObject[category_id][subject_id][topicId][content_id][currentTime] = {
    time_spent,
    page_read: page_read || null,
    mastery: mastery >= 0 ? mastery : null,
    marks: marks >= 0 ? marks : null,
  };

  return finalReportObject;
};
