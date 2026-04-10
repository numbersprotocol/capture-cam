import { Injectable } from '@angular/core';
import {
  GoogleLoginResponseOnline,
  SocialLogin,
} from '@capgo/capacitor-social-login';
import { from, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import {
  GOOGLE_IOS_CLIENT_ID,
  GOOGLE_WEB_CLIENT_ID,
} from '../dia-backend/secret';

export interface SocialUser {
  idToken: string;
  provider: 'google';
}

@Injectable({
  providedIn: 'root',
})
export class SocialAuthService {
  private initialized = false;
  private initializationPromise: Promise<void> | undefined;

  // No dependencies needed for this service
  constructor() {
    // Empty constructor
  }

  private async initSocialAuth(): Promise<void> {
    if (this.initialized) {
      return Promise.resolve();
    }

    if (!this.initializationPromise) {
      this.initializationPromise = SocialLogin.initialize({
        google: {
          iOSClientId: GOOGLE_IOS_CLIENT_ID,
          webClientId: GOOGLE_WEB_CLIENT_ID,
        },
      })
        .then(() => {
          this.initialized = true;
        })
        .catch((err: unknown) => {
          this.initializationPromise = undefined;
          throw err;
        });
    }

    return this.initializationPromise;
  }

  /**
   * Method to ensure the service is initialized
   */
  ensureInitialized$(): Observable<void> {
    return from(this.initSocialAuth());
  }

  signInWithGoogle$(): Observable<SocialUser> {
    return this.ensureInitialized$().pipe(
      mergeMap(() =>
        from(
          SocialLogin.login({
            provider: 'google',
            options: {
              scopes: ['email', 'profile'],
              forcePrompt: true,
              forceRefreshToken: true,
            },
          })
        )
      ),
      map(result => {
        const googleResult = result as {
          provider: 'google';
          result: GoogleLoginResponseOnline;
        };

        if (typeof googleResult.result.idToken !== 'string') {
          throw new Error(
            'Google authentication failed: Invalid or missing ID token'
          );
        }

        return {
          idToken: googleResult.result.idToken,
          provider: googleResult.provider,
        };
      })
    );
  }
}
