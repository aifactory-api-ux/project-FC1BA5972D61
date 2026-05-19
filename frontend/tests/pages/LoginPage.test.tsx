import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { LoginPage } from '../../src/pages/LoginPage';
import * as authModule from '../../src/api/auth';

vi.mock('../../src/api/auth');

const mockLoginUser = authModule.loginUser as ReturnType<typeof vi.fn>;

const renderLoginPage = () => {
  return render(
    <BrowserRouter>
      <LoginPage />
    </BrowserRouter>
  );
};

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders_login_form_with_email_and_password_fields', () => {
    renderLoginPage();
    expect(screen.getByRole('textbox', { name: /email/i })).toBeTruthy();
    expect(screen.getByRole('textbox', { name: /password/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /log in/i })).toBeTruthy();
  });

  it('shows_validation_error_for_empty_fields_on_submit', async () => {
    renderLoginPage();
    const button = screen.getByRole('button', { name: /log in/i });
    await userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeTruthy();
      expect(screen.getByText(/password is required/i)).toBeTruthy();
    });
  });

  it('shows_validation_error_for_invalid_email_format', async () => {
    renderLoginPage();
    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByRole('textbox', { name: /password/i });

    await userEvent.type(emailInput, 'not-an-email');
    await userEvent.type(passwordInput, 'ValidPass123');
    await userEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/enter a valid email address/i)).toBeTruthy();
    });
  });

  it('shows_validation_error_for_short_password', async () => {
    renderLoginPage();
    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByRole('textbox', { name: /password/i });

    await userEvent.type(emailInput, 'user@example.com');
    await userEvent.type(passwordInput, 'short');
    await userEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeTruthy();
    });
  });

  it('submits_valid_credentials_and_redirects_on_success', async () => {
    mockLoginUser.mockResolvedValue({ access_token: 'mocktoken', token_type: 'bearer' });
    renderLoginPage();

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByRole('textbox', { name: /password/i });
    const button = screen.getByRole('button', { name: /log in/i });

    await userEvent.type(emailInput, 'user@example.com');
    await userEvent.type(passwordInput, 'ValidPass123');
    await userEvent.click(button);

    await waitFor(() => {
      expect(mockLoginUser).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'ValidPass123'
      });
    });
  });

  it('shows_error_message_on_invalid_credentials_401', async () => {
    mockLoginUser.mockRejectedValue({ status: 401, message: 'Invalid email or password' });
    renderLoginPage();

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByRole('textbox', { name: /password/i });
    const button = screen.getByRole('button', { name: /log in/i });

    await userEvent.type(emailInput, 'user@example.com');
    await userEvent.type(passwordInput, 'WrongPassword');
    await userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeTruthy();
    });
  });

  it('disables_submit_button_while_loading', async () => {
    mockLoginUser.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    renderLoginPage();

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByRole('textbox', { name: /password/i });
    const button = screen.getByRole('button', { name: /log in/i });

    await userEvent.type(emailInput, 'user@example.com');
    await userEvent.type(passwordInput, 'ValidPass123');
    await userEvent.click(button);

    expect(button).toBeDisabled();
  });

  it('shows_generic_error_on_network_failure', async () => {
    mockLoginUser.mockRejectedValue(new Error('Network Error'));
    renderLoginPage();

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByRole('textbox', { name: /password/i });
    const button = screen.getByRole('button', { name: /log in/i });

    await userEvent.type(emailInput, 'user@example.com');
    await userEvent.type(passwordInput, 'ValidPass123');
    await userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/unable to connect\. please try again\./i)).toBeTruthy();
    });
  });

  it('does_not_submit_when_validation_fails', async () => {
    renderLoginPage();

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByRole('textbox', { name: /password/i });

    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.type(passwordInput, 'short');
    await userEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(mockLoginUser).not.toHaveBeenCalled();
  });

  it('shows_password_visibility_toggle', () => {
    renderLoginPage();
    expect(screen.getByRole('button', { name: /show password/i })).toBeTruthy();
  });
});