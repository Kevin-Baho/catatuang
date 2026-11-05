import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from './test-utils';
import authReducer from './features/auth/states/reducer';
import usersReducer from './features/users/states/reducer';
import { userApi } from './features/users/api/userApi';
import App from './App';

vi.mock('./helpers/toolsHelper', () => ({ showError: vi.fn(), showSuccess: vi.fn() }));

const loggedIn = { auth: { token: 't', user: { name: 'Budi', role: 'resident' }, isLoading: false } };
const opts = (route, preloadedState) => ({
  route,
  reducer: { auth: authReducer, users: usersReducer },
  preloadedState,
});

describe('App routes', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    vi.spyOn(userApi, 'list').mockResolvedValue([]);
    vi.spyOn(userApi, 'getMe').mockResolvedValue({
      id: 1, name: 'Budi', nim: '1', email: 'b@x.com', room_number: 'Kamar 1', floor: 1,
    });
  });

  it('/ tanpa token diarahkan ke halaman login', () => {
    renderWithProviders(<App />, opts('/'));
    expect(screen.getByRole('heading', { name: 'Masuk' })).toBeInTheDocument();
  });

  it('/auth mengarah ke login', () => {
    renderWithProviders(<App />, opts('/auth'));
    expect(screen.getByRole('heading', { name: 'Masuk' })).toBeInTheDocument();
  });

  it('/auth/register menampilkan form pendaftaran', () => {
    renderWithProviders(<App />, opts('/auth/register'));
    expect(screen.getByRole('heading', { name: 'Daftar Warga Asrama' })).toBeInTheDocument();
  });

  it('/ dengan token menampilkan dashboard', () => {
    renderWithProviders(<App />, opts('/', loggedIn));
    expect(screen.getByText(/Dashboard roster piket/)).toBeInTheDocument();
  });

  it('/users menampilkan direktori warga', async () => {
    renderWithProviders(<App />, opts('/users', loggedIn));
    expect(screen.getByRole('heading', { name: 'Direktori Warga Asrama' })).toBeInTheDocument();
    expect(await screen.findByText('Tidak ada warga ditemukan.')).toBeInTheDocument();
  });

  it('/profile menampilkan profil saya', async () => {
    renderWithProviders(<App />, opts('/profile', loggedIn));
    expect(await screen.findByRole('heading', { name: 'Profil Saya' })).toBeInTheDocument();
  });

  it('rute tak dikenal diarahkan ke /', () => {
    renderWithProviders(<App />, opts('/entah-apa', loggedIn));
    expect(screen.getByText(/Dashboard roster piket/)).toBeInTheDocument();
  });

  it('pengguna yang sudah login tidak bisa membuka /auth/login', () => {
    renderWithProviders(<App />, opts('/auth/login', loggedIn));
    expect(screen.getByText(/Dashboard roster piket/)).toBeInTheDocument();
  });
});
