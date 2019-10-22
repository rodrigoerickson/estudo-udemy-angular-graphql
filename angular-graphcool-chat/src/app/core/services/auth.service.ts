import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';

import { AUTHENTICATE_USER_MUTATION, SIGNUP_USER_MUTATION, LoggedInUserQuery, LOGGED_IN_USER_QUERY } from './auth.graphql';
import { subscribe } from 'graphql';
import { StorageKeys } from 'src/app/storag-keys';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  redirectUrl: string;
  keepSigned: boolean;
  private _isAuthenticated = new ReplaySubject<boolean>(1);

  constructor(
    private apollo: Apollo
  )
  {
    this.isAuthenticate.subscribe(is => console.log('authstate', is));
    this.init();
    this.validateToken()
        .subscribe(
            res => {
                console.log('Res:' ,res);
            },
            error => {
                console.log('error:' ,error);
            }
        )
  }

  init(): void {
    this.keepSigned = JSON.parse(window.localStorage.getItem(StorageKeys.KEEP_SIGNED));
  }

  get isAuthenticate(): Observable<boolean>{
    return this._isAuthenticated.asObservable();
  }

  isToken(res){
    return res.authenticateUser.token
  }

  signinUser(variables: {email: string, password: string}):Observable<{}> {
    return this.apollo.mutate({
      mutation: AUTHENTICATE_USER_MUTATION,
      variables
    }).pipe(
      map(res => res.data),
      tap(res => this.setAuthState({token: this.isToken(res), isAuthenticate: res != null})),
      catchError(error => {
        this.setAuthState({token: null, isAuthenticate: false});
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
      tap(res => this.setAuthState({token: this.isToken(res), isAuthenticate: res != null})),
      catchError(error => {
        this.setAuthState({token: null, isAuthenticate: false});
        return throwError(error);
      })
    )
  }

  toggleKeepSigned(): void {
    this.keepSigned = !this.keepSigned;
    window.localStorage.setItem(StorageKeys.KEEP_SIGNED, this.keepSigned.toString());
  }

  private validateToken(): Observable<{id:string, isAuthenticate: boolean}>{
    return this.apollo.query<LoggedInUserQuery>({
        query: LOGGED_IN_USER_QUERY
    }).pipe(
        map(res => {
            const user = res.data.loggedInUser;
            return {
                id: (user && user.id), 
                isAuthenticate: user !== null
            }
        })
    );
  }

  private setAuthState(authData: {token:string, isAuthenticate: boolean}): void {
    if (authData.isAuthenticate){
      window.localStorage.setItem(StorageKeys.AUTH_TOKEN, authData.token);
    }
    this._isAuthenticated.next(authData.isAuthenticate);
  }
}
