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