export const ROLES = ["VIEWER", "ANALYST", "ADMIN"] as const;
export const USER_STATUSES = ["ACTIVE", "INACTIVE"] as const;
export const RECORD_TYPES = ["INCOME", "EXPENSE"] as const;

export type Role = (typeof ROLES)[number];
export type UserStatus = (typeof USER_STATUSES)[number];
export type RecordType = (typeof RECORD_TYPES)[number];
