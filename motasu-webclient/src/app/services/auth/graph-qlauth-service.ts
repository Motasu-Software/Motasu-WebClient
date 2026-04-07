import { Injectable } from '@angular/core';
import { AuthStrategy } from './auth-strategy.interface';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';
import { UserService } from '../user/user.service';
import { User } from '../../model/user.model';

const LOGIN_MUTATION = gql`
  mutation LogIn($email: String!, $password: String!) {
    logIn(email: $email, password: $password) {
      user {
        email
        id
      }
      # Tu peux retirer 'token' de la query si ton backend gère 100% le cookie,
      # ou le garder si tu en as besoin pour autre chose.
    }
  }`;

const GET_ME = gql`
  query GetMe {
    me {
      id
      email
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GraphQLAuthService implements AuthStrategy {
  constructor(
    private apollo: Apollo, 
    private userService: UserService
  ) {}
  
  verifyToken(): Observable<User> {
    return this.apollo.query<{ me: any }>({
      query: GET_ME,
      fetchPolicy: 'network-only'
    }).pipe(
      map(response => {
        if (response.data && response.data.me) {
          return {
            id: response.data.me.id,
            email: response.data.me.email,
            username: response.data.me.email.split('@')[0],
          } as User;
        }
        throw new Error('User not found');
      }),
      catchError((error) => {
        // L'interceptor s'occupe normalement des redirections
        return throwError(() => error);
      })
    );
  }

  login(email: string, password: string): Observable<User> {
    return this.apollo.mutate({
      mutation: LOGIN_MUTATION,
      variables: { email, password },
    }).pipe(
      map((result: any) => {
        const response = result.data.logIn;
        if (response && response.user) {
          const user: User = {
            id: response.user.id,
            email: response.user.email,
            username: response.user.email.split('@')[0],
          };
          
          // Le cookie est déjà défini par le navigateur à cette étape
          this.userService.setUser(user);
          return user;
        }
        throw new Error('Invalid response from server');
      })
    );
  }

  logout(): Observable<any> {
    // Important : Ton backend doit avoir une mutation logout qui renvoie
    // un header Set-Cookie pour effacer le cookie actuel (ex: max-age=0)
    throw new Error('Method not implemented.');
  }

  register(email: string, password: string): Observable<any> {
    throw new Error('Method not implemented.');
  }
}