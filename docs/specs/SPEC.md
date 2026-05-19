# SPEC.md

## 1. TECHNOLOGY STACK

- **Backend**
  - Python 3.11
  - FastAPI 0.110.0
  - Pydantic 2.6.4
  - SQLAlchemy 2.0.29
  - PostgreSQL 15
  - passlib 1.7.4 (for password hashing)
  - python-jose 3.3.0 (for JWT)
  - uvicorn 0.29.0

- **Frontend**
  - React 18.2.0
  - TypeScript 5.4.2
  - Vite 5.2.0
  - Axios 1.6.7
  - React Router DOM 6.22.3
  - Zustand 4.4.2 (for state management)
  - Material UI 5.15.0

- **Infrastructure**
  - Docker 26.0.0
  - Docker Compose 2.27.0

## 2. DATA CONTRACTS

### Python (Pydantic Models)

```python
# backend/auth-service/schemas.py

from pydantic import BaseModel, EmailStr, Field

class UserRegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)

class UserRegisterResponse(BaseModel):
    id: int
    email: EmailStr

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserLoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserForgotPasswordRequest(BaseModel):
    email: EmailStr

class UserForgotPasswordResponse(BaseModel):
    message: str

class UserResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(min_length=8, max_length=128)

class UserResetPasswordResponse(BaseModel):
    message: str

class UserProfile(BaseModel):
    id: int
    email: EmailStr
```

### TypeScript (Frontend Interfaces)

```typescript
// frontend/src/types/auth.ts

export interface UserRegisterRequest {
  email: string;
  password: string;
}

export interface UserRegisterResponse {
  id: number;
  email: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserLoginResponse {
  access_token: string;
  token_type: "bearer";
}

export interface UserForgotPasswordRequest {
  email: string;
}

export interface UserForgotPasswordResponse {
  message: string;
}

export interface UserResetPasswordRequest {
  token: string;
  new_password: string;
}

export interface UserResetPasswordResponse {
  message: string;
}

export interface UserProfile {
  id: number;
  email: string;
}
```

## 3. API ENDPOINTS

### POST /api/auth/register

- **Request Body:** `UserRegisterRequest`
- **Response:** `UserRegisterResponse`
- **Status Codes:** 201 (Created), 400 (Validation Error), 409 (Email Already Registered)

### POST /api/auth/login

- **Request Body:** `UserLoginRequest`
- **Response:** `UserLoginResponse`
- **Status Codes:** 200 (OK), 401 (Invalid Credentials)

### POST /api/auth/forgot-password

- **Request Body:** `UserForgotPasswordRequest`
- **Response:** `UserForgotPasswordResponse`
- **Status Codes:** 200 (Always returns success message for security)

### POST /api/auth/reset-password

- **Request Body:** `UserResetPasswordRequest`
- **Response:** `UserResetPasswordResponse`
- **Status Codes:** 200 (OK), 400 (Invalid Token or Password)

### GET /api/auth/me

- **Headers:** `Authorization: Bearer <access_token>`
- **Response:** `UserProfile`
- **Status Codes:** 200 (OK), 401 (Unauthorized)

## 4. FILE STRUCTURE

### PORT TABLE

| Service        | Listening Port | Path                      |
|----------------|---------------|---------------------------|
| auth-service   | 23001         | backend/auth-service/     |

### FILE TREE

```
.
├── docker-compose.yml                # Multi-service orchestration
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore rules
├── README.md                        # Project documentation
├── run.sh                           # Root startup script
├── backend/
│   ├── shared/                      # Shared modules (future-proofed)
│   │   ├── __init__.py              # Shared package init
│   │   └── security.py              # Password hashing/JWT helpers
│   └── auth-service/
│       ├── Dockerfile               # Auth service container build
│       ├── main.py                  # FastAPI entrypoint
│       ├── models.py                # SQLAlchemy models
│       ├── schemas.py               # Pydantic schemas
│       ├── crud.py                  # DB access logic
│       ├── deps.py                  # Dependency overrides
│       ├── email_utils.py           # Password reset email logic
│       ├── database.py              # DB session/engine
│       ├── config.py                # Settings loader
│       ├── requirements.txt         # Python dependencies
│       └── __init__.py              # Package init
├── frontend/
│   ├── Dockerfile                   # Frontend container build
│   ├── vite.config.ts               # Vite config
│   ├── tsconfig.json                # TypeScript config
│   ├── package.json                 # NPM dependencies
│   ├── public/
│   │   └── index.html               # HTML entrypoint
│   └── src/
│       ├── main.tsx                 # React entrypoint
│       ├── App.tsx                  # Root component
│       ├── api/
│       │   └── auth.ts              # Axios API functions
│       ├── types/
│       │   └── auth.ts              # TypeScript interfaces
│       ├── hooks/
│       │   └── useAuth.ts           # Auth state hook (Zustand)
│       ├── components/
│       │   ├── RegisterForm.tsx     # Registration form
│       │   ├── LoginForm.tsx        # Login form
│       │   ├── ForgotPasswordForm.tsx # Forgot password form
│       │   ├── ResetPasswordForm.tsx  # Reset password form
│       │   └── UserProfile.tsx      # Profile display
│       └── routes/
│           ├── RegisterPage.tsx     # Registration page
│           ├── LoginPage.tsx        # Login page
│           ├── ForgotPasswordPage.tsx # Forgot password page
│           ├── ResetPasswordPage.tsx  # Reset password page
│           └── ProfilePage.tsx      # Profile page
```

