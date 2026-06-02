# MVP GraphQL Authentication System

Sistema de autenticación completo con FastAPI, GraphQL y React Native.

## 📋 Especificaciones

- **Backend**: FastAPI + Strawberry GraphQL + SQLite
- **Frontend**: React Native
- **Autenticación**: JWT + bcrypt
- **Roles**: Admin, Cliente
- **Funcionalidades**: Login, Registro, Recuperación de contraseña, CRUD de usuarios
- **Normas**: ISO/IEC 25022 (calidad en uso) + ISO/IEC 25023 (calidad de producto)
- **Diseño frontend**: Impeccable (DM Sans, paleta cálida, sin anti-patrones AI)

## 📁 Estructura del Proyecto

```
mvp-graphql-auth/
├── backend/              # API GraphQL con FastAPI
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py      # Punto de entrada
│   │   ├── config.py    # Configuración
│   │   ├── database.py  # Base de datos
│   │   ├── schemas/     # Esquemas GraphQL
│   │   ├── models/      # Modelos de BD
│   │   ├── services/    # Lógica de negocio
│   │   ├── utils/       # Utilidades
│   │   └── middleware/  # Middleware
│   ├── requirements.txt
│   └── .env.example
├── frontend/            # Aplicación React Native
│   ├── src/
│   │   ├── components/  # Componentes reutilizables
│   │   ├── screens/     # Pantallas
│   │   ├── services/    # Servicios (GraphQL client)
│   │   ├── utils/       # Utilidades
│   │   └── App.js
│   ├── package.json
│   └── .env.example
└── README.md
```

## 🚀 Inicio Rápido

### Backend
```bash
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m app.main
```

### Frontend
```bash
cd frontend
npm install --legacy-peer-deps
cp .env.example .env
npm start
```

### Usuario admin demo
- **Email:** `admin@admin.com`
- **Contraseña:** `Admin123!`

## 📊 Cumplimiento ISO/IEC 25022 y 25023

- ✅ [ISO_25022_COMPLIANCE.md](./ISO_25022_COMPLIANCE.md) — calidad en uso
- ✅ [ISO_25023_COMPLIANCE.md](./ISO_25023_COMPLIANCE.md) — calidad de producto
- ✅ 29 tests unitarios (`pytest test_services.py`)
- ✅ CRUD completo vía GraphQL + pantallas móvil
- ✅ JWT, bcrypt, autorización por roles

## 🔐 Seguridad

- JWT para autenticación
- Bcrypt para contraseñas
- CORS configurado
- Validaciones en entrada
- Rate limiting (en plan)
