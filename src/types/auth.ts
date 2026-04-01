import { Role, UserStatus } from "../constants/domain";

export interface AuthUser {
  userId: string;
  email: string;
  role: Role;
  status: UserStatus;
}
