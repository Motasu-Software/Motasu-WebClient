import { Injectable } from '@angular/core';
import { AuthStrategy } from './auth-strategy.interface';
import { Observable, map } from 'rxjs'; // Ajout de map
import { Apollo, gql } from 'apollo-angular'; // Utilise apollo-angular 

const LOGIN_MUTATION = gql`
  mutation LogIn($email: String!, $password: String!) {
    logIn(email: $email, password: $password) {
      token
      user {
        email
        id
      }
    }
  }`;

@Injectable({
  providedIn: 'root',
})
export class GraphQLAuthService implements AuthStrategy {
  constructor(private apollo: Apollo) {}

  login(login: string, password: string): Observable<any> {
    return this.apollo.mutate({
      mutation: LOGIN_MUTATION,
      variables: { login, password },
    }).pipe(
      map((result: any) => result.data.logIn)
  );
  }

  logout(): Observable<any> {
    throw new Error('Method not implemented.');
  }

  isAuthenticated(): Observable<boolean> {
    throw new Error('Method not implemented.');
  }

  register(email: string, password: string): Observable<any> {
    throw new Error('Method not implemented.');
  }
}