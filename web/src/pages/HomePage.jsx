import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function HomePage() {
  const user = useAuthStore((s) => s.user);

  return (
    <>
      <h1 style={{ marginTop: 0, color: 'var(--primary)' }}>Panel principal</h1>
      <p className="subtitle">Bienvenido al MVP de autenticación y gestión de usuarios</p>
      <div className="info-grid">
        <div className="info-row">
          <span>Email</span>
          <strong>{user?.email}</strong>
        </div>
        <div className="info-row">
          <span>Usuario</span>
          <strong>{user?.username}</strong>
        </div>
        <div className="info-row">
          <span>Rol</span>
          <span className={`badge ${user?.role === 'admin' ? 'badge-admin' : ''}`}>
            {user?.role === 'admin' ? 'Administrador' : 'Cliente'}
          </span>
        </div>
        <div className="info-row">
          <span>Estado</span>
          <span className={`badge ${user?.isActive ? 'badge-active' : 'badge-inactive'}`}>
            {user?.isActive ? 'Activo' : 'Inactivo'}
          </span>
        </div>
      </div>
      <Link to="/profile" className="btn btn-primary" style={{ textDecoration: 'none' }}>
        Ver mi perfil
      </Link>
      {user?.role === 'admin' && (
        <Link
          to="/users"
          className="btn btn-secondary"
          style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}
        >
          Gestionar usuarios
        </Link>
      )}
    </>
  );
}
