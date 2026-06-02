import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

export default function ChangePasswordPage() {
  const user = useAuthStore((s) => s.user);
  const changePassword = useAuthStore((s) => s.changePassword);
  const [currentPassword, setCurrent] = useState('');
  const [newPassword, setNew] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (newPassword !== confirm) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }
    setLoading(true);
    try {
      const msg = await changePassword(user.id, currentPassword, newPassword);
      setMessage(msg);
      setCurrent('');
      setNew('');
      setConfirm('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 style={{ marginTop: 0, color: 'var(--primary)' }}>Cambiar contraseña</h1>
      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="current">Contraseña actual</label>
          <input id="current" type="password" value={currentPassword} onChange={(e) => setCurrent(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="new">Nueva contraseña</label>
          <input id="new" type="password" value={newPassword} onChange={(e) => setNew(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="confirm">Confirmar nueva</label>
          <input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Actualizando…' : 'Cambiar contraseña'}
        </button>
      </form>
    </>
  );
}
