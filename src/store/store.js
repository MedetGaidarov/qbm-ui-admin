import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

// REDUCER
import applicationReducer from './slices/applicationSlice.ts';
import modalReducer from './slices/modalSlice.ts';
import authReducer from './slices/authSlice.ts';
import quizReducer from "./slices/quizCreateSlice.ts";

// API
import { authApi } from './api/authApi.ts';
import { userApi } from './api/userApi.ts';
import { applicationApi } from './api/applicationApi.ts';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import {locationApi} from "./api/position/locationApi.ts";
import {departmentApi} from "./api/position/departmentApi.ts";
import {positionApi} from "./api/position/positionApi.ts";
import {quizApi} from "./api/quizApi.ts";


// Конфигурация Redux Persist
const persistConfig = {
    key: 'root',
    storage,
};

// Объединение редьюсеров с поддержкой Redux Persist
const rootReducer = combineReducers({
    auth: authReducer,
    modal: modalReducer,
    application: persistReducer(persistConfig, applicationReducer),
    quizCreate: quizReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [applicationApi.reducerPath]: applicationApi.reducer,
    [locationApi.reducerPath]: locationApi.reducer,
    [departmentApi.reducerPath]: departmentApi.reducer,
    [positionApi.reducerPath]: positionApi.reducer,
    [quizApi.reducerPath]: quizApi.reducer,
});

// Создание хранилища
const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        }).concat(
            authApi.middleware, userApi.middleware, applicationApi.middleware,
            locationApi.middleware, departmentApi.middleware, positionApi.middleware,
            quizApi.middleware
        ),
});

// Настройка Redux Toolkit Query listeners
setupListeners(store.dispatch);

// Создание объекта persistor для Redux Persist
const persistor = persistStore(store);

// Экспорт хранилища и persistor
export { store, persistor };