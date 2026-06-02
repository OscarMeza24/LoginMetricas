import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    username: user?.username || '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await updateProfile(user.id, form.fullName, form.email, form.username);
      setMessage('Perfil actualizado correctamente');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 style={{ marginTop: 0, color: 'var(--primary)' }}>Mi perfil</h1>
      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}
      <form onSubmit={handleSubmit}>
        {['fullName', 'email', 'username'].map((name) => (
          <div className="field" key={name}>
            <label htmlFor={name}>
              {name === 'fullName' ? 'Nombre completo' : name.charAt(0).toUpperCase() + name.slice(1)}
            </label>
            <input
              id={name}
              value={form[name]}
              onChange={(e) => setForm({ ...form, [name]: e.target.value })}
            />
          </div>
        ))}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </form>
    </>
  );
}
