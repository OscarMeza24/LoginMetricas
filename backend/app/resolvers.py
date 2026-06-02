"""
Resolvers de GraphQL
ISO/IEC 25022: Implementación de consultas y mutaciones GraphQL
"""

import strawberry
from typing import Optional
from datetime import timedelta
from sqlalchemy.orm import Session
from fastapi import Depends

from app.schemas import (
    UserType, LoginResponse, RegisterResponse, TokenResponse,
    ChangePasswordResponse, RequestPasswordResetResponse, ResetPasswordResponse,
    UserListResponse, LoginInput, RegisterInput, ChangePasswordInput,
    RequestPasswordResetInput, ResetPasswordInput, UserRoleEnum
)
from app.models import User
from app.services import UserService
from app.database import get_db
from app.security import create_access_token, decode_token
import logging

logger = logging.getLogger(__name__)


def convert_user_to_type(user: User) -> UserType:
    """Convierte modelo User a tipo GraphQL"""
    return UserType(
        id=user.id,
        email=user.email,
        username=user.username,
        full_name=user.full_name,
        role=UserRoleEnum(user.role.value),
        is_active=user.is_active,
        is_verified=user.is_verified,
        created_at=user.created_at,
        updated_at=user.updated_at
    )


@strawberry.type
class Query:
    """Consultas GraphQL"""
    
    @strawberry.field
    def verify_token(self, token: str, db: Session = Depends(get_db)) -> TokenResponse:
        """
        Verifica si un token JWT es válido
        
        Args:
            token: Token JWT a verificar
            db: Sesión de BD
            
        Returns:
            TokenResponse con validez del token
        """
        logger.info("Verificando token")
        
        payload = decode_token(token)
        if not payload:
            logger.warning("Token inválido en verificación")
            return TokenResponse(
                valid=False,
                user_id=None,
                message="Token inválido o expirado"
            )
        
        user_id = payload.get("sub")
        user = UserService.get_user_by_id(db, int(user_id))
        
        if not user or not user.is_active:
            logger.warning(f"Usuario no encontrado o inactivo: {user_id}")
            return TokenResponse(
                valid=False,
                user_id=None,
                message="Usuario no encontrado o inactivo"
            )
        
        return TokenResponse(
            valid=True,
            user_id=user_id,
            message="Token válido"
        )
    
    @strawberry.field
    def get_user(self, user_id: int, db: Session = Depends(get_db)) -> Optional[UserType]:
        """
        Obtiene información de un usuario
        
        Args:
            user_id: ID del usuario
            db: Sesión de BD
            
        Returns:
            Información del usuario o None
        """
        logger.info(f"Obteniendo usuario: {user_id}")
        
        user = UserService.get_user_by_id(db, user_id)
        if not user:
            logger.warning(f"Usuario no encontrado: {user_id}")
            return None
        
        return convert_user_to_type(user)
    
    @strawberry.field
    def list_users(
        self,
        skip: int = 0,
        limit: int = 100,
        db: Session = Depends(get_db)
    ) -> UserListResponse:
        """
        Lista todos los usuarios (solo para admin)
        
        Args:
            skip: Usuarios a saltar
            limit: Límite de usuarios
            db: Sesión de BD
            
        Returns:
            Lista de usuarios
        """
        logger.info(f"Listando usuarios (skip={skip}, limit={limit})")
        
        users = UserService.get_all_users(db, skip, limit)
        user_types = [convert_user_to_type(user) for user in users]
        
        return UserListResponse(
            total=len(users),
            users=user_types
        )


@strawberry.type
class Mutation:
    """Mutaciones GraphQL"""
    
    @strawberry.mutation
    def register(
        self,
        input: RegisterInput,
        db: Session = Depends(get_db)
    ) -> RegisterResponse:
        """
        Registra un nuevo usuario
        ISO/IEC 25022: Validación exhaustiva de entrada
        
        Args:
            input: Datos de registro
            db: Sesión de BD
            
        Returns:
            RegisterResponse con resultado del registro
        """
        logger.info(f"Registro de nuevo usuario: {input.email}")
        
        success, message, user = UserService.register_user(
            db,
            input.email,
            input.username,
            input.password,
            input.full_name
        )
        
        return RegisterResponse(
            success=success,
            message=message,
            user=convert_user_to_type(user) if user else None
        )
    
    @strawberry.mutation
    def login(
        self,
        input: LoginInput,
        db: Session = Depends(get_db)
    ) -> LoginResponse:
        """
        Autentica un usuario y retorna token JWT
        ISO/IEC 25022: Autenticación segura
        
        Args:
            input: Credenciales de login
            db: Sesión de BD
            
        Returns:
            LoginResponse con token y usuario
        """
        logger.info(f"Login intento: {input.email}")
        
        success, message, user = UserService.login_user(db, input.email, input.password)
        
        if not success:
            return LoginResponse(
                success=False,
                message=message,
                access_token=None,
                user=None
            )
        
        # Crear token
        access_token_expires = timedelta(minutes=30)
        access_token = create_access_token(
            data={"sub": str(user.id)},
            expires_delta=access_token_expires
        )
        
        logger.info(f"Login exitoso: {input.email}")
        
        return LoginResponse(
            success=True,
            message="Login exitoso",
            access_token=access_token,
            user=convert_user_to_type(user)
        )
    
    @strawberry.mutation
    def change_password(
        self,
        user_id: int,
        input: ChangePasswordInput,
        db: Session = Depends(get_db)
    ) -> ChangePasswordResponse:
        """
        Cambia la contraseña de un usuario
        
        Args:
            user_id: ID del usuario
            input: Datos de cambio de contraseña
            db: Sesión de BD
            
        Returns:
            ChangePasswordResponse con resultado
        """
        logger.info(f"Cambio de contraseña para usuario: {user_id}")
        
        success, message = UserService.change_password(
            db,
            user_id,
            input.current_password,
            input.new_password
        )
        
        return ChangePasswordResponse(
            success=success,
            message=message
        )
    
    @strawberry.mutation
    def request_password_reset(
        self,
        input: RequestPasswordResetInput,
        db: Session = Depends(get_db)
    ) -> RequestPasswordResetResponse:
        """
        Solicita recuperación de contraseña
        
        Args:
            input: Email del usuario
            db: Sesión de BD
            
        Returns:
            RequestPasswordResetResponse con resultado
        """
        logger.info(f"Solicitud de reset: {input.email}")
        
        success, message = UserService.request_password_reset(db, input.email)
        
        return RequestPasswordResetResponse(
            success=success,
            message=message
        )
    
    @strawberry.mutation
    def reset_password(
        self,
        input: ResetPasswordInput,
        db: Session = Depends(get_db)
    ) -> ResetPasswordResponse:
        """
        Completa el reset de contraseña
        
        Args:
            input: Token y nueva contraseña
            db: Sesión de BD
            
        Returns:
            ResetPasswordResponse con resultado
        """
        logger.info("Reset de contraseña con token")
        
        success, message = UserService.reset_password(
            db,
            input.token,
            input.new_password
        )
        
        return ResetPasswordResponse(
            success=success,
            message=message
        )
    
    @strawberry.mutation
    def deactivate_user(
        self,
        user_id: int,
        db: Session = Depends(get_db)
    ) -> ChangePasswordResponse:
        """
        Desactiva un usuario
        
        Args:
            user_id: ID del usuario
            db: Sesión de BD
            
        Returns:
            Respuesta con resultado
        """
        logger.info(f"Desactivando usuario: {user_id}")
        
        success, message = UserService.deactivate_user(db, user_id)
        
        return ChangePasswordResponse(
            success=success,
            message=message
        )
