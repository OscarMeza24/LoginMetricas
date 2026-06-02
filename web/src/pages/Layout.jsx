import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Layout() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  return (
    <div className="shell" style={{ justifyContent: 'flex-start', paddingTop: 40 }}>
      <div className="card card-wide">
        <nav className="nav-bar">
          <h2>Hola, {user?.fullName || user?.username}</h2>
          <div className="nav-links">
            <Link to="/">Inicio</Link>
            <Link to="/profile">Perfil</Link>
            <Link to="/change-password">Contraseña</Link>
            {user?.role === 'admin' && <Link to="/users">Usuarios</Link>}
            <button type="button" onClick={handleLogout}>
              Salir
            </button>
          </div>
        </nav>
        <Outlet />
      </div>
    </div>
  );
}
