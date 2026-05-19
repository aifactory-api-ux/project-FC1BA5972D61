import pytest
import os
import yaml


def test_readme_includes_setup_instructions():
    readme_path = os.path.join(os.path.dirname(__file__), "..", "README.md")
    if not os.path.exists(readme_path):
        pytest.fail("README.md not found")

    with open(readme_path, "r") as f:
        content = f.read().lower()

    assert "setup" in content or "installation" in content, "Missing Setup section"
    assert "environment" in content or "env" in content, "Missing Environment Variables section"


def test_readme_includes_run_and_test_instructions():
    readme_path = os.path.join(os.path.dirname(__file__), "..", "README.md")
    if not os.path.exists(readme_path):
        pytest.fail("README.md not found")

    with open(readme_path, "r") as f:
        content = f.read().lower()

    assert "run" in content, "Missing Run section"
    assert "test" in content, "Missing Test section"


def test_readme_documents_api_endpoints():
    readme_path = os.path.join(os.path.dirname(__file__), "..", "README.md")
    if not os.path.exists(readme_path):
        pytest.fail("README.md not found")

    with open(readme_path, "r") as f:
        content = f.read()

    endpoints = [
        "/api/auth/register",
        "/api/auth/login",
        "/api/auth/forgot-password",
        "/api/auth/reset-password",
        "/api/auth/me"
    ]

    for endpoint in endpoints:
        assert endpoint in content, f"Missing endpoint: {endpoint}"


def test_readme_missing_required_section_returns_error():
    readme_path = os.path.join(os.path.dirname(__file__), "..", "README.md")
    if not os.path.exists(readme_path):
        pytest.fail("README.md not found")

    with open(readme_path, "r") as f:
        content = f.read().lower()

    required_sections = ["setup", "run", "test", "endpoint"]
    missing = [s for s in required_sections if s not in content]

    if missing:
        pytest.fail(f"Missing required section: {missing[0]}")


def test_readme_includes_troubleshooting_section():
    readme_path = os.path.join(os.path.dirname(__file__), "..", "README.md")
    if not os.path.exists(readme_path):
        pytest.fail("README.md not found")

    with open(readme_path, "r") as f:
        content = f.read().lower()

    assert "troubleshoot" in content or "faq" in content or "common issues" in content, "Missing Troubleshooting section"