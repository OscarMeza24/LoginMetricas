# GraphQL API Examples

## 📌 Endpoints

- **URL**: `http://localhost:8000/graphql`
- **Método**: POST
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer <JWT_TOKEN>` (si es necesario)

## 🔑 Autenticación

### Mutation: Register (Registro)

**Descripción**: Crea un nuevo usuario

```graphql
mutation {
  register(input: {
    email: "juan@example.com"
    username: "juan123"
    password: "SecurePass123!"
    fullName: "Juan García"
  }) {
    success
    message
    user {
      id
      email
      username
      fullName
      role
      isActive
      createdAt
    }
  }
}
```

**Respuesta exitosa**:
```json
{
  "data": {
    "register": {
      "success": true,
      "message": "Usuario registrado exitosamente",
      "user": {
        "id": 1,
        "email": "juan@example.com",
        "username": "juan123",
        "fullName": "Juan García",
        "role": "CLIENT",
        "isActive": true,
        "createdAt": "2024-01-15T10:30:00"
      }
    }
  }
}
```

### Mutation: Login

**Descripción**: Autentica un usuario y retorna JWT

```graphql
mutation {
  login(input: {
    email: "juan@example.com"
    password: "SecurePass123!"
  }) {
    success
    message
    accessToken
    user {
      id
      email
      username
      fullName
      role
      isActive
    }
  }
}
```

**Respuesta exitosa**:
```json
{
  "data": {
    "login": {
      "success": true,
      "message": "Login exitoso",
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": 1,
        "email": "juan@example.com",
        "username": "juan123",
        "fullName": "Juan García",
        "role": "CLIENT",
        "isActive": true
      }
    }
  }
}
```

## 🔒 Operaciones Autenticadas

### Query: VerifyToken

**Descripción**: Verifica si un JWT es válido

**Header**: `Authorization: Bearer <TOKEN>`

```graphql
query {
  verifyToken(token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...") {
    valid
    userId
    message
  }
}
```

**Respuesta**:
```json
{
  "data": {
    "verifyToken": {
      "valid": true,
      "userId": 1,
      "message": "Token válido"
    }
  }
}
```

### Query: GetUser

**Descripción**: Obtiene datos de un usuario

```graphql
query {
  getUser(userId: 1) {
    id
    email
    username
    fullName
    role
    isActive
    isVerified
    createdAt
    updatedAt
  }
}
```

**Respuesta**:
```json
{
  "data": {
    "getUser": {
      "id": 1,
      "email": "juan@example.com",
      "username": "juan123",
      "fullName": "Juan García",
      "role": "CLIENT",
      "isActive": true,
      "isVerified": false,
      "createdAt": "2024-01-15T10:30:00",
      "updatedAt": null
    }
  }
}
```

### Query: ListUsers (Admin)

**Descripción**: Lista todos los usuarios (solo para admin)

```graphql
query {
  listUsers(skip: 0, limit: 50) {
    total
    users {
      id
      email
      username
      fullName
      role
      isActive
      createdAt
    }
  }
}
```

**Respuesta**:
```json
{
  "data": {
    "listUsers": {
      "total": 2,
      "users": [
        {
          "id": 1,
          "email": "juan@example.com",
          "username": "juan123",
          "fullName": "Juan García",
          "role": "CLIENT",
          "isActive": true,
          "createdAt": "2024-01-15T10:30:00"
        },
        {
          "id": 2,
          "email": "admin@example.com",
          "username": "admin",
          "fullName": "Administrador",
          "role": "ADMIN",
          "isActive": true,
          "createdAt": "2024-01-15T09:00:00"
        }
      ]
    }
  }
}
```

## 🔐 Cambio de Contraseña

### Mutation: ChangePassword

**Descripción**: Cambia la contraseña de un usuario autenticado

```graphql
mutation {
  changePassword(userId: 1, input: {
    currentPassword: "SecurePass123!"
    newPassword: "NewSecurePass456!"
  }) {
    success
    message
  }
}
```

**Respuesta exitosa**:
```json
{
  "data": {
    "changePassword": {
      "success": true,
      "message": "Contraseña cambiada exitosamente"
    }
  }
}
```

## 🔑 Recuperación de Contraseña

### Mutation: RequestPasswordReset

**Descripción**: Solicita recuperación de contraseña

```graphql
mutation {
  requestPasswordReset(input: {
    email: "juan@example.com"
  }) {
    success
    message
  }
}
```

**Respuesta**:
```json
{
  "data": {
    "requestPasswordReset": {
      "success": true,
      "message": "Si la cuenta existe, recibirá un email de recuperación"
    }
  }
}
```

### Mutation: ResetPassword

**Descripción**: Completa el reset de contraseña con token

```graphql
mutation {
  resetPassword(input: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    newPassword: "NewSecurePass789!"
  }) {
    success
    message
  }
}
```

**Respuesta exitosa**:
```json
{
  "data": {
    "resetPassword": {
      "success": true,
      "message": "Contraseña reseteada exitosamente"
    }
  }
}
```

## ❌ Gestión de Usuarios (Admin)

### Mutation: DeactivateUser

**Descripción**: Desactiva un usuario (solo admin)

```graphql
mutation {
  deactivateUser(userId: 1) {
    success
    message
  }
}
```

**Respuesta**:
```json
{
  "data": {
    "deactivateUser": {
      "success": true,
      "message": "Usuario desactivado"
    }
  }
}
```

## ⚠️ Ejemplos de Errores

### Error: Email inválido
```graphql
mutation {
  register(input: {
    email: "invalid-email"
    username: "user"
    password: "Pass123!"
    fullName: "User"
  }) {
    success
    message
    user {
      id
    }
  }
}
```

**Respuesta**:
```json
{
  "data": {
    "register": {
      "success": false,
      "message": "Formato de email inválido",
      "user": null
    }
  }
}
```

### Error: Contraseña débil
```graphql
mutation {
  register(input: {
    email: "user@example.com"
    username: "user"
    password: "weak"
    fullName: "User"
  }) {
    success
    message
    user {
      id
    }
  }
}
```

**Respuesta**:
```json
{
  "data": {
    "register": {
      "success": false,
      "message": "La contraseña debe tener al menos 8 caracteres",
      "user": null
    }
  }
}
```

### Error: Email duplicado
```graphql
mutation {
  register(input: {
    email: "juan@example.com"
    username: "juan456"
    password: "Pass123!"
    fullName: "Juan"
  }) {
    success
    message
    user {
      id
    }
  }
}
```

**Respuesta**:
```json
{
  "data": {
    "register": {
      "success": false,
      "message": "El email ya está registrado",
      "user": null
    }
  }
}
```

### Error: Credenciales incorrectas
```graphql
mutation {
  login(input: {
    email: "juan@example.com"
    password: "WrongPassword123!"
  }) {
    success
    message
    accessToken
    user {
      id
    }
  }
}
```

**Respuesta**:
```json
{
  "data": {
    "login": {
      "success": false,
      "message": "Email o contraseña incorrectos",
      "accessToken": null,
      "user": null
    }
  }
}
```

## 🧪 Flujo Completo de Prueba

```
1. Registrar usuario
   POST /graphql con mutation register

2. Login (obtener token)
   POST /graphql con mutation login

3. Copiar accessToken

4. Verificar token
   POST /graphql con query verifyToken

5. Cambiar contraseña
   POST /graphql con mutation changePassword

6. Login con nueva contraseña
   POST /graphql con mutation login

7. Logout (eliminar token en cliente)
   - Solo eliminar JWT del secure store
```

## 📝 Notas

- Todos los tokens expiran en **30 minutos**
- Las contraseñas deben cumplir requisitos de seguridad
- Los campos sensibles no se devuelven en respuestas
- El sistema es case-sensitive para email
- Los tokens de reset expiran en **1 hora**
