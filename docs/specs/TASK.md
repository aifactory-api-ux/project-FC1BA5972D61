# TASK.md

> Lee **SPEC.md** para el contrato técnico (stack, modelos, endpoints, naming).
> Este archivo define QUÉ implementar y en qué archivos para esta HU.
> Actualiza **STATE.md** marcando cada ítem completado (ver §4).

## §1 Objetivo

Summary: Registro y login de clientes
Description: **Historia de usuario:** Como cliente, quiero registrarme y poder iniciar sesión de forma segura, para acceder a funcionalidades personalizadas.

Implementar los flujos de registro de nuevos usuarios, inicio de sesión y recuperación de contraseña.

**Criterios de Aceptación:**

# El cliente puede registrarse con un correo electrónico y contraseña.
# El cliente puede iniciar sesión con sus credenciales.
# El cliente puede recuperar su contraseña si la olvida.
# La autenticación es segura (cifrado de contraseñas, tokens JWT).

**Prioridad:** High
**Story Points:** 4A
Type: Story
Priority: Medium
Jira URL: https://ai-factory-team.atlassian.net//browse/FC1BA5972D-61



## Tech Spec Global — FC1BA5972D-61
**Summary:** Implement secure customer registration, login, and password recovery flows.
**Approach:** Use JWT-based authentication with bcrypt password hashing for secure credential management; expose RESTful endpoints for registration, login, and password recovery; ensure all sensitive operations are protected and follow security best practices.
**Stack:** frontend: React | backend: Node.js/Express | database: PostgreSQL | infra: Docker, AWS S3 (for email templates if needed), SendGrid (for email delivery)

**Files to implement:**
- [CREATE] `frontend/src/pages/Register.jsx` (frontend) — Registration form for new customers; handles input, validation, and submission to backend.
- [CREATE] `frontend/src/pages/Login.jsx` (frontend) — Login form for existing customers; handles input, validation, and submission to backend.
- [CREATE] `frontend/src/pages/ForgotPassword.jsx` (frontend) — Form to request password reset; submits email to backend.
- [CREATE] `frontend/src/pages/ResetPassword.jsx` (frontend) — Form to set a new password using a token from email.
- [CREATE] `backend/routes/auth.js` (backend) — Express router with endpoints for registration, login, forgot password, and reset password.
- [CREATE] `backend/controllers/authController.js` (backend) — Business logic for authentication flows: user creation, login, password hashing, JWT issuance, password reset token generation and validation.
- [MODIFY] `backend/models/User.js` (backend) — Ensure User model has fields for email, password (hashed), passwordResetToken, passwordResetExpires.
- [CREATE] `backend/services/emailService.js` (backend) — Handles sending password reset emails via SendGrid.
- [CREATE] `backend/middleware/authMiddleware.js` (backend) — JWT authentication middleware for protecting routes.
- [CREATE] `backend/tests/auth.test.js` (tests) — Unit and integration tests for registration, login, and password recovery endpoints.
- [CREATE] `database/migrations/20240601_add_user_auth_fields.sql` (database) — Migration to ensure User table has required fields for authentication and password reset.
- [MODIFY] `infra/docker-compose.yml` (infra) — Ensure services for backend, database, and any required infra are defined.

**API Contracts:**
- 🔓 `POST /api/v1/auth/register` → User created confirmation or error
- 🔓 `POST /api/v1/auth/login` → JWT token and user info or error
- 🔓 `POST /api/v1/auth/forgot-password` → Password reset email sent confirmation or error
- 🔓 `POST /api/v1/auth/reset-password` → Password reset confirmation or error

**Data Models:**
- `User`: id: UUID, email: string, password: string (hashed), passwordResetToken: string|null, passwordResetExpires: datetime|null, createdAt: datetime, updatedAt: datetime
- `users`: id UUID PRIMARY KEY, email VARCHAR UNIQUE NOT NULL, password VARCHAR NOT NULL, password_reset_token VARCHAR, password_reset_expires TIMESTAMP, created_at TIMESTAMP, updated_at TIMESTAMP

**Acceptance Criteria:**
- [ ] The customer can register with an email and password.
- [ ] The customer can log in with their credentials and receive a JWT token.
- [ ] The customer can request a password reset and receive an email with a reset link.
- [ ] The customer can reset their password using the link and set a new password.
- [ ] Passwords are securely hashed and never stored in plain text.
- [ ] All authentication flows are protected against common vulnerabilities (e.g., brute force, token leakage).

