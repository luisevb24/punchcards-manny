import Head from "next/head";
import Link from "next/link";
import Layout from "@/components/Layout";

export default function Home() {
  return (
    <Layout title="Bienvenido - manny">
      <div className="hero-gradient">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
              <h1 className="display-3 mb-4 fw-bold">Bienvenido a manny</h1>
              <p className="lead mb-5 fs-4">
                soy tu partner - El sistema de tarjetas de lealtad digital más simple y efectivo.
                Acumula puntos y obtén recompensas increíbles.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="row g-4 mb-5">
              <div className="col-md-4">
                <div className="card h-100 punch-card">
                  <div className="card-body text-center p-4">
                    <div className="text-manny-orange mb-3" style={{ fontSize: '3rem' }}>📱</div>
                    <h3 className="h5 card-title text-manny-orange">Fácil Acceso</h3>
                    <p className="card-text">
                      Sin registro complicado. Solo escanea tu QR y listo.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="card h-100 punch-card">
                  <div className="card-body text-center p-4">
                    <div className="text-manny-pink mb-3" style={{ fontSize: '3rem' }}>🎯</div>
                    <h3 className="h5 card-title text-manny-pink">Acumula Puntos</h3>
                    <p className="card-text">
                      Cada visita cuenta. Ve tu progreso en tiempo real.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="card h-100 punch-card">
                  <div className="card-body text-center p-4">
                    <div className="text-manny-orange mb-3" style={{ fontSize: '3rem' }}>🎁</div>
                    <h3 className="h5 card-title text-manny-orange">Recompensas</h3>
                    <p className="card-text">
                      Canjea tus puntos por productos y descuentos exclusivos.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <Link href="/admin" className="btn btn-primary btn-lg px-5 py-3" style={{ borderRadius: '50px' }}>
                Panel de Administración
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}