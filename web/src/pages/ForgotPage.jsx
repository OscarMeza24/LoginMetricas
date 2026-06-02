import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function ForgotPage() {
  const requestPasswordReset = useAuthStore((s) => s.requestPasswordReset);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const msg = await requestPasswordReset(email);
      setMessage(msg || 'Si la cuenta existe, recibirás instrucciones.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shell">
      <div className="card">
        <h1>Recuperar contraseña</h1>
        <p className="subtitle">Te enviaremos instrucciones si el email existe</p>
        {error && <div className="alert alert-error">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Enviando…' : 'Enviar solicitud'}
          </button>
        </form>
        <p className="footer-link">
          <Link to="/login">← Volver al login</Link>
        </p>
      </div>
    </div>
  );
}