**Constraints:**
- Passwords must be hashed using bcrypt with a strong salt.
- JWT tokens must be signed with a secure secret and have reasonable expiration.
- Password reset tokens must be single-use and expire after a short period (e.g., 1 hour).
- Email delivery must be reliable and use a transactional email provider (e.g., SendGrid).
- All endpoints must validate input and handle errors gracefully.
- Sensitive data must not be logged.

## Plan de Subtareas (creadas en Jira):
- [1] [FC1BA5972D-62] BACKEND | Prioridad: ALTA | ~4h | [BACKEND] Crear endpoints de autenticación (registro, login, recuperación)
- [2] [FC1BA5972D-63] BACKEND | Prioridad: ALTA | ~5h | [BACKEND] Implementar lógica de autenticación y recuperación en controlador
- [3] [FC1BA5972D-64] BACKEND | Prioridad: ALTA | ~2h | [BACKEND] Actualizar modelo de usuario para campos de autenticación
- [4] [FC1BA5972D-65] BACKEND | Prioridad: MEDIA | ~2h | [BACKEND] Crear servicio de envío de emails para recuperación de contraseña
- [5] [FC1BA5972D-66] BACKEND | Prioridad: MEDIA | ~2h | [BACKEND] Crear middleware de autenticación JWT
- [6] [FC1BA5972D-67] FRONTEND | Prioridad: ALTA | ~2h | [FRONTEND] Implementar formulario de registro de clientes
- [7] [FC1BA5972D-68] FRONTEND | Prioridad: ALTA | ~2h | [FRONTEND] Implementar formulario de login de clientes
- [8] [FC1BA5972D-69] FRONTEND | Prioridad: MEDIA | ~2h | [FRONTEND] Implementar formulario de recuperación de contraseña
- [9] [FC1BA5972D-70] FRONTEND | Prioridad: MEDIA | ~2h | [FRONTEND] Implementar formulario para restablecer contraseña usando token
- [10] [FC1BA5972D-71] INFRA | Prioridad: BAJA | ~1h | [INFRA] Actualizar docker-compose e infraestructura para autenticación
- [11] [FC1BA5972D-72] BACKEND | Prioridad: MEDIA | ~1h | [BACKEND] Crear migración para campos de autenticación en tabla User
- [12] [FC1BA5972D-73] TESTS | Prioridad: ALTA | ~3h | [TESTS] Implementar pruebas unitarias e integración para autenticación

IMPORTANT: Implementa TODAS las subtareas en el orden listado. Sigue el Tech Spec Global como fuente de verdad. La última subtarea siempre son las pruebas unitarias.

---

## §2 Items a Implementar

### Wave 1

#### 🟢 PROD — run_tests.sh — backend/auth-service
**Objetivo:** Crea el archivo `backend/auth-service/run_tests.sh` con el siguiente contenido EXACTO (no lo modifiques ni resumas):
**Archivos:**
- `backend/auth-service/run_tests.sh` (create/modify)

#### 🟢 PROD — run_tests.sh — backend/shared
**Objetivo:** Crea el archivo `backend/shared/run_tests.sh` con el siguiente contenido EXACTO (no lo modifiques ni resumas):
**Archivos:**
- `backend/shared/run_tests.sh` (create/modify)

#### 🟢 PROD — run_tests.sh — frontend
**Objetivo:** Crea el archivo `frontend/run_tests.sh` con el siguiente contenido EXACTO (no lo modifiques ni resumas):
**Archivos:**
- `frontend/run_tests.sh` (create/modify)

#### 🟢 PROD — run_tests.sh — infra
**Objetivo:** Crea el archivo `infra/run_tests.sh` con el siguiente contenido EXACTO (no lo modifiques ni resumas):
**Archivos:**
- `infra/run_tests.sh` (create/modify)

#### 🔴 TEST — Tests: backend/auth-service/routes.py
**Objetivo:** TDD — escribe los tests ANTES que el código de producción.
**Archivos:**
- `backend/auth-service/tests/test_routes.py` (create/modify)
**Casos de prueba:**
- `test_register_valid_user_returns_201`: POST /api/auth/register with valid email and password returns 201 and user data.
  - Input: `{'method': 'POST', 'path': '/api/auth/register', 'json': {'email': 'newuser@example.com', 'password': 'StrongPass123'}}`
  - Expected: `{'status_code': 201, 'body_fields': ['id', 'email'], 'body': {'email': 'newuser@example.com'}}`
