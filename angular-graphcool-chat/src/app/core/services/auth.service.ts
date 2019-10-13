import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';

import { AUTHENTICATE_USER_MUTATION, SIGNUP_USER_MUTATION } from './auth.graphql';
import { subscribe } from 'graphql';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _isAuthenticated = new ReplaySubject<boolean>(1);

  constructor(
    private apollo: Apollo
  ) {
    this.isAuthenticate.subscribe(is => console.log('authstate', is));
   }

  get isAuthenticate(): Observable<boolean>{
    return this._isAuthenticated.asObservable();
  }

  signinUser(variables: {email: string, password: string}) {
    return this.apollo.mutate({
      mutation: AUTHENTICATE_USER_MUTATION,
      variables
    }).pipe(
      map(res => res.data),
      tap(res => this.setAuthState(res != null)),
      catchError(error => {
        this.setAuthState(false);
        return throwError(error);
      })
    );
  }

  signupUser(variables: {name:string, email: string, password: string}) {
    return this.apollo.mutate({
      mutation:SIGNUP_USER_MUTATION,
      variables
    }).pipe(
      map(res => res.data),
      tap(res => this.setAuthState(res != null)),
      catchError(error => {
        this.setAuthState(false);
        return throwError(error);
      })
    )
  }

  private setAuthState(isAuthenticate: boolean): void {
    this._isAuthenticated.next(isAuthenticate);
  }
}
