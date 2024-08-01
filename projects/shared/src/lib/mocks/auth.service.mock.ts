import {
  AuthError, IdTokenResult, OperationType, User, UserCredential,
} from '@angular/fire/auth';
import {GenericItem} from '@shared-library/interfaces';
import {AuthService} from '@shared-library/services';
import {Observable, of} from 'rxjs';

export class MockAuthService extends AuthService {
  override currentUser = () => null;

  override authState$(): Observable<User | null> {
    return of(null);
  }

  override signIn() {
    return Promise.resolve();
  }

  override googleLogin() {
    return Promise.resolve(new Error('mock google login error') as AuthError);
  }

  override signUp() {
    return Promise.resolve(mockUserCredential);
  }

  override assertUser() {
    return;
  }

  override signOut() {
    return Promise.resolve();
  }

  override updateUser() {
    return Promise.resolve();
  }
}

export const mockRoutes: GenericItem[] = [
  {id: '1', name: 'Home'},
  {id: '2', name: 'Profile'},
  {id: '3', name: 'Settings'},
];

export const mockUser: User = {
  uid: 'mock-user-id',
  displayName: 'Mock User',
  emailVerified: true,
  isAnonymous: false,
  metadata: {},
  providerData: [],
  refreshToken: 'mock-user-refresh-token',
  tenantId: 'mock-user-tenant-id',
  email: 'mock-user-email',
  phoneNumber: 'mock-user-phone-number',
  photoURL: 'mock-user-photo-url',
  providerId: 'mock-user-provider-id',
  delete: () => Promise.resolve(),
  getIdToken: () => Promise.resolve('mock-user-id-token'),
  getIdTokenResult: () => Promise.resolve(mockIdTokenResult),
  reload: () => Promise.resolve(),
  toJSON: (): object => ({}),
};

export const mockUserCredential = {
  user: mockUser,
  providerId: null,
  operationType: OperationType.SIGN_IN,
} satisfies UserCredential;

export const mockIdTokenResult: IdTokenResult = {
  authTime: '',
  expirationTime: '',
  issuedAtTime: '',
  signInProvider: null,
  signInSecondFactor: null,
  token: '',
  claims: {},
};
