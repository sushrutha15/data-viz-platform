// Store/Store.ts
import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './DashboardSlice';
import variablesReducer from './VariablesSlice';

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    variables: variablesReducer,
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
