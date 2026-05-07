import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { Post, PostPage } from '../../model/post';

const POSTS_QUERY = gql`
  query Posts($page: Int!, $perPage: Int!) {
    posts(page: $page, perPage: $perPage) {
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

const CREATE_POST_MUTATION = gql`
  mutation CreatePost($title: String!, $description: String!, $circuit: String!, $car: String!, $lapTime: String!) {
    createPost(title: $title, description: $description, circuit: $circuit, car: $car, lapTime: $lapTime) {
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
  }
`;

const DELETE_POST_MUTATION = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id) {
      id
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private apollo: Apollo) {}

  getPosts(page = 1, perPage = 10): Observable<PostPage> {
    return this.apollo
      .query<{ posts: any }>({
        query: POSTS_QUERY,
        variables: { page, perPage },
        fetchPolicy: 'network-only',
      })
      .pipe(
        map((result) => {
          const payload = result.data?.posts;
          if (!payload) {
            throw new Error('Aucune donnée de post reçue.');
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

  createPost(title: string, description: string, circuit: string, car: string, lapTime: string): Observable<Post> {
    return this.apollo
      .mutate<{ createPost: any }>({
        mutation: CREATE_POST_MUTATION,
        variables: { title, description, circuit, car, lapTime },
      })
      .pipe(
        map((result) => {
          const post = result.data?.createPost;
          if (!post) {
            throw new Error('Impossible de créer le post.');
          }
          return {
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
          };
        }),
      );
  }

  deletePost(id: string): Observable<{ id: string }> {
    return this.apollo
      .mutate<{ deletePost: any }>({
        mutation: DELETE_POST_MUTATION,
        variables: { id },
      })
      .pipe(
        map((result) => {
          const deletedPost = result.data?.deletePost;
          if (!deletedPost) {
            throw new Error('Impossible de supprimer le post.');
          }
          return { id: deletedPost.id };
        }),
      );
  }
}
