# Secure Task Management App

A premium, enterprise-grade **Secure Task Management Application** featuring a high-performance React frontend and a robust NestJS backend. This project demonstrates advanced security patterns, including Supabase JWT integration, hierarchical Role-Based Access Control (RBAC), and multi-tenant Organization Scoping.

## 🚀 Key Features

- **Enterprise Security**: 
  - **Supabase Auth Integration**: Secure token exchange using Supabase JWTs with ES256 signature validation via JWKS.
  - **Hierarchical RBAC**: Granular permission system (`Owner` > `Admin` > `Viewer`).
  - **Multi-Tenant Scoping**: Strict organization isolation with parent-child relationship support.
  - **Compliance Logging**: Automated audit tracking for all sensitive operations (Create, Update, Delete).
- **Modern Tech Stack**:
  - **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS v4.
  - **Backend**: NestJS + TypeORM + SQLite (Local Dev).
  - **Design**: Premium Glassmorphism UI with Lucide icons and Inter typography.

## 🔑 Test Credentials

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Owner** | `admin@test.com` | `password123` | Full system access & Audit logs |
| **Viewer** | `user@test.com` | `password123` | Read-only access to specific org |

## 🛠️ Setup & Installation

### 1. Prerequisites
Ensure you have a [Supabase](https://supabase.com) project created.

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Backend Configuration
SUPABASE_URL=https://your-project.supabase.co
PORT=3001
VITE_API_URL=http://localhost:3001/api
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Servers
```bash
# Start Frontend & Backend concurrently
npm run start:all
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **API (Swagger)**: [http://localhost:3001/api](http://localhost:3001/api)

## 🏗️ Architecture Detail

### Backend (NestJS)
- **`SupabaseJwtStrategy`**: Validates incoming JWTs against Supabase's public keys (`ES256`).
- **`RbacService`**: Centralized logic for role inheritance and permission checks.
- **`OrgScopeService`**: Handles parent/child organization visibility logic.
- **`AuditService`**: Intercepts actions to log user activity for audit trails.

### Frontend (React)
- **`AuthContext`**: Manages session state and profile synchronization with the backend.
- **`api.ts`**: Optimized Axios client with synchronous token injection and 401 interceptors.
- **`RoleProtectedRoute`**: Client-side navigation guards based on user hierarchical roles.

## 📂 Project Structure

```text
├── apps/api/src/app/       # Backend (NestJS)
│   ├── auth/               # Auth controllers & strategies
│   ├── audit/              # Audit logging modules
│   └── tasks/              # Task management controllers
├── libs/                   # Shared Business Logic
│   ├── auth/               # RBAC, Org Scoping, Roles guards
│   └── data/               # TypeORM Entities & Enums
├── src/                    # Frontend (React 19)
│   ├── core/               # API clients & Auth context
│   ├── features/           # Feature-based components (Tasks, Audit)
│   ├── layout/             # Sidebar & Dashboard wrappers
│   └── routes/             # Protected routing logic
├── scripts/                # Database migration & utility scripts
└── database.sqlite         # Local SQLite storage
```

## 📄 License
MIT

---
**Note**: This project is optimized for high-performance development using `tsx` and `dotenv` for seamless environment management.
