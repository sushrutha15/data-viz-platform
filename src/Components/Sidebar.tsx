import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setActiveTab } from "../Store/DashboardSlice";
import {
  Home,
  Bell,
  LayoutDashboard,
  Network,
  Settings,
  User,
} from "lucide-react";
import type { RootState } from "../Store/Store";

const Sidebar: React.FC = () => {
  const activeTab = useSelector((state: RootState) => state.dashboard.activeTab);
  const dispatch = useDispatch();

  const handleMenuClick = (tabId: string) => {
    dispatch(setActiveTab(tabId));
  };

  return (
    <div className="bg-black w-16 flex flex-col items-center h-screen">
      <div className="flex flex-col items-center space-y-4 pt-6">
        <button
          onClick={() => handleMenuClick("home")}
          className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
            activeTab === "home"
              ? "bg-[#363636] text-white border border-[#5a5a5a]"
              : "text-gray-400 hover:text-white hover:bg-[#363636]"
          }`}
        >
          <Home className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleMenuClick("bell")}
          className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
            activeTab === "bell"
              ? "bg-[#363636] text-white border border-[#5a5a5a]"
              : "text-gray-400 hover:text-white hover:bg-[#363636]"
          }`}
        >
          <Bell className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleMenuClick("layoutDashboard")}
          className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
            activeTab === "layoutDashboard"
              ? "bg-[#363636] text-white border border-[#5a5a5a]"
              : "text-gray-400 hover:text-white hover:bg-[#363636]"
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleMenuClick("network")}
          className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
            activeTab === "network"
              ? "bg-[#363636] text-white border border-[#5a5a5a]"
              : "text-gray-400 hover:text-white hover:bg-[#363636]"
          }`}
        >
          <Network className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleMenuClick("settings")}
          className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
            activeTab === "settings"
              ? "bg-[#363636] text-white border border-[#5a5a5a]"
              : "text-gray-400 hover:text-white hover:bg-[#363636]"
          }`}
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* User icon at the bottom */}
      <div className="mt-auto mb-4">
        <button
          onClick={() => handleMenuClick("user")}
          className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
            activeTab === "user"
              ? "bg-[#363636] text-white border border-[#5a5a5a]"
              : "text-gray-400 hover:text-white hover:bg-[#363636]"
          }`}
        >
          <User className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
