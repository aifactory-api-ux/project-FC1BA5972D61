import axios from 'axios';
import type {
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

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

export const registerUser = async (data: UserRegisterRequest): Promise<UserRegisterResponse> => {
  if (!data.email || !data.password) {
    throw new Error('Email and password are required');
  }
  const response = await api.post<UserRegisterResponse>('/auth/register', data);
  return response.data;
};

export const loginUser = async (data: UserLoginRequest): Promise<UserLoginResponse> => {
  const response = await api.post<UserLoginResponse>('/auth/login', data);
  return response.data;
};

export const forgotPassword = async (data: UserForgotPasswordRequest): Promise<UserForgotPasswordResponse> => {
  const response = await api.post<UserForgotPasswordResponse>('/auth/forgot-password', data);
  return response.data;
};

export const resetPassword = async (data: UserResetPasswordRequest): Promise<UserResetPasswordResponse> => {
  const response = await api.post<UserResetPasswordResponse>('/auth/reset-password', data);
  return response.data;
};

export const getProfile = async (): Promise<UserProfile> => {
  const token = localStorage.getItem('access_token');
  const response = await api.get<UserProfile>('/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};