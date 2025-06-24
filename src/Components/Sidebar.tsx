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

  const menuItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "bell", icon: Bell, label: "Notifications" },
    { id: "layoutDashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "network", icon: Network, label: "Network" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  const renderButton = (item: { id: string; icon: React.ElementType; label: string }) => (
    <button
      key={item.id}
      onClick={() => handleMenuClick(item.id)}
      className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-lg transition-colors group relative ${
        activeTab === item.id
          ? "bg-[#363636] text-white border border-[#5a5a5a]"
          : "text-gray-400 hover:text-white hover:bg-[#363636]"
      }`}
      title={item.label}
    >
      <item.icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
      
      {/* Tooltip for larger screens */}
      <div className="absolute left-full ml-2 px-2 py-1 bg-[#1a1a1a] text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 hidden lg:block">
        {item.label}
        <div className="absolute left-[-4px] top-1/2 transform -translate-y-1/2 w-2 h-2 bg-[#1a1a1a] rotate-45"></div>
      </div>
    </button>
  );

  return (
    <div className="bg-black w-12 sm:w-16 lg:w-20 flex flex-col items-center h-screen">
      {/* Main Navigation Items */}
      <div className="flex flex-col items-center space-y-2 sm:space-y-3 lg:space-y-4 pt-4 sm:pt-6">
        {menuItems.map((item) => renderButton(item))}
      </div>

      {/* User icon at the bottom */}
      <div className="mt-auto mb-3 sm:mb-4 lg:mb-6">
        {renderButton({ id: "user", icon: User, label: "Profile" })}
      </div>
    </div>
  );
};

export default Sidebar;