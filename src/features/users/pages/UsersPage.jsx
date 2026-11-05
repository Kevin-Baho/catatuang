import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useInput from '../../../hooks/useInput';
import { asyncFetchUsers } from '../states/action';
import Avatar from '../components/Avatar';

const ROLE_LABEL = { resident: 'Warga', coordinator: 'Koordinator', admin: 'Admin' };
const FLOORS = [1, 2, 3, 4, 5];

export default function UsersPage() {
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector((state) => state.users);
  const [floor, onFloorChange] = useInput('');
  const [search, onSearchChange] = useInput('');

  useEffect(() => {
    dispatch(asyncFetchUsers({ floor, search }));
  }, [dispatch, floor, search]);

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-800">Direktori Warga Asrama</h2>
      <div className="flex flex-wrap gap-3">
        <input
          aria-label="Cari warga"
          placeholder="Cari nama, NIM, atau kamar"
          value={search}
          onChange={onSearchChange}
          className="min-w-64 flex-1 rounded-lg border border-slate-300 px-3 py-2"
        />
        <select aria-label="Filter lantai" value={floor} onChange={onFloorChange} className="rounded-lg border border-slate-300 px-3 py-2">
          <option value="">Semua Lantai</option>
          {FLOORS.map((f) => (
            <option key={f} value={f}>Lantai {f}</option>
          ))}
        </select>
      </div>

      {isLoading && <p className="text-sm text-slate-500">Memuat...</p>}
      {!isLoading && users.length === 0 && <p className="text-slate-500">Tidak ada warga ditemukan.</p>}

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((u) => (
          <li key={u.id} className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
            <Avatar user={u} />
            <div className="min-w-0">
              <p className="truncate font-medium text-slate-800">{u.name}</p>
              <p className="text-sm text-slate-500">{u.nim} · {u.room_number} · Lt. {u.floor}</p>
              <span className="text-xs text-indigo-600">{ROLE_LABEL[u.role] || u.role}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
