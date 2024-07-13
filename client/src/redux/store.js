import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'
import userReducer from './reducers/userSlice.js'
import ThemeReducer from './reducers/ThemeSlice.js'
const rootReducer = combineReducers({
   user : userReducer ,
  theme : ThemeReducer
})
const persistConfig = {
    key: 'root',
  version: 1,
  storage,
}
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
