"""
Utilidades de seguridad: hash de contraseñas y JWT
ISO/IEC 25022: Implementación segura de autenticación
"""

from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from app.config import settings
from typing import Optional
import logging

logger = logging.getLogger(__name__)

# Contexto para hash de contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """
    Hash una contraseña usando bcrypt
    
    Args:
        password: Contraseña en texto plano
        
    Returns:
        str: Contraseña hasheada
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifica una contraseña contra su hash
    
    Args:
        plain_password: Contraseña en texto plano
        hashed_password: Contraseña hasheada
        
    Returns:
        bool: True si la contraseña es correcta
    """
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Crea un token JWT
    
    Args:
        data: Datos a incluir en el token
        expires_delta: Tiempo de expiración (opcional)
        
    Returns:
        str: Token JWT codificado
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.access_token_expire_minutes
        )
    
    to_encode.update({"exp": expire})
    
    try:
        encoded_jwt = jwt.encode(
            to_encode,
            settings.secret_key,
            algorithm=settings.algorithm
        )
        logger.debug(f"Token creado para usuario: {data.get('sub')}")
        return encoded_jwt
    except Exception as e:
        logger.error(f"Error creando token: {e}")
        raise


def decode_token(token: str) -> Optional[dict]:
    """
    Decodifica un token JWT
    
    Args:
        token: Token JWT codificado
        
    Returns:
        dict: Datos del token o None si es inválido
    """
    try:
        payload = jwt.decode(
            token,
            settings.secret_key,
            algorithms=[settings.algorithm]
        )
        return payload
    except JWTError as e:
        logger.warning(f"Token inválido: {e}")
        return None


def generate_reset_token() -> str:
    """
    Genera un token para recuperación de contraseña
    
    Returns:
        str: Token aleatorio
    """
    import secrets
    return secrets.token_urlsafe(32)
