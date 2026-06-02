# MVP GraphQL Authentication System

Sistema de autenticación completo con FastAPI, GraphQL y React Native.

## 📋 Especificaciones

- **Backend**: FastAPI + Strawberry GraphQL + SQLite
- **Frontend**: React Native
- **Autenticación**: JWT + bcrypt
- **Roles**: Admin, Cliente
- **Funcionalidades**: Login, Registro, Recuperación de contraseña
- **Normas**: ISO/IEC 25022 (Medición de Calidad de Software)

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
npm install
npm start
```

## 📊 Cumplimiento ISO/IEC 25022

- ✅ Documentación clara
- ✅ Pruebas unitarias
- ✅ Logging estructurado
- ✅ Manejo de errores
- ✅ Seguridad (JWT, bcrypt)
- ✅ Validaciones

## 🔐 Seguridad

- JWT para autenticación
- Bcrypt para contraseñas
- CORS configurado
- Validaciones en entrada
- Rate limiting (en plan)
