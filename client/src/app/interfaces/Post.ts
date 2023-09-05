export interface Post {
  id: string;
  username: string;
  location: string;
  description: string;
  photo: string;
  userId: string;
  comments: any;
  reactions: string[];
  shares?: string[];
  views?: string[];
  date: string;
}
