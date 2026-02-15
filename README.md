# Secure Task Management App

This repository contains a **Secure Task Management Application** featuring a React frontend and a fully implemented NestJS backend with robust RBAC, Organization Scoping, and Audit Logging.

## Features

- **Frontend**: React + TypeScript + Vite
- **Backend**: NestJS + TypeORM + SQLite/PostgreSQL
- **Security**: 
  - JWT Authentication (Bcrypt hashing)
  - Hierarchical RBAC (`Owner` > `Admin` > `Viewer`)
  - Strict Organization Scoping
  - Audit Logging

## RBAC & Security Model

### User Roles

| Role   | Description | Hierarchy |
| :---   | :---        | :---      |
| **Owner** | Full access to their organization and all child organizations. | `Owner > Admin > Viewer` |
| **Admin** | Administrative access within their organization scope. | `Admin > Viewer` |
| **Viewer**| Read-only access, limited to tasks they created or exist in their org. | Lowest level |

### Organization Scoping

- **Owners/Admins** of a Parent Organization automatically inherit access to all Child Organizations.
- **Viewers** are restricted to their assigned organization.
- Cross-organization access is prohibited unless a strict parent-child relationship exists.

## Backend Architecture

The backend logic is structured as a modular NestJS application (`apps/api`):

- **`AuthModule`**: Handles JWT issuance, strategy validation, and guard implementation.
- **`TasksModule`**: Core business logic. Implements `TasksService` which enforces:
  - **Create**: Checks user organization.
  - **Read**: Scopes queries to `getAccessibleOrganizationIds(user)`.
  - **Update/Delete**: Verifies ownership and permission via `RbacService`.
- **`AuditModule`**: Tracks all critical actions. `GET /audit-log` is restricted to Admins/Owners.

## Setup & Usage

### 1. Install Dependencies
This project is a hybrid workspace. Install all dependencies (frontend + backend) at root:
```bash
npm install
```

### 2. Frontend Development
Run the React application via Vite:
```bash
npm run dev
```

### 3. Backend Development
The backend code is located in `apps/api` and `libs`.

**Compilation Verification**:
The environment is configured to support NestJS decorators and backend logic. You can verify the backend compiles successfully:
```bash
npx tsc --noEmit --skipLibCheck
```

**Note**: To run the backend server fully, you would typically wrap this in `nest start`, but currently it exists as a logic implementation within this repo structure.

## License

Private
