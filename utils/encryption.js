import CryptoJS from 'crypto-js';

const privateKey = process.env.PRIVATE_KEY;
const sharedKey = process.env.SHARED_KEY;

export const encrypt = (text, key) => {
  return CryptoJS.AES.encrypt(text, key).toString();
};

export const decrypt = (hash, key) => {
  if (!hash) return '';
  const bytes = CryptoJS.AES.decrypt(hash, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const keys = { privateKey, sharedKey };