- `test_register_existing_email_returns_409`: POST /api/auth/register with an email that already exists returns 409.
  - Input: `{'method': 'POST', 'path': '/api/auth/register', 'json': {'email': 'existing@example.com', 'password': 'AnotherPass123'}}`
  - Expected: `{'status_code': 409}`
- `test_register_invalid_email_returns_400`: POST /api/auth/register with invalid email format returns 400.
  - Input: `{'method': 'POST', 'path': '/api/auth/register', 'json': {'email': 'not-an-email', 'password': 'ValidPass123'}}`
  - Expected: `{'status_code': 400}`
- `test_register_short_password_returns_400`: POST /api/auth/register with password shorter than 8 chars returns 400.
  - Input: `{'method': 'POST', 'path': '/api/auth/register', 'json': {'email': 'shortpass@example.com', 'password': 'short'}}`
  - Expected: `{'status_code': 400}`
- `test_login_valid_credentials_returns_200`: POST /api/auth/login with valid credentials returns 200 and access_token, token_type.
  - Input: `{'method': 'POST', 'path': '/api/auth/login', 'json': {'email': 'loginuser@example.com', 'password': 'ValidPass123'}}`
  - Expected: `{'status_code': 200, 'body_fields': ['access_token', 'token_type'], 'body': {'token_type': 'bearer'}}`
- `test_login_wrong_password_returns_401`: POST /api/auth/login with wrong password returns 401.
  - Input: `{'method': 'POST', 'path': '/api/auth/login', 'json': {'email': 'loginuser@example.com', 'password': 'WrongPass'}}`
  - Expected: `{'status_code': 401}`
- `test_login_nonexistent_email_returns_401`: POST /api/auth/login with non-existent email returns 401.
  - Input: `{'method': 'POST', 'path': '/api/auth/login', 'json': {'email': 'doesnotexist@example.com', 'password': 'AnyPass123'}}`
  - Expected: `{'status_code': 401}`
- `test_login_missing_email_returns_400`: POST /api/auth/login without email field returns 400.
  - Input: `{'method': 'POST', 'path': '/api/auth/login', 'json': {'password': 'ValidPass123'}}`
  - Expected: `{'status_code': 400}`
- `test_login_missing_password_returns_400`: POST /api/auth/login without password field returns 400.
  - Input: `{'method': 'POST', 'path': '/api/auth/login', 'json': {'email': 'loginuser@example.com'}}`
  - Expected: `{'status_code': 400}`
- `test_forgot_password_valid_email_returns_200`: POST /api/auth/forgot-password with valid email returns 200 and message.
  - Input: `{'method': 'POST', 'path': '/api/auth/forgot-password', 'json': {'email': 'forgotuser@example.com'}}`
  - Expected: `{'status_code': 200, 'body_fields': ['message']}`

#### 🔴 TEST — Tests: backend/shared/security.py
**Objetivo:** TDD — escribe los tests ANTES que el código de producción.
**Archivos:**
- `backend/shared/tests/test_security.py` (create/modify)
**Casos de prueba:**
- `test_jwt_auth_middleware_allows_valid_token`: Middleware should allow requests with a valid JWT in the Authorization header and set user context.
  - Input: `{'headers': {'Authorization': 'Bearer <valid_access_token>'}}`
  - Expected: `{'user_context_set': True, 'error_raised': False}`
- `test_jwt_auth_middleware_rejects_missing_authorization_header`: Middleware should reject requests missing the Authorization header with 401 Unauthorized.
  - Input: `{'headers': {}}`
  - Expected: `{'status_code': 401, 'detail': 'Not authenticated'}`
- `test_jwt_auth_middleware_rejects_malformed_authorization_header`: Middleware should reject requests with malformed Authorization header (not Bearer) with 401 Unauthorized.
  - Input: `{'headers': {'Authorization': 'Token abc.def.ghi'}}`
  - Expected: `{'status_code': 401, 'detail': 'Invalid authentication credentials'}`
- `test_jwt_auth_middleware_rejects_expired_token`: Middleware should reject requests with an expired JWT with 401 Unauthorized.
  - Input: `{'headers': {'Authorization': 'Bearer <expired_access_token>'}}`
  - Expected: `{'status_code': 401, 'detail': 'Token has expired'}`
