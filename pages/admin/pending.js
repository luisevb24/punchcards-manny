// pages/admin/pending.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';

export default function AdminPending() {
  const [pendingRewards, setPendingRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pendiente'); // pendiente, entregado, todos

  useEffect(() => {
    fetchPendingRewards();
  }, [filter]);

  const fetchPendingRewards = async () => {
    try {
      let query = supabase
        .from('redeemed_rewards')
        .select(`
          *,
          users (nombre, user_slug, total_punches),
          rewards (nombre, punches_requeridos)
        `)
        .order('fecha', { ascending: false });

      // Aplicar filtro
      if (filter !== 'todos') {
        query = query.eq('estado', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPendingRewards(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateRewardStatus = async (rewardId, newStatus) => {
    try {
      const { error } = await supabase
        .from('redeemed_rewards')
        .update({ estado: newStatus })
        .eq('id', rewardId);

      if (error) throw error;

      alert(`Estado actualizado a: ${newStatus}`);
      fetchPendingRewards();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar estado');
    }
  };

  const addNote = async (rewardId) => {
    const note = prompt('Agregar nota (opcional):');
    if (note === null) return;

    try {
      const { error } = await supabase
        .from('redeemed_rewards')
        .update({ notas: note })
        .eq('id', rewardId);

      if (error) throw error;
      fetchPendingRewards();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al agregar nota');
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

  const getStatusBadge = (status) => {
    const badges = {
      pendiente: 'bg-warning text-dark',
      entregado: 'bg-success',
      cancelado: 'bg-danger'
    };
    return badges[status] || 'bg-secondary';
  };

  const pendingCount = pendingRewards.filter(r => r.estado === 'pendiente').length;

  return (
    <Layout title="Recompensas Pendientes - PunchCard">
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>
            Recompensas Pendientes
            {pendingCount > 0 && (
              <span className="badge bg-warning text-dark ms-2">
                {pendingCount}
              </span>
            )}
          </h1>
          <Link href="/admin" className="btn btn-secondary">
            ← Volver
          </Link>
        </div>

        {/* Filtros */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="btn-group" role="group">
              <button
                className={`btn ${filter === 'pendiente' ? 'btn-warning' : 'btn-outline-warning'}`}
                onClick={() => setFilter('pendiente')}
              >
                Pendientes ({pendingRewards.filter(r => r.estado === 'pendiente').length})
              </button>
              <button
                className={`btn ${filter === 'entregado' ? 'btn-success' : 'btn-outline-success'}`}
                onClick={() => setFilter('entregado')}
              >
                Entregadas
              </button>
              <button
                className={`btn ${filter === 'todos' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setFilter('todos')}
              >
                Todas
              </button>
            </div>
          </div>
        </div>

        {/* Lista de recompensas */}
        <div className="card">
          <div className="card-body">
            {pendingRewards.length === 0 ? (
              <p className="text-center text-muted my-4">
                No hay recompensas {filter === 'todos' ? '' : filter + 's'}
              </p>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Usuario</th>
                      <th>Recompensa</th>
                      <th>Estado</th>
                      <th>Notas</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingRewards.map((item) => (
                      <tr key={item.id}>
                        <td className="align-middle">
                          {formatDate(item.fecha)}
                        </td>
                        <td className="align-middle">
                          <strong>{item.users.nombre}</strong><br />
                          <small className="text-muted">
                            Punches: {item.users.total_punches}
                          </small>
                        </td>
                        <td className="align-middle">
                          <strong>{item.rewards.nombre}</strong><br />
                          <small className="text-muted">
                            Requiere: {item.rewards.punches_requeridos} punches
                          </small>
                        </td>
                        <td className="align-middle">
                          <span className={`badge ${getStatusBadge(item.estado)}`}>
                            {item.estado.toUpperCase()}
                          </span>
                        </td>
                        <td className="align-middle">
                          {item.notas || '-'}
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            {item.estado === 'pendiente' && (
                              <>
                                <button
                                  className="btn btn-success"
                                  onClick={() => updateRewardStatus(item.id, 'entregado')}
                                  title="Marcar como entregado"
                                >
                                  ✅
                                </button>
                                <button
                                  className="btn btn-danger"
                                  onClick={() => updateRewardStatus(item.id, 'cancelado')}
                                  title="Cancelar"
                                >
                                  ❌
                                </button>
                              </>
                            )}
                            {item.estado === 'entregado' && (
                              <button
                                className="btn btn-warning"
                                onClick={() => updateRewardStatus(item.id, 'pendiente')}
                                title="Volver a pendiente"
                              >
                                ↩️
                              </button>
                            )}
                            <button
                              className="btn btn-outline-secondary"
                              onClick={() => addNote(item.id)}
                              title="Agregar/editar nota"
                            >
                              📝
                            </button>
                            <Link
                              href={`/u/${item.users.user_slug}`}
                              className="btn btn-outline-primary"
                              target="_blank"
                              title="Ver usuario"
                            >
                              👤
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Resumen */}
        {filter === 'todos' && pendingRewards.length > 0 && (
          <div className="card mt-4">
            <div className="card-body">
              <h5>Resumen</h5>
              <div className="row text-center">
                <div className="col-md-4">
                  <h6>Pendientes</h6>
                  <p className="h4 text-warning">
                    {pendingRewards.filter(r => r.estado === 'pendiente').length}
                  </p>
                </div>
                <div className="col-md-4">
                  <h6>Entregadas</h6>
                  <p className="h4 text-success">
                    {pendingRewards.filter(r => r.estado === 'entregado').length}
                  </p>
                </div>
                <div className="col-md-4">
                  <h6>Canceladas</h6>
                  <p className="h4 text-danger">
                    {pendingRewards.filter(r => r.estado === 'cancelado').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}