"""
Modelos de base de datos para usuarios
ISO/IEC 25022: Estructura clara y documentada de modelos
"""

from sqlalchemy import Column, Integer, String, DateTime, Boolean, Enum
from sqlalchemy.sql import func
from app.database import Base
from enum import Enum as PyEnum
from datetime import datetime


class UserRole(str, PyEnum):
    """Roles disponibles en el sistema"""
    ADMIN = "admin"
    CLIENT = "client"


class User(Base):
    """
    Modelo de usuario en la base de datos
    
    Attributes:
        id: Identificador único
        email: Correo electrónico único
        username: Nombre de usuario único
        hashed_password: Contraseña hasheada con bcrypt
        full_name: Nombre completo del usuario
        role: Rol del usuario (admin o client)
        is_active: Estado del usuario
        is_verified: Si el email ha sido verificado
        created_at: Fecha de creación
        updated_at: Fecha de última actualización
        password_reset_token: Token para recuperación de contraseña
        password_reset_expires: Expiración del token de recuperación
    """
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    role = Column(Enum(UserRole), default=UserRole.CLIENT, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, onupdate=func.now(), nullable=True)
    password_reset_token = Column(String(500), nullable=True, unique=True)
    password_reset_expires = Column(DateTime, nullable=True)
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, role={self.role})>"
