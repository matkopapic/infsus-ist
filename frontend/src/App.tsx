import AppLayout from './components/layout/AppLayout';

function App() {
  return (
    <AppLayout>
      <div>
        <h1>Dobrodošli</h1>
        <p style={{ marginTop: 'var(--space-3)', color: 'var(--color-text-muted)' }}>
          Frontend aplikacija u izradi.
        </p>
      </div>
    </AppLayout>
  );
}

export default App;