# Arquitectura - MVP GraphQL Authentication

## 📐 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                     React Native Frontend                     │
│                    (Expo, zustand, Apollo)                    │
│  ┌───────────────┬─────────────────┬──────────────────────┐  │
│  │   LoginScreen │ RegisterScreen  │ ForgotPasswordScreen │  │
│  └───────────────┴─────────────────┴──────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              AuthStore (zustand)                        │  │
│  │  - isSignedIn  - user  - token  - error               │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                              │
                    GraphQL Query/Mutation
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                  FastAPI Backend (Python)                     │
│                    Port: 8000                                │
│  ┌────────────────────────────────────────────────────────┐  │
│  │            GraphQL Endpoint (/graphql)                 │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │  Resolvers                                       │  │  │
│  │  │  - Query.login, Query.verifyToken, etc.         │  │  │
│  │  │  - Mutation.register, Mutation.changePassword   │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │           Services Layer (Lógica de Negocio)           │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │  UserService                                    │  │  │
│  │  │  - register_user()                             │  │  │
│  │  │  - login_user()                                │  │  │
│  │  │  - change_password()                           │  │  │
│  │  │  - validate_password()                         │  │  │
│  │  │  - validate_email()                            │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │        Security Layer (Criptografía)                   │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │  - hash_password() → bcrypt                     │  │  │
│  │  │  - verify_password() → bcrypt                  │  │  │
│  │  │  - create_access_token() → JWT                 │  │  │
│  │  │  - decode_token() → JWT                        │  │  │
│  │  │  - generate_reset_token() → secrets            │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │       Data Access Layer (SQLAlchemy)                   │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │  Models                                         │  │  │
│  │  │  - User (id, email, password, role, etc.)      │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│              SQLite Database                                  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Table: users                                         │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │ id | email | username | hashed_password | role  │  │  │
│  │  │ ... | ... | ... | ... | ...                   │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

## 🏗️ Patrones de Diseño

### 1. **Separación de Capas (N-Tier Architecture)**
```
Frontend (React Native)
    ↓
GraphQL Client (Apollo)
    ↓
Resolvers (Query/Mutation)
    ↓
Services (Lógica de negocio)
    ↓
Data Access (SQLAlchemy)
    ↓
Database (SQLite)
```

### 2. **Dependency Injection**
```python
# FastAPI usa dependencias inyectadas automáticamente
@strawberry.mutation
def login(self, input: LoginInput, db: Session = Depends(get_db)) -> LoginResponse:
    # db se inyecta automáticamente
    return login_implementation(db, input)
```

### 3. **Service Layer Pattern**
```
Resolvers (Orquestación)
    ↓
Services (Lógica de negocio)
    ↓
Models (Entidades)
```

### 4. **Middleware Pattern**
```python
# AuthLink en GraphQL Client agrega JWT automáticamente
const authLink = new ApolloLink(async (operation, forward) => {
    const token = await SecureStore.getItemAsync('auth_token');
    if (token) {
        operation.setContext({
            headers: { authorization: `Bearer ${token}` }
        });
    }
    return forward(operation);
});
```

## 🔐 Flujo de Autenticación

### Registro
```
1. Usuario completa formulario
2. Frontend valida (cliente)
3. Envía mutation register a GraphQL
4. Backend valida email/password (servidor)
5. Hash contraseña con bcrypt
6. Guardar en BD
7. Retornar usuario creado
```

### Login
```
1. Usuario ingresa email/contraseña
2. Frontend valida formato
3. Envía mutation login a GraphQL
4. Backend busca usuario por email
5. Verifica contraseña con bcrypt
6. Genera JWT con exp=30min
7. Retorna token + datos usuario
8. Cliente almacena JWT en secure store
```

### Solicitud Autenticada
```
1. Cliente necesita hacer operación
2. AuthLink obtiene JWT de secure store
3. Agrega header: Authorization: Bearer <TOKEN>
4. Envía operación GraphQL
5. Backend valida JWT
6. Ejecuta operación
7. Retorna resultado
```

## 📊 Modelos de Datos

### User
```python
class User(Base):
    id: int (PK)
    email: str (UNIQUE)
    username: str (UNIQUE)
    hashed_password: str
    full_name: str
    role: Enum[ADMIN, CLIENT]
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime
    password_reset_token: str (UNIQUE, NULLABLE)
    password_reset_expires: datetime (NULLABLE)
```

## 🔒 Seguridad por Capas

### Frontend
- ✅ JWT almacenado en secure store (no localStorage)
- ✅ Validación de contraseña visible (requisitos)
- ✅ No almacenar password en estado
- ✅ Limpiar token en logout

### Backend
- ✅ Contraseñas hasheadas con bcrypt
- ✅ JWT con expiración
- ✅ Validación de entrada exhaustiva
- ✅ Mensajes de error seguros (no revelan info)
- ✅ Logging de eventos críticos
- ✅ CORS configurado

### Base de datos
- ✅ Contraseña nunca en texto plano
- ✅ Email y username únicos
- ✅ Timestamps para auditoría
- ✅ Transacciones ACID

## 🚀 Escalabilidad

### Horizontal
- Backend stateless (puede escalar con múltiples instancias)
- JWT permite distribuir requests
- BD SQLite puede migrar a PostgreSQL

### Vertical
- Agregar índices en BD
- Caching con Redis
- Rate limiting
- Compresión de respuestas

## 📈 Rendimiento

### Optimizaciones Implementadas
1. ✅ Validación de entrada temprana
2. ✅ Índices en campos únicos (email, username)
3. ✅ Transacciones mínimas
4. ✅ Logging no bloqueante

### Mejoras Futuras
1. 🔲 Caching de usuarios frecuentes
2. 🔲 Paginación en listado
3. 🔲 Compresión gzip
4. 🔲 CDN para assets frontend

## 🧪 Testabilidad

### Backend
- Servicios separados (fáciles de testear)
- BD en memoria para tests
- Fixtures de pytest
- 100% de cobertura posible

### Frontend
- Componentes puros y reutilizables
- Store testeable (zustand)
- Mocks de GraphQL fáciles

## 📝 Documentación

### Código
- Docstrings en todas las funciones
- Comentarios en lógica compleja
- Type hints en Python y TypeScript

### Proyectos
- README.md (visión general)
- SETUP_GUIDE.md (instalación)
- ISO_25022_COMPLIANCE.md (calidad)
- Este archivo (arquitectura)

## 🔄 CI/CD (Futuro)

```yaml
Pipeline:
1. Pull Request
2. Lint (ESLint, Flake8)
3. Tests (pytest, Jest)
4. Build (frontend: npm build, backend: check)
5. Deploy (a staging/production)
```

## 🎯 Conclusión

La arquitectura sigue principios SOLID:
- **S**ingle Responsibility: Cada clase/componente tiene una responsabilidad
- **O**pen/Closed: Extensible sin modificar existente
- **L**iskov Substitution: Interfaces consistentes
- **I**nterface Segregation: Interfaces específicas
- **D**ependency Inversion: Depende de abstracciones

Resultado: Código limpio, testeable, escalable y mantenible.
