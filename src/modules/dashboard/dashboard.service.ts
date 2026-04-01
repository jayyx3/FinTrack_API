import { RecordType } from "../../constants/domain";

export interface DashboardRecord {
  id: string;
  amount: number;
  type: RecordType;
  category: string;
  date: Date;
  notes: string | null;
}

export interface CategoryTotal {
  category: string;
  income: number;
  expense: number;
  net: number;
}

export interface TrendPoint {
  label: string;
  income: number;
  expense: number;
  net: number;
}

export const computeSummary = (records: DashboardRecord[]) => {
  let totalIncome = 0;
  let totalExpenses = 0;

  const categories = new Map<string, { income: number; expense: number }>();

  for (const record of records) {
    if (record.type === "INCOME") {
      totalIncome += record.amount;
    } else {
      totalExpenses += record.amount;
    }

    const current = categories.get(record.category) ?? { income: 0, expense: 0 };

    if (record.type === "INCOME") {
      current.income += record.amount;
    } else {
      current.expense += record.amount;
    }

    categories.set(record.category, current);
  }

  const categoryTotals: CategoryTotal[] = Array.from(categories.entries())
    .map(([category, values]) => ({
      category,
      income: Number(values.income.toFixed(2)),
      expense: Number(values.expense.toFixed(2)),
      net: Number((values.income - values.expense).toFixed(2))
    }))
    .sort((a, b) => Math.abs(b.net) - Math.abs(a.net));

  return {
    totalIncome: Number(totalIncome.toFixed(2)),
    totalExpenses: Number(totalExpenses.toFixed(2)),
    netBalance: Number((totalIncome - totalExpenses).toFixed(2)),
    categoryTotals
  };
};

const getWeekLabel = (inputDate: Date): string => {
  const date = new Date(Date.UTC(inputDate.getUTCFullYear(), inputDate.getUTCMonth(), inputDate.getUTCDate()));
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
};

export const computeTrends = (records: DashboardRecord[], period: "monthly" | "weekly" = "monthly") => {
  const trendMap = new Map<string, { income: number; expense: number }>();

  for (const record of records) {
    const label =
      period === "monthly"
        ? `${record.date.getUTCFullYear()}-${String(record.date.getUTCMonth() + 1).padStart(2, "0")}`
        : getWeekLabel(record.date);

    const current = trendMap.get(label) ?? { income: 0, expense: 0 };

    if (record.type === "INCOME") {
      current.income += record.amount;
    } else {
      current.expense += record.amount;
    }

    trendMap.set(label, current);
  }

  return Array.from(trendMap.entries())
    .map(([label, values]) => ({
      label,
      income: Number(values.income.toFixed(2)),
      expense: Number(values.expense.toFixed(2)),
      net: Number((values.income - values.expense).toFixed(2))
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
};
