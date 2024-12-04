import mongoose from 'mongoose';
//import config from '../config/index.config.js';

const initMongoDb = async () => {
  try {
    let mongoString = process.env.MONGODB_URL_STRING_TEST;
    if (process.env.NODE_ENV == 'production') mongoString = process.env.MONGODB_URL_STRING;
    else if (process.env.NODE_ENV == 'beta') mongoString = process.env.MONGODB_URL_STRING_TEST;

    await mongoose.connect(mongoString);
    console.log('Mongo connected seamlessly');
  } catch (error) {
    console.log('Mongo connection unsuccessful: ', error);
  }
};

export default initMongoDb;
