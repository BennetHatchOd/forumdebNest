import dotenv from 'dotenv'
import * as process from 'node:process';

dotenv.config()

export const PORT = process.env.PORT || 3014
export const SECRET_KEY = process.env.SECRET_KEY || '114'
export const PASSCODE_ADMIN_NAME = process.env.PASSCODE_ADMIN || 'admin'
export const PASSCODE_ADMIN_PASSWORD = process.env.PASSCODE_ADMIN || 'qwerty'

 export const PASSWORD_MAIL: string = process.env.PASSWORD_MAIL || "don't work"

 export const TIME_LIFE_ACCESS_TOKEN = 600    // sec
 export const TIME_LIFE_REFRESH_TOKEN = 24*60*60   //sec

 export const TIME_RATE_LIMITED = 10         // sec
 export const COUNT_RATE_LIMITED = 5

 export const LENGTH_VERSION_ID = 7          // for version refresh-token and deviceId
 export const TIME_LIFE_EMAIL_CODE = 2       // hours
 export const TIME_LIFE_PASSWORD_CODE = 2       // hours

export const mongoURI = process.env.MONGO_URL_LOCAL || 'mongodb://0.0.0.0:27017'

export const DB_NAME = 'forumDebol';

export const saltRounds = 10;

export const GLOBAL_PREFIX = 'api';
export const URL_PATH = {
    base:       '/',
    blogs:      '/blogs',
    posts:      '/posts',
    users:      '/users',
    auth:       '/auth',
    devices:    '/security/devices',
    comments:   '/comments',
    testing:    '/testing',
};

 export const AUTH_PATH = {
     login:                 '/login',
//     logout:          '/logout',
     registration:          '/registration',
     confirmation:          '/registration-confirmation',
     resentEmail:           '/registration-email-resending',
     askNewPassword:        '/password-recovery',
     confirmNewPassword:    '/new-password',
//     refresh:         '/refresh-token',
     aboutMe:               '/me',
 };
