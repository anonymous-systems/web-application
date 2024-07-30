import {FIREBASE_API_KEY, RECAPTCHA3_SITE_KEY} from './keys';

export const environment = {
  firebaseConfig: {
    apiKey: FIREBASE_API_KEY,
    authDomain: 'anonymous-systems-dev.firebaseapp.com',
    databaseURL: 'https://anonymous-systems-dev-default-rtdb.firebaseio.com',
    projectId: 'anonymous-systems-dev',
    storageBucket: 'anonymous-systems-dev.appspot.com',
    messagingSenderId: '160347575398',
    appId: '1:160347575398:web:a29a7b932649cae54749a7',
    measurementId: 'G-ZXCJBFNDCG',
  },
  recaptcha3SiteKey: RECAPTCHA3_SITE_KEY,
  domain: 'anonymous-systems-dev.web.app',
};
