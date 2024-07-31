import {User} from '@angular/fire/auth';
import {AuthService, GenericItem} from '@shared-library';

export const mockAuthService = jasmine.createSpyObj(
    'AuthService', ['authState$', 'signOut'],
) as jasmine.SpyObj<AuthService>;

export const mockRoutes: GenericItem[] = [
  {id: '1', name: 'Home'},
  {id: '2', name: 'Profile'},
  {id: '3', name: 'Settings'},
];

export const mockUser = {
  uid: 'mock-user-id',
  displayName: 'Mock User Name',
} as User;
