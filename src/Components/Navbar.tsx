import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Search, Menu, X } from "lucide-react";
import { setActiveTab } from "../Store/DashboardSlice";
import type { RootState } from "../Store/Store";

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state: RootState) => state.dashboard.activeTab || 'chargingSolutions');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleNavClick = (tabId: string) => {
    dispatch(setActiveTab(tabId));
    setIsMobileMenuOpen(false); // Close mobile menu after selection
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsSearchOpen(false); // Close search when opening menu
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setIsMobileMenuOpen(false); // Close menu when opening search
  };

  const navItems = [
    { id: 'chargingSolutions', label: 'Charging Solutions', shortLabel: 'Charging' },
    { id: 'fleetSizing', label: 'Fleet Sizing', shortLabel: 'Fleet' },
    { id: 'parking', label: 'Parking', shortLabel: 'Parking' }
  ];

  return (
    <>
      {/* Main Navbar */}
      <div className="bg-black w-full h-14 sm:h-16 flex items-center px-3 sm:px-4 lg:px-6 sticky top-0 z-30">
        
        {/* Menu Button */}
        <div className="mr-2 sm:mr-4">
          <button 
            onClick={toggleMobileMenu}
            className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#363636] rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>

        {/* Desktop Navigation Tabs */}
        <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`px-2 lg:px-4 py-1.5 text-xs lg:text-sm transition-colors rounded-lg whitespace-nowrap ${
                activeTab === item.id
                  ? 'bg-[#363636] text-white bg-opacity-90 border border-[#5a5a5a]'
                  : 'text-white hover:text-white hover:bg-[#363636]'
              }`}
            >
              <span className="hidden lg:inline">{item.label}</span>
              <span className="lg:hidden">{item.shortLabel}</span>
            </button>
          ))}
        </div>

        {/* Mobile Active Tab Indicator */}
        <div className="flex-1 md:hidden">
          <div className="text-white text-sm font-medium">
            {navItems.find(item => item.id === activeTab)?.shortLabel || 'Dashboard'}
          </div>
        </div>

        {/* Search Section */}
        <div className="ml-auto flex items-center space-x-2">
          {/* Mobile Search Toggle */}
          <button
            onClick={toggleSearch}
            className="md:hidden w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#363636] rounded-lg transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Desktop Search */}
          <div className="hidden md:block relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-4 h-4" />
            <input
              type="text"
              placeholder="Search"
              className="bg-[#242424] border border-[#3d3c3c] rounded-lg pl-10 pr-4 py-1.5 text-white placeholder-white focus:outline-none focus:border-[#5a5a5a] transition-colors w-32 lg:w-48 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="bg-black border-t border-[#3d3c3c] px-3 py-2 md:hidden sticky top-14 z-29">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-4 h-4" />
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-[#242424] border border-[#3d3c3c] rounded-lg pl-10 pr-4 py-2 text-white placeholder-white focus:outline-none focus:border-[#5a5a5a] transition-colors text-sm"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="bg-black border-t border-[#3d3c3c] md:hidden sticky top-14 z-29">
          <div className="px-3 py-2 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-3 text-sm transition-colors rounded-lg ${
                  activeTab === item.id
                    ? 'bg-[#363636] text-white border border-[#5a5a5a]'
                    : 'text-white hover:text-white hover:bg-[#363636]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Overlay */}
      {(isMobileMenuOpen || isSearchOpen) && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => {
            setIsMobileMenuOpen(false);
            setIsSearchOpen(false);
          }}
        />
      )}
    </>
  );
};

export default Navbar;