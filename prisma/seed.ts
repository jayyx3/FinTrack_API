import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/hash";
import { Role } from "../src/constants/domain";

const prisma = new PrismaClient();

const createUserIfNotExists = async (payload: {
  name: string;
  email: string;
  password: string;
  role: Role;
}) => {
  const existingUser = await prisma.user.findUnique({ where: { email: payload.email } });

  if (existingUser) {
    return existingUser;
  }

  const passwordHash = await hashPassword(payload.password);

  return prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      passwordHash,
      role: payload.role,
      status: "ACTIVE"
    }
  });
};

const main = async () => {
  const admin = await createUserIfNotExists({
    name: "System Admin",
    email: "admin@finance.local",
    password: "Admin@123",
    role: "ADMIN"
  });

  await createUserIfNotExists({
    name: "Data Analyst",
    email: "analyst@finance.local",
    password: "Analyst@123",
    role: "ANALYST"
  });

  await createUserIfNotExists({
    name: "Dashboard Viewer",
    email: "viewer@finance.local",
    password: "Viewer@123",
    role: "VIEWER"
  });

  const recordsCount = await prisma.record.count();

  if (recordsCount === 0) {
    await prisma.record.createMany({
      data: [
        {
          amount: 5000,
          type: "INCOME",
          category: "Salary",
          date: new Date("2026-01-01T09:00:00.000Z"),
          notes: "Monthly salary",
          createdById: admin.id
        },
        {
          amount: 1200,
          type: "EXPENSE",
          category: "Rent",
          date: new Date("2026-01-03T10:00:00.000Z"),
          notes: "Apartment rent",
          createdById: admin.id
        },
        {
          amount: 300,
          type: "EXPENSE",
          category: "Groceries",
          date: new Date("2026-01-05T12:00:00.000Z"),
          notes: "Weekly groceries",
          createdById: admin.id
        },
        {
          amount: 200,
          type: "INCOME",
          category: "Freelance",
          date: new Date("2026-01-08T16:00:00.000Z"),
          notes: "Side project payment",
          createdById: admin.id
        }
      ]
    });
  }

  console.log("Database seeded successfully.");
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
