import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// TYPES
export interface ChartDataPoint {
  month: string;
  value: number;
  displayValue: string;
 [key: string]: string | number | undefined;
}

export interface KPI {
  title: string;
  subtitle: string;
  value: string;
  variableId: string;
}

export interface Scenario {
  id: number;
  title: string;
}

export interface DashboardState {
  selectedMetric: string;
  activeTab: string;
  isLoading: boolean;
  error: string | null;
  chartData: Record<string, ChartDataPoint[]>;
  kpis: KPI[];
  scenarios: Scenario[];
  expandedScenario: number | null;
}

// INITIAL STATE
const initialState: DashboardState = {
  selectedMetric: 'Unsatisfied Demand %',
  activeTab: 'chargingSolutions',
  isLoading: false,
  error: null,

  chartData: {
    infrastructureUnits: [
      { month: 'Apr', value: 20000, displayValue: '€320.45' },
      { month: 'May', value: 45000, displayValue: '€421.07' },
      { month: 'Jun', value: 40000, displayValue: '€385.23' },
      { month: 'Jul', value: 90000, displayValue: '€567.89' },
      { month: 'Aug', value: 60000, displayValue: '€445.12' },
      { month: 'Sep', value: 30000, displayValue: '€298.76' },
      { month: 'Oct', value: 55000, displayValue: '€434.55' },
    ],
    chargingGrowth: [
      { month: 'Apr', value: 15000, displayValue: '25.5%' },
      { month: 'May', value: 25000, displayValue: '33.07%' },
      { month: 'Jun', value: 30000, displayValue: '42.1%' },
      { month: 'Jul', value: 45000, displayValue: '55.8%' },
      { month: 'Aug', value: 38000, displayValue: '48.3%' },
      { month: 'Sep', value: 20000, displayValue: '28.9%' },
      { month: 'Oct', value: 35000, displayValue: '44.2%' },
    ],
    localizationChange: [
      { month: 'Apr', value: 8000, displayValue: '12.3%' },
      { month: 'May', value: 15000, displayValue: '21.9%' },
      { month: 'Jun', value: 22000, displayValue: '31.2%' },
      { month: 'Jul', value: 35000, displayValue: '45.7%' },
      { month: 'Aug', value: 28000, displayValue: '38.4%' },
      { month: 'Sep', value: 15000, displayValue: '23.1%' },
      { month: 'Oct', value: 25000, displayValue: '34.8%' },
    ],
    fleetGrowth: [
      { month: 'Apr', value: 12000, displayValue: '5.2%' },
      { month: 'May', value: 18000, displayValue: '7.03%' },
      { month: 'Jun', value: 25000, displayValue: '9.8%' },
      { month: 'Jul', value: 40000, displayValue: '15.2%' },
      { month: 'Aug', value: 32000, displayValue: '12.7%' },
      { month: 'Sep', value: 18000, displayValue: '7.9%' },
      { month: 'Oct', value: 30000, displayValue: '11.4%' },
    ],
    chargingStations: [
      { month: 'Apr', value: 35000, displayValue: '42 units' },
      { month: 'May', value: 42000, displayValue: '48 units' },
      { month: 'Jun', value: 38000, displayValue: '45 units' },
      { month: 'Jul', value: 52000, displayValue: '58 units' },
      { month: 'Aug', value: 48000, displayValue: '52 units' },
      { month: 'Sep', value: 40000, displayValue: '46 units' },
      { month: 'Oct', value: 50000, displayValue: '55 units' },
    ],
    energyConsumption: [
      { month: 'Apr', value: 18000, displayValue: '980 kWh' },
      { month: 'May', value: 28000, displayValue: '1,234 kWh' },
      { month: 'Jun', value: 32000, displayValue: '1,456 kWh' },
      { month: 'Jul', value: 48000, displayValue: '2,103 kWh' },
      { month: 'Aug', value: 35000, displayValue: '1,678 kWh' },
      { month: 'Sep', value: 25000, displayValue: '1,145 kWh' },
      { month: 'Oct', value: 38000, displayValue: '1,789 kWh' },
    ],
  },

  kpis: [
    {
      title: "Infrastructure Units",
      subtitle: "Total infrastructure investment and deployment tracking",
      value: "€421.07",
      variableId: "infrastructureUnits",
    },
    {
      title: "Charging Growth",
      subtitle: "Month-over-month growth rate in charging sessions",
      value: "33.07%",
      variableId: "chargingGrowth",
    },
    {
      title: "Localization Change",
      subtitle: "Geographic distribution shifts and regional variations",
      value: "21.9%",
      variableId: "localizationChange",
    },
    {
      title: "Fleet Growth",
      subtitle: "Electric vehicle fleet expansion and adoption rate",
      value: "7.03%",
      variableId: "fleetGrowth",
    },
  ],

  scenarios: [
    {
      id: 1,
      title:
        "The best found configuration based on profit is characterized by 11 zones (max) with charging stations and 48 total number of poles.",
    },
    {
      id: 2,
      title:
        "The best found configuration based on satisfied demand is characterized by 11 zones (max) with charging stations and 48 total number of poles.",
    },
  ],

  expandedScenario: null,
};

// SLICE
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setSelectedMetric(state, action: PayloadAction<string>) {
      state.selectedMetric = action.payload;
    },
    setActiveTab(state, action: PayloadAction<string>) {
      state.activeTab = action.payload;
    },
    setExpandedScenario(state, action: PayloadAction<number>) {
      state.expandedScenario =
        state.expandedScenario === action.payload ? null : action.payload;
    },
    updateChartData(state, action: PayloadAction<Record<string, ChartDataPoint[]>>) {
      state.chartData = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

// EXPORT ACTIONS & REDUCER
export const {
  setSelectedMetric,
  setActiveTab,
  setExpandedScenario,
  updateChartData,
  setLoading,
  setError,
  clearError,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
