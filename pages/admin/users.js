// pages/admin/users.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addManualPunch = async (userId) => {
    try {
      const { error } = await supabase
        .from('punches')
        .insert([
          {
            user_id: userId,
            tipo: 'manual'
          }
        ]);

      if (error) throw error;

      alert('Punch agregado exitosamente!');
      fetchUsers();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al agregar punch');
    }
  };

  const deleteUser = async (userId, userName) => {
    if (!confirm(`¿Estás seguro de eliminar a ${userName}? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      alert('Usuario eliminado exitosamente');
      fetchUsers();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar usuario');
    }
  };

  const showQR = (user) => {
    setSelectedUser(user);
    setShowQRModal(true);
  };

  const filteredUsers = users.filter(user =>
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.user_slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <Layout title="Gestión de Usuarios - PunchCard">
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Gestión de Usuarios</h1>
          <Link href="/admin" className="btn btn-secondary">
            ← Volver al Panel
          </Link>
        </div>

        {/* Barra de búsqueda */}
        <div className="card mb-4">
          <div className="card-body">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre o código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tabla de usuarios */}
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">
              Usuarios ({filteredUsers.length} de {users.length})
            </h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Código</th>
                    <th>Punches</th>
                    <th>Creado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="align-middle">
                        <strong>{user.nombre}</strong>
                      </td>
                      <td className="align-middle">
                        <code>{user.user_slug}</code>
                      </td>
                      <td className="align-middle">
                        <span className="badge bg-primary">
                          {user.total_punches}
                        </span>
                      </td>
                      <td className="align-middle">
                        {new Date(user.created_at).toLocaleDateString('es-MX')}
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <Link 
                            href={`/u/${user.user_slug}`}
                            className="btn btn-outline-primary"
                            target="_blank"
                            title="Ver tarjeta"
                          >
                            👁️
                          </Link>
                          <button
                            className="btn btn-outline-success"
                            onClick={() => addManualPunch(user.id)}
                            title="Agregar punch manual"
                          >
                            ➕
                          </button>
                          <button
                            className="btn btn-outline-info"
                            onClick={() => showQR(user)}
                            title="Ver código QR"
                          >
                            📱
                          </button>
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => {
                              const url = `${baseUrl}/u/${user.user_slug}`;
                              navigator.clipboard.writeText(url);
                              alert('URL copiada!');
                            }}
                            title="Copiar URL"
                          >
                            📋
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => deleteUser(user.id, user.nombre)}
                            title="Eliminar usuario"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredUsers.length === 0 && (
                <p className="text-center text-muted my-4">
                  No se encontraron usuarios
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de QR */}
      {showQRModal && selectedUser && (
        <div 
          className="modal show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowQRModal(false)}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Código QR - {selectedUser.nombre}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowQRModal(false)}
                ></button>
              </div>
              <div className="modal-body text-center">
                <div className="mb-3">
                  <Image
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`${baseUrl}/u/${selectedUser.user_slug}`)}`}
                    alt="Código QR"
                    width={300}
                    height={300}
                    className="img-fluid"
                  />
                </div>
                <p className="mb-2">
                  <strong>URL:</strong><br />
                  <code>{baseUrl}/u/{selectedUser.user_slug}</code>
                </p>
                <div className="d-grid gap-2">
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`${baseUrl}/u/${selectedUser.user_slug}`)}`;
                      window.open(qrUrl, '_blank');
                    }}
                  >
                    Descargar QR
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => {
                      const url = `${baseUrl}/u/${selectedUser.user_slug}`;
                      navigator.clipboard.writeText(url);
                      alert('URL copiada!');
                    }}
                  >
                    Copiar URL
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}