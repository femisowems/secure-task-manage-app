# Secure Task Management App

This repository contains a **Secure Task Management Application** featuring a React frontend and a fully implemented NestJS backend with robust RBAC, Organization Scoping, and Audit Logging.

## Features

- **Frontend**: React + TypeScript + Vite
- **Backend**: NestJS + TypeORM + SQLite/PostgreSQL
- **Styling**: Tailwind CSS v4.0 (CSS-first engine)
- **Security**: 
  - JWT Authentication (Bcrypt hashing)
  - Hierarchical RBAC (`Owner` > `Admin` > `Viewer`)
  - Strict Organization Scoping
  - Audit Logging
  - Metadata-stable runtime (explicit `@Inject` decorators)

## Test Credentials

Use these credentials to test the RBAC and organization scoping features:

| User Type | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@test.com` | `password123` | **Owner** (Full Scope) |
| **User** | `user@test.com` | `password123` | **Viewer** (Scoped to Org) |

## Setup & Usage

### 1. Install Dependencies
This project is a hybrid workspace. Install all dependencies (frontend + backend) at root:
```bash
npm install
```

### 2. Run the Application
Start both the Frontend (Vite) and Backend (NestJS/tsx) concurrently:
```bash
npm run start:all
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **API**: [http://localhost:3001/api](http://localhost:3001/api)

### 3. Build for Production
```bash
npm run build
```

## Backend Architecture

The backend logic is modularized for security and scalability:

- **`AuthModule`**: Shared services/guards. Re-organized to handle metadata limitations of development runtimes like `tsx`.
- **`TasksModule`**: Enforces organization scoping and dynamic RBAC checks for all task operations.
- **`AuditModule`**: Centralized logging for compliance across all user actions.

## Documentation Artifacts
Internal documentation and implementation details can be found in the `.gemini/antigravity/brain` directory.

---
**Note**: This environment uses `tsx` for high-performance backend execution without a separate build step during development. Explicit `@Inject()` decorators are used to ensure dependency injection stability.
