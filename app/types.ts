export interface Post {
  id: number;
  createdAt: number;
  caption: string;
  image: string;
}

export interface User {
  id: number;
  name: string;
  image: string;
  title: string;
  mail: string;
}
