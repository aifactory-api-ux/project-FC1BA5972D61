import pytest
import subprocess
import os


def test_run_sh_checks_docker_installed(monkeypatch):
    def mock_which(cmd):
        if cmd == "docker":
            return None
        return f"/usr/bin/{cmd}"

    monkeypatch.setattr("subprocess.which", mock_which)

    result = subprocess.run(
        ["bash", "-c", "source run.sh 2>&1 || true"],
        capture_output=True,
        text=True,
        cwd=os.path.join(os.path.dirname(__file__), "..", "..")
    )
    assert "Docker is not installed" in result.stderr or "Docker is not installed" in result.stdout


def test_run_sh_builds_and_starts_services(monkeypatch):
    commands = []

    def mock_run(cmd, shell=False, check=False, capture_output=False, text=False, cwd=None):
        commands.append(" ".join(cmd) if isinstance(cmd, list) else cmd)
        return subprocess.CompletedProcess(cmd, 0, stdout="", stderr="")

    monkeypatch.setattr("subprocess.run", mock_run)

    subprocess.run(
        ["bash", "-c", "source run.sh 2>&1 || true"],
        capture_output=True,
        text=True,
        cwd=os.path.join(os.path.dirname(__file__), "..", "..")
    )

    assert any("docker-compose up --build" in cmd for cmd in commands)


def test_run_sh_waits_for_services_healthy(monkeypatch):
    health_checks = []

    def mock_run(cmd, shell=False, check=False, capture_output=False, text=False, cwd=None, env=None):
        if "docker-compose" in (cmd if isinstance(cmd, str) else " ".join(cmd)):
            health_checks.append(cmd)
        return subprocess.CompletedProcess(cmd, 0, stdout="", stderr="")

    monkeypatch.setattr("subprocess.run", mock_run)

    subprocess.run(
        ["bash", "-c", "source run.sh 2>&1 || true"],
        capture_output=True,
        text=True,
        cwd=os.path.join(os.path.dirname(__file__), "..", "..")
    )

    assert len(health_checks) > 0


def test_run_sh_prints_access_url_on_success(monkeypatch):
    outputs = []

    def mock_run(cmd, shell=False, check=False, capture_output=False, text=False, cwd=None, env=None):
        return subprocess.CompletedProcess(cmd, 0, stdout="", stderr="")

    def mock_popen(cmd, shell=False, stdout=None, stderr=None, cwd=None, env=None):
        class MockPopen:
            def __init__(self):
                self.returncode = 0
            def communicate(self):
                return ("", "")
            def wait(self):
                return 0
        outputs.append(cmd)
        return MockPopen()

    monkeypatch.setattr("subprocess.run", mock_run)
    monkeypatch.setattr("subprocess.Popen", mock_popen)

    result = subprocess.run(
        ["bash", "-c", "source run.sh 2>&1 || true"],
        capture_output=True,
        text=True,
        cwd=os.path.join(os.path.dirname(__file__), "..", "..")
    )

    assert "Frontend available at http://localhost:3000" in result.stdout or "http://localhost:3000" in result.stdout


def test_run_sh_handles_docker_compose_failure(monkeypatch):
    def mock_popen(cmd, shell=False, stdout=None, stderr=None, cwd=None, env=None):
        class MockPopen:
            def __init__(self):
                self.returncode = 1
            def communicate(self):
                return ("", "Failed to start services")
            def wait(self):
                return 1
        return MockPopen()

    monkeypatch.setattr("subprocess.Popen", mock_popen)

    result = subprocess.run(
        ["bash", "-c", "source run.sh 2>&1 || true"],
        capture_output=True,
        text=True,
        cwd=os.path.join(os.path.dirname(__file__), "..", "..")
    )

    assert result.returncode != 0 or "Failed to start services" in result.stdout or "Failed to start services" in result.stderr