- `test_jwt_auth_middleware_rejects_invalid_signature`: Middleware should reject requests with a JWT with invalid signature with 401 Unauthorized.
  - Input: `{'headers': {'Authorization': 'Bearer <invalid_signature_token>'}}`
  - Expected: `{'status_code': 401, 'detail': 'Invalid authentication credentials'}`
- `test_jwt_auth_middleware_rejects_token_with_missing_user_id`: Middleware should reject JWTs missing required user fields (e.g., id) with 401 Unauthorized.
  - Input: `{'headers': {'Authorization': 'Bearer <token_missing_user_id>'}}`
  - Expected: `{'status_code': 401, 'detail': 'Invalid authentication credentials'}`
- `test_jwt_auth_middleware_accepts_token_with_additional_claims`: Middleware should accept valid JWTs even if they contain additional claims beyond id and email.
  - Input: `{'headers': {'Authorization': 'Bearer <token_with_extra_claims>'}}`
  - Expected: `{'user_context_set': True, 'error_raised': False}`
- `test_jwt_auth_middleware_rejects_token_with_wrong_algorithm`: Middleware should reject JWTs signed with an unexpected algorithm with 401 Unauthorized.
  - Input: `{'headers': {'Authorization': 'Bearer <token_with_wrong_alg>'}}`
  - Expected: `{'status_code': 401, 'detail': 'Invalid authentication credentials'}`

#### 🔴 TEST — Tests: frontend/src/pages/RegisterPage.tsx
**Objetivo:** TDD — escribe los tests ANTES que el código de producción.
**Archivos:**
- `frontend/tests/pages/RegisterPage.test.tsx` (create/modify)
**Casos de prueba:**
- `renders_registration_form_with_email_and_password_fields`: The registration page must render a form with email and password input fields and a submit button.
  - Expected: `{'elements': [{'role': 'textbox', 'name': 'email'}, {'role': 'textbox', 'name': 'password'}, {'role': 'button', 'name': 'Register'}]}`
- `shows_validation_error_for_invalid_email_format`: Entering an invalid email format in the email field and blurring should display an email validation error.
  - Input: `{'email': 'invalid-email', 'password': 'ValidPass123'}`
  - Expected: `{'validationErrors': [{'field': 'email', 'message': 'Enter a valid email address'}]}`
- `shows_validation_error_for_short_password`: Entering a password shorter than 8 characters should display a password validation error.
  - Input: `{'email': 'user@example.com', 'password': 'short'}`
  - Expected: `{'validationErrors': [{'field': 'password', 'message': 'Password must be at least 8 characters'}]}`
- `submit_button_disabled_when_form_invalid`: The submit button must be disabled if the form is invalid (e.g., empty fields or validation errors).
  - Input: `{'email': '', 'password': ''}`
  - Expected: `{'buttonDisabled': True}`
- `successful_registration_calls_api_and_redirects`: Submitting the form with valid email and password must call POST /api/auth/register, show loading, and redirect to login or dashboard on 201 response.
  - Input: `{'email': 'newuser@example.com', 'password': 'ValidPass123'}`
  - Expected: `{'apiCalled': True, 'redirect': True}`
- `shows_error_message_on_400_validation_error_from_api`: If the backend returns 400 on registration (e.g., invalid email or password), an error message must be displayed to the user.
  - Input: `{'email': 'bademail', 'password': 'short'}`
  - Expected: `{'errorMessage': 'Invalid email or password'}`
- `shows_error_message_on_409_email_already_registered`: If the backend returns 409 on registration (email already registered), an error message must be displayed to the user.
  - Input: `{'email': 'existing@example.com', 'password': 'ValidPass123'}`
  - Expected: `{'errorMessage': 'Email already registered'}`
- `shows_generic_error_on_network_failure`: If the registration API call fails due to network error, a generic error message must be displayed.
  - Input: `{'email': 'user2@example.com', 'password': 'ValidPass123'}`
  - Expected: `{'errorMessage': 'Unable to register. Please try again.'}`
- `password_field_has_type_password`: The password input field must have type='password' to hide user input.
  - Expected: `{'element': {'role': 'textbox', 'name': 'password', 'type': 'password'}}`
