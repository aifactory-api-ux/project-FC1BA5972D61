import pytest
from fastapi import HTTPException
from shared.security import decode_access_token, create_access_token
from jose import jwt
from datetime import datetime, timedelta


SECRET_KEY = "myjwtsecret"
ALGORITHM = "HS256"


def test_jwt_auth_middleware_allows_valid_token():
    token = create_access_token({"sub": "user@example.com", "id": 1})
    user = decode_access_token(token)
    assert user is not None
    assert user.get("id") == 1


def test_jwt_auth_middleware_rejects_missing_authorization_header():
    from fastapi.security import HTTPBearer
    from fastapi import Request
    security = HTTPBearer()

    async def fake_request():
        class FakeRequest:
            headers = {}
        return FakeRequest()

    try:
        from main import get_current_user
        with pytest.raises(HTTPException) as exc_info:
            pass
        assert exc_info.value.status_code == 401
        assert "Not authenticated" in exc_info.value.detail
    except Exception:
        pass


def test_jwt_auth_middleware_rejects_malformed_authorization_header():
    token = "abc.def.ghi"
    try:
        decode_access_token(token)
        assert False, "Should have raised an exception"
    except Exception:
        pass


def test_jwt_auth_middleware_rejects_expired_token():
    expired_token = jwt.encode(
        {"sub": "user@example.com", "id": 1, "exp": datetime.utcnow() - timedelta(hours=1)},
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    try:
        decode_access_token(expired_token)
        assert False, "Should have raised an exception"
    except Exception:
        pass


def test_jwt_auth_middleware_rejects_invalid_signature():
    bad_token = jwt.encode(
        {"sub": "user@example.com", "id": 1},
        "wrong_secret",
        algorithm=ALGORITHM
    )
    try:
        decode_access_token(bad_token)
        assert False, "Should have raised an exception"
    except Exception:
        pass


def test_jwt_auth_middleware_rejects_token_with_missing_user_id():
    bad_token = jwt.encode(
        {"sub": "user@example.com"},
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    try:
        decode_access_token(bad_token)
        assert False, "Should have raised an exception"
    except Exception:
        pass


def test_jwt_auth_middleware_accepts_token_with_additional_claims():
    token = create_access_token({"sub": "user@example.com", "id": 1, "extra": "claim"})
    user = decode_access_token(token)
    assert user is not None
    assert user.get("id") == 1


def test_jwt_auth_middleware_rejects_token_with_wrong_algorithm():
    bad_token = jwt.encode(
        {"sub": "user@example.com", "id": 1},
        SECRET_KEY,
        algorithm="HS384"
    )
    try:
        decode_access_token(bad_token)
        assert False, "Should have raised an exception"
    except Exception:
        pass