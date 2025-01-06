import * as dotenv from 'dotenv';
import { cert, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';
import { getMessaging } from 'firebase-admin/messaging';
//import { getStorage } from 'firebase-admin/storage';
dotenv.config();

let db_ref;
let auth;
let messaging;

const firebaseConfig = {
  type: 'service_account',
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  storageBucket: 'iprep-7f10a.appspot.com',
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
};

const initializeFirebaseApp = () => {
  const common_db = initializeApp(
    {
      credential: cert(firebaseConfig),
      databaseURL: process.env.LIVE_DATABASE_URL,
      databaseAuthVariableOverride: {
        uid: process.env.SUPER_APP_AUTH_SECRET,
      },
    },
    'copplet_app'
  );

  db_ref = getDatabase(common_db).ref();
  auth = getAuth(common_db);

  messaging = getMessaging(common_db);
};

const getDBRef = () => {
  return db_ref;
};

const getUserAuth = () => {
  return auth;
};

const getUserMessaging = () => {
  return messaging;
};

export { initializeFirebaseApp, getUserMessaging, getUserAuth, getDBRef };