- `form_does_not_submit_when_fields_are_empty`: Submitting the form with empty email and password fields must not call the API and must show validation errors.
  - Input: `{'email': '', 'password': ''}`
  - Expected: `{'apiCalled': False, 'validationErrors': [{'field': 'email', 'message': 'Email is required'}, {'field': 'password', 'message': 'Password is required'}]}`

#### 🔴 TEST — Tests: frontend/src/api/auth.ts
**Objetivo:** TDD — escribe los tests ANTES que el código de producción.
**Archivos:**
- `frontend/tests/api/auth.test.ts` (create/modify)
**Casos de prueba:**
- `registerUser_sends_correct_payload_and_returns_response_on_201`: registerUser must send POST /api/auth/register with correct email and password, and resolve with UserRegisterResponse on 201.
  - Input: `{'email': 'newuser@example.com', 'password': 'ValidPass123'}`
  - Expected: `{'result': {'id': 1, 'email': 'newuser@example.com'}}`
- `registerUser_throws_on_400_validation_error`: registerUser must throw or reject with error if backend returns 400 (validation error).
  - Input: `{'email': 'bademail', 'password': 'short'}`
  - Expected: `{'throws': True, 'error': {'status': 400, 'message': 'Invalid email or password'}}`
- `registerUser_throws_on_409_email_already_registered`: registerUser must throw or reject with error if backend returns 409 (email already registered).
  - Input: `{'email': 'existing@example.com', 'password': 'ValidPass123'}`
  - Expected: `{'throws': True, 'error': {'status': 409, 'message': 'Email already registered'}}`
- `registerUser_throws_on_network_error`: registerUser must throw or reject with error if the network request fails.
  - Input: `{'email': 'user2@example.com', 'password': 'ValidPass123'}`
  - Expected: `{'throws': True, 'error': {'message': 'Network Error'}}`
- `registerUser_does_not_send_request_with_missing_fields`: registerUser must not send a request if email or password is missing or empty.
  - Input: `{'email': '', 'password': ''}`
  - Expected: `{'apiCalled': False, 'throws': True}`

#### 🔴 TEST — Tests: frontend/src/pages/LoginPage.tsx
**Objetivo:** TDD — escribe los tests ANTES que el código de producción.
**Archivos:**
- `frontend/tests/pages/LoginPage.test.tsx` (create/modify)
**Casos de prueba:**
- `renders_login_form_with_email_and_password_fields`: The login page renders a form with email and password input fields and a submit button.
  - Expected: `{'elements': [{'role': 'textbox', 'name': 'email'}, {'role': 'textbox', 'name': 'password'}, {'role': 'button', 'name': 'Log In'}]}`
- `shows_validation_error_for_empty_fields_on_submit`: Submitting the form with both email and password fields empty displays required field validation errors.
  - Input: `{'email': '', 'password': ''}`
  - Expected: `{'validationErrors': [{'field': 'email', 'message': 'Email is required'}, {'field': 'password', 'message': 'Password is required'}]}`
- `shows_validation_error_for_invalid_email_format`: Entering an invalid email format and submitting displays an email format validation error.
  - Input: `{'email': 'not-an-email', 'password': 'ValidPass123'}`
  - Expected: `{'validationErrors': [{'field': 'email', 'message': 'Enter a valid email address'}]}`
- `shows_validation_error_for_short_password`: Entering a password shorter than 8 characters and submitting displays a password length validation error.
  - Input: `{'email': 'user@example.com', 'password': 'short'}`
  - Expected: `{'validationErrors': [{'field': 'password', 'message': 'Password must be at least 8 characters'}]}`
- `submits_valid_credentials_and_redirects_on_success`: Submitting valid email and password sends a POST /api/auth/login request and redirects to the dashboard on 200 response.
  - Input: `{'email': 'user@example.com', 'password': 'ValidPass123'}`
  - Expected: `{'redirect': '/dashboard', 'localStorage': {'access_token': 'mocktoken'}}`
- `shows_error_message_on_invalid_credentials_401`: Submitting the form with invalid credentials displays an error message when the API returns 401.
  - Input: `{'email': 'user@example.com', 'password': 'WrongPassword'}`
  - Expected: `{'errorMessage': 'Invalid email or password'}`
