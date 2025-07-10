import Head from "next/head";
import Link from "next/link";
import Layout from "@/components/Layout";

export default function Home() {
  return (
    <Layout title="Bienvenido - PunchCard Manny">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <h1 className="display-4 mb-4">Bienvenido a PunchCard</h1>
            <p className="lead mb-5">
              El sistema de tarjetas de lealtad digital más simple y efectivo.
              Acumula puntos y obtén recompensas increíbles.
            </p>
            
            <div className="row g-4 mb-5">
              <div className="col-md-4">
                <div className="card h-100 punch-card">
                  <div className="card-body text-center">
                    <h3 className="h5 card-title">📱 Fácil Acceso</h3>
                    <p className="card-text">
                      Sin registro complicado. Solo escanea tu QR y listo.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="card h-100 punch-card">
                  <div className="card-body text-center">
                    <h3 className="h5 card-title">🎯 Acumula Puntos</h3>
                    <p className="card-text">
                      Cada visita cuenta. Ve tu progreso en tiempo real.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="card h-100 punch-card">
                  <div className="card-body text-center">
                    <h3 className="h5 card-title">🎁 Recompensas</h3>
                    <p className="card-text">
                      Canjea tus puntos por productos y descuentos exclusivos.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="d-grid gap-3 d-md-flex justify-content-md-center">
              <Link href="/admin" className="btn btn-primary btn-lg">
                Panel de Administración
              </Link>
              <button className="btn btn-outline-secondary btn-lg" disabled>
                ¿Tienes una tarjeta? Escanea tu QR
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}