export interface Post {
  id: string;
  title: string;
  description: string;
  circuit: string;
  car: string;
  lapTime: string;
  authorId: string;
  authorEmail: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostPage {
  items: Post[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}