## 5. ENVIRONMENT VARIABLES

| Name                        | Type   | Description                                      | Example Value                  |
|-----------------------------|--------|--------------------------------------------------|-------------------------------|
| POSTGRES_HOST               | str    | PostgreSQL host                                  | db                            |
| POSTGRES_PORT               | int    | PostgreSQL port                                  | 5432                          |
| POSTGRES_DB                 | str    | PostgreSQL database name                         | auth_db                       |
| POSTGRES_USER               | str    | PostgreSQL username                              | auth_user                     |
| POSTGRES_PASSWORD           | str    | PostgreSQL password                              | supersecret                   |
| AUTH_JWT_SECRET             | str    | JWT signing secret                               | myjwtsecret                   |
| AUTH_JWT_ALGORITHM          | str    | JWT algorithm                                    | HS256                         |
| AUTH_JWT_EXPIRE_MINUTES     | int    | JWT expiration in minutes                        | 60                            |
| AUTH_SMTP_HOST              | str    | SMTP server host (for password reset emails)      | smtp.mailtrap.io              |
| AUTH_SMTP_PORT              | int    | SMTP server port                                 | 2525                          |
| AUTH_SMTP_USER              | str    | SMTP username                                    | smtp_user                     |
| AUTH_SMTP_PASSWORD          | str    | SMTP password                                    | smtp_password                 |
| AUTH_EMAIL_FROM             | str    | Sender email address for system emails            | noreply@myapp.com             |
| FRONTEND_URL                | str    | Public URL of the frontend (for email links)      | http://localhost:3000         |
| BACKEND_URL                 | str    | Public URL of the backend                        | http://localhost:23001        |

## 6. IMPORT CONTRACTS

### Backend

```python
# backend/auth-service/main.py
from fastapi import FastAPI

# backend/auth-service/schemas.py
from schemas import (
    UserRegisterRequest,
    UserRegisterResponse,
    UserLoginRequest,
    UserLoginResponse,
    UserForgotPasswordRequest,
    UserForgotPasswordResponse,
    UserResetPasswordRequest,
    UserResetPasswordResponse,
    UserProfile,
)

# backend/auth-service/crud.py
from crud import (
    get_user_by_email,
    create_user,
    authenticate_user,
    update_user_password,
)

# backend/auth-service/email_utils.py
from email_utils import send_password_reset_email

# backend/shared/security.py
from shared.security import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
)
```

### Frontend

```typescript
// frontend/src/api/auth.ts
import {
  UserRegisterRequest,
  UserRegisterResponse,
  UserLoginRequest,
  UserLoginResponse,
  UserForgotPasswordRequest,
  UserForgotPasswordResponse,
  UserResetPasswordRequest,
  UserResetPasswordResponse,
  UserProfile,
} from '../types/auth';

// frontend/src/hooks/useAuth.ts
import { useAuth } from './useAuth';

// frontend/src/types/auth.ts
export type {
  UserRegisterRequest,
  UserRegisterResponse,
  UserLoginRequest,
  UserLoginResponse,
  UserForgotPasswordRequest,
  UserForgotPasswordResponse,
  UserResetPasswordRequest,
  UserResetPasswordResponse,
  UserProfile,
};
```

## 7. FRONTEND STATE & COMPONENT CONTRACTS

### Shared State (Zustand Hook)

```typescript
// useAuth() → {
  user: UserProfile | null,
  accessToken: string | null,
  loading: boolean,
  error: string | null,
  register: (data: UserRegisterRequest) => Promise<void>,
  login: (data: UserLoginRequest) => Promise<void>,
  logout: () => void,
  forgotPassword: (data: UserForgotPasswordRequest) => Promise<void>,
  resetPassword: (data: UserResetPasswordRequest) => Promise<void>,
  fetchProfile: () => Promise<void>,
}
```

### Reusable Components

```
RegisterForm props: {
  onSubmit: (data: UserRegisterRequest) => void,
  loading: boolean,
  error: string | null,
}

LoginForm props: {
  onSubmit: (data: UserLoginRequest) => void,
  loading: boolean,
  error: string | null,
}

ForgotPasswordForm props: {
  onSubmit: (data: UserForgotPasswordRequest) => void,
  loading: boolean,
  error: string | null,
}

ResetPasswordForm props: {
  onSubmit: (data: UserResetPasswordRequest) => void,
  loading: boolean,
  error: string | null,
}

UserProfile props: {
  user: UserProfile,
}
```

## 8. FILE EXTENSION CONVENTION

- **Frontend files:** `.tsx` (TypeScript React)
- **Project language:** TypeScript (frontend), Python (backend)
- **Entry point:** `/src/main.tsx` (as referenced in `public/index.html`)

**All frontend source files use `.tsx` or `.ts` extensions. No `.jsx` or `.js` files are present.**