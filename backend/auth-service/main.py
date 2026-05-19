from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta

from database import engine, get_db, Base
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
from crud import get_user_by_email, create_user, authenticate_user
from deps import get_current_user
from shared.security import create_access_token, hash_password, ACCESS_TOKEN_EXPIRE_MINUTES
from email_utils import send_password_reset_email

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Auth Service", version="1.0.0")


@app.post("/api/auth/register", response_model=UserRegisterResponse, status_code=status.HTTP_201_CREATED)
def register(request: UserRegisterRequest, db: Session = Depends(get_db)):
    existing_user = get_user_by_email(db, request.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )

    user = create_user(db, request.email, request.password)
    return UserRegisterResponse(id=user.id, email=user.email)


@app.post("/api/auth/login", response_model=UserLoginResponse)
def login(request: UserLoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, request.email, request.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        data={"sub": user.email, "id": user.id},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return UserLoginResponse(access_token=access_token, token_type="bearer")


@app.post("/api/auth/forgot-password", response_model=UserForgotPasswordResponse)
def forgot_password(request: UserForgotPasswordRequest, db: Session = Depends(get_db)):
    user = get_user_by_email(db, request.email)
    if user:
        token = create_access_token(
            data={"sub": user.email, "id": user.id, "type": "reset"},
            expires_delta=timedelta(hours=1)
        )
        send_password_reset_email(user.email, token)

    return UserForgotPasswordResponse(message="If that email exists, a password reset link has been sent.")


@app.post("/api/auth/reset-password", response_model=UserResetPasswordResponse)
def reset_password(request: UserResetPasswordRequest, db: Session = Depends(get_db)):
    from shared.security import decode_access_token

    try:
        payload = decode_access_token(request.token)
        if payload.get("type") != "reset":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired token"
            )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

    email = payload.get("sub")
    user = get_user_by_email(db, email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired token"
        )

    user.hashed_password = hash_password(request.new_password)
    db.commit()

    return UserResetPasswordResponse(message="Password reset successful")


@app.get("/api/auth/me", response_model=UserProfile)
def get_me(current_user = Depends(get_current_user)):
    return UserProfile(id=current_user.id, email=current_user.email)


@app.get("/health")
def health_check():
    return {"status": "healthy"}