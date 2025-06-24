import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// TYPES
export interface DataPointDetails {
  efficiency?: number;
  utilization?: number;
  trend?: 'increasing' | 'decreasing' | 'stable';
  comparison?: {
    lastMonth: number;
  };
  incidents?: number;
}

export interface DataPoint {
  month: string;
  value: number;
  details?: DataPointDetails;
}

export interface Insight {
  type: 'positive' | 'warning' | 'info';
  text: string;
}

export interface TooltipData extends DataPoint {
  insights: Insight[];
  recommendations: string[];
}

export interface DetailsState {
  hoveredDataPoint: DataPoint | null;
  mousePosition: { x: number; y: number };
  isVisible: boolean;
  selectedDataPoint: DataPoint | null;
  tooltipData: TooltipData | null;
  animationState: 'hidden' | 'entering' | 'visible' | 'exiting';
}

// INITIAL STATE
const initialState: DetailsState = {
  hoveredDataPoint: null,
  mousePosition: { x: 0, y: 0 },
  isVisible: false,
  selectedDataPoint: null,
  tooltipData: null,
  animationState: 'hidden',
};

// SLICE
const detailsSlice = createSlice({
  name: 'details',
  initialState,
  reducers: {
    setHoveredDataPoint(state, action: PayloadAction<DataPoint | null>) {
      state.hoveredDataPoint = action.payload;
      state.isVisible = !!action.payload;
      state.animationState = action.payload ? 'entering' : 'exiting';

      if (action.payload) {
        state.tooltipData = {
          ...action.payload,
          insights: generateInsights(action.payload),
          recommendations: generateRecommendations(action.payload),
        };
      } else {
        state.tooltipData = null;
      }
    },
    setMousePosition(state, action: PayloadAction<{ x: number; y: number }>) {
      state.mousePosition = action.payload;
    },
    setAnimationState(
      state,
      action: PayloadAction<'hidden' | 'entering' | 'visible' | 'exiting'>
    ) {
      state.animationState = action.payload;
    },
    setSelectedDataPoint(state, action: PayloadAction<DataPoint | null>) {
      state.selectedDataPoint = action.payload;
    },
    clearDetails(state) {
      state.hoveredDataPoint = null;
      state.isVisible = false;
      state.tooltipData = null;
      state.animationState = 'hidden';
    },
  },
});

// HELPERS
function generateInsights(dataPoint: DataPoint): Insight[] {
  const insights: Insight[] = [];

  if (!dataPoint.details) return insights;

  const { efficiency, utilization, trend, comparison } = dataPoint.details;

  if (efficiency !== undefined) {
    if (efficiency > 90) {
      insights.push({ type: 'positive', text: 'Excellent operational efficiency' });
    } else if (efficiency < 80) {
      insights.push({ type: 'warning', text: 'Below optimal efficiency threshold' });
    }
  }

  if (utilization !== undefined && utilization > 95) {
    insights.push({ type: 'info', text: 'Near capacity - consider expansion' });
  }

  if (trend === 'increasing') {
    insights.push({ type: 'positive', text: 'Positive growth trajectory' });
  } else if (trend === 'decreasing') {
    insights.push({ type: 'warning', text: 'Declining performance trend' });
  }

  if (comparison && comparison.lastMonth) {
    const growth = ((dataPoint.value - comparison.lastMonth) / comparison.lastMonth) * 100;
    if (Math.abs(growth) > 20) {
      insights.push({
        type: growth > 0 ? 'positive' : 'warning',
       text: `${Math.abs(growth).toFixed(1)}% ${growth > 0 ? 'increase' : 'decrease'} from last month`,
      });
    }
  }

  return insights;
}

function generateRecommendations(dataPoint: DataPoint): string[] {
  const recommendations: string[] = [];

  if (!dataPoint.details) return recommendations;

  const { efficiency, utilization, incidents, trend } = dataPoint.details;

  if (efficiency !== undefined && efficiency < 85) {
    recommendations.push('Optimize charging algorithms for better efficiency.');
  }

  if (utilization !== undefined && utilization > 90) {
    recommendations.push('Consider adding more charging stations in this area.');
  }

  if (incidents !== undefined && incidents > 3) {
    recommendations.push('Increase maintenance frequency to reduce incidents.');
  }

  if (trend === 'decreasing') {
    recommendations.push('Investigate factors causing performance decline.');
  }

  return recommendations;
}

// EXPORTS
export const {
  setHoveredDataPoint,
  setMousePosition,
  setAnimationState,
  setSelectedDataPoint,
  clearDetails,
} = detailsSlice.actions;

export default detailsSlice.reducer;
