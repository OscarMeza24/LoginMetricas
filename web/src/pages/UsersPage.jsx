import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';

export default function UsersPage() {
  const listUsers = useAuthStore((s) => s.listUsers);
  const activateUser = useAuthStore((s) => s.activateUser);
  const deactivateUser = useAuthStore((s) => s.deactivateUser);
  const deleteUser = useAuthStore((s) => s.deleteUser);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listUsers();
      setUsers(data.users);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const runAction = async (action, userId, confirmMsg) => {
    if (!window.confirm(confirmMsg)) return;
    try {
      await action(userId);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="spinner" />;

  return (
    <>
      <h1 style={{ marginTop: 0, color: 'var(--primary)' }}>Gestión de usuarios</h1>
      {error && <div className="alert alert-error">{error}</div>}
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Usuario</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td>{u.username}</td>
              <td>{u.role}</td>
              <td>
                <span className={`badge ${u.isActive ? 'badge-active' : 'badge-inactive'}`}>
                  {u.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="actions">
                {u.isActive ? (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => runAction(deactivateUser, u.id, `¿Desactivar ${u.email}?`)}
                  >
                    Desactivar
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => runAction(activateUser, u.id, `¿Activar ${u.email}?`)}
                  >
                    Activar
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() =>
                    runAction(deleteUser, u.id, `¿Eliminar permanentemente ${u.email}?`)
                  }
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
