# Guía de Instalación y Ejecución - MVP GraphQL Authentication

## 📋 Requisitos Previos

### Backend
- Python 3.8 o superior
- pip (gestor de paquetes de Python)
- SQLite (incluido con Python)

### Frontend
- Node.js 14+ y npm
- Expo CLI
- Emulador de Android o iOS (opcional, puede usar web para pruebas)

## 🚀 Instalación

### 1. Backend (FastAPI + GraphQL)

#### Paso 1: Crear entorno virtual
```bash
cd backend
python -m venv venv
```

#### Paso 2: Activar entorno virtual

**En Windows (PowerShell):**
```powershell
.\venv\Scripts\Activate.ps1
```

**En Windows (CMD):**
```cmd
venv\Scripts\activate.bat
```

**En macOS/Linux:**
```bash
source venv/bin/activate
```

#### Paso 3: Instalar dependencias
```bash
pip install -r requirements.txt
```

#### Paso 4: Configurar variables de entorno
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env si es necesario (opcional para desarrollo)
```

#### Paso 5: Inicializar base de datos
```bash
# La BD se crea automáticamente al iniciar la app
python -m app.main
```

El servidor debería estar disponible en `http://localhost:8000`
- GraphQL Playground: `http://localhost:8000/graphql`
- Health Check: `http://localhost:8000/health`

### 2. Frontend (React Native)

#### Paso 1: Instalar dependencias
```bash
cd frontend
npm install
```

#### Paso 2: Configurar variables de entorno
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env para apuntar al backend correcto
# REACT_APP_API_URL=http://localhost:8000/graphql
```

#### Paso 3: Iniciar la aplicación

**Opción 1: Ejecutar en Web (más fácil para pruebas)**
```bash
npm run web
```

**Opción 2: Ejecutar en Android**
```bash
npm run android
```

**Opción 3: Ejecutar en iOS (solo macOS)**
```bash
npm run ios
```

## 📝 Prueba de la API

### Usando GraphQL Playground

1. Abre `http://localhost:8000/graphql` en tu navegador
2. Prueba las siguientes operaciones:

#### Registro
```graphql
mutation {
  register(input: {
    email: "usuario@example.com"
    username: "usuario123"
    password: "Password123!"
    fullName: "Juan Pérez"
  }) {
    success
    message
    user {
      id
      email
      username
      fullName
      role
    }
  }
}
```

#### Login
```graphql
mutation {
  login(input: {
    email: "usuario@example.com"
    password: "Password123!"
  }) {
    success
    message
    accessToken
    user {
      id
      email
      username
      role
      isActive
    }
  }
}
```

#### Verificar Token
```graphql
query {
  verifyToken(token: "TU_TOKEN_AQUI") {
    valid
    userId
    message
  }
}
```

#### Solicitar Reset de Contraseña
```graphql
mutation {
  requestPasswordReset(input: {
    email: "usuario@example.com"
  }) {
    success
    message
  }
}
```

#### Listar Usuarios (solo admin)
```graphql
query {
  listUsers(skip: 0, limit: 100) {
    total
    users {
      id
      email
      username
      role
      isActive
      createdAt
    }
  }
}
```

## 🔒 Seguridad

### Contraseña de Ejemplo (cumple requisitos)
- Email: `admin@example.com`
- Usuario: `admin123`
- Contraseña: `Admin@2024!`

**Requisitos de Contraseña:**
- ✓ Mínimo 8 caracteres
- ✓ Al menos 1 mayúscula
- ✓ Al menos 1 minúscula
- ✓ Al menos 1 número
- ✓ Al menos 1 carácter especial (!@#$%^&*)

## 📁 Estructura del Proyecto

```
mvp-graphql-auth/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py           # Punto de entrada
│   │   ├── config.py         # Configuración
│   │   ├── database.py       # BD
│   │   ├── models.py         # Modelos ORM
│   │   ├── security.py       # Criptografía
│   │   ├── services.py       # Lógica de negocio
│   │   ├── schemas.py        # Tipos GraphQL
│   │   └── resolvers.py      # Endpoints GraphQL
│   ├── requirements.txt       # Dependencias
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── screens/          # Pantallas de la app
│   │   ├── navigation/       # Navegadores
│   │   ├── services/         # Cliente GraphQL
│   │   ├── store/            # Zustand store
│   │   └── App.js
│   ├── package.json
│   └── .env.example
├── README.md
└── ISO_25022_COMPLIANCE.md
```

## 🔄 Flujo de Autenticación

1. **Usuario se registra** → Validación de datos → Guardar en BD (contraseña hasheada)
2. **Usuario inicia sesión** → Verificar credenciales → Generar JWT
3. **Cliente almacena JWT** → Almacenar en secure store
4. **Operaciones autenticadas** → Enviar JWT en headers

## 🐛 Troubleshooting

### Backend no inicia
```bash
# Eliminar BD vieja y reintentar
rm mvp_auth.db
python -m app.main
```

### Puerto 8000 ya en uso
```bash
# Cambiar puerto en app/main.py
uvicorn.run("app.main:app", host="0.0.0.0", port=8001, reload=True)
```

### Frontend no conecta a GraphQL
```bash
# Verificar que .env tiene URL correcta
cat .env

# Si estás en emulador Android, usa:
REACT_APP_API_URL=http://10.0.2.2:8000/graphql

# Si estás en emulador iOS, usa:
REACT_APP_API_URL=http://localhost:8000/graphql
```

## 📊 Métricas de Calidad

Ver [ISO_25022_COMPLIANCE.md](./ISO_25022_COMPLIANCE.md) para más detalles.

## 📚 Documentación Adicional

- [FastAPI Docs](https://fastapi.tiangolo.com)
- [Strawberry GraphQL](https://strawberry.rocks)
- [React Native Docs](https://reactnative.dev)
- [Expo Docs](https://docs.expo.dev)

## 📞 Soporte

Para reportar problemas, crear un issue en el repositorio con:
- Sistema operativo
- Versión de Python/Node.js
- Pasos para reproducir
- Logs de error
