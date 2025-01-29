import { keys } from '../utils/encryption.js';

const checkKeys = (req, res, next) => {
    try {
        if (!keys.sharedKey) {
            throw new Error('Shared key does not exist');
        }
        if (!keys.privateKey) {
            throw new Error('Private key does not exist');
        }
        next();
    } catch (error) {
        console.error("Key validation error:", error);
        res.status(500).json({ status: 500, message: error.message});
    }
};

export default checkKeys;
