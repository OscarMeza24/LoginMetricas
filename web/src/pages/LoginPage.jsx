import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const signIn = useAuthStore((s) => s.signIn);
  const error = useAuthStore((s) => s.error);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleDemoLogin = async () => {
    setEmail('admin@admin.com');
    setPassword('Admin123!');
    setLocalError('');
    setLoading(true);
    try {
      await signIn('admin@admin.com', 'Admin123!');
      navigate('/');
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (!email || !password) {
      setLocalError('Completa todos los campos');
      return;
    }
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/');
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shell">
      <div className="card">
        <h1>LoginMetricas</h1>
        <p className="subtitle">Inicia sesión en tu cuenta</p>
        {(localError || error) && (
          <div className="alert alert-error">{localError || error}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
            />
          </div>
          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Entrando…' : 'Iniciar sesión'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            disabled={loading}
            onClick={handleDemoLogin}
          >
            Entrar con cuenta demo
          </button>
        </form>
        <p className="footer-link">
          <Link to="/forgot">¿Olvidaste tu contraseña?</Link>
        </p>
        <p className="footer-link">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
        <p className="footer-link" style={{ fontSize: '0.8rem', marginTop: 24 }}>
          Demo admin: admin@admin.com / Admin123!
        </p>
      </div>
    </div>
  );
}
