import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X, Search, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { setVariables } from '../Store/VariablesSlice';
import type { RootState } from '../Store/Store';

// Type definitions
interface Variable {
  id: string;
  name: string;
  description: string;
  value?: string;
  type?: string;
}

interface VariableEditingProps {
  isOpen: boolean;
  onClose: () => void;
  activeVariables: Record<string, boolean>;
}

interface ExpandedSections {
  primary: boolean;
  secondary: boolean;
}

const VariableEditing: React.FC<VariableEditingProps> = ({ isOpen, onClose, activeVariables }) => {
  const dispatch = useDispatch();
  const { variableCategories } = useSelector((state: RootState) => state.variables);
  
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [localActiveVariables, setLocalActiveVariables] = useState<Record<string, boolean>>(activeVariables || {});
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    primary: false,
    secondary: false
  });

  const [hoveredVariable, setHoveredVariable] = useState<Variable | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalActiveVariables(activeVariables || {});
  }, [activeVariables]);

  const handleToggleVariable = (variableId: string): void => {
    setLocalActiveVariables(prev => ({
      ...prev,
      [variableId]: !prev[variableId]
    }));
  };

  const handleSave = (): void => {
    dispatch(setVariables(localActiveVariables));
    onClose();
  };

  const handleReset = (): void => {
    setLocalActiveVariables({
      infrastructureUnits: true,
      chargingGrowth: true,
      localizationChange: false,
      fleetGrowth: false,
      chargingStations: false,
      energyConsumption: false
    });
  };

  const toggleSection = (section: keyof ExpandedSections): void => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getVariableInfo = (variableId: string): string => {
    const infoMap: Record<string, string> = {
      infrastructureUnits: "Measures the total investment in charging infrastructure including hardware, installation, and maintenance costs. This directly affects the baseline capacity and operational efficiency of the charging network.",
      chargingGrowth: "Tracks the month-over-month growth rate in charging sessions and station utilization. Higher growth rates indicate successful market adoption and may require additional infrastructure planning.",
      localizationChange: "Analyzes geographic distribution shifts in charging demand. This helps identify emerging markets and optimize station placement for maximum coverage and efficiency.",
      fleetGrowth: "Monitors electric vehicle fleet expansion rates in the service area. Fleet growth directly correlates with future charging demand and infrastructure requirements.",
      chargingStations: "Total count of operational charging stations across all service areas. This metric affects network density calculations and coverage analysis.",
      energyConsumption: "Measures total energy consumed across all charging sessions. This data is crucial for cost calculations, grid planning, and sustainability metrics.",
      co2Distribution: "But what truly sets Switch apart is its versatility. It can be used as a scooter, a bike, or even a skateboard, making it suitable for people of all ages. Whether you're a student, a professional, or a senior citizen, Switch adapts to your needs and lifestyle."
    };
    return infoMap[variableId] || "Information about this variable's impact on charging station operations and analysis.";
  };

  const filteredVariables = Object.entries(variableCategories || {}).reduce<Record<string, Variable[]>>((acc, [categoryKey, variables]) => {
    const filtered = variables.filter((variable: Variable) => 
      variable.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variable.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[categoryKey] = filtered;
    }
    return acc;
  }, {});

  const handleMouseEnter = (variable: Variable): void => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
    }
    hoverTimer.current = setTimeout(() => {
      setHoveredVariable(variable);
    }, 1500);
  };

  const handleMouseLeave = (): void => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
    setHoveredVariable(null);
  };

  // Get all variables for the top category sections
  const getAllVariables = () => {
    const allVars: Variable[] = [];
    if (variableCategories?.primary) allVars.push(...variableCategories.primary);
    if (variableCategories?.secondary) allVars.push(...variableCategories.secondary);
    return allVars;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-40 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Slide Over Panel */}
      <div className={`
        fixed right-0 top-0 h-full bg-[#0e0d0d] border-l border-[#383838] z-50
        transform transition-transform duration-300 ease-in-out flex flex-col
        w-full sm:w-[90%] md:w-[70%] lg:w-[600px] xl:w-[650px]
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-[#383838]">
          <h2 className="text-white text-lg sm:text-xl font-semibold">Edit Variables</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Controls */}
        <div className="p-3 sm:p-4 border-b border-[#383838]">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-3 sm:mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search variables..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-[#0e0d0d] border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-[#9acd32] text-sm"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleReset}
                className="px-3 py-2 sm:py-2.5 bg-[#0e0d0d] border border-[#383838] text-white rounded hover:bg-[#3a3a3a] transition-colors text-sm whitespace-nowrap"
              >
                Autofill
              </button>
              <button
                onClick={handleSave}
                className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#9acd32] text-black rounded hover:bg-[#8bc34a] transition-colors text-sm font-medium whitespace-nowrap"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Rerun</span>
                <span className="sm:hidden">Run</span>
              </button>
            </div>
          </div>
        </div>

        {/* Variable Categories Section */}
        <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 border-b border-[#383838]">
          {/* Variable Category 1 */}
          <div className="space-y-2">
            <h3 className="text-gray-400 text-xs sm:text-sm">Variable category 1</h3>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {getAllVariables().slice(0, 3).map((variable) => {
                const isActive = localActiveVariables[variable.id];
                return (
                  <button
                    key={variable.id}
                    onClick={() => handleToggleVariable(variable.id)}
                    onMouseEnter={() => handleMouseEnter(variable)}
                    onMouseLeave={handleMouseLeave}
                    className={`
                      inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm transition-all
                      ${isActive 
                        ? 'bg-[#282e16] text-[#c7e871] border border-[#799629]' 
                        : 'bg-[#262628] text-[#8d8d8d] border border-[#5d5d5f] hover:border-[#c7e871]'
                      }
                    `}
                  >
                    <span className="truncate max-w-[120px] sm:max-w-none">{variable.name}</span>
                    <X className="w-3 h-3 ml-1 sm:ml-2 flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Variable Category 2 */}
          <div className="space-y-2">
            <h3 className="text-gray-400 text-xs sm:text-sm">Variable Category 2</h3>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {getAllVariables().slice(3, 6).map((variable) => {
                const isActive = localActiveVariables[variable.id];
                return (
                  <button
                    key={variable.id}
                    onClick={() => handleToggleVariable(variable.id)}
                    onMouseEnter={() => handleMouseEnter(variable)}
                    onMouseLeave={handleMouseLeave}
                    className={`
                      inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm transition-all
                      ${isActive 
                        ? 'bg-[#282e16] text-[#c7e871] border border-[#799629]' 
                        : 'bg-[#262628] text-[#8d8d8d] border border-[#5d5d5f] hover:border-[#c7e871]'
                      }
                    `}
                  >
                    <span className="truncate max-w-[120px] sm:max-w-none">{variable.name}</span>
                    <X className="w-3 h-3 ml-1 sm:ml-2 flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Variable Category 3 */}
          <div className="space-y-2">
            <h3 className="text-gray-400 text-xs sm:text-sm">Variable Category 3</h3>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {getAllVariables().slice(6, 9).map((variable) => {
                const isActive = localActiveVariables[variable.id];
                return (
                  <button
                    key={variable.id}
                    onClick={() => handleToggleVariable(variable.id)}
                    onMouseEnter={() => handleMouseEnter(variable)}
                    onMouseLeave={handleMouseLeave}
                    className={`
                      inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm transition-all
                      ${isActive 
                        ? 'bg-[#282e16] text-[#c7e871] border border-[#799629]' 
                        : 'bg-[#262628] text-[#8d8d8d] border border-[#5d5d5f] hover:border-[#c7e871]'
                      }
                    `}
                  >
                    <span className="truncate max-w-[120px] sm:max-w-none">{variable.name}</span>
                    <X className="w-3 h-3 ml-1 sm:ml-2 flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Context Window */}
          {hoveredVariable && (
            <div className="p-3 sm:p-4 bg-[#222324] border border-[#28292a] rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-white font-semibold text-base sm:text-lg pr-2">
                  {hoveredVariable.name}
                </h4>
                <div className="w-4 h-4 rounded-full border border-[#28292a] flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-gray-400">i</span>
                </div>
              </div>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                {getVariableInfo(hoveredVariable.id)}
              </p>
            </div>
          )}
        </div>

        {/* Collapsible Sections */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
          {/* Primary Variables */}
          <div className="bg-[#161618] border border-[#383838] rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('primary')}
              className="w-full flex items-center justify-between p-3 sm:p-4 text-left transition-colors hover:bg-[#1a1a1a]"
            >
              <span className="text-[#b4d067] font-medium text-sm sm:text-base">Primary Variables</span>
              {expandedSections.primary ? (
                <ChevronUp className="w-4 h-4 text-[#b4d067]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#b4d067]" />
              )}
            </button>
            
            {expandedSections.primary && (
              <div className="p-3 sm:p-4 pt-0">
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {filteredVariables.primary?.map((variable) => {
                    const isActive = localActiveVariables[variable.id];
                    return (
                      <button
                        key={variable.id}
                        onClick={() => handleToggleVariable(variable.id)}
                        onMouseEnter={() => handleMouseEnter(variable)}
                        onMouseLeave={handleMouseLeave}
                        className={`
                          inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm transition-all
                          ${isActive 
                            ? 'bg-[#9acd32] text-black' 
                            : 'bg-[#3a3a3a] text-gray-300 border border-gray-600 hover:border-[#9acd32]'
                          }
                        `}
                      >
                        <span className="truncate max-w-[120px] sm:max-w-none">{variable.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Secondary Variables */}
          <div className="bg-[#161618] border border-[#383838] rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('secondary')}
              className="w-full flex items-center justify-between p-3 sm:p-4 text-left transition-colors hover:bg-[#1a1a1a]"
            >
              <span className="text-[#b4d067] font-medium text-sm sm:text-base">Secondary Variables</span>
              {expandedSections.secondary ? (
                <ChevronUp className="w-4 h-4 text-[#9acd32]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#9acd32]" />
              )}
            </button>
            
            {expandedSections.secondary && (
              <div className="p-3 sm:p-4 pt-0">
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {filteredVariables.secondary?.map((variable) => {
                    const isActive = localActiveVariables[variable.id];
                    return (
                      <button
                        key={variable.id}
                        onClick={() => handleToggleVariable(variable.id)}
                        onMouseEnter={() => handleMouseEnter(variable)}
                        onMouseLeave={handleMouseLeave}
                        className={`
                          inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm transition-all
                          ${isActive 
                            ? 'bg-[#9acd32] text-black' 
                            : 'bg-[#3a3a3a] text-gray-300 border border-gray-600 hover:border-[#9acd32]'
                          }
                        `}
                      >
                        <span className="truncate max-w-[120px] sm:max-w-none">{variable.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Footer - Apply Changes and Cancel */}
        <div className="p-3 sm:p-4 border-t border-[#383838] bg-[#0e0d0d]">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-[#9acd32] text-black py-2.5 sm:py-2 px-4 rounded font-medium hover:bg-[#8bc34a] transition-colors text-sm"
            >
              Apply Changes
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-[#242424] text-white py-2.5 sm:py-2 px-4 rounded border border-[#3a3a3a] hover:bg-[#2a2a2a] transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VariableEditing;