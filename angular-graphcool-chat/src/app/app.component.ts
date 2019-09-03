import { Component } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  private apiUrl = 'https://api.graph.cool/simple/v1/cjzsyt38x0xuy0103ba7jy6qe';

  constructor(
    private apollo: Apollo
  ){
    this.allUsers();
  }

  allUsers():void{
    this.apollo.query({
      query: gql`
      query {
        allUsers{
          id
          name
          email
        }
      }
      `
    }).subscribe(res => console.log(res))

   
  }

  createuser(): void {
    const body = {
      query: `
      mutation CreateNewUser($name: String!, $email: String!, $password: String!) {
        createUser(name: $name, email: $email, password: $password){
          id
          name
          email
        }
      }
      `,
      variables: {
        name: 'Black Panther', 
        email: 'panther@avangers.com', 
        password: '123456'
      }
    }

    
  }
}
