import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { MoreHorizontal, RotateCcw, Zap, Upload } from "lucide-react";
import { Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ComposedChart } from "recharts";
import { setSelectedMetric, setExpandedScenario, setLoading, setError } from '../Store/DashboardSlice';
import { setEditingOpen, setPrimaryVariable } from '../Store/VariablesSlice';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import VariableEditing from './VariableEditing';
import DataPointDetails from './DataPointDetails';
import LoadingSpinner from './LoadSpinner';
import ErrorMessage from './ErrorMessage';
import type { ChartDataPoint as DashboardChartDataPoint } from '../Store/DashboardSlice';

// Type definitions
interface Variable {
    id: string;
    name: string;
    description: string;
    value: string | number;
    type: string;
}

interface VariableCategories {
    primary: Variable[];
    secondary: Variable[];
}

interface ActiveVariables {
    [key: string]: boolean;
}

interface ChartData {
    [key: string]: DashboardChartDataPoint[];
}

interface KPI {
    title: string;
    subtitle: string;
    value: string | number;
    variableId: string;
    type: string;
    isPrimary: boolean;
}

interface Scenario {
    id: number;
    title: string;
}

interface DashboardState {
    selectedMetric: string;
    chartData: ChartData | null;
    scenarios: Scenario[] | null;
    expandedScenario: number | null;
    isLoading: boolean;
    error: string | null;
}

interface VariablesState {
    activeVariables: ActiveVariables;
    isEditingOpen: boolean;
    variableCategories: VariableCategories | null;
    primaryVariable: string | null;
}

interface RootState {
    dashboard: DashboardState;
    variables: VariablesState;
}

interface HoveredDataPoint extends DashboardChartDataPoint {
    variableId: string;
}


interface Position {
    x: number;
    y: number;
}

interface SingleChartData {
    id: string;
    data: DashboardChartDataPoint[];
    color: string;
    name: string;
}

interface VariableInfo {
    color: string;
    name: string;
}

interface VariableInfoMap {
    [key: string]: VariableInfo;
}

interface CustomDotProps {
    cx?: number;
    cy?: number;
    index?: number;
}

