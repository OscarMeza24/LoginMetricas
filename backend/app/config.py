"""
Configuración de la aplicación FastAPI
ISO/IEC 25022: Configuración centralizada para mantenibilidad
"""

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """
    Configuración de la aplicación
    
    Variables de entorno soportadas:
    - DATABASE_URL: URL de la base de datos
    - SECRET_KEY: Clave secreta para JWT
    - ALGORITHM: Algoritmo de encriptación JWT
    - ACCESS_TOKEN_EXPIRE_MINUTES: Expiración del token
    - API_TITLE: Nombre de la API
    - API_VERSION: Versión de la API
    """
    
    # Base de datos
    database_url: str = "sqlite:///./test.db"
    
    # Seguridad
    secret_key: str = "your-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # API
    api_title: str = "MVP GraphQL Auth API"
    api_version: str = "1.0.0"
    api_description: str = "Sistema de autenticación con GraphQL y FastAPI"
    
    # CORS
    cors_origins: list = ["*"]
    
    class Config:
        env_file = ".env"
        case_sensitive = False


# Instancia global de configuración
settings = Settings()
