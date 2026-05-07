import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { User } from '../../model/user.model';
import { Post, PostPage } from '../../model/post';

const GET_USER_PROFILE = gql`
  query GetUserProfile($email: String!) {
    user(email: $email) {
      id
      email
      username
      createdAt
    }
  }
`;

const GET_USER_POSTS = gql`
  query GetUserPosts($authorEmail: String!, $page: Int!, $perPage: Int!) {
    posts(authorEmail: $authorEmail, page: $page, perPage: $perPage) {
      items {
        id
        title
        description
        circuit
        car
        lapTime
        author {
          id
          email
        }
        createdAt
        updatedAt
      }
      page
      perPage
      totalItems
      totalPages
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  constructor(private apollo: Apollo) {}

  getUserProfile(email: string): Observable<User> {
    return this.apollo
      .query<{ user: any }>({
        query: GET_USER_PROFILE,
        variables: { email },
        fetchPolicy: 'network-only',
      })
      .pipe(
        map((result) => {
          const user = result.data?.user;
          if (!user) {
            throw new Error('Utilisateur non trouvé.');
          }
          return {
            id: user.id,
            email: user.email,
            username: user.username || user.email.split('@')[0],
            createdAt: user.createdAt,
          };
        }),
      );
  }

  getUserPosts(email: string, page = 1, perPage = 10): Observable<PostPage> {
    return this.apollo
      .query<{ posts: any }>({
        query: GET_USER_POSTS,
        variables: { authorEmail: email, page, perPage },
        fetchPolicy: 'network-only',
      })
      .pipe(
        map((result) => {
          const payload = result.data?.posts;
          if (!payload) {
            throw new Error('Impossible de charger les posts.');
          }

          return {
            ...payload,
            items: payload.items.map((post: any) => ({
              id: post.id,
              title: post.title,
              description: post.description,
              circuit: post.circuit,
              car: post.car,
              lapTime: post.lapTime,
              authorId: post.author?.id ?? '',
              authorEmail: post.author?.email ?? '',
              createdAt: post.createdAt,
              updatedAt: post.updatedAt,
            })),
          };
        }),
      );
  }
}
