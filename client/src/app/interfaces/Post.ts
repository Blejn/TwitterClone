export interface Post {
  username: string;
  location: string;
  description: string;
  photo: string;
  userId: string;
  comments?: string[];
  reactions?: string[];
  shares?: string[];
  views?: string[];
}
