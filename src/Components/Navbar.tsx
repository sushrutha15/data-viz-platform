import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Search, Menu } from "lucide-react";
import { setActiveTab } from "../Store/DashboardSlice";
import type { RootState } from "../Store/Store";

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state: RootState) => state.dashboard.activeTab || 'chargingSolutions');

  const handleNavClick = (tabId: string) => {
    dispatch(setActiveTab(tabId));
  };

  return (
    <div className="bg-black w-full h-16 flex items-center px-4 sticky top-0 z-30">
      <div className="mr-4">
        <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#363636] rounded-lg transition-colors">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleNavClick('chargingSolutions')}
          className={`px-4 py-1.5 text-sm transition-colors rounded-lg ${
            activeTab === 'chargingSolutions'
              ? 'bg-[#363636] text-white bg-opacity-90 border border-[#5a5a5a]'
              : 'text-white hover:text-white hover:bg-[#363636]'
          }`}
        >
          Charging Solutions
        </button>

        <button
          onClick={() => handleNavClick('fleetSizing')}
          className={`px-4 py-1.5 text-sm transition-colors rounded-lg ${
            activeTab === 'fleetSizing'
              ? 'bg-[#363636] text-white bg-opacity-90 border border-[#5a5a5a]'
              : 'text-white hover:text-white hover:bg-[#363636]'
          }`}
        >
          Fleet Sizing
        </button>

        <button
          onClick={() => handleNavClick('parking')}
          className={`px-4 py-1.5 text-sm transition-colors rounded-lg ${
            activeTab === 'parking'
              ? 'bg-[#363636] text-white bg-opacity-90 border border-[#5a5a5a]'
              : 'text-white hover:text-white hover:bg-[#363636]'
          }`}
        >
          Parking
        </button>
      </div>

      <div className="ml-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-4 h-4" />
          <input
            type="text"
            placeholder="Search"
            className="bg-[#242424] border border-[#3d3c3c] rounded-lg pl-10 pr-4 py-1.5 text-white placeholder-white focus:outline-none focus:border-[#5a5a5a] transition-colors w-48 text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
