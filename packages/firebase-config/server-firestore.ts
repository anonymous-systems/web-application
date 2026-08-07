import { deleteApp, initializeServerApp } from 'firebase/app'
import {
  getFirestore,
  connectFirestoreEmulator,
  type Firestore,
} from 'firebase/firestore'
import { getAppCheck } from 'firebase-admin/app-check'
import { firebaseClientConfig } from './client'
import { getFirebaseAdminApp } from './admin-app'

let cached: { token: string; expiresAt: number } | null = null

/**
 * An App Check token for this app, minted with admin credentials.
 *
 * App Check normally proves a request came from a real instance of the app by
 * running reCAPTCHA in a browser — which a server cannot do: there is no DOM to
 * execute the challenge and no origin to match against the site key's allowed
 * domains. A service account is the substitute, and a stronger claim than
 * reCAPTCHA at that.
 *
 * Cached because minting is an HTTPS round trip: doing it per render would add
 * latency to every server-rendered page. The token is app-level rather than
 * per-user, so one serves every request an instance handles. Quota is not the
 * reason — the limit is 20,000/min against roughly one mint per instance-hour.
 *
 * Refreshed a minute early so a request never carries a token that expires
 * mid-flight. Firebase issues these with a one-hour TTL by default.
 */
const appCheckToken = async (): Promise<string> => {
  const now = Date.now()
  if (cached && cached.expiresAt > now + 60_000) return cached.token

  const appId = firebaseClientConfig.appId
  if (!appId) {
    throw new Error(
      'NEXT_PUBLIC_FIREBASE_APP_ID is required to mint an App Check token'
    )
  }

  const { token, ttlMillis } = await getAppCheck(
    getFirebaseAdminApp()
  ).createToken(appId)

  cached = { token, expiresAt: now + ttlMillis }
  return token
}

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
  const onEmulator = Boolean(process.env.FIRESTORE_EMULATOR_HOST)

  const app = initializeServerApp(firebaseClientConfig, {
    ...(idToken ? { authIdToken: idToken } : {}),
    // App Check is enforced on Firestore in deployed environments. The emulator
    // ignores it, and minting there would need real admin credentials, so it is
    // skipped locally — which is precisely why an emulator run cannot prove this
    // path works. Verify against a deployment.
    ...(onEmulator ? {} : { appCheckToken: await appCheckToken() }),
  })

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
