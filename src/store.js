import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/states/reducer';
import usersReducer from './features/users/states/reducer';

// Slice duties ditambahkan di langkah berikutnya
export const rootReducer = {
  auth: authReducer,
  users: usersReducer,
};

const store = configureStore({ reducer: rootReducer });

export default store;
