# Test Report — Registro y login de clientes

> Generado: 2026-05-19 00:07 UTC  
> Estado general: **❌ FAIL**

## 1. Resumen ejecutivo

| Métrica | Valor |
|---------|-------|
| Lint | ✅ OK |
| Suites ejecutadas | 4 |
| Suites OK | 1 |
| Suites FAIL | 3 |
| Archivos fuera de scope | 0 |

## 2. ❌ `backend/auth-service/run_tests.sh`

**Estado:** FAIL  
<details>
<summary>Output completo</summary>

```
>>> [auth-service] Installing Python test dependencies...
>>> [auth-service] Running tests...
/usr/local/lib/python3.11/site-packages/pytest_asyncio/plugin.py:208: PytestDeprecationWarning: The configuration option "asyncio_default_fixture_loop_scope" is unset.
The event loop scope for asynchronous fixtures will default to the fixture caching scope. Future versions of pytest-asyncio will default the loop scope for asynchronous fixtures to function scope. Set the default fixture loop scope explicitly in order to avoid unexpected behavior in the future. Valid fixture loop scopes are: "function", "class", "module", "package", "session"

  warnings.warn(PytestDeprecationWarning(_DEFAULT_FIXTURE_LOOP_SCOPE_UNSET))

==================================== ERRORS ====================================
____________________ ERROR collecting tests/test_routes.py _____________________
ImportError while importing test module '/workspace/FC1BA5972D61/backend/auth-service/tests/test_routes.py'.
Hint: make sure your test modules/packages have valid Python names.
Traceback:
/usr/local/lib/python3.11/importlib/__init__.py:126: in import_module
    return _bootstrap._gcd_import(name[level:], package, level)
tests/test_routes.py:3: in <module>
    from main import app
main.py:5: in <module>
    from database import engine, get_db, Base
E   ImportError: cannot import name 'Base' from 'database' (/workspace/FC1BA5972D61/backend/auth-service/database.py)
=============================== warnings summary ===============================
../../../../home/appuser/.local/lib/python3.11/site-packages/starlette/formparsers.py:12
  /home/appuser/.local/lib/python3.11/site-packages/starlette/formparsers.py:12: PendingDeprecationWarning: Please use `import python_multipart` instead.
    import multipart

-- Docs: https://docs.pytest.org/en/stable/how-to/capture-warnings.html
=========================== short test summary info ============================
ERROR tests/test_routes.py
!!!!!!!!!!!!!!!!!!!! Interrupted: 1 error during collection !!!!!!!!!!!!!!!!!!!!
1 warning, 1 error in 9.79s
```
</details>

## 3. ✅ `backend/shared/run_tests.sh`

**Estado:** PASS  
**Coverage:** `TOTAL                       96     15    84%`

<details>
<summary>Output completo</summary>

```
>>> [shared] Installing Python test dependencies...
>>> [shared] Running tests...
/usr/local/lib/python3.11/site-packages/pytest_asyncio/plugin.py:208: PytestDeprecationWarning: The configuration option "asyncio_default_fixture_loop_scope" is unset.
The event loop scope for asynchronous fixtures will default to the fixture caching scope. Future versions of pytest-asyncio will default the loop scope for asynchronous fixtures to function scope. Set the default fixture loop scope explicitly in order to avoid unexpected behavior in the future. Valid fixture loop scopes are: "function", "class", "module", "package", "session"

  warnings.warn(PytestDeprecationWarning(_DEFAULT_FIXTURE_LOOP_SCOPE_UNSET))
........                                                                 [100%]
=============================== warnings summary ===============================
../../../../home/appuser/.local/lib/python3.11/site-packages/starlette/formparsers.py:12
  /home/appuser/.local/lib/python3.11/site-packages/starlette/formparsers.py:12: PendingDeprecationWarning: Please use `import python_multipart` instead.
    import multipart

../../../../usr/local/lib/python3.11/site-packages/passlib/utils/__init__.py:854
  /usr/local/lib/python3.11/site-packages/passlib/utils/__init__.py:854: DeprecationWarning: 'crypt' is deprecated and slated for removal in Python 3.13
    from crypt import crypt as _crypt

-- Docs: https://docs.pytest.org/en/stable/how-to/capture-warnings.html
================================ tests coverage ================================
_______________ coverage: platform linux, python 3.11.15-final-0 _______________

Name                     Stmts   Miss  Cover   Missing
------------------------------------------------------
__init__.py                  0      0   100%
security.py                 28      3    89%   13, 17, 23
tests/test_security.py      68     12    82%   25-27, 31-34, 43, 56, 69, 82, 102
------------------------------------------------------
TOTAL                       96     15    84%
Coverage JSON written to file coverage/coverage.json
8 passed, 2 warnings in 9.13s
>>> [shared] Done.
```
</details>

## 4. ❌ `infra/run_tests.sh`

**Estado:** FAIL  
<details>
<summary>Output completo</summary>

