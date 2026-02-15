# Secure Task Management App

This repository contains a Secure Task Management Application featuring a React frontend and a NestJS-structured backend logic layer with built-in Role-Based Access Control (RBAC) and Organization Scoping.

## Features

- **Frontend**: React + TypeScript + Vite
- **Backend Logic**: NestJS-style architecture (Services, Controllers, Guards)
- **Security**: 
  - Role-Based Access Control (RBAC)
  - Organization Scoping
  - Audit Logging

## RBAC & Security Architecture

The application implements a robust security model based on user roles and organization hierarchy.

### User Roles

| Role   | Description | Hierarchy |
| :---   | :---        | :---      |
| **Owner** | Full access to their organization and all child organizations. | `Owner > Admin > Viewer` |
| **Admin** | Administrative access within their organization scope. | `Admin > Viewer` |
| **Viewer**| Read-only access, limited to tasks they created or exist in their org. | Lowest level |

### Organization Scoping

- **Owners/Admins** of a Parent Organization automatically inherit access to all Child Organizations.
- **Viewers** are strictly scoped to their assigned organization.
- Cross-organization access is strictly prohibited unless a parent-child relationship exists.

### implemented Services (`apps/api` & `libs/auth`)

The backend logic is structured into the following components:

- **`RbacService`**: Centralized service for permission checks (`canCreateTask`, `canReadTask`, etc.). Supports role inheritance.
- **`OrgScopeService`**: Calculates the list of accessible organization IDs for a given user, traversing the organization tree.
- **`AuditLogService`**: Tracks critical actions (Create, Update, Delete) with user ID and resource metadata.
- **`TasksService`**: Implements business logic with enforced security checks using the above services.
- **`RolesGuard`**: A NestJS guard to enforce role requirements on API endpoints.

## Project Structure

```
.
├── apps
│   └── api
│       └── src
│           └── app
│               └── tasks     # Tasks module (Controller, Service)
├── libs
│   ├── auth
│   │   └── src
│   │       └── lib           # Auth module (RBAC, Audit, Guards)
│   └── data
│       └── src
│           └── lib           # Shared Interfaces & Enums
├── src                       # React Frontend Source
└── ...
```

## Setup & Usage

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Frontend (Vite)**
   ```bash
   npm run dev
   ```

3. **Backend Logic**
   The backend logic is located in `apps/api` and `libs`. While this repo is currently configured as a Vite SPA, the backend code is structured to be dropped into a NestJS runtime environment.

   *Note: Validating the backend code requires TypeScript configuration for NestJS decorators, which may not be fully enabled in this frontend-focused repo.*

## License

Private
