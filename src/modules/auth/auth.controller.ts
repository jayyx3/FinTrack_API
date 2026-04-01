import { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/prisma";
import { HttpError } from "../../utils/httpError";
import { verifyPassword } from "../../utils/hash";
import { signAccessToken } from "../../utils/jwt";
import { Role, UserStatus } from "../../constants/domain";

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new HttpError(401, "Invalid email or password.");
    }

    const isPasswordValid = await verifyPassword(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new HttpError(401, "Invalid email or password.");
    }

    if (user.status !== "ACTIVE") {
      throw new HttpError(403, "This user is inactive.");
    }

    const token = signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role as Role,
      status: user.status as UserStatus
    });

    res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new HttpError(401, "Authentication is required.");
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true
      }
    });

    if (!user) {
      throw new HttpError(404, "User not found.");
    }

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};
