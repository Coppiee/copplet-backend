import { MESSAGE, ERROR_CODES } from '../global/global.vars.js';
import { PATH_TO } from '../global/iprepapp.global.vars.js';
import Crud from '../utils/crud.utils.js';
import { getDBRef } from '../db/db.js';
import { generateAlphanumeric } from '../utils/common.utils.js';

class Controller {
  saveUser = (req, res) => {
    const userData = req.body;
    const uid = res.locals.uid;
    if (!uid || !Object.keys(userData).length)
      return res.status(400).json({ status: 400, message: 'Either user id or user data is required', errorCode: ERROR_CODES.BAD_REQUEST });
    const crud = new Crud(getDBRef);
    crud.updateValueAsync(`${PATH_TO.users}/${uid}`, userData, (error) => {
      if (error) return res.status(500).json({ status: 500, message: MESSAGE[500], errorCode: ERROR_CODES.SERVER_ERROR });
      return res.status(200).json({ status: 200, message: MESSAGE[200] });
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
        if (error) return res.status(401).json({ status: 401, message: 'Unauthorized', errorCode: ERROR_CODES.UNAUTHORIZED });
        if (!userDoc) return res.status(404).json({ status: 404, message: 'User not found', errorCode: ERROR_CODES.DATA_NOT_FOUND });
        return res.status(200).json({ status: 200, message: 'User data fetched successfully', data: userDoc });
      });
    } catch (error) {
      console.error('Error fetching user info:', error);
      return res.status(500).json({ status: 500, message: 'Internal Server Error', errorCode: ERROR_CODES.SERVER_ERROR });
    }
  };

  connectAccounts = async (req, res) => {
    try {
      const { partnerCode } = req.body;
      if (!partnerCode) return res.status(400).json({ status: 400, message: 'Partner code is required', errorCode: ERROR_CODES.BAD_REQUEST });
      const uid = res?.locals?.uid;
      if (!uid) return res.status(400).json({ status: 400, message: 'Uid not found', errorCode: ERROR_CODES.BAD_REQUEST });
      const { coupleCode, name: userName } = res?.locals?.userInfo;
      if (coupleCode == partnerCode)
        return res.status(400).json({ status: 400, message: 'You cannot connect to yourself', errorCode: ERROR_CODES.BAD_REQUEST });
      const crud = new Crud(getDBRef);
      const { data: coupleCodeData } = await crud.getValueSync(`${PATH_TO.coupleCodeUserRelation}/${partnerCode}`);
      if (!coupleCodeData) return res.status(400).json({ status: 400, message: 'Partner code not found', errorCode: ERROR_CODES.BAD_REQUEST });
      const partnerUid = coupleCodeData?.uid;
      const isCoupleCodeConnected = coupleCodeData?.connected;
      if (isCoupleCodeConnected)
        return res.status(400).json({ status: 400, message: 'Partner code already connected', errorCode: ERROR_CODES.BAD_REQUEST });
      const { data: partnerData } = await crud.getValueSync(`${PATH_TO.users}/${partnerUid}`);
      if (!partnerData) return res.status(400).json({ status: 400, message: 'Partner data not found', errorCode: ERROR_CODES.BAD_REQUEST });
      const currentTime = +new Date();
      const connectionCode = `${coupleCode}${partnerCode}`;
      const connectionData = {
        timestamp: currentTime,
        connectionCode,
        sharedKey: generateAlphanumeric(process.env.ENCRYPTION_KEY_LENGTH),
        connectedUsers: {
          [partnerUid]: { connectionCode, userName: partnerData?.name, coupleCode: partnerData?.coupleCode },
          [uid]: { connectionCode, userName, coupleCode },
        },
      };

      const promises = [];
      promises.push(crud.updateValueSync(`${PATH_TO.connection}/${connectionCode}`, connectionData));
      promises.push(crud.updateValueSync(`${PATH_TO.users}/${partnerUid}/`, { connectionCode, sharedKey: connectionData.sharedKey }));
      promises.push(crud.updateValueSync(`${PATH_TO.users}/${uid}`, { connectionCode, sharedKey: connectionData.sharedKey }));
      promises.push(
        crud.updateValueSync(`${PATH_TO.coupleCodeUserRelation}/${partnerCode}`, { connected: true, connectedUid: uid, timestamp: currentTime })
      );
      promises.push(
        crud.updateValueSync(`${PATH_TO.coupleCodeUserRelation}/${coupleCode}`, { connected: true, connectedUid: partnerUid, timestamp: currentTime })
      );

      await Promise.all(promises);
      return res.status(200).json({ status: 200, message: 'Connection code updated successfully', data: { connectionData } });
    } catch (error) {
      console.error('Error connecting accounts:', error);
      return res.status(500).json({ status: 500, message: 'Internal Server Error', errorCode: ERROR_CODES.SERVER_ERROR });
    }
  };
}

export default Controller;
