import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_register_valid_user_returns_201():
    response = client.post(
        "/api/auth/register",
        json={"email": "newuser@example.com", "password": "StrongPass123"}
    )
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert data["email"] == "newuser@example.com"


def test_register_existing_email_returns_409():
    client.post(
        "/api/auth/register",
        json={"email": "existing@example.com", "password": "AnotherPass123"}
    )
    response = client.post(
        "/api/auth/register",
        json={"email": "existing@example.com", "password": "AnotherPass123"}
    )
    assert response.status_code == 409


def test_register_invalid_email_returns_400():
    response = client.post(
        "/api/auth/register",
        json={"email": "not-an-email", "password": "ValidPass123"}
    )
    assert response.status_code == 400


def test_register_short_password_returns_400():
    response = client.post(
        "/api/auth/register",
        json={"email": "shortpass@example.com", "password": "short"}
    )
    assert response.status_code == 400


def test_login_valid_credentials_returns_200():
    client.post(
        "/api/auth/register",
        json={"email": "loginuser@example.com", "password": "ValidPass123"}
    )
    response = client.post(
        "/api/auth/login",
        json={"email": "loginuser@example.com", "password": "ValidPass123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password_returns_401():
    client.post(
        "/api/auth/register",
        json={"email": "loginuser2@example.com", "password": "ValidPass123"}
    )
    response = client.post(
        "/api/auth/login",
        json={"email": "loginuser2@example.com", "password": "WrongPass"}
    )
    assert response.status_code == 401


def test_login_nonexistent_email_returns_401():
    response = client.post(
        "/api/auth/login",
        json={"email": "doesnotexist@example.com", "password": "AnyPass123"}
    )
    assert response.status_code == 401


def test_login_missing_email_returns_400():
    response = client.post(
        "/api/auth/login",
        json={"password": "ValidPass123"}
    )
    assert response.status_code == 400


def test_login_missing_password_returns_400():
    response = client.post(
        "/api/auth/login",
        json={"email": "loginuser@example.com"}
    )
    assert response.status_code == 400


def test_forgot_password_valid_email_returns_200():
    response = client.post(
        "/api/auth/forgot-password",
        json={"email": "forgotuser@example.com"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "message" in data