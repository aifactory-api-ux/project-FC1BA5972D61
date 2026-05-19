from pydantic import BaseModel
from typing import Optional


class Settings(BaseModel):
    POSTGRES_HOST: str = "db"
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str = "auth_db"
    POSTGRES_USER: str = "auth_user"
    POSTGRES_PASSWORD: str = "supersecret"
    AUTH_JWT_SECRET: str = "myjwtsecret"
    AUTH_JWT_ALGORITHM: str = "HS256"
    AUTH_JWT_EXPIRE_MINUTES: int = 60
    AUTH_SMTP_HOST: str = "smtp.mailtrap.io"
    AUTH_SMTP_PORT: int = 2525
    AUTH_SMTP_USER: str = "smtp_user"
    AUTH_SMTP_PASSWORD: str = "smtp_password"
    AUTH_EMAIL_FROM: str = "noreply@myapp.com"
    FRONTEND_URL: str = "http://localhost:3000"
    BACKEND_URL: str = "http://localhost:23001"


settings = Settings()