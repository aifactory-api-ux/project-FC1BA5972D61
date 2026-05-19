import { create } from 'zustand';
import type {
  UserRegisterRequest,
  UserLoginRequest,
  UserForgotPasswordRequest,
  UserResetPasswordRequest,
  UserProfile,
} from '../types/auth';
import { registerUser, loginUser, forgotPassword, resetPassword, getProfile } from '../api/auth';

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
  register: (data: UserRegisterRequest) => Promise<void>;
  login: (data: UserLoginRequest) => Promise<void>;
  logout: () => void;
  forgotPassword: (data: UserForgotPasswordRequest) => Promise<void>;
  resetPassword: (data: UserResetPasswordRequest) => Promise<void>;
  fetchProfile: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  accessToken: localStorage.getItem('access_token'),
  loading: false,
  error: null,

  register: async (data: UserRegisterRequest) => {
    set({ loading: true, error: null });
    try {
      const response = await registerUser(data);
      set({ user: response, loading: false });
    } catch (err: unknown) {
      set({ loading: false, error: (err as { message?: string })?.message || 'Unable to register. Please try again.' });
      throw err;
    }
  },

  login: async (data: UserLoginRequest) => {
    set({ loading: true, error: null });
    try {
      const response = await loginUser(data);
      localStorage.setItem('access_token', response.access_token);
      set({ accessToken: response.access_token, loading: false });
      await useAuth.getState().fetchProfile();
    } catch (err: unknown) {
      set({ loading: false, error: (err as { message?: string })?.message || 'Unable to connect. Please try again.' });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    set({ user: null, accessToken: null });
  },

  forgotPassword: async (data: UserForgotPasswordRequest) => {
    set({ loading: true, error: null });
    try {
      await forgotPassword(data);
      set({ loading: false });
    } catch (err: unknown) {
      set({ loading: false, error: (err as { message?: string })?.message || 'Unable to send reset email. Please try again.' });
      throw err;
    }
  },

  resetPassword: async (data: UserResetPasswordRequest) => {
    set({ loading: true, error: null });
    try {
      await resetPassword(data);
      set({ loading: false });
    } catch (err: unknown) {
      set({ loading: false, error: (err as { message?: string })?.message || 'Something went wrong. Please try again.' });
      throw err;
    }
  },

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const user = await getProfile();
      set({ user, loading: false });
    } catch (err: unknown) {
      set({ loading: false, error: (err as { message?: string })?.message || 'Unable to fetch profile.' });
      throw err;
    }
  },
}));