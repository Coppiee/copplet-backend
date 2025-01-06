export const MESSAGE = {
  404: 'Not Found',
  401: 'Permission Denied',
  500: 'Internal Server Error',
  200: 'Success',
  400: 'Bad Request',
  406: 'Not Acceptable',
  201: 'Created',
  422: 'The coupon code you have entered is invalid!', //'Invalid',
  502: ' Bad Gateway',
};

export const ERROR_CODES = {
  BAD_REQUEST: 'code/bad-request',
  OTP_EXPIRED: 'auth/otp-expired',
  AUTH_TOKEN_EXPIRED: 'auth/token-expired',
  USER_DISABLED: 'auth/user-disabled',
  UNVERIFIED: 'auth/not-verified',
  UNAUTHORIZED: 'auth/unauthorized',
  FORBIDDEN: 'auth/forbidden',
  AUTH_USER_NOT_FOUND: 'auth/user-not-found',
  MISSING_PARAMS: 'code/missing-params',
  NOT_ACCEPTABLE: 'code/not-acceptable',
  SERVER_ERROR: 'code/internal-server-error',
  DATA_NOT_FOUND: 'db/data-not-found',
  INVALID: 'code/invalid',
  ALREADY_USED: 'code/already-used',
  WORNG: 'code/wrong-coupon-code',
  UNPROCESSABLE: 'auth/Unprocessable',
  AUTH_TOKEN_UNAVAILABLE: 'code/token-unavailable',
  PG_ERROR: 'pg/payment-gateway-error',
  PG_INVALID_PAYMENT: 'pg/invalid-payment-info',
  INVALID_ARGUMENT: 'code/invalid-argument',
  UNKNOWN_ERROR: 'code/unknown-error',
  ACCOUNT_ALREADY_EXISTS: 'auth/account_already_exists',
};

export const ERROR_SEVERITY = {
  FATAL: 'FATAL',
  ERROR: 'ERROR',
  WARN: 'WARN',
  SUCCESS: 'SUCCESS',
};

export const DEFAULT_PROFILE_PICS = [
  'https://firebasestorage.googleapis.com/v0/b/iprep-7f10a.appspot.com/o/iprep_app%2Favatars%2FFrame-1.png?alt=media&token=bb405ab1-c999-4923-9bdc-b59e6994d0ac',
  'https://firebasestorage.googleapis.com/v0/b/iprep-7f10a.appspot.com/o/iprep_app%2Favatars%2FFrame-2.png?alt=media&token=79ed3e91-a299-4d34-af97-89fd2965ea13',
  'https://firebasestorage.googleapis.com/v0/b/iprep-7f10a.appspot.com/o/iprep_app%2Favatars%2FFrame-3.png?alt=media&token=4059e835-b21c-4cd9-beb6-3570315a451c',
  'https://firebasestorage.googleapis.com/v0/b/iprep-7f10a.appspot.com/o/iprep_app%2Favatars%2FFrame-4.png?alt=media&token=ac0f45a1-004e-4355-b37c-0a67834a115a',
  'https://firebasestorage.googleapis.com/v0/b/iprep-7f10a.appspot.com/o/iprep_app%2Favatars%2FFrame-5.png?alt=media&token=08e7e68c-4f79-494b-9f95-30f26a5504e8',
  'https://firebasestorage.googleapis.com/v0/b/iprep-7f10a.appspot.com/o/iprep_app%2Favatars%2FFrame.png?alt=media&token=a5e096a4-7081-4189-826b-f605d6cba26f',
];

export const LIST_OF_VALID_CLASSES = [
  'KG',
  'lkg',
  'ukg',
  'nursery',
  'kg',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
];
export const LIST_OF_HIGHER_CLASSES = ['11', '12', 11, 12];
export const EMAIL_REGEX = '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$';
export const PHONE_REGEX = '^(?:\\+\\d{2}-?)?\\d{10}$';
export const FULLNAME_REGEX = '^[A-Za-z _|]{1,30}$'; // '^[a-zA-Z]+(?:_[a-zA-Z]+)*(?: [a-zA-Z]+(?:_[a-zA-Z]+)*){0,1}$',
export const LANGUAGE_REGEX = '^[A-Za-z ]{1,15}$';

export const EMAIL_OTP_EXPIRY_LIMIT = 60000;
export const TRIAL_LIMIT = parseInt(process.env.TRIAL_LIMIT) || 720000;

export const NOTIF_ICON_LINKS = {
  general: 'https://download.iprep.in/notification_icons/general.svg',
  payment: 'https://download.iprep.in/notification_icons/payment.svg',
  plan_expiry: 'https://download.iprep.in/notification_icons/plan_expire.svg',
};

export const NOTIF_TYPES = {
  general: 'general_notification',
  payment: 'payment_notification',
};

//export const SUBSCRIPTION_PLANS = { 'trial': {
//    'title': ''
//  }, 'phone': 'phone'}

//export const LOGIN_TYPES = { 'email': 'email', 'phone': 'phone'}
