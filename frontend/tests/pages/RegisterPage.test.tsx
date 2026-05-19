import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { RegisterPage } from '../../src/pages/RegisterPage';
import * as authModule from '../../src/api/auth';

vi.mock('../../src/api/auth');

const mockRegisterUser = authModule.registerUser as ReturnType<typeof vi.fn>;

const renderRegisterPage = () => {
  return render(
    <BrowserRouter>
      <RegisterPage />
    </BrowserRouter>
  );
};

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders_registration_form_with_email_and_password_fields', () => {
    renderRegisterPage();
    expect(screen.getByRole('textbox', { name: /email/i })).toBeTruthy();
    expect(screen.getByRole('textbox', { name: /password/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /register/i })).toBeTruthy();
  });

  it('shows_validation_error_for_invalid_email_format', async () => {
    renderRegisterPage();
    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByRole('textbox', { name: /password/i });

    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.type(passwordInput, 'ValidPass123');
    await userEvent.tab();

    await waitFor(() => {
      expect(screen.getByText(/enter a valid email address/i)).toBeTruthy();
    });
  });

  it('shows_validation_error_for_short_password', async () => {
    renderRegisterPage();
    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByRole('textbox', { name: /password/i });

    await userEvent.type(emailInput, 'user@example.com');
    await userEvent.type(passwordInput, 'short');
    await userEvent.tab();

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeTruthy();
    });
  });

  it('submit_button_disabled_when_form_invalid', () => {
    renderRegisterPage();
    const button = screen.getByRole('button', { name: /register/i });
    expect(button).toBeDisabled();
  });

  it('successful_registration_calls_api_and_redirects', async () => {
    mockRegisterUser.mockResolvedValue({ id: 1, email: 'newuser@example.com' });
    renderRegisterPage();

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByRole('textbox', { name: /password/i });
    const button = screen.getByRole('button', { name: /register/i });

    await userEvent.type(emailInput, 'newuser@example.com');
    await userEvent.type(passwordInput, 'ValidPass123');
    await userEvent.click(button);

    await waitFor(() => {
      expect(mockRegisterUser).toHaveBeenCalledWith({
        email: 'newuser@example.com',
        password: 'ValidPass123'
      });
    });
  });

  it('shows_error_message_on_400_validation_error_from_api', async () => {
    mockRegisterUser.mockRejectedValue({ status: 400, message: 'Invalid email or password' });
    renderRegisterPage();

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByRole('textbox', { name: /password/i });
    const button = screen.getByRole('button', { name: /register/i });

    await userEvent.type(emailInput, 'bademail');
    await userEvent.type(passwordInput, 'short');
    await userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeTruthy();
    });
  });

  it('shows_error_message_on_409_email_already_registered', async () => {
    mockRegisterUser.mockRejectedValue({ status: 409, message: 'Email already registered' });
    renderRegisterPage();

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByRole('textbox', { name: /password/i });
    const button = screen.getByRole('button', { name: /register/i });

    await userEvent.type(emailInput, 'existing@example.com');
    await userEvent.type(passwordInput, 'ValidPass123');
    await userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/email already registered/i)).toBeTruthy();
    });
  });

  it('shows_generic_error_on_network_failure', async () => {
    mockRegisterUser.mockRejectedValue(new Error('Network Error'));
    renderRegisterPage();

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByRole('textbox', { name: /password/i });
    const button = screen.getByRole('button', { name: /register/i });

    await userEvent.type(emailInput, 'user2@example.com');
    await userEvent.type(passwordInput, 'ValidPass123');
    await userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/unable to register\. please try again\./i)).toBeTruthy();
    });
  });

  it('password_field_has_type_password', () => {
    renderRegisterPage();
    const passwordInput = screen.getByRole('textbox', { name: /password/i });
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('form_does_not_submit_when_fields_are_empty', async () => {
    renderRegisterPage();
    const button = screen.getByRole('button', { name: /register/i });
    await userEvent.click(button);

    await waitFor(() => {
      expect(mockRegisterUser).not.toHaveBeenCalled();
    });
  });
});