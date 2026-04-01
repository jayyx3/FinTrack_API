import { env } from "../config/env";

const serverUrl = `http://localhost:${env.PORT}`;

export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Finance Data Processing and Access Control API",
    version: "1.0.0",
    description:
      "Backend assignment API with JWT auth, RBAC, financial records CRUD, filtering, dashboard summaries, validation, and SQLite persistence."
  },
  servers: [{ url: serverUrl }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 6 }
        }
      },
      CreateUserRequest: {
        type: "object",
        required: ["name", "email", "password", "role"],
        properties: {
          name: { type: "string" },
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 6 },
          role: { type: "string", enum: ["VIEWER", "ANALYST", "ADMIN"] },
          status: { type: "string", enum: ["ACTIVE", "INACTIVE"] }
        }
      },
      CreateRecordRequest: {
        type: "object",
        required: ["amount", "type", "category", "date"],
        properties: {
          amount: { type: "number", minimum: 0.01 },
          type: { type: "string", enum: ["INCOME", "EXPENSE"] },
          category: { type: "string" },
          date: { type: "string", format: "date-time" },
          notes: { type: "string" }
        }
      }
    }
  },
  paths: {
    "/health": {
      get: {
        summary: "Health check",
        responses: {
          "200": { description: "Server healthy" }
        }
      }
    },
    "/api/auth/login": {
      post: {
        summary: "Login and receive JWT token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" }
            }
          }
        },
        responses: {
          "200": { description: "Login successful" },
          "401": { description: "Invalid credentials" }
        }
      }
    },
    "/api/auth/me": {
      get: {
        summary: "Get authenticated user profile",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Current user" },
          "401": { description: "Unauthorized" }
        }
      }
    },
    "/api/users": {
      get: {
        summary: "List users (admin)",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Users list" },
          "403": { description: "Forbidden" }
        }
      },
      post: {
        summary: "Create user (admin)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateUserRequest" }
            }
          }
        },
        responses: {
          "201": { description: "User created" },
          "403": { description: "Forbidden" }
        }
      }
    },
    "/api/users/{id}": {
      patch: {
        summary: "Update user role/status/name (admin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          "200": { description: "User updated" },
          "404": { description: "User not found" }
        }
      }
    },
    "/api/records": {
      get: {
        summary: "List records with pagination/filtering/search (analyst/admin)",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Records list" },
          "403": { description: "Forbidden" }
        }
      },
      post: {
        summary: "Create financial record (admin)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateRecordRequest" }
            }
          }
        },
        responses: {
          "201": { description: "Record created" },
          "403": { description: "Forbidden" }
        }
      }
    },
    "/api/records/{id}": {
      get: {
        summary: "Get one record (analyst/admin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          "200": { description: "Record found" },
          "404": { description: "Record not found" }
        }
      },
      patch: {
        summary: "Update record (admin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          "200": { description: "Record updated" },
          "404": { description: "Record not found" }
        }
      },
      delete: {
        summary: "Soft delete record (admin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          "200": { description: "Record deleted" },
          "404": { description: "Record not found" }
        }
      }
    },
    "/api/dashboard/summary": {
      get: {
        summary: "Get totals, category totals, and recent activity",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Summary payload" },
          "403": { description: "Forbidden" }
        }
      }
    },
    "/api/dashboard/trends": {
      get: {
        summary: "Get monthly or weekly trends",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Trends payload" },
          "403": { description: "Forbidden" }
        }
      }
    }
  }
};
