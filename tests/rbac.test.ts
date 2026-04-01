import { describe, expect, it } from "vitest";
import { canAccess } from "../src/utils/rbac";

describe("RBAC permission matrix", () => {
  it("allows viewer to read dashboard only", () => {
    expect(canAccess("VIEWER", "dashboard", "read")).toBe(true);
    expect(canAccess("VIEWER", "records", "read")).toBe(false);
    expect(canAccess("VIEWER", "users", "manage")).toBe(false);
  });

  it("allows analyst to read records and dashboard", () => {
    expect(canAccess("ANALYST", "dashboard", "read")).toBe(true);
    expect(canAccess("ANALYST", "records", "read")).toBe(true);
    expect(canAccess("ANALYST", "records", "create")).toBe(false);
  });

  it("allows admin to manage users and records", () => {
    expect(canAccess("ADMIN", "users", "manage")).toBe(true);
    expect(canAccess("ADMIN", "records", "delete")).toBe(true);
  });
});
