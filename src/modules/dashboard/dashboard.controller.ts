import { NextFunction, Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { computeSummary, computeTrends, DashboardRecord } from "./dashboard.service";

const buildDateFilter = (startDate?: string, endDate?: string) => {
  if (!startDate && !endDate) {
    return undefined;
  }

  return {
    ...(startDate ? { gte: new Date(startDate) } : {}),
    ...(endDate ? { lte: new Date(endDate) } : {})
  };
};

export const getSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const startDate = typeof req.query.startDate === "string" ? req.query.startDate : undefined;
    const endDate = typeof req.query.endDate === "string" ? req.query.endDate : undefined;
    const dateFilter = buildDateFilter(startDate, endDate);

    const records = await prisma.record.findMany({
      where: {
        deletedAt: null,
        ...(dateFilter ? { date: dateFilter } : {})
      },
      orderBy: { date: "desc" }
    });

    const typedRecords: DashboardRecord[] = records.map((record: any) => ({
      id: record.id,
      amount: record.amount,
      type: record.type as "INCOME" | "EXPENSE",
      category: record.category,
      date: record.date,
      notes: record.notes
    }));

    const summary = computeSummary(typedRecords);

    const recentActivity = records.slice(0, 5).map((record: any) => ({
      id: record.id,
      amount: record.amount,
      type: record.type,
      category: record.category,
      date: record.date,
      notes: record.notes
    }));

    res.status(200).json({
      ...summary,
      recentActivity
    });
  } catch (error) {
    next(error);
  }
};

export const getTrends = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const startDate = typeof req.query.startDate === "string" ? req.query.startDate : undefined;
    const endDate = typeof req.query.endDate === "string" ? req.query.endDate : undefined;
    const period = req.query.period === "weekly" ? "weekly" : "monthly";
    const dateFilter = buildDateFilter(startDate, endDate);

    const records = await prisma.record.findMany({
      where: {
        deletedAt: null,
        ...(dateFilter ? { date: dateFilter } : {})
      },
      select: {
        id: true,
        amount: true,
        type: true,
        category: true,
        date: true,
        notes: true
      }
    });

    const typedRecords = records.map((record: any) => ({
      ...record,
      type: record.type as "INCOME" | "EXPENSE"
    }));

    const trends = computeTrends(typedRecords, period);

    res.status(200).json({
      period,
      trends
    });
  } catch (error) {
    next(error);
  }
};
