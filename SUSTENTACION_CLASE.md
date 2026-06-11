# Sustentación de clase — LoginMetricas (hoja de apoyo)

Usa este documento como guion. Los archivos `ISO_25022_COMPLIANCE.md` e `ISO_25023_COMPLIANCE.md` son la evidencia formal.

---

## 1. Frase de apertura (30 s)

> Presentamos un **MVP de autenticación y gestión de usuarios** con **FastAPI + GraphQL (Strawberry) + React (Vite)**. Aplicamos el marco **SQuaRE**: **ISO/IEC 25023** (calidad del *producto*) e **ISO/IEC 25022** (calidad *en uso*).

---

## 2. Arranque en clase (2 terminales)

**Terminal 1 — Backend**
```bash
cd backend
python3.11 -m venv venv          # o python -m venv venv si ya es 3.11+
source venv/bin/activate         # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m app.main
```
Comprobar: http://localhost:8000/health → `{"status":"ok",...}`

**Terminal 2 — Web**
```bash
cd web
npm install
npm run dev
```
Abrir: **http://localhost:5173**

| Demo | Valor |
|------|--------|
| Email | `admin@admin.com` |
| Contraseña | `Admin123!` |
| Atajo | Botón **«Entrar con cuenta demo»** en login |

> El admin se crea/restablece al iniciar el backend (`database.py` → `seed_default_admin`).

**Requisito tests:** Python **3.10+** (recomendado **3.11**). Con 3.9 falla la colección de pytest.

---

## 3. Demo en vivo (orden sugerido, ~2 min)

1. **Login** → «Entrar con cuenta demo» → Home.
2. **Perfil** (`/profile`) → cambiar nombre → guardar (mutation `updateUser`).
3. **Usuarios** (`/users`, solo admin) → listar → desactivar → reactivar → eliminar (CRUD admin).
4. **Registro** (opcional) → mostrar validación de contraseña débil.
5. **Olvidé contraseña** → mensaje genérico (no revela si el email existe).
6. **GraphQL Playground:** http://localhost:8000/graphql (pegar token si hace falta).

---

## 4. Arquitectura (1 min)

| Capa | Tecnología | Archivo clave |
|------|------------|---------------|
| UI | React + Vite (`web/`) | `web/src/pages/LoginPage.jsx`, `UsersPage.jsx` |
| Cliente API | Apollo Client | `web/src/services/graphqlClient.js` |
| API | GraphQL Strawberry | `backend/app/resolvers.py` |
| Negocio | Servicios | `backend/app/services.py` |
| Auth / roles | JWT + bcrypt | `backend/app/auth.py`, `security.py` |
| Datos | SQLite | `backend/app/models.py`, `database.py` |

**Flujo:** UI → GraphQL → `resolvers` → `services` → BD. El contexto inyecta `db` y `request` en cada operación (`main.py` → `get_graphql_context`).

---

## 5. CRUD y operaciones GraphQL (memorizar)

| Letra | Operación | GraphQL | Quién |
|-------|-----------|---------|--------|
| **C** | Crear | `register` | Público |
| **R** | Leer uno | `getUser` | Autenticado |
| **R** | Listar | `listUsers` | **Admin** |
| **U** | Actualizar perfil | `updateUser` | Propio usuario o admin |
| **U** | Cambiar contraseña | `changePassword` | Propio usuario o admin |
| **U** | Reactivar | `activateUser` | **Admin** |
| **D** | Soft delete | `deactivateUser` (`is_active=false`) | **Admin** |
| **D** | Hard delete | `deleteUser` | **Admin** |

**Auth adicional:** `login`, `verifyToken`, `requestPasswordReset`, `resetPassword`.

**Seguridad admin:** `backend/app/auth.py` → `require_admin`, `require_self_or_admin`; sin JWT válido o rol incorrecto → error GraphQL.

---

## 6. ISO/IEC 25023 — Calidad de producto (1.5 min)

Abrir `ISO_25023_COMPLIANCE.md` y destacar:

- **Completitud funcional:** CRUD usuario al 100 % (tabla de operaciones).
- **Correctitud:** tests automatizados.
- **Seguridad:** bcrypt + JWT + validación de contraseña fuerte.
- **Mantenibilidad:** capas separadas (models, services, resolvers, auth, security).

