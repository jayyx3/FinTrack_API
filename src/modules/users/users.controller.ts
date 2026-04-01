import { NextFunction, Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { hashPassword } from "../../utils/hash";
import { HttpError } from "../../utils/httpError";

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password, role, status } = req.body as {
      name: string;
      email: string;
      password: string;
      role: "VIEWER" | "ANALYST" | "ADMIN";
      status?: "ACTIVE" | "INACTIVE";
    };

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new HttpError(409, "A user with this email already exists.");
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
        status: status ?? "ACTIVE"
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true
      }
    });

    res.status(201).json({ message: "User created successfully.", user });
  } catch (error) {
    next(error);
  }
};

export const listUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const skip = (page - 1) * limit;

    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const role = typeof req.query.role === "string" ? req.query.role : undefined;
    const status = typeof req.query.status === "string" ? req.query.status : undefined;

    const where = {
      ...(search
        ? {
            OR: [
              { name: { contains: search } },
              { email: { contains: search } }
            ]
          }
        : {}),
      ...(role ? { role: role as "VIEWER" | "ANALYST" | "ADMIN" } : {}),
      ...(status ? { status: status as "ACTIVE" | "INACTIVE" } : {})
    };

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true
        }
      })
    ]);

    res.status(200).json({
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = String(req.params.id);

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new HttpError(404, "User not found.");
    }

    const user = await prisma.user.update({
      where: { id },
      data: req.body,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.status(200).json({ message: "User updated successfully.", user });
  } catch (error) {
    next(error);
  }
};
