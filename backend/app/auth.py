"""
Helpers de autorización JWT para GraphQL y FastAPI.
Extrae el token del header Authorization y valida roles.
"""

from dataclasses import dataclass
from typing import Optional

from sqlalchemy.orm import Session
from starlette.requests import Request
import strawberry
from strawberry.exceptions import GraphQLError

from app.models import User, UserRole
from app.security import decode_token
from app.services import UserService
import logging

logger = logging.getLogger(__name__)


@dataclass
class AuthContext:
    """Usuario autenticado resuelto desde JWT."""
    user_id: int
    role: UserRole
    email: str


def extract_bearer_token(authorization: Optional[str]) -> Optional[str]:
    """Obtiene el token Bearer del header Authorization."""
    if not authorization:
        return None
    parts = authorization.strip().split()
    if len(parts) == 2 and parts[0].lower() == "bearer":
        return parts[1]
    return None


def resolve_auth_user(request: Optional[Request], db: Session) -> Optional[AuthContext]:
    """
    Decodifica JWT y carga el usuario activo desde la BD.
    """
    if request is None:
        return None

    token = extract_bearer_token(request.headers.get("Authorization"))
    if not token:
        return None

    payload = decode_token(token)
    if not payload or payload.get("sub") is None:
        return None

    try:
        user_id = int(payload["sub"])
    except (TypeError, ValueError):
        logger.warning("JWT sub inválido")
        return None

    user = UserService.get_user_by_id(db, user_id)
    if not user or not user.is_active:
        return None

    return AuthContext(
        user_id=user.id,
        role=user.role,
        email=user.email,
    )


def get_request_from_info(info: strawberry.Info) -> Optional[Request]:
    """Obtiene el Request de Starlette desde el contexto GraphQL."""
    context = info.context
    if isinstance(context, dict):
        return context.get("request")
    return getattr(context, "request", None)


def require_auth(info: strawberry.Info, db: Session) -> AuthContext:
    """Exige usuario autenticado; lanza GraphQLError si falta."""
    request = get_request_from_info(info)
    auth_user = resolve_auth_user(request, db)
    if not auth_user:
        raise GraphQLError("Autenticación requerida")
    return auth_user


def require_admin(info: strawberry.Info, db: Session) -> AuthContext:
    """Exige rol admin."""
    auth_user = require_auth(info, db)
    if auth_user.role != UserRole.ADMIN:
        raise GraphQLError("Se requiere rol de administrador")
    return auth_user


def require_self_or_admin(
    info: strawberry.Info,
    db: Session,
    target_user_id: int,
) -> AuthContext:
    """Permite la operación solo al propio usuario o a un admin."""
    auth_user = require_auth(info, db)
    if auth_user.role == UserRole.ADMIN or auth_user.user_id == target_user_id:
        return auth_user
    raise GraphQLError("No tiene permiso para realizar esta operación")
