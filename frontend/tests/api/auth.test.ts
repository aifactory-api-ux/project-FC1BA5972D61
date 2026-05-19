import { describe, it, expect, vi } from 'vitest';
import { registerUser } from '../../src/api/auth';
import axios from 'axios';

vi.mock('axios');
const mockedAxios = axios as ReturnType<typeof vi.fn>;

describe('auth.ts API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('registerUser_sends_correct_payload_and_returns_response_on_201', async () => {
    const mockResponse = { data: { id: 1, email: 'newuser@example.com' } };
    mockedAxios.post.mockResolvedValue({ ...mockResponse, status: 201 });

    const result = await registerUser({ email: 'newuser@example.com', password: 'ValidPass123' });

    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/api/auth/register',
      { email: 'newuser@example.com', password: 'ValidPass123' }
    );
    expect(result).toEqual({ id: 1, email: 'newuser@example.com' });
  });

  it('registerUser_throws_on_400_validation_error', async () => {
    mockedAxios.post.mockRejectedValue({
      response: { status: 400, data: { message: 'Invalid email or password' } }
    });

    await expect(
      registerUser({ email: 'bademail', password: 'short' })
    ).rejects.toEqual({ status: 400, message: 'Invalid email or password' });
  });

  it('registerUser_throws_on_409_email_already_registered', async () => {
    mockedAxios.post.mockRejectedValue({
      response: { status: 409, data: { message: 'Email already registered' } }
    });

    await expect(
      registerUser({ email: 'existing@example.com', password: 'ValidPass123' })
    ).rejects.toEqual({ status: 409, message: 'Email already registered' });
  });

  it('registerUser_throws_on_network_error', async () => {
    mockedAxios.post.mockRejectedValue(new Error('Network Error'));

    await expect(
      registerUser({ email: 'user2@example.com', password: 'ValidPass123' })
    ).rejects.toThrow('Network Error');
  });

  it('registerUser_does_not_send_request_with_missing_fields', async () => {
    mockedAxios.post.mockResolvedValue({ status: 201, data: {} });

    await expect(
      registerUser({ email: '', password: '' })
    ).rejects.toThrow();

    expect(mockedAxios.post).not.toHaveBeenCalled();
  });
});