**Evidencia en vivo — tests:**
```bash
cd backend
source venv/bin/activate
python -m pytest test_services.py -v
```
**Resultado esperado: 29 passed** (100 %).

**Fórmulas que puede preguntar el docente:**
- Completitud CRUD: `(operaciones implementadas / requeridas) × 100` → **100 %**
- Correctitud: `tests_ok / tests_total × 100` → **29/29 = 100 %**

---

## 7. ISO/IEC 25022 — Calidad en uso (1 min)

Abrir `ISO_25022_COMPLIANCE.md` y vincular con la demo web:

| Característica 25022 | Cómo lo demuestras |
|----------------------|-------------------|
| **Efectividad** | Login demo en 1 clic; admin gestiona usuarios sin consola |
| **Eficiencia** | Login: 2 campos + 1 botón |
| **Satisfacción** | Errores en español; UI consistente (DM Sans, paleta en `index.css`) |
| **Libertad de riesgo** | Contraseñas hasheadas; JWT; roles; mensajes genéricos en login/reset |
| **Cobertura de contexto** | Roles admin/cliente; web responsive |

---

## 8. Preguntas del docente — respuestas cortas

| Pregunta | Respuesta |
|----------|-----------|
| ¿Por qué GraphQL? | Un endpoint tipado; el cliente pide solo los campos necesarios; ideal para auth + CRUD. |
| ¿Por qué no REST puro? | Mismo backend podría exponer REST; GraphQL reduce over-fetching y documenta el esquema. |
| ¿Dónde está el CRUD? | Mutations/queries en `resolvers.py`; lógica en `services.py`. |
| ¿Cómo miden 25023? | Tabla en `ISO_25023_COMPLIANCE.md` + **pytest** (evidencia reproducible). |
| ¿Cómo miden 25022? | Protocolo en `ISO_25022_COMPLIANCE.md` + **demo observable** en el navegador. |
| ¿Soft vs hard delete? | `deactivateUser` → `is_active=false`; `deleteUser` borra el registro. |
| ¿Quién puede listar usuarios? | Solo **admin** (`require_admin` en `list_users`). |
| ¿Cómo se guarda la contraseña? | **bcrypt** en `security.py`; nunca en texto plano. |
| ¿Cómo viaja el token? | Header `Authorization: Bearer <JWT>`; frontend: `localStorage` + Apollo `authLink`. |
| ¿Qué pasa si el token expira? | `verifyToken` / `restoreSession` fallan → vuelve a login. |
| ¿Relación 25022 vs 25023? | **25023** = propiedades del producto (código, tests). **25022** = experiencia del usuario usando el sistema. |

---

## 9. Ejemplo GraphQL (Playground)

**Login:**
```graphql
mutation {
  login(input: { email: "admin@admin.com", password: "Admin123!" }) {
    success
    message
    accessToken
    user { id email role }
  }
}
```

**Listar usuarios (header: Authorization: Bearer TOKEN):**
```graphql
query {
  listUsers(skip: 0, limit: 50) {
    total
    users { id email username role isActive }
  }
}
```

Más ejemplos en `GRAPHQL_EXAMPLES.md`.

---

## 10. Checklist antes de presentar

- [ ] Repo: `https://github.com/OscarMeza24/LoginMetricas` (rama `master`)
- [ ] Python 3.11+ y Node instalados
- [ ] `/health` OK y web en `5173`
- [ ] Botón demo funciona
- [ ] `pytest` → **29 passed**
- [ ] Abiertos: este archivo + `ISO_25022_COMPLIANCE.md` + `ISO_25023_COMPLIANCE.md`
- [ ] Proyector probado con http://localhost:5173

---

## 11. Cierre (30 s)

> El MVP cumple **login, registro, recuperación de contraseña, CRUD de usuarios con roles**, con **métricas ISO 25022 y 25023 documentadas**, **evidencia en código** y **29 pruebas unitarias automatizadas**.

---

## Tu fork en GitHub

Repo: `https://github.com/OscarMeza24/LoginMetricas` — rama `master` (incluye carpeta `web/`).
