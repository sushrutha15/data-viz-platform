import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

//  Define a Variable type for your categories
export interface Variable {
  id: string;
  name: string;
  value: string;
  description: string;
  type: string;
}

//  State type
export interface VariablesState {
  activeVariables: Record<string, boolean>;
  isEditingOpen: boolean;
  primaryVariable: string | null;
  variableCategories: {
    primary: Variable[];
    secondary: Variable[];
  };
}

// Initial state typed
const initialState: VariablesState = {
  activeVariables: {
    infrastructureUnits: true,
    chargingGrowth: true,
    localizationChange: false,
    fleetGrowth: false,
    chargingStations: false,
    energyConsumption: false,
  },
  isEditingOpen: false,
  primaryVariable: 'infrastructureUnits',
  variableCategories: {
    primary: [
      {
        id: 'infrastructureUnits',
        name: 'Infrastructure Units',
        value: '€421.07',
        description: 'Total infrastructure investment units across all charging stations',
        type: 'currency',
      },
      {
        id: 'chargingGrowth',
        name: 'Charging Growth',
        value: '33.07%',
        description: 'Monthly charging station growth rate and expansion metrics',
        type: 'percentage',
      },
      {
        id: 'chargingStations',
        name: 'Charging Stations',
        value: '48 units',
        description: 'Total number of active charging stations in the network',
        type: 'count',
      },
    ],
    secondary: [
      {
        id: 'localizationChange',
        name: 'Localization Change',
        value: '21.9%',
        description: 'Geographic distribution changes and regional deployment shifts',
        type: 'percentage',
      },
      {
        id: 'fleetGrowth',
        name: 'Fleet Growth',
        value: '7.03%',
        description: 'Electric vehicle fleet expansion and adoption rates',
        type: 'percentage',
      },
      {
        id: 'energyConsumption',
        name: 'Energy Consumption',
        value: '1,234 kWh',
        description: 'Total energy consumption metrics and efficiency tracking',
        type: 'energy',
      },
    ],
  },
};

const variablesSlice = createSlice({
  name: 'variables',
  initialState,
  reducers: {
    toggleVariable: (state, action: PayloadAction<string>) => {
      const variableId = action.payload;
      const wasActive = state.activeVariables[variableId];
      state.activeVariables[variableId] = !wasActive;

      if (!wasActive) {
        state.primaryVariable = variableId;
      } else if (variableId === state.primaryVariable) {
        const activeVars = Object.entries(state.activeVariables)
          .filter(([id, isActive]) => isActive && id !== variableId)
          .map(([id]) => id);
        state.primaryVariable = activeVars.length > 0 ? activeVars[0] : null;
      }
    },

    setVariables: (state, action: PayloadAction<Record<string, boolean>>) => {
      state.activeVariables = { ...state.activeVariables, ...action.payload };

      const activeVars = Object.entries(state.activeVariables)
        .filter(([, isActive]) => isActive)
        .map(([id]) => id);

      if (state.primaryVariable && activeVars.includes(state.primaryVariable)) {
        // keep current
      } else {
        state.primaryVariable = activeVars.length > 0 ? activeVars[0] : null;
      }
    },

    setPrimaryVariable: (state, action: PayloadAction<string>) => {
      const variableId = action.payload;
      if (state.activeVariables[variableId]) {
        state.primaryVariable = variableId;
      }
    },

    setEditingOpen: (state, action: PayloadAction<boolean>) => {
      state.isEditingOpen = action.payload;
    },
  },
});

export const {
  toggleVariable,
  setVariables,
  setPrimaryVariable,
  setEditingOpen,
} = variablesSlice.actions;

export default variablesSlice.reducer;
