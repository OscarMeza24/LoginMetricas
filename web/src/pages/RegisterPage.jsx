import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function RegisterPage() {
  const navigate = useNavigate();
  const signUp = useAuthStore((s) => s.signUp);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirm: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (Object.values(form).some((v) => !v)) {
      setError('Completa todos los campos');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setLoading(true);
    try {
      await signUp(form.email, form.username, form.password, form.fullName);
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shell">
      <div className="card">
        <h1>Crear cuenta</h1>
        <p className="subtitle">Regístrate para continuar</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          {['fullName', 'email', 'username', 'password', 'confirm'].map((name) => (
            <div className="field" key={name}>
              <label htmlFor={name}>
                {name === 'fullName'
                  ? 'Nombre completo'
                  : name === 'confirm'
                    ? 'Confirmar contraseña'
                    : name.charAt(0).toUpperCase() + name.slice(1)}
              </label>
              <input
                id={name}
                name={name}
                type={name.includes('password') || name === 'confirm' ? 'password' : name === 'email' ? 'email' : 'text'}
                value={form[name]}
                onChange={handleChange}
              />
            </div>
          ))}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creando…' : 'Registrarse'}
          </button>
        </form>
        <p className="footer-link">
          <Link to="/login">← Volver al login</Link>
        </p>
      </div>
    </div>
  );
}
