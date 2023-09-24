export interface UserDetails {
  id: string;
  exp: number;
  iat: number;
  email: string;
  username: string | undefined;
  profile_picture: string;
}
