import { deleteApp, initializeServerApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator, type Firestore } from 'firebase/firestore'
import { firebaseClientConfig } from './client'

/**
 * Runs a read against Firestore from the server using the **client** SDK, so
 * security rules apply. The Admin SDK bypasses rules entirely, which makes app
 * code the only thing standing between a query bug and unpublished content;
 * here the rules are the backstop.
 *
 * Server rendering is preserved — this is `initializeServerApp`, Firebase's
 * supported SSR path — so pages and `generateMetadata` still resolve data on the
 * server rather than in the browser.
 *
 * Pass `idToken` to read as a specific signed-in user; omit it to read
 * anonymously, which is what the public surfaces want.
 *
 * Note that rules authorise, they do not filter: a query asking for documents
 * the rules disallow is rejected outright rather than trimmed, so callers must
 * still constrain their queries to exactly what is permitted.
 */
export const withServerFirestore = async <T>(
  read: (firestore: Firestore) => Promise<T>,
  idToken?: string
): Promise<T> => {
  const app = initializeServerApp(
    firebaseClientConfig,
    idToken ? { authIdToken: idToken } : {}
  )

  try {
    const firestore = getFirestore(app)

    if (process.env.FIRESTORE_EMULATOR_HOST) {
      const [host, port] = process.env.FIRESTORE_EMULATOR_HOST.split(':')
      connectFirestoreEmulator(firestore, host as string, Number(port))
    }

    return await read(firestore)
  } finally {
    // Server apps are per-request; leaving them registered leaks an instance and
    // its connection for every render.
    await deleteApp(app)
  }
}
