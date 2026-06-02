"""
Esquemas GraphQL para autenticación
ISO/IEC 25022: Definición clara de tipos y endpoints
"""

import strawberry
from typing import Optional
from datetime import datetime
from enum import Enum as PyEnum


@strawberry.enum
class UserRoleEnum(PyEnum):
    """Roles disponibles"""
    ADMIN = "admin"
    CLIENT = "client"


@strawberry.type
class UserType:
    """Tipo de usuario para GraphQL"""
    id: int
    email: str
    username: str
    full_name: Optional[str]
    role: UserRoleEnum
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: Optional[datetime]


@strawberry.type
class LoginResponse:
    """Respuesta de login"""
    success: bool
    message: str
    access_token: Optional[str]
    user: Optional[UserType]


@strawberry.type
class RegisterResponse:
    """Respuesta de registro"""
    success: bool
    message: str
    user: Optional[UserType]


@strawberry.type
class TokenResponse:
    """Respuesta de verificación de token"""
    valid: bool
    user_id: Optional[int]
    message: str


@strawberry.type
class ChangePasswordResponse:
    """Respuesta de cambio de contraseña"""
    success: bool
    message: str


@strawberry.type
class RequestPasswordResetResponse:
    """Respuesta de solicitud de reset de contraseña"""
    success: bool
    message: str


@strawberry.type
class ResetPasswordResponse:
    """Respuesta de reset de contraseña"""
    success: bool
    message: str


@strawberry.type
class UserListResponse:
    """Respuesta de lista de usuarios"""
    total: int
    users: list[UserType]


@strawberry.input
class LoginInput:
    """Input para login"""
    email: str
    password: str


@strawberry.input
class RegisterInput:
    """Input para registro"""
    email: str
    username: str
    password: str
    full_name: str


@strawberry.input
class ChangePasswordInput:
    """Input para cambio de contraseña"""
    current_password: str
    new_password: str


@strawberry.input
class RequestPasswordResetInput:
    """Input para solicitar reset de contraseña"""
    email: str


@strawberry.input
class ResetPasswordInput:
    """Input para reset de contraseña"""
    token: str
    new_password: str


@strawberry.input
class UpdateUserInput:
    """Input para actualizar perfil de usuario"""
    full_name: str
    email: str
    username: str


@strawberry.type
class UpdateUserResponse:
    """Respuesta de actualización de usuario"""
    success: bool
    message: str
    user: Optional[UserType]


@strawberry.type
class OperationResponse:
    """Respuesta genérica de operaciones (activar, desactivar, eliminar)"""
    success: bool
    message: str
