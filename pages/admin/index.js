// pages/admin/index.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';
import { generateUserSlug } from '@/lib/utils';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPunches: 0,
    totalRewards: 0,
    pendingRewards: 0
  });
  const [newUserName, setNewUserName] = useState('');
  const [creating, setCreating] = useState(false);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Obtener estadísticas
      const { count: usersCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      const { count: punchesCount } = await supabase
        .from('punches')
        .select('*', { count: 'exact', head: true });

      const { count: rewardsCount } = await supabase
        .from('rewards')
        .select('*', { count: 'exact', head: true });

      const { count: pendingCount } = await supabase
        .from('redeemed_rewards')
        .select('*', { count: 'exact', head: true })
        .eq('estado', 'pendiente');

      setStats({
        totalUsers: usersCount || 0,
        totalPunches: punchesCount || 0,
        totalRewards: rewardsCount || 0,
        pendingRewards: pendingCount || 0
      });

      // Obtener usuarios recientes
      const { data: usersData } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentUsers(usersData || []);

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (e) => {
    e.preventDefault();
    if (!newUserName.trim() || creating) return;

    setCreating(true);
    try {
      // Generar slug único
      let userSlug = generateUserSlug();
      let slugExists = true;
      let attempts = 0;

      // Verificar que el slug sea único
      while (slugExists && attempts < 10) {
        const { data } = await supabase
          .from('users')
          .select('id')
          .eq('user_slug', userSlug)
          .single();
        
        if (!data) {
          slugExists = false;
        } else {
          userSlug = generateUserSlug();
          attempts++;
        }
      }

      // Crear usuario
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            nombre: newUserName.trim(),
            user_slug: userSlug
          }
        ])
        .select()
        .single();

      if (error) throw error;

      alert(`Usuario creado exitosamente!\n\nURL: ${window.location.origin}/u/${userSlug}`);
      
      setNewUserName('');
      fetchDashboardData();

    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear usuario. Intenta de nuevo.');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Panel de Administración - PunchCard">
      <div className="container py-4">
        <h1 className="mb-4">Panel de Administración</h1>

        {/* Estadísticas */}
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card text-white bg-primary">
              <div className="card-body">
                <h5 className="card-title">Usuarios Totales</h5>
                <p className="card-text display-6">{stats.totalUsers}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-white bg-success">
              <div className="card-body">
                <h5 className="card-title">Punches Totales</h5>
                <p className="card-text display-6">{stats.totalPunches}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-white bg-info">
              <div className="card-body">
                <h5 className="card-title">Recompensas</h5>
                <p className="card-text display-6">{stats.totalRewards}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-white bg-warning">
              <div className="card-body">
                <h5 className="card-title">Pendientes</h5>
                <p className="card-text display-6">{stats.pendingRewards}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Crear nuevo usuario */}
          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Crear Nuevo Usuario</h5>
              </div>
              <div className="card-body">
                <form onSubmit={createUser}>
                  <div className="mb-3">
                    <label htmlFor="userName" className="form-label">
                      Nombre del Usuario
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="userName"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      placeholder="Ej: Juan Pérez"
                      required
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={creating}
                  >
                    {creating ? 'Creando...' : 'Crear Usuario'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Accesos rápidos */}
          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Accesos Rápidos</h5>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  <Link href="/admin/users" className="btn btn-outline-primary">
                    👥 Gestionar Usuarios
                  </Link>
                  <Link href="/admin/rewards" className="btn btn-outline-success">
                    🎁 Gestionar Recompensas
                  </Link>
                  <Link href="/admin/pending" className="btn btn-outline-warning">
                    ⏳ Recompensas Pendientes
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Usuarios recientes */}
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Usuarios Recientes</h5>
            <Link href="/admin/users" className="btn btn-sm btn-primary">
              Ver todos
            </Link>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Código</th>
                    <th>Punches</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.nombre}</td>
                      <td>
                        <code>{user.user_slug}</code>
                      </td>
                      <td>{user.total_punches}</td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <Link 
                            href={`/u/${user.user_slug}`} 
                            className="btn btn-outline-primary"
                            target="_blank"
                          >
                            Ver
                          </Link>
                          <button 
                            className="btn btn-outline-secondary"
                            onClick={() => {
                              const url = `${window.location.origin}/u/${user.user_slug}`;
                              navigator.clipboard.writeText(url);
                              alert('URL copiada al portapapeles!');
                            }}
                          >
                            Copiar URL
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}