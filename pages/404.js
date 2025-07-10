// pages/404.js
import Link from 'next/link';
import Layout from '@/components/Layout';

export default function Custom404() {
  return (
    <Layout title="Página no encontrada - PunchCard">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <h1 className="display-1">404</h1>
            <h2 className="mb-4">Página no encontrada</h2>
            <p className="lead mb-4">
              Lo sentimos, la página que buscas no existe o el código QR no es válido.
            </p>
            <div className="d-grid gap-2 d-md-flex justify-content-md-center">
              <Link href="/" className="btn btn-primary">
                Ir al inicio
              </Link>
              <Link href="/admin" className="btn btn-outline-secondary">
                Panel de administración
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}