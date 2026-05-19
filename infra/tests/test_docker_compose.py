import pytest
import os
import yaml


def test_compose_file_defines_all_services():
    compose_path = os.path.join(os.path.dirname(__file__), "..", "docker-compose.yml")
    if not os.path.exists(compose_path):
        pytest.fail("docker-compose.yml not found")

    with open(compose_path, "r") as f:
        compose_data = yaml.safe_load(f)

    services = compose_data.get("services", {})
    required_services = ["auth-service", "frontend", "db"]

    for service in required_services:
        assert service in services, f"Missing required service: {service}"


def test_compose_file_includes_healthchecks_and_depends_on():
    compose_path = os.path.join(os.path.dirname(__file__), "..", "docker-compose.yml")
    if not os.path.exists(compose_path):
        pytest.fail("docker-compose.yml not found")

    with open(compose_path, "r") as f:
        compose_data = yaml.safe_load(f)

    services = compose_data.get("services", {})

    assert "auth-service" in services
    auth_service = services["auth-service"]
    assert "healthcheck" in auth_service or "depends_on" in auth_service, "auth-service missing healthcheck or depends_on"

    assert "frontend" in services
    frontend = services["frontend"]
    assert "healthcheck" in frontend or "depends_on" in frontend, "frontend missing healthcheck or depends_on"


def test_compose_file_exposes_correct_ports():
    compose_path = os.path.join(os.path.dirname(__file__), "..", "docker-compose.yml")
    if not os.path.exists(compose_path):
        pytest.fail("docker-compose.yml not found")

    with open(compose_path, "r") as f:
        compose_data = yaml.safe_load(f)

    services = compose_data.get("services", {})

    assert "auth-service" in services
    auth_ports = services["auth-service"].get("ports", [])
    assert "23001:23001" in auth_ports or any("23001" in str(p) for p in auth_ports), "auth-service port 23001 not exposed"

    assert "frontend" in services
    frontend_ports = services["frontend"].get("ports", [])
    assert any("3000" in str(p) for p in frontend_ports), "frontend port 3000 not exposed"


def test_compose_file_missing_service_returns_error():
    compose_path = os.path.join(os.path.dirname(__file__), "..", "docker-compose.yml")
    if not os.path.exists(compose_path):
        pytest.fail("docker-compose.yml not found")

    with open(compose_path, "r") as f:
        compose_data = yaml.safe_load(f)

    services = compose_data.get("services", {})
    required_services = ["auth-service", "frontend", "db"]

    missing = [s for s in required_services if s not in services]
    if missing:
        pytest.fail(f"Missing required service: {missing[0]}")


def test_compose_file_invalid_yaml_returns_error():
    import io
    from yaml import YAMLSafeLoader

    invalid_yaml = "invalid: yaml: content: ["

    try:
        yaml.safe_load(invalid_yaml)
        pytest.fail("Should have raised an exception for invalid YAML")
    except yaml.YAMLError:
        pass