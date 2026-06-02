"""
Configuración de la base de datos SQLite con SQLAlchemy
ISO/IEC 25022: Gestión centralizada de conexiones a BD
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings
import logging

logger = logging.getLogger(__name__)

# Crear engine
engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False},  # Necesario para SQLite
    echo=False  # Cambiar a True para ver queries SQL
)

# Session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base para modelos
Base = declarative_base()


def get_db():
    """
    Dependency para obtener sesión de base de datos
    
    Yields:
        Session: Sesión de SQLAlchemy
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def seed_default_admin():
    """
    Crea usuario admin por defecto para demos si no existe.
    Credenciales: admin@admin.com / Admin123!
    """
    from app.models import User, UserRole
    from app.security import hash_password

    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.email == "admin@admin.com").first()
        if existing:
            logger.debug("Usuario admin por defecto ya existe")
            return

        admin = User(
            email="admin@admin.com",
            username="admin",
            hashed_password=hash_password("Admin123!"),
            full_name="Administrador",
            role=UserRole.ADMIN,
            is_active=True,
            is_verified=True,
        )
        db.add(admin)
        db.commit()
        logger.info("Usuario admin por defecto creado (admin@admin.com)")
    except Exception as e:
        db.rollback()
        logger.error(f"Error al crear usuario admin por defecto: {e}")
        raise
    finally:
        db.close()


def init_db():
    """
    Inicializar base de datos (crear tablas)
    ISO/IEC 25022: Logging de operaciones críticas
    """
    try:
        logger.info("Inicializando base de datos...")
        Base.metadata.create_all(bind=engine)
        seed_default_admin()
        logger.info("Base de datos inicializada correctamente")
    except Exception as e:
        logger.error(f"Error al inicializar base de datos: {e}")
        raise
