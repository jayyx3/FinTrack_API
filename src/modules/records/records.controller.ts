import { NextFunction, Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { HttpError } from "../../utils/httpError";

export const createRecord = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new HttpError(401, "Authentication is required.");
    }

    const { amount, type, category, date, notes } = req.body as {
      amount: number;
      type: "INCOME" | "EXPENSE";
      category: string;
      date: string;
      notes?: string;
    };

    const record = await prisma.record.create({
      data: {
        amount,
        type,
        category,
        date: new Date(date),
        notes: notes ?? null,
        createdById: req.user.userId
      }
    });

    res.status(201).json({ message: "Record created successfully.", record });
  } catch (error) {
    next(error);
  }
};

export const listRecords = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const skip = (page - 1) * limit;

    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const category = typeof req.query.category === "string" ? req.query.category : undefined;
    const type = typeof req.query.type === "string" ? req.query.type : undefined;
    const startDate = typeof req.query.startDate === "string" ? new Date(req.query.startDate) : undefined;
    const endDate = typeof req.query.endDate === "string" ? new Date(req.query.endDate) : undefined;

    const where = {
      deletedAt: null,
      ...(search
        ? {
            OR: [
              { category: { contains: search } },
              { notes: { contains: search } }
            ]
          }
        : {}),
      ...(category ? { category: { equals: category } } : {}),
      ...(type ? { type: type as "INCOME" | "EXPENSE" } : {}),
      ...(startDate || endDate
        ? {
            date: {
              ...(startDate ? { gte: startDate } : {}),
              ...(endDate ? { lte: endDate } : {})
            }
          }
        : {})
    };

    const [total, records] = await Promise.all([
      prisma.record.count({ where }),
      prisma.record.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: "desc" },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })
    ]);

    res.status(200).json({
      data: records,
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

export const getRecordById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = String(req.params.id);

    const record = await prisma.record.findFirst({
      where: {
        id,
        deletedAt: null
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!record) {
      throw new HttpError(404, "Record not found.");
    }

    res.status(200).json({ record });
  } catch (error) {
    next(error);
  }
};

export const updateRecord = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = String(req.params.id);

    const existingRecord = await prisma.record.findFirst({
      where: {
        id,
        deletedAt: null
      }
    });

    if (!existingRecord) {
      throw new HttpError(404, "Record not found.");
    }

    const payload = req.body as {
      amount?: number;
      type?: "INCOME" | "EXPENSE";
      category?: string;
      date?: string;
      notes?: string;
    };

    const record = await prisma.record.update({
      where: { id },
      data: {
        ...payload,
        ...(payload.date ? { date: new Date(payload.date) } : {})
      }
    });

    res.status(200).json({ message: "Record updated successfully.", record });
  } catch (error) {
    next(error);
  }
};

export const deleteRecord = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = String(req.params.id);

    const existingRecord = await prisma.record.findFirst({
      where: {
        id,
        deletedAt: null
      }
    });

    if (!existingRecord) {
      throw new HttpError(404, "Record not found.");
    }

    await prisma.record.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });

    res.status(200).json({ message: "Record deleted successfully." });
  } catch (error) {
    next(error);
  }
};
