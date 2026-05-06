import { useParams } from 'react-router-dom';

function TrainingDetailPage() {
  const { id } = useParams();

  return (
    <div>
      <h1>Detalji treninga</h1>
      <p style={{ marginTop: 'var(--space-3)', color: 'var(--color-text-muted)' }}>
        ID treninga: {id} (u izradi).
      </p>
    </div>
  );
}

export default TrainingDetailPage;