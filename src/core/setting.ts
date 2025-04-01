export const PORT = 3014;
export const MONGO_URL_LOCAL =
    'mongodb://admin:adminPSWtest@0.0.0.0/?retryWrites=true&w=majority';
export const MONGO_URL =
    'mongodb+srv://vng114:LjYtxxLzoFJUI12K@cluster0.4c5ql.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
export const mongoURI = MONGO_URL_LOCAL || 'mongodb://0.0.0.0:27017'

export const DB_NAME = 'forumDebol';
export const BLOG_COLLECTION_NAME = 'blogs';
export const POST_COLLECTION_NAME = 'posts';
export const USER_COLLECTION_NAME = 'users';
export const COMMENT_COLLECTION_NAME = 'comments';
// export const REQUEST_COLLECTION_NAME = 'requests';
// export const NEWPASSWORD_COLLECTION_NAME = 'askpasswords';
// export const SESSION_COLLECTION_NAME = 'sessions';
// export const LIKE_COMMENT_COLLECTION_NAME = 'likescomments';
// export const LIKE_POST_COLLECTION_NAME = 'likesposts';

export const saltRounds = 10;

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
