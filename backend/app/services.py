"""
Servicios de usuario y autenticación
ISO/IEC 25022: Lógica de negocio separada de endpoints
"""

from sqlalchemy.orm import Session
from app.models import User, UserRole
from app.security import hash_password, verify_password, generate_reset_token
from datetime import datetime, timedelta, timezone
from typing import Optional
import logging
import re

logger = logging.getLogger(__name__)


class UserService:
    """Servicio de gestión de usuarios"""
    
    @staticmethod
    def validate_username(username: str) -> tuple[bool, str]:
        """
        Valida formato de nombre de usuario (3-100 caracteres alfanuméricos o _).
        """
        if len(username) < 3:
            return False, "El nombre de usuario debe tener al menos 3 caracteres"
        if len(username) > 100:
            return False, "El nombre de usuario no puede exceder 100 caracteres"
        if not re.match(r'^[a-zA-Z0-9_]+$', username):
            return False, "El nombre de usuario solo puede contener letras, números y guión bajo"
        return True, ""

    @staticmethod
    def validate_email(email: str) -> bool:
        """
        Valida formato de email
        
        Args:
            email: Email a validar
            
        Returns:
            bool: True si es válido
        """
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    @staticmethod
    def validate_password(password: str) -> tuple[bool, str]:
        """
        Valida contraseña según criterios de seguridad
        
        Criterios:
        - Mínimo 8 caracteres
        - Al menos una mayúscula
        - Al menos una minúscula
        - Al menos un número
        - Al menos un carácter especial
        
        Args:
            password: Contraseña a validar
            
        Returns:
            tuple: (es_válida, mensaje_error)
        """
        if len(password) < 8:
            return False, "La contraseña debe tener al menos 8 caracteres"
        
        if not re.search(r'[A-Z]', password):
            return False, "La contraseña debe contener al menos una mayúscula"
        
        if not re.search(r'[a-z]', password):
            return False, "La contraseña debe contener al menos una minúscula"
        
        if not re.search(r'\d', password):
            return False, "La contraseña debe contener al menos un número"
        
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            return False, "La contraseña debe contener al menos un carácter especial"
        
        return True, ""
    
    @staticmethod
    def register_user(
        db: Session,
        email: str,
        username: str,
        password: str,
        full_name: str
    ) -> tuple[bool, str, Optional[User]]:
        """
        Registra un nuevo usuario
        ISO/IEC 25022: Validaciones exhaustivas
        
        Args:
            db: Sesión de BD
            email: Email del usuario
            username: Nombre de usuario
            password: Contraseña
            full_name: Nombre completo
            
        Returns:
            tuple: (éxito, mensaje, usuario)
        """
        logger.info(f"Intentando registrar usuario: {email}")
        
        # Validar email
        if not UserService.validate_email(email):
            msg = "Formato de email inválido"
            logger.warning(f"{msg}: {email}")
            return False, msg, None
        
        # Validar contraseña
        valid, error_msg = UserService.validate_password(password)
        if not valid:
            logger.warning(f"Contraseña débil para {email}: {error_msg}")
            return False, error_msg, None
        
        # Verificar si email existe
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            msg = "El email ya está registrado"
            logger.warning(f"{msg}: {email}")
            return False, msg, None
        
        # Verificar si username existe
        existing_username = db.query(User).filter(User.username == username).first()
        if existing_username:
            msg = "El nombre de usuario ya está registrado"
            logger.warning(f"{msg}: {username}")
            return False, msg, None
        
        # Crear usuario
        try:
            new_user = User(
                email=email,
                username=username,
                hashed_password=hash_password(password),
                full_name=full_name,
                role=UserRole.CLIENT,  # Por defecto cliente
                is_active=True,
                is_verified=False
            )
            db.add(new_user)
            db.commit()
            db.refresh(new_user)
            logger.info(f"Usuario registrado exitosamente: {email}")
            return True, "Usuario registrado exitosamente", new_user
        except Exception as e:
            db.rollback()
            logger.error(f"Error registrando usuario {email}: {e}")
            return False, "Error al registrar usuario", None
    
    @staticmethod
    def login_user(
        db: Session,
        email: str,
        password: str
    ) -> tuple[bool, str, Optional[User]]:
        """
        Autentica un usuario
        ISO/IEC 25022: Validación de credenciales segura
        
        Args:
            db: Sesión de BD
            email: Email del usuario
            password: Contraseña
            
        Returns:
            tuple: (éxito, mensaje, usuario)
        """
        logger.info(f"Intento de login: {email}")
        
        # Buscar usuario
        user = db.query(User).filter(User.email == email).first()
        if not user:
            logger.warning(f"Usuario no encontrado: {email}")
            return False, "Email o contraseña incorrectos", None
        
        # Verificar contraseña
        if not verify_password(password, user.hashed_password):
            logger.warning(f"Contraseña incorrecta para: {email}")
            return False, "Email o contraseña incorrectos", None
        
        # Verificar si usuario está activo
        if not user.is_active:
            logger.warning(f"Usuario inactivo: {email}")
            return False, "Usuario inactivo", None
        
        logger.info(f"Login exitoso: {email}")
        return True, "Login exitoso", user
    
    @staticmethod
    def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
        """
        Obtiene un usuario por ID
        
        Args:
            db: Sesión de BD
            user_id: ID del usuario
            
        Returns:
            User o None
        """
        return db.query(User).filter(User.id == user_id).first()
    
    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[User]:
        """
        Obtiene un usuario por email
        
        Args:
            db: Sesión de BD
            email: Email del usuario
            
        Returns:
            User o None
        """
        return db.query(User).filter(User.email == email).first()
    
    @staticmethod
    def change_password(
        db: Session,
        user_id: int,
        current_password: str,
        new_password: str
    ) -> tuple[bool, str]:
        """
        Cambia la contraseña de un usuario
        
        Args:
            db: Sesión de BD
            user_id: ID del usuario
            current_password: Contraseña actual
            new_password: Nueva contraseña
            
        Returns:
            tuple: (éxito, mensaje)
        """
        logger.info(f"Cambio de contraseña para usuario: {user_id}")
        
        user = UserService.get_user_by_id(db, user_id)
        if not user:
            return False, "Usuario no encontrado"
        
        # Verificar contraseña actual
        if not verify_password(current_password, user.hashed_password):
            logger.warning(f"Contraseña actual incorrecta para usuario {user_id}")
            return False, "Contraseña actual incorrecta"
        
        # Validar nueva contraseña
        valid, error_msg = UserService.validate_password(new_password)
        if not valid:
            return False, error_msg
        
        # Actualizar contraseña
        try:
            user.hashed_password = hash_password(new_password)
            db.commit()
            logger.info(f"Contraseña cambiada para usuario: {user_id}")
            return True, "Contraseña cambiada exitosamente"
        except Exception as e:
            db.rollback()
            logger.error(f"Error cambiando contraseña para usuario {user_id}: {e}")
            return False, "Error al cambiar contraseña"
    
    @staticmethod
    def request_password_reset(db: Session, email: str) -> tuple[bool, str]:
        """
        Solicita reset de contraseña
        
        Args:
            db: Sesión de BD
            email: Email del usuario
            
        Returns:
            tuple: (éxito, mensaje)
        """
        logger.info(f"Solicitud de reset de contraseña: {email}")
        
        user = UserService.get_user_by_email(db, email)
        if not user:
            # No revelar si el email existe
            return True, "Si la cuenta existe, recibirá un email de recuperación"
        
        try:
            token = generate_reset_token()
            user.password_reset_token = token
            user.password_reset_expires = datetime.now(timezone.utc) + timedelta(hours=1)
            db.commit()
            
            # Aquí iría el envío de email (simulado por ahora)
            logger.info(f"Token de reset generado para: {email}")
            return True, "Si la cuenta existe, recibirá un email de recuperación"
        except Exception as e:
            db.rollback()
            logger.error(f"Error en reset de contraseña para {email}: {e}")
            return False, "Error al procesar solicitud"
    
    @staticmethod
    def reset_password(
        db: Session,
        token: str,
        new_password: str
    ) -> tuple[bool, str]:
        """
        Reset de contraseña con token
        
        Args:
            db: Sesión de BD
            token: Token de reset
            new_password: Nueva contraseña
            
        Returns:
            tuple: (éxito, mensaje)
        """
        logger.info("Intento de reset de contraseña con token")
        
        user = db.query(User).filter(
            User.password_reset_token == token
        ).first()
        
        if not user:
            logger.warning("Token de reset inválido")
            return False, "Token inválido"
        
        # Verificar expiración
        if user.password_reset_expires < datetime.now(timezone.utc):
            logger.warning("Token de reset expirado")
            return False, "Token expirado"
        
        # Validar nueva contraseña
        valid, error_msg = UserService.validate_password(new_password)
        if not valid:
            return False, error_msg
        
        try:
            user.hashed_password = hash_password(new_password)
            user.password_reset_token = None
            user.password_reset_expires = None
            db.commit()
            logger.info("Contraseña reseteada exitosamente")
            return True, "Contraseña reseteada exitosamente"
        except Exception as e:
            db.rollback()
            logger.error(f"Error al resetear contraseña: {e}")
            return False, "Error al resetear contraseña"
    
    @staticmethod
    def get_all_users(db: Session, skip: int = 0, limit: int = 100) -> list[User]:
        """
        Obtiene lista de usuarios (solo para admin)
        
        Args:
            db: Sesión de BD
            skip: Usuarios a saltar
            limit: Límite de usuarios
            
        Returns:
            list: Lista de usuarios
        """
        return db.query(User).offset(skip).limit(limit).all()
    
    @staticmethod
    def update_user(
        db: Session,
        user_id: int,
        full_name: str,
        email: str,
        username: str,
    ) -> tuple[bool, str, Optional[User]]:
        """
        Actualiza full_name, email y username de un usuario.
        """
        logger.info(f"Actualizando usuario: {user_id}")

        user = UserService.get_user_by_id(db, user_id)
        if not user:
            return False, "Usuario no encontrado", None

        if not UserService.validate_email(email):
            return False, "Formato de email inválido", None

        valid_username, username_error = UserService.validate_username(username)
        if not valid_username:
            return False, username_error, None

        if not full_name or not full_name.strip():
            return False, "El nombre completo es obligatorio", None

        existing_email = db.query(User).filter(
            User.email == email,
            User.id != user_id,
        ).first()
        if existing_email:
            return False, "El email ya está registrado", None

        existing_username = db.query(User).filter(
            User.username == username,
            User.id != user_id,
        ).first()
        if existing_username:
            return False, "El nombre de usuario ya está registrado", None

        try:
            user.full_name = full_name.strip()
            user.email = email
            user.username = username
            db.commit()
            db.refresh(user)
            logger.info(f"Usuario actualizado: {user_id}")
            return True, "Usuario actualizado exitosamente", user
        except Exception as e:
            db.rollback()
            logger.error(f"Error actualizando usuario {user_id}: {e}")
            return False, "Error al actualizar usuario", None

    @staticmethod
    def activate_user(db: Session, user_id: int) -> tuple[bool, str]:
        """
        Reactiva un usuario desactivado.
        """
        logger.info(f"Activando usuario: {user_id}")

        user = UserService.get_user_by_id(db, user_id)
        if not user:
            return False, "Usuario no encontrado"

        if user.is_active:
            return True, "El usuario ya está activo"

        try:
            user.is_active = True
            db.commit()
            logger.info(f"Usuario activado: {user_id}")
            return True, "Usuario activado"
        except Exception as e:
            db.rollback()
            logger.error(f"Error activando usuario {user_id}: {e}")
            return False, "Error al activar usuario"

    @staticmethod
    def delete_user(db: Session, user_id: int) -> tuple[bool, str]:
        """
        Elimina permanentemente un usuario de la base de datos.
        """
        logger.info(f"Eliminando usuario (hard delete): {user_id}")

        user = UserService.get_user_by_id(db, user_id)
        if not user:
            return False, "Usuario no encontrado"

        try:
            db.delete(user)
            db.commit()
            logger.info(f"Usuario eliminado: {user_id}")
            return True, "Usuario eliminado permanentemente"
        except Exception as e:
            db.rollback()
            logger.error(f"Error eliminando usuario {user_id}: {e}")
            return False, "Error al eliminar usuario"

    @staticmethod
    def deactivate_user(db: Session, user_id: int) -> tuple[bool, str]:
        """
        Desactiva un usuario
        
        Args:
            db: Sesión de BD
            user_id: ID del usuario
            
        Returns:
            tuple: (éxito, mensaje)
        """
        logger.info(f"Desactivando usuario: {user_id}")
        
        user = UserService.get_user_by_id(db, user_id)
        if not user:
            return False, "Usuario no encontrado"
        
        try:
            user.is_active = False
            db.commit()
            logger.info(f"Usuario desactivado: {user_id}")
            return True, "Usuario desactivado"
        except Exception as e:
            db.rollback()
            logger.error(f"Error desactivando usuario {user_id}: {e}")
            return False, "Error al desactivar usuario"
