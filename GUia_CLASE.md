# Guía para clase — LoginMetricas MVP

## 1. Llevar el proyecto a clase (3 opciones)

### Opción A — GitHub (recomendada)

En tu PC, con cuenta que tenga acceso al repo `OscarMeza24/LoginMetricas`:

```powershell
cd e:\MVP_Seguridad_Calidad_software\LoginMetricas
git checkout feature/mvp-completo-iso25022-25023
git pull
git push -u origin feature/mvp-completo-iso25022-25023
```

En la laptop de clase:

```powershell
git clone https://github.com/OscarMeza24/LoginMetricas.git
cd LoginMetricas
git checkout feature/mvp-completo-iso25022-25023
```

### Opción B — USB / OneDrive / ZIP

Copia la carpeta `LoginMetricas` **sin** `node_modules` ni `venv`:

- Excluir: `web/node_modules`, `backend/venv`, `backend/__pycache__`
- En clase ejecutar `npm install` y `pip install -r requirements.txt`

### Opción C — Repositorio del equipo

Repositorio principal (merge integrado): **https://github.com/OscarMeza24/LoginMetricas** — rama `master`.

---

## 2. Arrancar en 2 minutos (demo en vivo)

**Terminal 1 — Backend**

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m app.main
```

Verifica: http://localhost:8000/health

**Terminal 2 — Frontend web**

```powershell
cd web
npm install
copy .env.example .env
npm run dev
```

Abre: **http://localhost:5173**

**Login demo:** botón **“Entrar con cuenta demo”**  
(o manual: `admin@admin.com` / `Admin123!`)

---

## 3. Guion de sustentación (5–7 min)

### Intro (30 s)

> “Presentamos un MVP de autenticación y gestión de usuarios con **FastAPI + GraphQL + React**, aplicando el marco **SQuaRE**: **ISO 25023** (calidad del producto) e **ISO 25022** (calidad en uso).”

### Arquitectura (1 min)

| Capa | Tecnología | Archivo clave |
|------|------------|---------------|
| UI | React + Vite (`web/`) | `web/src/pages/LoginPage.jsx`, `UsersPage.jsx` |
| API | GraphQL Strawberry | `backend/app/resolvers.py` |
| Negocio | Servicios | `backend/app/services.py` |
| Seguridad | JWT + bcrypt | `backend/app/auth.py`, `security.py` |
| Datos | SQLite | `backend/app/models.py` |

### Demo en vivo (2 min)

1. Login con cuenta demo → panel principal  
2. **Perfil** → editar nombre (Update)  
3. **Usuarios** (admin) → listar, desactivar, activar, eliminar (CRUD)  
4. GraphQL Playground: http://localhost:8000/graphql  

### ISO 25023 — Calidad de producto (1.5 min)

Abrir `ISO_25023_COMPLIANCE.md` y mostrar:

- **Completitud CRUD:** register, getUser, updateUser, deactivate/delete  
- **Seguridad:** JWT, bcrypt, validación de contraseña fuerte  
- **Confiabilidad:** ejecutar tests:

```powershell
cd backend
python -m pytest test_services.py -v
```

Resultado esperado: **29 tests OK**

### ISO 25022 — Calidad en uso (1 min)

Abrir `ISO_25022_COMPLIANCE.md`:

- **Efectividad:** usuario completa login en 1 clic (botón demo)  
- **Eficiencia:** flujo corto (2 campos)  
- **Satisfacción:** mensajes claros, diseño Impeccable (sin plantilla genérica)  
- **Libertad de riesgo:** contraseñas hasheadas, token JWT, roles admin/cliente  

### Cierre (30 s)

> “El MVP cumple login, CRUD completo sobre usuarios, métricas 25022/25023 documentadas con evidencia en código y tests automatizados.”

---

## 4. Preguntas frecuentes del docente

| Pregunta | Respuesta |
|----------|-----------|
| ¿Por qué GraphQL? | Un solo endpoint, tipado, ideal para CRUD + auth |
| ¿Dónde está el CRUD? | `register`, `getUser`, `listUsers`, `updateUser`, `changePassword`, `deactivateUser`, `deleteUser` |
| ¿Cómo miden 25023? | Tabla con fórmulas en `ISO_25023_COMPLIANCE.md` + pytest |
| ¿Cómo miden 25022? | Flujos de usuario observables en la demo web |
| ¿Qué es soft delete? | `deactivateUser` pone `is_active=false`; `deleteUser` borra el registro |
| ¿Seguridad admin? | `auth.py` valida JWT y rol ADMIN en endpoints sensibles |

---

## 5. Checklist antes de entrar a clase

- [ ] Python **3.11+** instalado (necesario para pytest; 3.9 falla)  
- [ ] Node.js instalado  
- [ ] Backend arranca (`/health` OK)  
- [ ] Web arranca (`5173`)  
- [ ] Botón demo funciona  
- [ ] Tests pasan (29/29)  
- [ ] Tener abiertos: `ISO_25022_COMPLIANCE.md`, `ISO_25023_COMPLIANCE.md`  
- [ ] Proyector probado con http://localhost:5173  

---

## 6. Credenciales demo

| Campo | Valor |
|-------|-------|
| Email | `admin@admin.com` |
| Contraseña | `Admin123!` |
| Rol | Administrador |

La contraseña se restablece al reiniciar el backend (seed en `database.py`).

---

## 7. Hoja de sustentación extendida

Ver **[SUSTENTACION_CLASE.md](./SUSTENTACION_CLASE.md)** — guion completo, preguntas del docente, ejemplos GraphQL y checklist.
