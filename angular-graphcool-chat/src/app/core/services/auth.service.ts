import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, throwError, of } from 'rxjs';
import { map, tap, catchError, mergeMap } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';

import { AUTHENTICATE_USER_MUTATION, SIGNUP_USER_MUTATION, LoggedInUserQuery, LOGGED_IN_USER_QUERY } from './auth.graphql';
import { subscribe } from 'graphql';
import { StorageKeys } from 'src/app/storag-keys';
import { Router } from '@angular/router';

import { Base64 } from 'js-base64';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    authUser: User;
    redirectUrl: string;
    keepSigned: boolean;
    rememberMe: boolean;
    private _isAuthenticated = new ReplaySubject<boolean>(1);

    constructor(
        private apollo: Apollo,
        private router: Router
    ) {
        this.isAuthenticate.subscribe(is => console.log('authstate', is));
        this.init();
    }

    init(): void {
        this.keepSigned = JSON.parse(window.localStorage.getItem(StorageKeys.KEEP_SIGNED));
        this.rememberMe = JSON.parse(window.localStorage.getItem(StorageKeys.REMEMBER_ME));
    }

    toggleRememberMe(): void {
        this.rememberMe = !this.rememberMe;
        window.localStorage.setItem(StorageKeys.REMEMBER_ME, this.rememberMe.toString());
        if (!this.rememberMe) {
            window.localStorage.removeItem(StorageKeys.USER_EMAIL);
            window.localStorage.removeItem(StorageKeys.USER_PASSWORD);
        }
    }

    setRememberMe(user: { email: string, password: string }): void {
        if (this.rememberMe) {
            window.localStorage.setItem(StorageKeys.USER_EMAIL, Base64.encode(user.email));
            window.localStorage.setItem(StorageKeys.USER_PASSWORD, Base64.encode(user.password));
        }
    }

    getRememberMe(): { email: string, password: string } {
        if (!this.rememberMe) {
            return null
        }
        return {
            email: Base64.decode(window.localStorage.getItem(StorageKeys.USER_EMAIL)),
            password: Base64.decode(window.localStorage.getItem(StorageKeys.USER_PASSWORD))
        }
    }

    get isAuthenticate(): Observable<boolean> {
        return this._isAuthenticated.asObservable();
    }

    isToken(res) {
        return res.authenticateUser.token
    }
    isId(res){
        return res.authenticateUser.id
    }

    signinUser(variables: { email: string, password: string }): Observable<{}> {
        return this.apollo.mutate({
            mutation: AUTHENTICATE_USER_MUTATION,
            variables
        }).pipe(
            map(res => res.data),
            tap(res => this.setAuthState({id: this.isId(res), token: this.isToken(res), isAuthenticate: res != null })),
            catchError(error => {
                this.setAuthState({id:null, token: null, isAuthenticate: false });
                return throwError(error);
            })
        );
    }

    signupUser(variables: { name: string, email: string, password: string }) {
        return this.apollo.mutate({
            mutation: SIGNUP_USER_MUTATION,
            variables
        }).pipe(
            map(res => res.data),
            tap(res => this.setAuthState({id: this.isId(res),  token: this.isToken(res), isAuthenticate: res != null })),
            catchError(error => {
                this.setAuthState({id:null, token: null, isAuthenticate: false });
                return throwError(error);
            })
        )
    }

    toggleKeepSigned(): void {
        this.keepSigned = !this.keepSigned;
        window.localStorage.setItem(StorageKeys.KEEP_SIGNED, this.keepSigned.toString());
    }

    logout(): void {
        window.localStorage.removeItem(StorageKeys.AUTH_TOKEN);
        window.localStorage.removeItem(StorageKeys.KEEP_SIGNED);
        this.keepSigned = false;
        this._isAuthenticated.next(false);
        this.router.navigate(['/login']);
        this.apollo.getClient().resetStore;
    }

    autoLogin(): Observable<void> {
        if (!this.keepSigned) {
            this._isAuthenticated.next(false);
            window.localStorage.removeItem(StorageKeys.AUTH_TOKEN);
            return of();
        }

        return this.validateToken()
            .pipe(
                tap(authData => {
                    const token = window.localStorage.getItem(StorageKeys.AUTH_TOKEN);
                    this.setAuthState({id: authData.id, token, isAuthenticate: authData.isAuthenticate });
                }),
                mergeMap(res => of()),
                catchError(error => {
                    this.setAuthState({id: null, token: null, isAuthenticate: false })
                    return throwError(error);
                })
            )
    }

    private validateToken(): Observable<{ id: string, isAuthenticate: boolean }> {
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

    private setAuthState(authData: {id:string, token: string, isAuthenticate: boolean }): void {
        if (authData.isAuthenticate) {
            window.localStorage.setItem(StorageKeys.AUTH_TOKEN, authData.token);
            this.authUser = { id: authData.id};
        }
        this._isAuthenticated.next(authData.isAuthenticate);
    }
}
