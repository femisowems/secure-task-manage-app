# Secure Task Management App (Frontend)

A premium, enterprise-grade **Secure Task Management Application** featuring a high-performance React frontend. This project demonstrates advanced security patterns, including Supabase JWT integration, hierarchical Role-Based Access Control (RBAC), and multi-tenant Organization Scoping.

**Note**: This repository contains the Frontend application only. The backend is deployed independently.

## 🚀 Key Features

- **Enterprise Security**: 
  - **Supabase Auth Integration**: Secure token exchange using Supabase JWTs with ES256 signature validation.
  - **Hierarchical RBAC**: Granular permission system (`Owner` > `Admin` > `Viewer`).
  - **Multi-Tenant Scoping**: Strict organization isolation.
- **Modern Tech Stack**:
  - **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS v4.
  - **Backend API**: Connected to external NestJS API.
  - **Design**: Premium Glassmorphism UI with Lucide icons and Inter typography.

## 🔑 Test Credentials

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Owner** | `admin@test.com` | `password123` | Full system access & Audit logs |
| **Viewer** | `user@test.com` | `password123` | Read-only access to specific org |

## 🛠️ Setup & Installation

### 1. Prerequisites
- Node.js (Latest LTS recommended)
- Supabase Project

### 2. Environment Configuration
Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# API Configuration
VITE_API_URL=https://secure-task-manage-backend-api.onrender.com/api
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)

## 🏗️ Architecture Detail

### Frontend (React)
- **`AuthContext`**: Manages session state and profile synchronization with the backend.
- **`api.ts`**: Optimized Axios client with synchronous token injection and 401 interceptors.
- **`RoleProtectedRoute`**: Client-side navigation guards based on user hierarchical roles.

## 📂 Project Structure

```text
├── src/                    # Frontend (React 19)
│   ├── core/               # API clients & Auth context
│   ├── features/           # Feature-based components (Tasks, Audit)
│   ├── layout/             # Sidebar & Dashboard wrappers
│   └── routes/             # Protected routing logic
├── .env                    # Environment variables
├── package.json            # Dependencies and scripts
└── vite.config.ts          # Vite configuration
```

## 📄 License
MIT
