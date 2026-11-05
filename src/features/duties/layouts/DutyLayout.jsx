import { Navigate, NavLink, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { asyncLogout } from '../../auth/states/action';

// Cangkang sementara: proteksi rute + header & menu sederhana.
// Navbar & Sidebar lengkap ditambahkan di langkah berikutnya.
const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-1 ${isActive ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`;

export default function DutyLayout() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  if (!token) return <Navigate to="/auth/login" replace />;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex flex-wrap items-center justify-between gap-3 bg-white px-6 py-3 shadow">
        <div className="flex items-center gap-4">
          <span className="font-bold text-slate-800">DormDuty</span>
          <nav className="flex gap-1 text-sm">
            <NavLink to="/" end className={linkClass}>Beranda</NavLink>
            <NavLink to="/users" className={linkClass}>Warga</NavLink>
            <NavLink to="/profile" className={linkClass}>Profil</NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-slate-600">{user?.name} ({user?.role})</span>
          <button onClick={() => dispatch(asyncLogout())} className="rounded-lg border px-3 py-1 hover:bg-slate-100">
            Keluar
          </button>
        </div>
      </header>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
