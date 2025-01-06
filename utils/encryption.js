import CryptoJS from "crypto-js";

const privateKey = process.env.PRIVATE_KEY || 'mySecretKey1234567890123456';
const sharedKey = process.env.SHARED_KEY || 'mysharedKey1234567890';

export const encrypt = (text, key) => {
    return CryptoJS.AES.encrypt(text, key).toString();
};

export const decrypt = (hash, key) => {
    const bytes = CryptoJS.AES.decrypt(hash, key);
    return bytes.toString(CryptoJS.enc.Utf8);
};

export const keys = {privateKey, sharedKey};