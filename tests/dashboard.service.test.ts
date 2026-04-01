import { describe, expect, it } from "vitest";
import { computeSummary, computeTrends, DashboardRecord } from "../src/modules/dashboard/dashboard.service";

const sample: DashboardRecord[] = [
  {
    id: "r1",
    amount: 5000,
    type: "INCOME",
    category: "Salary",
    date: new Date("2026-01-01T00:00:00.000Z"),
    notes: null
  },
  {
    id: "r2",
    amount: 1500,
    type: "EXPENSE",
    category: "Rent",
    date: new Date("2026-01-03T00:00:00.000Z"),
    notes: null
  },
  {
    id: "r3",
    amount: 500,
    type: "EXPENSE",
    category: "Food",
    date: new Date("2026-02-01T00:00:00.000Z"),
    notes: null
  },
  {
    id: "r4",
    amount: 700,
    type: "INCOME",
    category: "Freelance",
    date: new Date("2026-02-10T00:00:00.000Z"),
    notes: null
  }
];

describe("Dashboard summary service", () => {
  it("computes totals correctly", () => {
    const summary = computeSummary(sample);

    expect(summary.totalIncome).toBe(5700);
    expect(summary.totalExpenses).toBe(2000);
    expect(summary.netBalance).toBe(3700);
    expect(summary.categoryTotals.length).toBeGreaterThan(0);
  });

  it("builds monthly trends", () => {
    const trends = computeTrends(sample, "monthly");

    expect(trends).toEqual([
      { label: "2026-01", income: 5000, expense: 1500, net: 3500 },
      { label: "2026-02", income: 700, expense: 500, net: 200 }
    ]);
  });
});
