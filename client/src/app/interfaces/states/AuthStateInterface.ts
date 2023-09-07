import { UserDetails } from '../UserDetails';

export interface AuthStateInterface {
  isLoading: boolean;
  isLoggedin: boolean;
  userInfo: UserDetails | null;
  accessToken: string | null | undefined;
  refreshToken: string | null | undefined;
  error: string | null;
}