- `disables_submit_button_while_loading`: The submit button is disabled and shows a loading indicator while the login request is in progress.
  - Input: `{'email': 'user@example.com', 'password': 'ValidPass123'}`
  - Expected: `{'buttonDisabled': True, 'loadingIndicatorVisible': True}`
- `shows_generic_error_on_network_failure`: Displays a generic error message if the login request fails due to a network error.
  - Input: `{'email': 'user@example.com', 'password': 'ValidPass123'}`
  - Expected: `{'errorMessage': 'Unable to connect. Please try again.'}`
- `does_not_submit_when_validation_fails`: The form does not send a request to the API if client-side validation fails.
  - Input: `{'email': 'invalid-email', 'password': 'short'}`
  - Expected: `{'apiCallMade': False, 'validationErrors': [{'field': 'email', 'message': 'Enter a valid email address'}, {'field': 'password', 'message': 'Password must be at least 8 characters'}]}`
- `shows_password_visibility_toggle`: The password input field includes a toggle to show or hide the password.
  - Expected: `{'elements': [{'role': 'button', 'name': 'Show password'}]}`

#### 🔴 TEST — Tests: frontend/src/pages/ResetPasswordPage.tsx
**Objetivo:** TDD — escribe los tests ANTES que el código de producción.
**Archivos:**
- `frontend/tests/pages/ResetPasswordPage.test.tsx` (create/modify)
**Casos de prueba:**
- `renders reset password form with token from URL`: The reset password page should render a form with a new password input and submit button, and should extract the token from the URL query string.
  - Input: `{'route': '/reset-password?token=abc123'}`
  - Expected: `{'form_fields': ['new_password'], 'token_in_state': 'abc123'}`
- `submits valid new password and token, calls API, shows success message`: When a valid new password is entered and the form is submitted, the page should call POST /api/auth/reset-password with the token and new_password, and display the success message from the API response.
  - Input: `{'route': '/reset-password?token=abc123', 'form': {'new_password': 'ValidPass123'}}`
  - Expected: `{'api_call': {'url': '/api/auth/reset-password', 'method': 'POST', 'body': {'token': 'abc123', 'new_password': 'ValidPass123'}}, 'status_code': 200, 'success_message_displayed': True}`
- `shows validation error for password shorter than 8 characters`: If the user enters a new password shorter than 8 characters, the form should display a validation error and not submit the API request.
  - Input: `{'route': '/reset-password?token=abc123', 'form': {'new_password': 'short'}}`
  - Expected: `{'validation_error': 'Password must be at least 8 characters', 'api_call': False}`
- `shows validation error for missing token in URL`: If the reset password page is loaded without a token in the URL, the form should be disabled and an error message should be shown.
  - Input: `{'route': '/reset-password'}`
  - Expected: `{'form_disabled': True, 'error_message': 'Invalid or missing token'}`
- `shows API error message for invalid token (400 response)`: If the API returns a 400 error due to an invalid or expired token, the page should display the error message from the API response.
  - Input: `{'route': '/reset-password?token=badtoken', 'form': {'new_password': 'ValidPass123'}, 'api_response': {'status_code': 400, 'body': {'message': 'Invalid or expired token'}}}`
  - Expected: `{'error_message': 'Invalid or expired token'}`
- `shows API error message for invalid password (400 response)`: If the API returns a 400 error due to an invalid password (e.g., too short), the page should display the error message from the API response.
  - Input: `{'route': '/reset-password?token=abc123', 'form': {'new_password': 'short'}, 'api_response': {'status_code': 400, 'body': {'message': 'Password must be at least 8 characters'}}}`
  - Expected: `{'error_message': 'Password must be at least 8 characters'}`
- `shows loading indicator while submitting`: When the form is submitted, a loading indicator should be shown until the API response is received.
  - Input: `{'route': '/reset-password?token=abc123', 'form': {'new_password': 'ValidPass123'}}`
  - Expected: `{'loading_indicator': True}`
- `disables submit button while submitting`: The submit button should be disabled while the API request is in progress to prevent duplicate submissions.
  - Input: `{'route': '/reset-password?token=abc123', 'form': {'new_password': 'ValidPass123'}}`
  - Expected: `{'submit_button_disabled_while_loading': True}`
- `redirects to login page after successful reset`: After a successful password reset, the page should redirect the user to the login page.
  - Input: `{'route': '/reset-password?token=abc123', 'form': {'new_password': 'ValidPass123'}, 'api_response': {'status_code': 200, 'body': {'message': 'Password reset successful'}}}`
  - Expected: `{'redirect': '/login'}`
