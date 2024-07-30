import {PROD_FIREBASE_API_KEY, PROD_RECAPTCHA3_SITE_KEY} from './keys';

export const environment = {
  firebaseConfig: {
    apiKey: PROD_FIREBASE_API_KEY,
    authDomain: 'anonymous-systems.firebaseapp.com',
    databaseURL: 'https://anonymous-systems-default-rtdb.firebaseio.com',
    projectId: 'anonymous-systems',
    storageBucket: 'anonymous-systems.appspot.com',
    messagingSenderId: '64613558725',
    appId: '1:64613558725:web:e6dd82824d65de7e6cc3ac',
    measurementId: 'G-TYGJF3S5RG',
  },
  recaptcha3SiteKey: PROD_RECAPTCHA3_SITE_KEY,
  domain: 'anonsys.tech',
};
