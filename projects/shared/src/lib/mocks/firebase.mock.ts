import {EnvironmentProviders, Provider} from '@angular/core';
import {
  FirebaseOptions, initializeApp, provideFirebaseApp,
} from '@angular/fire/app';
import {getAuth, provideAuth} from '@angular/fire/auth';
import {
  connectFirestoreEmulator, provideFirestore,
} from '@angular/fire/firestore';
import {
  connectFunctionsEmulator, getFunctions, provideFunctions,
} from '@angular/fire/functions';
import {
  connectStorageEmulator, getStorage, provideStorage,
} from '@angular/fire/storage';
import {connectAuthEmulator} from '@firebase/auth';
import {getFirestore} from '@firebase/firestore';

let firestoreEmulatorStarted = false;

export const mockFirebaseConfig: FirebaseOptions = {
  apiKey: 'mock-api-key',
  authDomain: 'mock-auth-domain',
  projectId: 'mock-project-id',
  storageBucket: 'mock-storage-bucket',
  messagingSenderId: 'mock-messaging-sender-id',
  appId: 'mock-app-id',
  measurementId: 'mock-measurement-id',
  databaseURL: 'mock-database-url',
};

const MockFirebaseProviders = [
  provideFirebaseApp(() => {
    return initializeApp(mockFirebaseConfig);
  }),
  provideAuth(() => {
    const auth = getAuth();
    connectAuthEmulator(auth, 'http://localhost:9099', {disableWarnings: true});

    return auth;
  }),
  provideFirestore(() => {
    const firestore = getFirestore();

    /** Ensure it's only connected once */
    if (!firestoreEmulatorStarted) {
      connectFirestoreEmulator(firestore, 'localhost', 8080);

      firestoreEmulatorStarted = true;
    }

    return firestore;
  }),
  provideStorage(() => {
    const storage = getStorage();

    connectStorageEmulator(storage, 'localhost', 9199);

    return storage;
  }),
  provideFunctions(() => {
    const functions = getFunctions();

    connectFunctionsEmulator(functions, 'localhost', 5001);

    return functions;
  }),
];

export const provideMockFirebase = (): (Provider | EnvironmentProviders)[] => {
  return MockFirebaseProviders;
};
