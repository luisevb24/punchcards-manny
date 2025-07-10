// pages/u/[userId].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';

export default function UserPunchCard() {
  const router = useRouter();
  const { userId } = router.query;
  
  const [user, setUser] = useState(null);
  const [punches, setPunches] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [redeemedRewards, setRedeemedRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingPunch, setAddingPunch] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const fetchUserData = async () => {
    try {
      // Obtener datos del usuario
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('user_slug', userId)
        .single();

      if (userError) throw userError;
      
      if (!userData) {
        router.push('/404');
        return;
      }

      setUser(userData);

      // Obtener punches del usuario
      const { data: punchesData } = await supabase
        .from('punches')
        .select('*')
        .eq('user_id', userData.id)
        .order('fecha', { ascending: false });

      setPunches(punchesData || []);

      // Obtener todas las recompensas disponibles
      const { data: rewardsData } = await supabase
        .from('rewards')
        .select('*')
        .eq('activo', true)
        .order('punches_requeridos', { ascending: true });

      setRewards(rewardsData || []);

      // Obtener recompensas canjeadas por el usuario
      const { data: redeemedData } = await supabase
        .from('redeemed_rewards')
        .select('*, rewards(nombre)')
        .eq('user_id', userData.id)
        .order('fecha', { ascending: false });

      setRedeemedRewards(redeemedData || []);

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPunch = async () => {
    if (!user || addingPunch) return;
    
    setAddingPunch(true);
    try {
      const { data, error } = await supabase
        .from('punches')
        .insert([
          {
            user_id: user.id,
            tipo: 'qr'
          }
        ]);

      if (error) throw error;

      // Recargar datos
      await fetchUserData();
      
      // Mostrar mensaje de éxito
      alert('¡Punch agregado exitosamente!');
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error al agregar punch. Intenta de nuevo.');
    } finally {
      setAddingPunch(false);
    }
  };

  const requestReward = async (rewardId) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('redeemed_rewards')
        .insert([
          {
            user_id: user.id,
            reward_id: rewardId,
            estado: 'pendiente'
          }
        ]);

      if (error) throw error;

      alert('¡Recompensa solicitada! Te contactaremos pronto.');
      await fetchUserData();
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error al solicitar recompensa. Intenta de nuevo.');
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

  if (!user) {
    return (
      <Layout>
        <div className="container py-5 text-center">
          <h1>Usuario no encontrado</h1>
          <p>El enlace que seguiste no es válido.</p>
        </div>
      </Layout>
    );
  }

  const totalPunches = punches.length;

  return (
    <Layout title={`${user.nombre} - PunchCard`}>
      <div className="container py-4">
        {/* Encabezado del usuario */}
        <div className="card punch-card mb-4">
          <div className="card-body text-center">
            <h1 className="h3 mb-3">¡Hola, {user.nombre}!</h1>
            <div className="row g-3">
              <div className="col-6">
                <div className="bg-primary text-white rounded p-3">
                  <h2 className="h1 mb-0">{totalPunches}</h2>
                  <p className="mb-0">Punches totales</p>
                </div>
              </div>
              <div className="col-6">
                <div className="bg-success text-white rounded p-3">
                  <h2 className="h1 mb-0">{redeemedRewards.length}</h2>
                  <p className="mb-0">Recompensas canjeadas</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botón para agregar punch */}
        <div className="text-center mb-4">
          <button 
            className="btn btn-primary btn-lg"
            onClick={addPunch}
            disabled={addingPunch}
          >
            {addingPunch ? 'Agregando...' : '🎯 Agregar Punch'}
          </button>
          <p className="text-muted mt-2">
            Presiona para registrar tu visita
          </p>
        </div>

        {/* Tarjeta visual de punches */}
        <div className="card punch-card mb-4">
          <div className="card-header">
            <h5 className="mb-0">Tu Tarjeta de Punches</h5>
          </div>
          <div className="card-body">
            <div className="punch-grid">
              {[...Array(20)].map((_, index) => (
                <div 
                  key={index}
                  className={`punch-slot ${index < totalPunches ? 'filled' : ''}`}
                >
                  {index < totalPunches ? '✓' : ''}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recompensas disponibles */}
        <div className="card punch-card mb-4">
          <div className="card-header">
            <h5 className="mb-0">Recompensas Disponibles</h5>
          </div>
          <div className="card-body">
            {rewards.map((reward) => {
              const canRedeem = totalPunches >= reward.punches_requeridos;
              const alreadyRedeemed = redeemedRewards.some(r => r.reward_id === reward.id);
              
              return (
                <div key={reward.id} className="border rounded p-3 mb-3">
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <h6 className="mb-1">{reward.nombre}</h6>
                      <p className="text-muted mb-1">{reward.descripcion}</p>
                      <small className="text-muted">
                        Requiere: {reward.punches_requeridos} punches
                      </small>
                    </div>
                    <div className="col-md-4 text-end">
                      {alreadyRedeemed ? (
                        <span className="badge bg-secondary">Ya canjeada</span>
                      ) : canRedeem ? (
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={() => requestReward(reward.id)}
                        >
                          Canjear
                        </button>
                      ) : (
                        <span className="text-muted">
                          Te faltan {reward.punches_requeridos - totalPunches} punches
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Historial de punches */}
        <div className="card punch-card">
          <div className="card-header">
            <h5 className="mb-0">Historial de Punches</h5>
          </div>
          <div className="card-body">
            {punches.length === 0 ? (
              <p className="text-muted mb-0">Aún no tienes punches registrados.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Tipo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {punches.slice(0, 10).map((punch) => (
                      <tr key={punch.id}>
                        <td>{formatDate(punch.fecha)}</td>
                        <td>
                          <span className="badge bg-primary">
                            {punch.tipo.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {punches.length > 10 && (
                  <p className="text-muted text-center mb-0">
                    Mostrando los últimos 10 punches de {punches.length} totales
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}