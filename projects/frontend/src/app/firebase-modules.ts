import { EnvironmentProviders, isDevMode, Provider } from "@angular/core";
import { getApp, initializeApp, provideFirebaseApp } from "@angular/fire/app";
import { environment } from '../environments/environment';
import {
  getAnalytics, isSupported,
  ScreenTrackingService, UserTrackingService,
} from '@angular/fire/analytics';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import {
  connectFirestoreEmulator, getFirestore, provideFirestore,
} from '@angular/fire/firestore';
import {
  connectStorageEmulator, getStorage, provideStorage,
} from '@angular/fire/storage';
import {
  connectFunctionsEmulator, getFunctions, provideFunctions,
} from '@angular/fire/functions';
import {
  initializeAppCheck, provideAppCheck,
  ReCaptchaV3Provider
} from "@angular/fire/app-check";

let firestoreEmulatorStarted = false;

const FirebaseServices = [
  ScreenTrackingService,
  UserTrackingService,
];

const FirebaseProviders = [
  ...FirebaseServices,
  /** Firebase App */
  provideFirebaseApp(() => {
    const app = initializeApp(environment.firebaseConfig);

    /** Initialize Analytics (if supported and production) */
    if (!isDevMode()) {
      isSupported().then((supported: boolean) => {
        if (supported) getAnalytics(app);
      });
    }

    return app;
  }),
  /** Authentication */
  provideAuth(() => {
    const auth = getAuth();
    if (isDevMode()) {
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    }

    return auth;
  }),
  /** AppCheck */
  provideAppCheck(() => {
    const provider = new ReCaptchaV3Provider(environment.recaptcha3SiteKey);

    return initializeAppCheck(
      getApp(),
      { provider, isTokenAutoRefreshEnabled: true },
    );
  }),
  /** Firestore */
  provideFirestore(() => {
    const firestore = getFirestore();

    /** Ensure it's only connected once */
    if (!firestoreEmulatorStarted) {
      if (isDevMode()) {
        connectFirestoreEmulator(firestore, 'localhost', 8080);
      }

      firestoreEmulatorStarted = true;
    }

    return firestore;
  }),
  /** Storage */
  provideStorage(() => {
    const storage = getStorage();

    if (isDevMode()) {
      connectStorageEmulator(storage, 'localhost', 9199);
    }

    return storage;
  }),
  /** Functions */
  provideFunctions(() => {
    const functions = getFunctions();

    if (isDevMode()) {
      connectFunctionsEmulator(functions, 'localhost', 5001);
    }

    return functions;
  }),
];

/**
 * A function that provides an array of Firebase providers for use in an
 * Angular module.
 *
 * @returns {(Provider | EnvironmentProviders)[]} An array of providers for
 * Firebase services and features.
 */
export const provideFirebase = (): (Provider | EnvironmentProviders)[] => {
  return FirebaseProviders;
};
