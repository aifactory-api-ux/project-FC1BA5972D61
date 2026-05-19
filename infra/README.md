# Authentication Service

A complete authentication system with registration, login, and password recovery flows.

## Setup

1. Ensure Docker and Docker Compose are installed.
2. Copy `.env.example` to `.env` and configure if needed (defaults work for local development).

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| POSTGRES_HOST | PostgreSQL host | db |
| POSTGRES_PORT | PostgreSQL port | 5432 |
| POSTGRES_DB | Database name | auth_db |
| POSTGRES_USER | Database user | auth_user |
| POSTGRES_PASSWORD | Database password | supersecret |
| AUTH_JWT_SECRET | JWT signing secret | myjwtsecret |
| AUTH_JWT_ALGORITHM | JWT algorithm | HS256 |
| AUTH_JWT_EXPIRE_MINUTES | Token expiration | 60 |
| AUTH_SMTP_HOST | SMTP server | smtp.mailtrap.io |
| AUTH_SMTP_PORT | SMTP port | 2525 |
| AUTH_SMTP_USER | SMTP username | smtp_user |
| AUTH_SMTP_PASSWORD | SMTP password | smtp_password |
| AUTH_EMAIL_FROM | Sender email | noreply@myapp.com |
| FRONTEND_URL | Frontend URL | http://localhost:3000 |
| BACKEND_URL | Backend URL | http://localhost:23001 |

## Run

```bash
cd infra
./run.sh
```

Or manually:

```bash
cd infra
docker-compose up --build -d
```

## Test

### Backend

```bash
cd backend/auth-service
python -m pytest tests/ --tb=short -q
```

### Frontend

```bash
cd frontend
npx vitest run --coverage
```

### Infrastructure

```bash
cd infra
python -m pytest tests/ --tb=short -q
```

## API Endpoints

### POST /api/auth/register

Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "StrongPass123"
}
```

**Response (201):**
```json
{
  "id": 1,
  "email": "user@example.com"
}
```

### POST /api/auth/login

Login with credentials.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "StrongPass123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer"
}
```

### POST /api/auth/forgot-password

Request password reset email.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "message": "If that email exists, a password reset link has been sent."
}
```

### POST /api/auth/reset-password

Reset password using token.

**Request:**
```json
{
  "token": "abc123",
  "new_password": "NewStrongPass123"
}
```

**Response (200):**
```json
{
  "message": "Password reset successful"
}
```

### GET /api/auth/me

Get current user profile. Requires Bearer token.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com"
}
```

## Troubleshooting

### Database connection issues
- Ensure PostgreSQL container is running: `docker-compose ps db`
- Check logs: `docker-compose logs db`

### Backend not starting
- Check if port 23001 is available
- Verify environment variables are set correctly
- Check logs: `docker-compose logs auth-service`

### Frontend not loading
- Check if port 3000 is available
- Verify backend is healthy first
- Check logs: `docker-compose logs frontend`