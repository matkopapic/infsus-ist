import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import TrainingsListPage from './pages/TrainingsListPage';
import TrainingDetailPage from './pages/TrainingDetailPage';
import TrainingFormPage from './pages/TrainingFormPage';
import MembershipsPage from './pages/MembershipsPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/trainings" replace />} />
          <Route path="/trainings" element={<TrainingsListPage />} />
          <Route path="/trainings/new" element={<TrainingFormPage />} />
          <Route path="/trainings/:id" element={<TrainingDetailPage />} />
          <Route path="/trainings/:id/edit" element={<TrainingFormPage />} />
          <Route path="/memberships" element={<MembershipsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;