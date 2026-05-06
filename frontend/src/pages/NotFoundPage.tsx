import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', paddingTop: 'var(--space-6)' }}>
      <h1 style={{ fontSize: '3rem', color: 'var(--color-primary)' }}>404</h1>
      <p style={{ marginTop: 'var(--space-3)', color: 'var(--color-text-muted)' }}>
        Stranica nije pronađena.
      </p>
      <Link
        to="/"
        style={{
          display: 'inline-block',
          marginTop: 'var(--space-4)',
          color: 'var(--color-primary-hover)',
        }}
      >
        ← Natrag na početnu
      </Link>
    </div>
  );
}

export default NotFoundPage;