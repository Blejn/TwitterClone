import { Users } from './Users';
export interface Data {
  next: { page: number; limit: number };
  previous: { page: number; limtit: number };
  len: number;
  results: Users[];
}
