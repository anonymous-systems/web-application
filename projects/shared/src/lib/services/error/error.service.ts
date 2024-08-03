import {inject, Injectable} from '@angular/core';
import {LoggerService} from '../logger/logger.service';
import {FirebaseError} from '@angular/fire/app';
import {ErrorWithHandledFlag} from '@shared-library/interfaces';

@Injectable({providedIn: 'root'})
export class ErrorService {
  private logger = inject(LoggerService);

  /**
   * Handles authentication errors and provides user-friendly error messages.
   *
   * @remarks
   * This method takes an error object (presumably caught during Firebase
   * authentication operations), analyzes its error code if it's a
   * `FirebaseError`, and translates it into a more understandable
   * message for the user. The error message is logged using the
   * `LoggerService`, and the original error is re-thrown to allow
   * further handling or propagation.
   *
   * @param {unknown} error - The error object to handle.
   *
   * @throws {unknown} The original error, allowing it to be caught and
   * handled further up the call stack.
   */
  handleAuthenticationError(error: unknown) {
    if (error instanceof FirebaseError) {
      let errorMessage = 'An unexpected error occured during authentication.';

      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Invalid password.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Your account has been disabled.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'User not found.';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'An account with this email already exists.';
          break;
        case 'auth/weak-password':
          // eslint-disable-next-line max-len
          errorMessage = 'Password is too weak. Please choose a stronger password.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Please try again later.';
          break;
        case 'auth/network-request-failed':
          // eslint-disable-next-line max-len
          errorMessage = 'Network error. Please check your internet connection.';
          break;
        case 'auth/internal-error':
          errorMessage = 'An internal error occurred. Please try again later.';
          break;
        case 'auth/popup-closed-by-user':
        case 'auth/cancelled-popup-request': return;
      }

      this.logger.error(errorMessage, error);

      const errorHandled = {...error, handled: true} as ErrorWithHandledFlag;

      throw errorHandled;
    }

    throw error;
  }
}
