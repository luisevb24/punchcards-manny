// components/Layout.js
import Head from 'next/head';
import Link from 'next/link';

export default function Layout({ children, title = 'PunchCard - Manny' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Sistema de tarjetas de lealtad digital" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container">
          <Link href="/" className="navbar-brand d-flex align-items-center">
            <span style={{ fontSize: '2rem', marginRight: '0.5rem' }}>📱</span>
            <span>manny</span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link href="/admin" className="nav-link">
                  <i className="bi bi-gear-fill me-1"></i>
                  Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="min-vh-100 bg-light">
        {children}
      </main>

      <footer className="bg-dark text-white text-center py-3 mt-5">
        <div className="container">
          <p className="mb-0">© 2024 PunchCard Manny. Todos los derechos reservados.</p>
        </div>
      </footer>
    </>
  );
}