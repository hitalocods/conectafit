import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';

const Home = lazy(() => import('./pages/Home'));
const Explore = lazy(() => import('./pages/Explore'));
const ProfessionalProfile = lazy(() => import('./pages/ProfessionalProfile'));
const Auth = lazy(() => import('./pages/Auth'));
const ProfessionalDashboard = lazy(() => import('./pages/ProfessionalDashboard'));
const Account = lazy(() => import('./pages/Account'));

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/explorar" element={<Explore />} />
        <Route path="/profissional/:id" element={<ProfessionalProfile />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/minha-conta" element={<Account />} />
        <Route path="/dashboard" element={<ProfessionalDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
