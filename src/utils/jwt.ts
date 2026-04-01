import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AuthUser } from "../types/auth";
import { Role, UserStatus } from "../constants/domain";

export const signAccessToken = (payload: AuthUser): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"]
  });
};

export const verifyAccessToken = (token: string): AuthUser => {
  const decoded = jwt.verify(token, env.JWT_SECRET) as {
    userId: string;
    email: string;
    role: Role;
    status: UserStatus;
  };

  return {
    userId: decoded.userId,
    email: decoded.email,
    role: decoded.role,
    status: decoded.status
  };
};