const Dashboard: React.FC = () => {
    const dispatch = useDispatch();
    
    const { selectedMetric, chartData, scenarios, expandedScenario, isLoading, error } = useSelector((state: RootState) => state.dashboard);
    const { activeVariables, isEditingOpen, variableCategories, primaryVariable } = useSelector((state: RootState) => state.variables);
    
    const [hoveredDataPoint, setHoveredDataPoint] = useState<HoveredDataPoint | null>(null);
    const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 });

    // Simulating data loading on component mount
    useEffect(() => {
        const loadDashboardData = (): void => {
            dispatch(setLoading(true));
            
            setTimeout(() => {
                if (Math.random() > 0.1) {
                    dispatch(setLoading(false));
                } else {
                    dispatch(setError('Failed to load dashboard data. Please try again.'));
                    dispatch(setLoading(false));
                }
            }, 1500);
        };

        loadDashboardData();
    }, [dispatch]);

    // Get active variables and create dynamic KPI data
    const getActiveKPIs = (): KPI[] => {
        if (!variableCategories) return [];
        
        const allVariables: Variable[] = [...variableCategories.primary, ...variableCategories.secondary];
        return Object.entries(activeVariables)
            .filter(([, isActive]: [string, boolean]) => isActive)
            .map(([variableId, ]: [string, boolean]) => {
                const variable: Variable | undefined = allVariables.find((v: Variable) => v.id === variableId);
                if (!variable) return null;
                
                return {
                    title: variable.name,
                    subtitle: variable.description,
                    value: variable.value,
                    variableId: variableId,
                    type: variable.type,
                    isPrimary: variableId === primaryVariable
                };
            })
            .filter((item): item is KPI => Boolean(item));
    };

    // Get SINGLE chart data based on primary variable
    const getSingleChartData = (): SingleChartData | null => {
        if (!chartData || !primaryVariable) return null;
        
        const data: DashboardChartDataPoint[] | undefined = chartData[primaryVariable];
        if (!data) return null;
        
        //Chart Color and name mapping
        const variableInfo: VariableInfoMap = {
            infrastructureUnits: { color: '#9acd32', name: 'Infrastructure Units' },
            chargingGrowth: { color: '#ff6b6b', name: 'Charging Growth' },
            localizationChange: { color: '#4ecdc4', name: 'Localization Change' },
            fleetGrowth: { color: '#ffd93d', name: 'Fleet Growth' },
            chargingStations: { color: '#ff9f43', name: 'Charging Stations' },
            energyConsumption: { color: '#a55eea', name: 'Energy Consumption' }
        };
        
        const info: VariableInfo = variableInfo[primaryVariable] || { color: '#9acd32', name: 'Unknown' };
        
        return {
            id: primaryVariable,
            data: data,
            color: info.color,
            name: info.name
        };
    };

    const activeKPIs: KPI[] = getActiveKPIs();
    const singleChart: SingleChartData | null = getSingleChartData();

    const handleDotHover = (dataPoint: HoveredDataPoint, event?: React.MouseEvent): void => {
        if (event) {
            setMousePosition({ x: event.clientX, y: event.clientY });
        }
        setHoveredDataPoint(dataPoint);
    };

    const handleDotLeave = (): void => {
        setHoveredDataPoint(null);
    };

    // Convert HoveredDataPoint to expected ChartDataPoint format
    const getDataPointForDetails = (dataPoint: HoveredDataPoint | null): DashboardChartDataPoint | null => {
        if (!dataPoint) return null;
        // Return the dataPoint as-is since it already extends DashboardChartDataPoint
        // and has all required properties including displayValue
        return dataPoint;
    };

    const handleEditVariables = (): void => {
        dispatch(setEditingOpen(true));
    };

    const toggleScenario = (id: number): void => { 
        dispatch(setExpandedScenario(id));
    };

    const handleRetry = (): void => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        setTimeout(() => {
            dispatch(setLoading(false));
        }, 1500);
    };

    // Handle KPI card click to change primary variable
    const handleKPIClick = (variableId: string): void => {
        if (activeVariables[variableId]) {
            dispatch(setPrimaryVariable(variableId));
        }
    };

    const CustomDot: React.FC<CustomDotProps> = (props) => {
        const { cx, cy, index } = props;
        if (!singleChart || typeof index === 'undefined') return null;
        
        const item: DashboardChartDataPoint | undefined = singleChart.data[index];
        
        if (item?.month === 'May' || item?.month === 'Jul') {
            return (
                <circle 
                    cx={cx} 
                    cy={cy} 
                    r="6" 
                    fill={singleChart.color}
                    stroke="#2c2d2e" 
                    strokeWidth="2"
                    className="cursor-pointer hover:r-8 transition-all"
                    onMouseEnter={(e: React.MouseEvent) => handleDotHover({...item, variableId: singleChart.id}, e)}
                    onMouseLeave={handleDotLeave}
                />
            );
        }
        return null;
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex flex-col">
                <Navbar />
                <div className="flex flex-1">
                    <Sidebar />
                    <div className="flex-1 bg-[#161618] border border-[#3b3b3b] text-white">
                        <LoadingSpinner message="Loading dashboard data..." />
                    </div>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex flex-col">
                <Navbar />
                <div className="flex flex-1">
                    <Sidebar />
                    <div className="flex-1 bg-[#161618] border border-[#3b3b3b] text-white">
                        <ErrorMessage 
                            message={error} 
                            onRetry={handleRetry}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f0f0f] flex flex-col">
            <Navbar />
            
            <div className="flex flex-1">
                <Sidebar />
                
                <div className="flex-1 bg-[#161618] border border-[#3b3b3b] text-white p-3 sm:p-4 lg:p-6 overflow-y-auto">
                    <div className={`transition-all duration-300 ${isEditingOpen ? 'blur-sm' : ''}`}>
            
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 lg:mb-6 space-y-3 sm:space-y-0">
                            <div className="flex items-center space-x-3">
                                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                <h1 className="text-white text-xl sm:text-2xl font-semibold">Charging Station</h1>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button 
                                    onClick={handleRetry}
                                    className="bg-[#242424] border border-[#3a3a3a] text-white p-2 rounded text-sm hover:bg-[#3a3a3a] transition-colors"
                                    title="Refresh data"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={handleEditVariables} 
                                    className="bg-[#242424] border border-[#3a3a3a] text-white px-2 sm:px-4 py-2 rounded text-xs sm:text-sm hover:bg-[#3a3a3a] transition-colors"
                                >
                                    <span className="hidden sm:inline">Edit Variables</span>
                                    <span className="sm:hidden">Edit</span>
                                </button>
                                <button className="bg-[#242424] border border-[#3a3a3a] text-white p-2 rounded text-sm hover:bg-[#3a3a3a] transition-colors">
                                    <Upload className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Best Scenario Results */}
                        <div className="mb-6 lg:mb-8">
                            <h2 className="text-[#dafd7e] text-base sm:text-lg font-semibold mb-3 lg:mb-4">Best Scenario Results</h2>
                            <div className="space-y-2 lg:space-y-3">
                                {scenarios && scenarios.map((scenario: Scenario) => (
                                    <div key={scenario.id} className="bg-[#161618] border border-[#4a5c2a] rounded-lg p-3 lg:p-4">
                                        <div className="flex justify-between items-start">
                                            <p className="text-[#9acd32] text-xs sm:text-sm flex-1 pr-4">{scenario.title}</p>
                                            <button 
                                                onClick={() => toggleScenario(scenario.id)} 
                                                className="text-gray-400 hover:text-white transition-colors"
                                            >
                                                <MoreHorizontal className="w-4 h-4 lg:w-5 lg:h-5 text-[#9acd32]" />
                                            </button>
                                        </div>
                                        {expandedScenario === scenario.id && (
                                            <div className="mt-3 lg:mt-4 pt-3 lg:pt-4 border-t border-[#4a5c2a]">
                                                <p className="text-gray-400 text-xs sm:text-sm">
                                                    Additional scenario details would be displayed here.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Main Content - Chart and Variables Panel */}
                        <div className="flex flex-col xl:flex-row xl:space-x-6 space-y-6 xl:space-y-0">
                            {/* Chart Section */}
                            <div className="w-full xl:w-[60%]">
                                {/* Title outside the border */}
                                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-3 lg:mb-4">
                                    <h3 className="text-white text-lg sm:text-xl font-semibold">Graphs</h3>
                                    {singleChart && (
                                        <div className="flex items-center space-x-2">
                                            <div 
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: singleChart.color }}
                                            ></div>
                                            <span className="text-gray-400 text-xs sm:text-sm">{singleChart.name}</span>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Chart container with border */}
                                <div className="bg-[#161618] border border-[#2a2a2a] rounded-lg p-3 sm:p-4 lg:p-6 outline:none">
                                    {/* Dropdown inside the border */}
                                    <div className="flex justify-end items-center mb-3 lg:mb-4">
                                        <select 
                                            value={selectedMetric} 
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => dispatch(setSelectedMetric(e.target.value))} 
                                            className="bg-[#242424] border border-[#3a3a3a] text-white px-2 sm:px-3 py-2 rounded text-xs sm:text-sm focus:outline-none focus:border-[#5a5a5a] w-full sm:w-auto"
                                        >
                                            <option>Unsatisfied Demand %</option>
                                            <option>Charging Growth Rate</option>
                                            <option>Infrastructure Utilization</option>
                                        </select>
                                    </div>
                                    
                                    <div className="h-[300px] sm:h-[350px] lg:h-[400px]">
                                        {singleChart ? (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <ComposedChart 
                                                    data={singleChart.data} 
                                                    margin={{ 
                                                        top: 20, 
                                                        right: window.innerWidth < 640 ? 10 : 30, 
                                                        left: window.innerWidth < 640 ? 10 : 20, 
                                                        bottom: 20 
                                                    }}
                                                >
                                                    <CartesianGrid strokeDasharray="10" stroke="#2b2c2c" horizontal={true} vertical={false} />
                                                    <XAxis 
                                                        dataKey="month" 
                                                        axisLine={true} 
                                                        tickLine={false} 
                                                        tick={{ fill: '#e3e3e4', fontSize: window.innerWidth < 640 ? 10 : 12 }} 
                                                        interval={window.innerWidth < 640 ? 1 : 0}
                                                    />
                                                    <YAxis 
                                                        axisLine={true} 
                                                        tickLine={false} 
                                                        tick={{ fill: '#e3e3e4', fontSize: window.innerWidth < 640 ? 10 : 12 }} 
                                                        tickFormatter={(value: number) => `${value/1000}K`} 
                                                        domain={[0, 100000]} 
                                                        width={window.innerWidth < 640 ? 40 : 60}
                                                    />
                                                    
                                                    {/* Reference Lines */}
                                                    <defs>
                                                        <pattern id="currentMonthLine" patternUnits="userSpaceOnUse" width="4" height="4">
                                                            <path d="M 0,4 l 4,-4 M -1,1 l 2,-2 M 3,5 l 2,-2" stroke="#2c2d2e" strokeWidth="1"/>
                                                        </pattern>
                                                        <pattern id="peakMonthLine" patternUnits="userSpaceOnUse" width="6" height="6">
                                                            <path d="M 0,6 l 6,-6 M -1.5,1.5 l 3,-3 M 4.5,7.5 l 3,-3" stroke="#9acd32" strokeWidth="2"/>
                                                        </pattern>
                                                    </defs>
                                                    
                                                    {/* Current Month Line (May) */}
                                                    <line 
                                                        x1="25%" 
                                                        y1="10%" 
                                                        x2="25%" 
                                                        y2="90%" 
                                                        stroke="#2c2d2e" 
                                                        strokeWidth="2" 
                                                        strokeDasharray="5,5" 
                                                    />
                                                    
                                                    {/* Peak Month Line (Jul) */}
                                                    <line 
                                                        x1="53.5%" 
                                                        y1="12%" 
                                                        x2="53.5%" 
                                                        y2="88%" 
                                                        stroke="#dafd7e" 
                                                        strokeWidth="2" 
                                                        strokeDasharray="8,4" 
                                                    />
                                                    
                                                    {/* Single dynamic chart line */}
                                                    <Line 
                                                        type="linear" 
                                                        dataKey="value" 
                                                        stroke={singleChart.color}
                                                        strokeWidth={window.innerWidth < 640 ? 2 : 3}
                                                        name={singleChart.name}
                                                        dot={<CustomDot />}
                                                    />
                                                </ComposedChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <div className="text-center px-4">
                                                    <p className="text-gray-400 text-base sm:text-lg mb-2">No variables selected</p>
                                                    <p className="text-gray-500 text-xs sm:text-sm">Select variables to view chart data</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Variables Panel */}
                            <div className="w-full xl:w-[40%]">
                                {/* Title and controls outside the border */}
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 lg:mb-4 space-y-2 sm:space-y-0">
                                    <h3 className="text-white text-lg sm:text-xl font-semibold">Key Performance Indicators</h3>
                                    <button 
                                        onClick={handleEditVariables}
                                        className="flex items-center justify-center space-x-1 bg-[#242424] border border-[#3a3a3a] text-gray-300 px-2 sm:px-3 py-1.5 rounded text-xs sm:text-sm hover:bg-[#3a3a3a] transition-colors w-full sm:w-auto"
                                    >
                                        <span>Variables</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </button>
                                </div>
                                
                                {/* KPI container with border */}
                                <div className="bg-[#161618] border border-[#2a2a2a] rounded-lg p-3 sm:p-4 lg:p-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                                        {activeKPIs.length > 0 ? activeKPIs.map((kpi: KPI, index: number) => (
                                            <div 
                                                key={index} 
                                                onClick={() => handleKPIClick(kpi.variableId)}
                                                // onMouseEnter={(e: React.MouseEvent) => handleVariableHover(kpi, e)}
                                                // onMouseLeave={handleVariableLeave}
                                                className={`rounded-lg p-3 lg:p-4 relative transition-all cursor-pointer ${
                                                    kpi.isPrimary 
                                                        ? 'bg-[#1e2a1a] border-2 border-[#9acd32] shadow-lg' 
                                                        : 'bg-[#1a1a1a] border border-[#3a3a3a] hover:border-[#5a5a5a] hover:bg-[#1e1e1e]'
                                                }`}
                                            >
                                                <div className="absolute top-2 lg:top-3 right-2 lg:right-3">
                                                    <div className={`w-3 h-3 lg:w-4 lg:h-4 rounded-full border flex items-center justify-center ${
                                                        kpi.isPrimary ? 'border-[#9acd32]' : 'border-gray-400'
                                                    }`}>
                                                        <span className={`text-xs ${
                                                            kpi.isPrimary ? 'text-[#9acd32]' : 'text-gray-400'
                                                        }`}>i</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="pr-5 lg:pr-6">
                                                    <h4 className={`text-xs sm:text-sm font-medium mb-2 ${
                                                        kpi.isPrimary ? 'text-[#9acd32]' : 'text-white'
                                                    }`}>{kpi.title}</h4>
                                                    <p className="text-gray-400 text-xs leading-relaxed mb-3 lg:mb-4">
                                                        {kpi.subtitle}
                                                    </p>
                                                    <div className={`text-lg sm:text-xl font-bold ${
                                                        kpi.isPrimary ? 'text-[#9acd32]' : 'text-white'
                                                    }`}>
                                                        {kpi.value}
                                                    </div>
                                                </div>
                                                
                                                <div className={`absolute bottom-2 lg:bottom-3 right-2 lg:right-3 w-2 h-2 rounded-full transition-all ${
                                                    kpi.isPrimary 
                                                        ? 'bg-[#9acd32] shadow-[0_0_8px_rgba(154,205,50,0.6)]' 
                                                        : 'bg-gray-600'
                                                }`} />
                                                
                                                {kpi.isPrimary && (
                                                    <div className="absolute inset-0 rounded-lg bg-[#9acd32] opacity-5 pointer-events-none" />
                                                )}
                                                
                                                {/* Primary indicator */}
                                                {kpi.isPrimary && (
                                                    <div className="absolute top-2 left-2">
                                                        <div className="w-2 h-2 rounded-full bg-[#9acd32] animate-pulse"></div>
                                                    </div>
                                                )}
                                            </div>
                                        )) : (
                                            <div className="col-span-1 sm:col-span-2 text-center py-6 lg:py-8">
                                                <div className="text-gray-400 text-sm mb-2">No variables selected</div>
                                                <button 
                                                    onClick={handleEditVariables}
                                                    className="text-[#9acd32] text-sm hover:underline"
                                                >
                                                    Click "Variables" to select some
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Variable Status Footer */}
                                    <div className="mt-4 lg:mt-6 pt-3 lg:pt-4 border-t border-[#2a2a2a]">
                                        <div className="flex justify-between items-center text-xs text-gray-500">
                                            <span>Active Variables</span>
                                            <span className="flex items-center space-x-2">
                                                <span>{Object.values(activeVariables).filter(Boolean).length}/{Object.keys(activeVariables).length}</span>
                                                <div className="flex space-x-1">
                                                    {Object.entries(activeVariables).slice(0, 4).map(([key, isActive]: [string, boolean]) => (
                                                        <div 
                                                            key={key}
                                                            className={`w-1.5 h-1.5 rounded-full transition-colors ${
                                                                isActive ? 'bg-[#9acd32]' : 'bg-gray-600'
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                            </span>
                                        </div>
                                        
                                        {singleChart && (
                                            <div className="mt-2 lg:mt-3 text-center">
                                                <p className="text-gray-500 text-xs">
                                                    Showing: <span className="text-[#9acd32]">{singleChart.name}</span> | 
                                                    <span className="hidden sm:inline"> Click KPI cards to switch</span>
                                                    <span className="sm:hidden"> Tap cards to switch</span>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Tooltip Component */}
                    {/* <VariableToolTip 
                        variable={getVariableForTooltip(hoveredVariable)}
                        position={variableTooltipPosition}
                        isVisible={!!hoveredVariable}
                    /> */}
                    
                    <VariableEditing 
                        isOpen={isEditingOpen}
                        onClose={() => dispatch(setEditingOpen(false))}
                        activeVariables={activeVariables}
                    />

                    <DataPointDetails 
                        dataPoint={getDataPointForDetails(hoveredDataPoint)}
                        position={mousePosition}
                        isVisible={!!hoveredDataPoint}
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;