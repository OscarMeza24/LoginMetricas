"""
Tests unitarios para los servicios de autenticación
ISO/IEC 25022: Pruebas exhaustivas
"""

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app.models import User
from app.services import UserService
from app.security import verify_password, create_access_token, decode_token, hash_password
from app.models import User, UserRole
from app import auth as auth_helpers


# Configuración de BD en memoria para tests
@pytest.fixture
def db_session():
    """Crea una sesión de BD en memoria para tests"""
    engine = create_engine('sqlite:///:memory:')
    Base.metadata.create_all(bind=engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = TestingSessionLocal()
    yield db
    db.close()


class TestUserService:
    """Tests para UserService"""
    
    def test_validate_email_valid(self):
        """Valida que emails válidos sean aceptados"""
        assert UserService.validate_email("user@example.com") is True
        assert UserService.validate_email("test.user+tag@example.co.uk") is True
    
    def test_validate_email_invalid(self):
        """Valida que emails inválidos sean rechazados"""
        assert UserService.validate_email("invalid") is False
        assert UserService.validate_email("user@") is False
        assert UserService.validate_email("@example.com") is False
    
    def test_validate_password_strong(self):
        """Valida que contraseñas fuertes sean aceptadas"""
        valid, msg = UserService.validate_password("StrongPass123!")
        assert valid is True
        assert msg == ""
    
    def test_validate_password_weak_length(self):
        """Valida que contraseñas cortas sean rechazadas"""
        valid, msg = UserService.validate_password("Weak1!")
        assert valid is False
        assert "8 caracteres" in msg
    
    def test_validate_password_weak_no_uppercase(self):
        """Valida que contraseñas sin mayúsculas sean rechazadas"""
        valid, msg = UserService.validate_password("weakpass123!")
        assert valid is False
        assert "mayúscula" in msg
    
    def test_validate_password_weak_no_number(self):
        """Valida que contraseñas sin números sean rechazadas"""
        valid, msg = UserService.validate_password("Weakpass!")
        assert valid is False
        assert "número" in msg
    
    def test_register_user_success(self, db_session):
        """Test registro exitoso de usuario"""
        success, msg, user = UserService.register_user(
            db_session,
            "newuser@example.com",
            "newuser",
            "StrongPass123!",
            "New User"
        )
        
        assert success is True
        assert user is not None
        assert user.email == "newuser@example.com"
        assert user.username == "newuser"
        assert user.full_name == "New User"
        assert user.is_active is True
    
    def test_register_user_duplicate_email(self, db_session):
        """Test que no permite registrar email duplicado"""
        # Registrar primer usuario
        UserService.register_user(
            db_session,
            "duplicate@example.com",
            "user1",
            "StrongPass123!",
            "User One"
        )
        
        # Intentar registrar con mismo email
        success, msg, user = UserService.register_user(
            db_session,
            "duplicate@example.com",
            "user2",
            "StrongPass456!",
            "User Two"
        )
        
        assert success is False
        assert "ya está registrado" in msg
    
    def test_register_user_weak_password(self, db_session):
        """Test que rechaza contraseñas débiles"""
        success, msg, user = UserService.register_user(
            db_session,
            "user@example.com",
            "testuser",
            "weak",  # Contraseña débil
            "Test User"
        )
        
        assert success is False
        assert "8 caracteres" in msg
    
    def test_login_user_success(self, db_session):
        """Test login exitoso"""
        # Registrar usuario
        UserService.register_user(
            db_session,
            "login@example.com",
            "loginuser",
            "ValidPass123!",
            "Login User"
        )
        
        # Intentar login
        success, msg, user = UserService.login_user(
            db_session,
            "login@example.com",
            "ValidPass123!"
        )
        
        assert success is True
        assert user is not None
        assert user.email == "login@example.com"
    
    def test_login_user_wrong_password(self, db_session):
        """Test login con contraseña incorrecta"""
        UserService.register_user(
            db_session,
            "test@example.com",
            "testuser",
            "ValidPass123!",
            "Test User"
        )
        
        success, msg, user = UserService.login_user(
            db_session,
            "test@example.com",
            "WrongPassword123!"
        )
        
        assert success is False
        assert user is None
    
    def test_login_user_not_found(self, db_session):
        """Test login de usuario inexistente"""
        success, msg, user = UserService.login_user(
            db_session,
            "nonexistent@example.com",
            "Password123!"
        )
        
        assert success is False
        assert user is None
    
    def test_change_password_success(self, db_session):
        """Test cambio de contraseña exitoso"""
        UserService.register_user(
            db_session,
            "change@example.com",
            "changeuser",
            "OldPassword123!",
            "Change User"
        )
        
        success, msg = UserService.change_password(
            db_session,
            user_id=1,
            current_password="OldPassword123!",
            new_password="NewPassword456!"
        )
        
        assert success is True
        
        # Verificar que login funciona con nueva contraseña
        success, _, user = UserService.login_user(
            db_session,
            "change@example.com",
            "NewPassword456!"
        )
        assert success is True
    
    def test_change_password_wrong_current(self, db_session):
        """Test cambio de contraseña con contraseña actual incorrecta"""
        UserService.register_user(
            db_session,
            "test@example.com",
            "testuser",
            "ValidPass123!",
            "Test User"
        )
        
        success, msg = UserService.change_password(
            db_session,
            user_id=1,
            current_password="WrongPass123!",
            new_password="NewPass456!"
        )
        
        assert success is False

    def test_update_user_success(self, db_session):
        """Test actualización exitosa de usuario"""
        UserService.register_user(
            db_session,
            "update@example.com",
            "updateuser",
            "StrongPass123!",
            "Original Name",
        )

        success, msg, user = UserService.update_user(
            db_session,
            user_id=1,
            full_name="Updated Name",
            email="updated@example.com",
            username="updateduser",
        )

        assert success is True
        assert user.email == "updated@example.com"
        assert user.username == "updateduser"
        assert user.full_name == "Updated Name"

    def test_update_user_duplicate_email(self, db_session):
        """Test que no permite email duplicado al actualizar"""
        UserService.register_user(
            db_session,
            "user1@example.com",
            "user1",
            "StrongPass123!",
            "User One",
        )
        UserService.register_user(
            db_session,
            "user2@example.com",
            "user2",
            "StrongPass456!",
            "User Two",
        )

        success, msg, user = UserService.update_user(
            db_session,
            user_id=1,
            full_name="User One",
            email="user2@example.com",
            username="user1",
        )

        assert success is False
        assert "ya está registrado" in msg
        assert user is None

    def test_update_user_invalid_username(self, db_session):
        """Test validación de username al actualizar"""
        UserService.register_user(
            db_session,
            "user@example.com",
            "validuser",
            "StrongPass123!",
            "Test User",
        )

        success, msg, user = UserService.update_user(
            db_session,
            user_id=1,
            full_name="Test User",
            email="user@example.com",
            username="bad user!",
        )

        assert success is False
        assert user is None

    def test_deactivate_user_success(self, db_session):
        """Test desactivación de usuario"""
        UserService.register_user(
            db_session,
            "deact@example.com",
            "deactuser",
            "StrongPass123!",
            "Deactivate User",
        )

        success, msg = UserService.deactivate_user(db_session, user_id=1)
        assert success is True

        user = UserService.get_user_by_id(db_session, 1)
        assert user.is_active is False

    def test_activate_user_success(self, db_session):
        """Test reactivación de usuario"""
        UserService.register_user(
            db_session,
            "react@example.com",
            "reactuser",
            "StrongPass123!",
            "Reactivate User",
        )
        UserService.deactivate_user(db_session, user_id=1)

        success, msg = UserService.activate_user(db_session, user_id=1)
        assert success is True

        user = UserService.get_user_by_id(db_session, 1)
        assert user.is_active is True

    def test_delete_user_hard_delete(self, db_session):
        """Test eliminación permanente de usuario"""
        UserService.register_user(
            db_session,
            "delete@example.com",
            "deleteuser",
            "StrongPass123!",
            "Delete User",
        )

        success, msg = UserService.delete_user(db_session, user_id=1)
        assert success is True
        assert UserService.get_user_by_id(db_session, 1) is None


class TestAuthHelpers:
    """Tests de autorización JWT"""

    @pytest.fixture
    def admin_in_db(self, db_session):
        admin = User(
            email="admin@test.com",
            username="admintest",
            hashed_password=hash_password("AdminPass123!"),
            full_name="Admin Test",
            role=UserRole.ADMIN,
            is_active=True,
            is_verified=True,
        )
        db_session.add(admin)
        db_session.commit()
        db_session.refresh(admin)
        return admin

    @pytest.fixture
    def client_in_db(self, db_session):
        client = User(
            email="client@test.com",
            username="clienttest",
            hashed_password=hash_password("ClientPass123!"),
            full_name="Client Test",
            role=UserRole.CLIENT,
            is_active=True,
            is_verified=True,
        )
        db_session.add(client)
        db_session.commit()
        db_session.refresh(client)
        return client

    def _fake_request(self, authorization: str | None):
        class FakeRequest:
            def __init__(self, auth_value):
                self._auth_value = auth_value

            @property
            def headers(self):
                class Headers:
                    def __init__(self, auth_value):
                        self._auth_value = auth_value

                    def get(self, key):
                        if key == "Authorization":
                            return self._auth_value
                        return None

                return Headers(self._auth_value)

        return FakeRequest(authorization)

    def _fake_info(self, request):
        class FakeInfo:
            context = {}

        info = FakeInfo()
        info.context = {"request": request}
        return info

    def test_extract_bearer_token(self):
        assert auth_helpers.extract_bearer_token("Bearer abc123") == "abc123"
        assert auth_helpers.extract_bearer_token(None) is None
        assert auth_helpers.extract_bearer_token("Basic xyz") is None

    def test_resolve_auth_user_valid_token(self, db_session, admin_in_db):
        token = create_access_token(
            data={"sub": str(admin_in_db.id), "role": admin_in_db.role.value}
        )
        request = self._fake_request(f"Bearer {token}")
        auth_user = auth_helpers.resolve_auth_user(request, db_session)

        assert auth_user is not None
        assert auth_user.user_id == admin_in_db.id
        assert auth_user.role == UserRole.ADMIN

    def test_require_admin_with_client_raises(self, db_session, client_in_db):
        from strawberry.exceptions import GraphQLError

        token = create_access_token(
            data={"sub": str(client_in_db.id), "role": client_in_db.role.value}
        )
        request = self._fake_request(f"Bearer {token}")
        info = self._fake_info(request)

        with pytest.raises(GraphQLError, match="administrador"):
            auth_helpers.require_admin(info, db_session)

    def test_require_admin_success(self, db_session, admin_in_db):
        token = create_access_token(
            data={"sub": str(admin_in_db.id), "role": admin_in_db.role.value}
        )
        request = self._fake_request(f"Bearer {token}")
        info = self._fake_info(request)

        auth_user = auth_helpers.require_admin(info, db_session)
        assert auth_user.user_id == admin_in_db.id

    def test_require_self_or_admin_denied(self, db_session, client_in_db, admin_in_db):
        from strawberry.exceptions import GraphQLError

        token = create_access_token(
            data={"sub": str(client_in_db.id), "role": client_in_db.role.value}
        )
        request = self._fake_request(f"Bearer {token}")
        info = self._fake_info(request)

        with pytest.raises(GraphQLError, match="permiso"):
            auth_helpers.require_self_or_admin(info, db_session, admin_in_db.id)


class TestSecurityFunctions:
    """Tests para funciones de seguridad"""
    
    def test_verify_password(self):
        """Test verificación de contraseña"""
        from app.security import hash_password
        
        password = "TestPassword123!"
        hashed = hash_password(password)
        
        assert verify_password(password, hashed) is True
        assert verify_password("WrongPassword123!", hashed) is False
    
    def test_create_and_decode_token(self):
        """Test creación y decodificación de JWT"""
        data = {"sub": "123"}
        token = create_access_token(data)
        
        decoded = decode_token(token)
        assert decoded is not None
        assert decoded["sub"] == "123"
    
    def test_decode_invalid_token(self):
        """Test decodificación de token inválido"""
        decoded = decode_token("invalid.token.here")
        assert decoded is None
    
    def test_token_expiration(self):
        """Test que tokens expirados no se decodifican"""
        from datetime import timedelta
        from app.security import jwt
        import time
        
        # Crear token con expiración inmediata
        from app.config import settings
        payload = {
            "sub": "123",
            "exp": int(time.time()) - 1  # Ya expirado
        }
        expired_token = jwt.encode(
            payload,
            settings.secret_key,
            algorithm=settings.algorithm
        )
        
        decoded = decode_token(expired_token)
        assert decoded is None


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
