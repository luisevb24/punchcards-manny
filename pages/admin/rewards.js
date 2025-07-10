// pages/admin/rewards.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';

export default function AdminRewards() {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReward, setEditingReward] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    punches_requeridos: '',
    activo: true
  });

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .order('punches_requeridos', { ascending: true });

      if (error) throw error;
      setRewards(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingReward) {
        // Actualizar recompensa existente
        const { error } = await supabase
          .from('rewards')
          .update({
            nombre: formData.nombre,
            descripcion: formData.descripcion,
            punches_requeridos: parseInt(formData.punches_requeridos),
            activo: formData.activo
          })
          .eq('id', editingReward.id);

        if (error) throw error;
        alert('Recompensa actualizada exitosamente!');
      } else {
        // Crear nueva recompensa
        const { error } = await supabase
          .from('rewards')
          .insert([
            {
              nombre: formData.nombre,
              descripcion: formData.descripcion,
              punches_requeridos: parseInt(formData.punches_requeridos),
              activo: formData.activo
            }
          ]);

        if (error) throw error;
        alert('Recompensa creada exitosamente!');
      }

      resetForm();
      fetchRewards();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar recompensa');
    }
  };

  const editReward = (reward) => {
    setEditingReward(reward);
    setFormData({
      nombre: reward.nombre,
      descripcion: reward.descripcion || '',
      punches_requeridos: reward.punches_requeridos.toString(),
      activo: reward.activo
    });
    setShowForm(true);
  };

  const toggleRewardStatus = async (reward) => {
    try {
      const { error } = await supabase
        .from('rewards')
        .update({ activo: !reward.activo })
        .eq('id', reward.id);

      if (error) throw error;
      fetchRewards();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cambiar estado');
    }
  };

  const deleteReward = async (reward) => {
    if (!confirm(`¿Estás seguro de eliminar "${reward.nombre}"?`)) return;

    try {
      const { error } = await supabase
        .from('rewards')
        .delete()
        .eq('id', reward.id);

      if (error) throw error;
      alert('Recompensa eliminada exitosamente!');
      fetchRewards();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar recompensa');
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      punches_requeridos: '',
      activo: true
    });
    setEditingReward(null);
    setShowForm(false);
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
    <Layout title="Gestión de Recompensas - PunchCard">
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Gestión de Recompensas</h1>
          <div>
            <button 
              className="btn btn-primary me-2"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancelar' : '➕ Nueva Recompensa'}
            </button>
            <Link href="/admin" className="btn btn-secondary">
              ← Volver
            </Link>
          </div>
        </div>

        {/* Formulario */}
        {showForm && (
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">
                {editingReward ? 'Editar Recompensa' : 'Nueva Recompensa'}
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Nombre *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Punches Requeridos *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.punches_requeridos}
                      onChange={(e) => setFormData({...formData, punches_requeridos: e.target.value})}
                      min="1"
                      required
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Estado</label>
                    <div className="form-check form-switch mt-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={formData.activo}
                        onChange={(e) => setFormData({...formData, activo: e.target.checked})}
                      />
                      <label className="form-check-label">
                        {formData.activo ? 'Activa' : 'Inactiva'}
                      </label>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  />
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary">
                    {editingReward ? 'Actualizar' : 'Crear'} Recompensa
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Lista de recompensas */}
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">Recompensas ({rewards.length})</h5>
          </div>
          <div className="card-body">
            {rewards.length === 0 ? (
              <p className="text-center text-muted my-4">
                No hay recompensas creadas aún
              </p>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Descripción</th>
                      <th>Punches</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rewards.map((reward) => (
                      <tr key={reward.id}>
                        <td className="align-middle">
                          <strong>{reward.nombre}</strong>
                        </td>
                        <td className="align-middle">
                          {reward.descripcion || '-'}
                        </td>
                        <td className="align-middle">
                          <span className="badge bg-primary">
                            {reward.punches_requeridos}
                          </span>
                        </td>
                        <td className="align-middle">
                          <span className={`badge ${reward.activo ? 'bg-success' : 'bg-secondary'}`}>
                            {reward.activo ? 'Activa' : 'Inactiva'}
                          </span>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => editReward(reward)}
                              title="Editar"
                            >
                              ✏️
                            </button>
                            <button
                              className="btn btn-outline-warning"
                              onClick={() => toggleRewardStatus(reward)}
                              title={reward.activo ? 'Desactivar' : 'Activar'}
                            >
                              {reward.activo ? '🚫' : '✅'}
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => deleteReward(reward)}
                              title="Eliminar"
                            >
                              🗑️
                            </button>
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
      </div>
    </Layout>
  );
}