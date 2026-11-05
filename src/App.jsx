import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './features/auth/layouts/AuthLayout';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import DutyLayout from './features/duties/layouts/DutyLayout';
import UsersPage from './features/users/pages/UsersPage';
import ProfilePage from './features/users/pages/ProfilePage';

// Placeholder sampai HomePage dibuat di langkah berikutnya
function DashboardPlaceholder() {
  return <p className="text-slate-600">Dashboard roster piket segera hadir.</p>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthLayout />}>
        <Route index element={<Navigate to="login" replace />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>
      <Route element={<DutyLayout />}>
        <Route path="/" element={<DashboardPlaceholder />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
