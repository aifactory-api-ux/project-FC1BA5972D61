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