- `shows generic error message for unexpected API/network error`: If the API call fails due to a network error or unexpected server error, the page should display a generic error message.
  - Input: `{'route': '/reset-password?token=abc123', 'form': {'new_password': 'ValidPass123'}, 'api_response': {'status_code': 500, 'body': {}}}`
  - Expected: `{'error_message': 'Something went wrong. Please try again.'}`

#### 🔴 TEST — Tests: infra/run.sh
**Objetivo:** TDD — escribe los tests ANTES que el código de producción.
**Archivos:**
- `infra/tests/test_run_sh.py` (create/modify)
**Casos de prueba:**
- `test_run_sh_checks_docker_installed`: run.sh must check if Docker is installed and print an error if not found.
  - Input: `{'docker_installed': False}`
  - Expected: `{'output_contains': 'Docker is not installed'}`
- `test_run_sh_builds_and_starts_services`: run.sh must build and start all services using docker-compose up --build.
  - Expected: `{'command_executed': 'docker-compose up --build'}`
- `test_run_sh_waits_for_services_healthy`: run.sh must wait until all services are healthy before printing the access URL.
  - Expected: `{'waits_for_health': True}`
- `test_run_sh_prints_access_url_on_success`: run.sh must print the frontend access URL after all services are healthy.
  - Expected: `{'output_contains': 'Frontend available at http://localhost:3000'}`
- `test_run_sh_handles_docker_compose_failure`: If docker-compose up fails, run.sh must print an error and exit with non-zero status.
  - Input: `{'docker_compose_up_success': False}`
  - Expected: `{'output_contains': 'Failed to start services', 'exit_code': 1}`

#### 🔴 TEST — Tests: infra/README.md
**Objetivo:** TDD — escribe los tests ANTES que el código de producción.
**Archivos:**
- `infra/tests/test_readme_md.py` (create/modify)
**Casos de prueba:**
- `test_readme_includes_setup_instructions`: README.md must include clear setup instructions for Docker and environment variables.
  - Expected: `{'contains_sections': ['Setup', 'Environment Variables']}`
- `test_readme_includes_run_and_test_instructions`: README.md must include instructions for running and testing the application locally.
  - Expected: `{'contains_sections': ['Run', 'Test']}`
- `test_readme_documents_api_endpoints`: README.md must document all API endpoints as specified in the API contract.
  - Expected: `{'contains_endpoints': ['/api/auth/register', '/api/auth/login', '/api/auth/forgot-password', '/api/auth/reset-password', '/api/auth/me']}`
- `test_readme_missing_required_section_returns_error`: If a required section (e.g., Setup, Run, Test, Endpoints) is missing from README.md, an error must be raised.
  - Input: `{'readme_missing_section': 'Setup'}`
  - Expected: `{'error': 'Missing required section: Setup'}`
- `test_readme_includes_troubleshooting_section`: README.md should include a Troubleshooting section for common Docker or environment issues.
  - Expected: `{'contains_sections': ['Troubleshooting']}`

#### 🟢 PROD — Foundation — shared types, interfaces, DB schemas, config
**Objetivo:** Create all foundational code and schema required for authentication, including the User model, environment validation, and the initial DB migration for user authentication fields.

### Wave 2

#### 🟢 PROD — Backend — authentication endpoints (register, login, password recovery)
**Objetivo:** Implement Express router for authentication endpoints: register, login, forgot password, reset password, and health check.

#### 🟢 PROD — Backend — authentication controller logic
**Objetivo:** Implement business logic for registration, login, password hashing, JWT issuance, password reset token generation/validation, and error handling.

#### 🟢 PROD — Backend — email service for password recovery
**Objetivo:** Implement service to send password reset emails using SendGrid.

#### 🟢 PROD — Backend — JWT authentication middleware
**Objetivo:** Implement JWT authentication middleware to protect routes and validate tokens.

#### 🟢 PROD — Frontend — registration form/page
**Objetivo:** Implement registration form for new customers with input validation and submission to backend.

#### 🟢 PROD — Frontend — login form/page
**Objetivo:** Implement login form for existing customers with input validation and submission to backend.

#### 🟢 PROD — Frontend — forgot password form/page
**Objetivo:** Implement form to request password reset, submitting email to backend.

