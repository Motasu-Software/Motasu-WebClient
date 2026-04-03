import { Injectable } from '@angular/core';
import { AuthStrategy } from './auth-strategy.interface';
import { Observable, map, tap } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';
import { UserService } from '../user/user.service';
import { User } from '../../model/user.model';

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
  constructor(private apollo: Apollo, private userService: UserService) {}

  login(login: string, password: string): Observable<any> {
    return this.apollo.mutate({
      mutation: LOGIN_MUTATION,
      variables: { email: login, password },
    }).pipe(
      map((result: any) => result.data.logIn),
      tap((response: any) => {
        if (response && response.token && response.user) {
          const user: User = {
            id: response.user.id,
            email: response.user.email,
            username: response.user.email.split('@')[0],
          };
          this.userService.setUser(user, response.token);
        }
      })
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