```
>>> [infra] Installing Python test dependencies...
>>> [infra] Running tests...
/usr/local/lib/python3.11/site-packages/pytest_asyncio/plugin.py:208: PytestDeprecationWarning: The configuration option "asyncio_default_fixture_loop_scope" is unset.
The event loop scope for asynchronous fixtures will default to the fixture caching scope. Future versions of pytest-asyncio will default the loop scope for asynchronous fixtures to function scope. Set the default fixture loop scope explicitly in order to avoid unexpected behavior in the future. Valid fixture loop scopes are: "function", "class", "module", "package", "session"

  warnings.warn(PytestDeprecationWarning(_DEFAULT_FIXTURE_LOOP_SCOPE_UNSET))
....F.....FFFFF                                                          [100%]
=================================== FAILURES ===================================
_________________ test_compose_file_invalid_yaml_returns_error _________________
tests/test_docker_compose.py:77: in test_compose_file_invalid_yaml_returns_error
    from yaml import YAMLSafeLoader
E   ImportError: cannot import name 'YAMLSafeLoader' from 'yaml' (/usr/local/lib/python3.11/site-packages/yaml/__init__.py)
_____________________ test_run_sh_checks_docker_installed ______________________
/usr/local/lib/python3.11/site-packages/_pytest/monkeypatch.py:90: in annotated_getattr
    obj = getattr(obj, name)
E   AttributeError: module 'subprocess' has no attribute 'which'

The above exception was the direct cause of the following exception:
tests/test_run_sh.py:12: in test_run_sh_checks_docker_installed
    monkeypatch.setattr("subprocess.which", mock_which)
/usr/local/lib/python3.11/site-packages/_pytest/monkeypatch.py:104: in derive_importpath
    annotated_getattr(target, attr, ann=module)
/usr/local/lib/python3.11/site-packages/_pytest/monkeypatch.py:92: in annotated_getattr
    raise AttributeError(
E   AttributeError: 'module' object at subprocess has no attribute 'which'
____________________ test_run_sh_builds_and_starts_services ____________________
tests/test_run_sh.py:39: in test_run_sh_builds_and_starts_services
    assert any("docker-compose up --build" in cmd for cmd in commands)
E   assert False
E    +  where False = any(<generator object test_run_sh_builds_and_starts_services.<locals>.<genexpr> at 0x7f6fe6a4a740>)
____________________ test_run_sh_waits_for_services_healthy ____________________
tests/test_run_sh.py:59: in test_run_sh_waits_for_services_healthy
    assert len(health_checks) > 0
E   assert 0 > 0
E    +  where 0 = len([])
___________________ test_run_sh_prints_access_url_on_success ___________________
tests/test_run_sh.py:89: in test_run_sh_prints_access_url_on_success
    assert "Frontend available at http://localhost:3000" in result.stdout or "http://localhost:3000" in result.stdout
E   AssertionError: assert ('Frontend available at http://localhost:3000' in '' or 'http://localhost:3000' in '')
E    +  where '' = CompletedProcess(args=['bash', '-c', 'source run.
```
</details>

## 5. ❌ `frontend/run_tests.sh`

**Estado:** FAIL  
<details>
<summary>Output completo</summary>

```
>>> [frontend] Installing JS test dependencies...
>>> [frontend] Running tests...
 MISSING DEPENDENCY  Cannot find dependency '@vitest/coverage-v8'
```
</details>

## 6. Lint

**Estado:** ✅ OK  

## 7. Coverage por módulo

| Módulo | Coverage |
|--------|----------|
| `backend/shared/coverage` | 84% |
| `infra/coverage` | 75% |

## 8. Tests fallidos — detalle

### `backend/auth-service/run_tests.sh`

```
==================================== ERRORS ====================================
____________________ ERROR collecting tests/test_routes.py _____________________
ImportError while importing test module '/workspace/FC1BA5972D61/backend/auth-service/tests/test_routes.py'.
E   ImportError: cannot import name 'Base' from 'database' (/workspace/FC1BA5972D61/backend/auth-service/database.py)
ERROR tests/test_routes.py
```

### `frontend/run_tests.sh`

```
>>> [frontend] Installing JS test dependencies...
>>> [frontend] Running tests...
 MISSING DEPENDENCY  Cannot find dependency '@vitest/coverage-v8'
```

### `infra/run_tests.sh`

```
E   ImportError: cannot import name 'YAMLSafeLoader' from 'yaml' (/usr/local/lib/python3.11/site-packages/yaml/__init__.py)
E   AttributeError: module 'subprocess' has no attribute 'which'
    raise AttributeError(
E   AttributeError: 'module' object at subprocess has no attribute 'which'
    assert any("docker-compose up --build" in cmd for cmd in commands)
E   assert False
    assert len(health_checks) > 0
E   assert 0 > 0
    assert "Frontend available at http://localhost:3000" in result.stdout or "http://localhost:3000" in result.stdout
E   AssertionError: assert ('Frontend available at http://localhost:3000' in '' or 'http://localhost:3000' in '')
```

## 9. Dependencias faltantes

- `frontend/run_tests.sh`: MISSING DEPENDENCY  Cannot find dependency '@vitest/coverage-v8'

## 10. Archivos fuera de scope

_Ningún archivo fuera de scope._

## 11. Próximos pasos

- [ ] Revisar tests fallidos y corregir implementación
- [ ] Instalar dependencias faltantes en el entorno de CI

- [ ] Aprobar PR para merge a `main`
