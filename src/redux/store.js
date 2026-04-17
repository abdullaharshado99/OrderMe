// store.js
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

import storage from '@react-native-async-storage/async-storage'; 
import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1'; 

import authSlice from './slices/authSlice';
import userSlice from './slices/userSlice';

const persistConfig = {
  key: 'root',
  storage, 
  stateReconciler: autoMergeLevel1,
  // optional:
  // blacklist: ['authReducer'], // 🔐 if you don’t want to persist auth
};

const reducers = combineReducers({
  authReducer: authSlice,
  userReducer: userSlice,
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistedStore = persistStore(store);