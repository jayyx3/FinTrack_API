# Finance Data Processing and Access Control Backend

Submission project for a backend assignment focused on API design, role-based access control, data modeling, validation, and dashboard-style finance analytics.

## Project Summary

This service provides:

- user and role management
- finance record CRUD
- filtering, pagination, and search
- dashboard summary and trend endpoints
- JWT authentication and RBAC authorization
- input validation and centralized error handling
- SQLite persistence using Prisma

## Technology Stack

- Node.js
- Express
- TypeScript
- Prisma ORM
- SQLite
- JWT
- Zod
- Vitest
- Swagger UI

## Feature Coverage

All assignment core requirements are implemented:

- User and Role Management
- Financial Records CRUD
- Record Filtering (date, category, type)
- Dashboard Summary APIs (totals, trends)
- Role Based Access Control
- Input Validation and Error Handling
- Data Persistence (Database)

Additional enhancements included:

- JWT login and protected routes
- pagination and search in listing endpoints
- soft delete for records
- rate limiting
- API documentation via Swagger
- seeded demo users and sample records
- focused tests for RBAC and dashboard computations

## API Base URLs

- Root: http://localhost:4000
- Health: http://localhost:4000/health
- Swagger Docs: http://localhost:4000/docs

## Local Setup

Prerequisites:

- Node.js 18+ (recommended: 20+)
- npm

Steps:

1. Install packages

```bash
npm install
```

2. Prepare environment file

```bash
copy .env.example .env
```

3. Run migration and seed

```bash
npm run db:setup
```

4. Start development server

```bash
npm run dev
```

## Environment Variables

Defined in .env.example:

- NODE_ENV
- PORT
- DATABASE_URL
- JWT_SECRET
- JWT_EXPIRES_IN

## Demo Users (Seeded)

- Admin
  - email: admin@finance.local
  - password: Admin@123
- Analyst
  - email: analyst@finance.local
  - password: Analyst@123
- Viewer
  - email: viewer@finance.local
  - password: Viewer@123

## Role Permissions

- VIEWER
  - can read dashboard endpoints only
- ANALYST
  - can read records and dashboard endpoints
- ADMIN
  - full access to users and records, plus dashboard

## Main Endpoints

Auth:

- POST /api/auth/login
- GET /api/auth/me

Users (admin only):

- POST /api/users
- GET /api/users
- PATCH /api/users/:id

Records:

- POST /api/records (admin)
- GET /api/records (analyst/admin)
- GET /api/records/:id (analyst/admin)
- PATCH /api/records/:id (admin)
- DELETE /api/records/:id (admin, soft delete)

Dashboard:

- GET /api/dashboard/summary (viewer/analyst/admin)
- GET /api/dashboard/trends?period=monthly|weekly (viewer/analyst/admin)

## Validation and Error Handling

- Zod schemas validate body, params, and query inputs.
- Business errors return clear status codes and JSON responses.
- Unknown routes return 404.
- Global error middleware standardizes API error output.

## Scripts

- npm run dev: start dev server with watch mode
- npm run build: compile TypeScript into dist
- npm run start: run compiled server
- npm run test: run test suite
- npm run test:watch: run tests in watch mode
- npm run prisma:generate: generate Prisma client
- npm run prisma:migrate: run migration
- npm run prisma:seed: seed demo data
- npm run db:setup: migrate + seed

## Tests

Run:

```bash
npm run test
```

Included tests cover:

- RBAC permission behavior
- dashboard summary and trend calculations

## Architecture Notes and Trade-offs

- SQLite was chosen for quick setup and predictable local evaluation.
- Prisma was chosen for schema clarity and maintainable data access.
- RBAC is centralized via middleware and permission matrix.
- Soft delete is used for records to avoid immediate hard data loss.
- The project is backend-only by assignment design; Swagger acts as the testing interface.

## Deployment Note

This project can be deployed as-is. If using SQLite in production/demo hosting, choose a platform with persistent disk/volume support so data is not lost on restart/redeploy.

AUTHOR: Jay Joshi

Email: joshijayy421@gmail.com
LinkedIn: https://www.linkedin.com/in/jay-joshi-75b75124b/
GitHub: https://github.com/jayyx3
Portfolio: https://jay-portfolio-ten-tawny.vercel.app/
