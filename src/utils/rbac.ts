import { Role } from "../constants/domain";

export type Resource = "users" | "records" | "dashboard";
export type Action = "create" | "read" | "update" | "delete" | "manage";

const permissionMatrix: Record<Role, Partial<Record<Resource, Action[]>>> = {
  VIEWER: {
    dashboard: ["read"]
  },
  ANALYST: {
    dashboard: ["read"],
    records: ["read"]
  },
  ADMIN: {
    users: ["manage", "create", "read", "update", "delete"],
    records: ["create", "read", "update", "delete"],
    dashboard: ["read"]
  }
};

export const canAccess = (role: Role, resource: Resource, action: Action): boolean => {
  const allowedActions = permissionMatrix[role]?.[resource] ?? [];
  return allowedActions.includes(action) || allowedActions.includes("manage");
};
