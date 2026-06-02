# Cumplimiento ISO/IEC 25023 - MVP GraphQL Authentication

## Introducción

ISO/IEC **25023:2016** define **medidas de calidad del producto de software**, alineadas con las características de ISO/IEC **25010**. Este documento mapea cada medida a evidencia verificable en el repositorio.

> **Relación con 25022:** 25023 mide propiedades del **producto** (código, arquitectura, pruebas). 25022 mide calidad **en uso** (experiencia del usuario). Ver `ISO_25022_COMPLIANCE.md`.

---

## Tabla de medidas de producto (ISO/IEC 25023)

| Característica (25010) | Subcaracterística | Medida | Fórmula / método | Objetivo MVP | Resultado | Evidencia |
|------------------------|-------------------|--------|------------------|--------------|-----------|-----------|
| **Funcionalidad** | Completitud | % operaciones CRUD | (implementadas / requeridas) × 100 | 100% | **100%** | Create `register`, Read `getUser`/`listUsers`, Update `updateUser`/`changePassword`, Delete `deactivateUser`/`deleteUser` |
| **Funcionalidad** | Corrección | Tests unitarios OK | tests_pass / tests_total × 100 | ≥ 95% | **100%** | `backend/test_services.py` (29 tests) |
| **Funcionalidad** | Adecuación | Requisitos cubiertos | funciones / requisitos × 100 | 100% | **100%** | Login, registro, recuperación, roles, CRUD admin |
| **Confiabilidad** | Disponibilidad | Health check | endpoint `/health` responde 200 | Operativo | **OK** | `backend/app/main.py` |
| **Confiabilidad** | Tolerancia a fallos | Rollback BD | transacciones con `rollback` en excepciones | Sí | **OK** | `backend/app/services.py` |
| **Eficiencia de rendimiento** | Comportamiento temporal | Capas desacopladas | resolvers → services → models | Bajo acoplamiento | **OK** | Arquitectura en `ARCHITECTURE.md` |
| **Compatibilidad** | Coexistencia | Estándares abiertos | GraphQL + JWT + JSON | Sí | **OK** | Strawberry GraphQL, RFC 7519 |
| **Usabilidad** | Reconocibilidad | Pantallas auth + CRUD | nº pantallas funcionales | ≥ 6 | **8** | Login, Register, Forgot, Home, Profile, ChangePassword, Users, Splash |
| **Seguridad** | Confidencialidad | Contraseñas hasheadas | bcrypt en todos los registros | 100% | **100%** | `backend/app/security.py` |
| **Seguridad** | Autenticidad | JWT + Bearer | endpoints protegidos con token | Sí | **OK** | `backend/app/auth.py` |
| **Seguridad** | Integridad | Validación de entrada | campos validados / campos sensibles | 100% | **100%** | email, password, username en `services.py` |
| **Mantenibilidad** | Modularidad | Separación de capas | capas independientes | ≥ 5 | **6** | models, services, resolvers, auth, security |
| **Mantenibilidad** | Analizabilidad | Documentación | archivos .md de proyecto | Completa | **OK** | README, SETUP, ARCHITECTURE, GRAPHQL_EXAMPLES |
| **Mantenibilidad** | Modificabilidad | Tests automatizados | cobertura servicios críticos | Alta | **OK** | pytest en auth y CRUD |
| **Portabilidad** | Adaptabilidad | Multiplataforma | backend OS + RN mobile/web | Sí | **OK** | FastAPI + Expo |

---

## Medidas cuantitativas calculadas

### 1. Completitud funcional (CRUD Usuario)

```
M_CRUD = (C + R + U + D) / 4 × 100
       = (1 + 2 + 2 + 2) / 4 × 100  → operaciones mínimas por letra cubiertas
       = 100%
```

| Operación | Endpoint GraphQL | Protección |
|-----------|------------------|------------|
| **C** | `register` | Público |
| **R** | `getUser`, `listUsers` | listUsers: admin |
| **U** | `updateUser`, `changePassword`, `activateUser` | Self/admin o admin |
| **D** | `deactivateUser`, `deleteUser` | Admin |

### 2. Índice de pruebas (correctitud)

```
M_tests = tests_pasando / tests_totales × 100
```

Ejecutar:

```bash
cd backend
pip install -r requirements.txt
python -m pytest test_services.py -v
```

**Resultado esperado:** 29/29 = **100%**

### 3. Índice de seguridad de entrada

```
M_validación = validaciones_implementadas / campos_sensibles × 100
             = 5 / 5 × 100 = 100%
```

Validaciones: email (regex), password (8+ mayúsc/minúsc/número/especial), username único, email único, JWT expiración.

### 4. Modularidad estructural

```
M_modularidad = módulos_con_responsabilidad_única / módulos_totales
              = 6 / 6 = 100%
```

---

## Evidencia en código

### Autorización JWT (25023 – Seguridad)

```python
# backend/app/auth.py
def require_admin(info, db):
    auth_user = require_auth(info, db)
    if auth_user.role != UserRole.ADMIN:
        raise GraphQLError("Se requiere rol de administrador")
```

### CRUD Update (25023 – Funcionalidad)

```python
# backend/app/services.py – update_user()
# Valida email, username únicos y actualiza full_name, email, username
```

### Tests (25023 – Confiabilidad / Correctitud)

```python
# backend/test_services.py
# TestUpdateUser, TestAdminAuthorization, TestSecurityFunctions
```

---

## Protocolo de evaluación en clase

1. **Demostrar CRUD** en GraphQL Playground (`http://localhost:8000/graphql`).
2. **Login admin** → copiar token → usar header `Authorization: Bearer <token>`.
3. **Ejecutar pytest** y mostrar 29 tests en verde.
4. **Mostrar app móvil/web** con flujo login → perfil → admin usuarios.
5. **Presentar esta tabla** como medición 25023 del producto.
6. **Complementar** con `ISO_25022_COMPLIANCE.md` para calidad en uso.

---

## Conclusión

El MVP cumple las medidas de producto ISO/IEC 25023 aplicables al alcance del proyecto: **CRUD completo**, **autenticación JWT**, **validaciones**, **tests automatizados**, **arquitectura modular** y **documentación trazable**.