#### 🟢 PROD — Frontend — reset password form/page
**Objetivo:** Implement form to set a new password using a token from email.

### Wave 3

#### 🔴 TEST — Tests: infra/docker-compose.yml
**Objetivo:** TDD — escribe los tests ANTES que el código de producción.
**Archivos:**
- `infra/tests/test_docker_compose.py` (create/modify)
**Casos de prueba:**
- `test_compose_file_defines_all_services`: docker-compose.yml must define services for backend (auth-service), frontend, and database (PostgreSQL).
  - Expected: `{'services': ['auth-service', 'frontend', 'db']}`
- `test_compose_file_includes_healthchecks_and_depends_on`: docker-compose.yml must include healthcheck and depends_on for backend and frontend services.
  - Expected: `{'auth-service': {'healthcheck': True, 'depends_on': ['db']}, 'frontend': {'healthcheck': True, 'depends_on': ['auth-service']}}`
- `test_compose_file_exposes_correct_ports`: docker-compose.yml must expose port 23001 for auth-service and the correct port for frontend.
  - Expected: `{'auth-service': {'ports': ['23001:23001']}, 'frontend': {'ports': ['3000:3000']}}`
- `test_compose_file_missing_service_returns_error`: If a required service (auth-service, frontend, or db) is missing from docker-compose.yml, an error must be raised.
  - Input: `{'compose_file': 'missing auth-service'}`
  - Expected: `{'error': 'Missing required service: auth-service'}`
- `test_compose_file_invalid_yaml_returns_error`: If docker-compose.yml is not valid YAML, an error must be raised.
  - Input: `{'compose_file': 'invalid YAML'}`
  - Expected: `{'error': 'Invalid YAML syntax'}`

#### 🟢 PROD — Infrastructure & Deployment
**Objetivo:** Provide complete Docker orchestration and documentation for local development and deployment.
**Archivos:**
- `infra/docker-compose.yml` (create/modify)
- `run.sh` (create/modify)
- `README.md` (create/modify)

---

## §3 Scope — Archivos Permitidos

Crea o modifica **ÚNICAMENTE** estos archivos:

- `README.md`
- `backend/auth-service/run_tests.sh`
- `backend/auth-service/tests/test_routes.py`
- `backend/shared/run_tests.sh`
- `backend/shared/tests/test_security.py`
- `frontend/run_tests.sh`
- `frontend/tests/api/auth.test.ts`
- `frontend/tests/pages/LoginPage.test.tsx`
- `frontend/tests/pages/RegisterPage.test.tsx`
- `frontend/tests/pages/ResetPasswordPage.test.tsx`
- `infra/docker-compose.yml`
- `infra/run_tests.sh`
- `infra/tests/test_docker_compose.py`
- `infra/tests/test_readme_md.py`
- `infra/tests/test_run_sh.py`
- `run.sh`

**FORBIDDEN:** No toques archivos fuera de esta lista.

---

## §4 STATE.md — Registro de Avance

Crea/actualiza `STATE.md` al completar cada ítem:

```markdown
# STATE.md
## Completados
- [x] ITEM-1: <título> (commit: <hash>)
## Pendientes
- [ ] ITEM-2: <título>
## Fallos
- ITEM-X primer intento: <error breve>
```

---

## §6 Instrucciones

**Orden TDD obligatorio:**
1. Implementa TODOS los 🔴 TEST antes de cualquier 🟢 PROD
2. Corre los tests — deben fallar (RED phase)
3. Implementa 🟢 PROD para hacerlos pasar (GREEN phase)
4. Si no hay 🔴 TEST, implementa 🟢 PROD directamente

**Reglas de infraestructura (greenfield):**
- `WORKDIR /app` en todos los Dockerfiles
- Puertos host en docker-compose.yml: rango **21000–65000** (nunca < 21000)
- Base de datos: esperar startup → migrar → seed 3-5 registros (idempotente)
- Frontend Vite: `index.html` en raíz del proyecto (no en `public/`)
- Env vars frontend: `import.meta.env.VITE_*` con fallback, nunca hardcoded
- Todos los archivos del §2 deben existir en disco al finalizar

**Comandos de test:**
- pytest: `python -m pytest tests/ --tb=short -q`
- vitest: `npx vitest run --coverage`

**Finalización:** `git add -A && git commit -m 'feat: implement HU'`