import { useParams } from 'react-router-dom';

function TrainingFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);

  return (
    <div>
      <h1>{isEdit ? 'Uređivanje treninga' : 'Novi trening'}</h1>
      <p style={{ marginTop: 'var(--space-3)', color: 'var(--color-text-muted)' }}>
        Forma za trening (u izradi).
      </p>
    </div>
  );
}

export default TrainingFormPage;