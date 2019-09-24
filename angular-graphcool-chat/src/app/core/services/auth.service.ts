import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';

import { AUTHENTICATE_USER_MUTATION, SIGNUP_USER_MUTATION } from './auth.graphql';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private apollo: Apollo
  ) {
    this.signupUser({name:"Doctor Strange", email: 'strange@marvel.com', password: '123456'})
      .subscribe(res => console.log('signupUser', res));
  }

  signinUser(variables: {email: string, password: string}) {
    return this.apollo.mutate({
      mutation: AUTHENTICATE_USER_MUTATION,
      variables
    }).pipe(
      map(res => res.data)
    );
  }

  signupUser(variables: {name:string, email: string, password: string}) {
    return this.apollo.mutate({
      mutation:SIGNUP_USER_MUTATION,
      variables
    }).pipe(
      map(res => res.data)
    )
  }

}
