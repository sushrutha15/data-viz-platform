import React, { useEffect, useState, useRef, useMemo } from 'react';
import type { ChartDataPoint } from '../Store/DashboardSlice';

interface DataPointDetailsProps {
  dataPoint: ChartDataPoint | null;
  position: { x: number; y: number };
  isVisible: boolean;
}

const DataPointDetails: React.FC<DataPointDetailsProps> = ({ dataPoint, position, isVisible }) => {
  const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);
//   const velocityRef = useRef({ x: 0, y: 0 });
  const targetPositionRef = useRef({ x: 0, y: 0 });

  // Memoize tooltip dimensions with responsive sizing
  const tooltipConfig = useMemo(() => {
    const isMobile = window.innerWidth < 640;
    const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
    
    return {
      width: isMobile ? 160 : isTablet ? 180 : 200,
      height: isMobile ? 70 : isTablet ? 75 : 80,
      offset: isMobile ? 10 : 15,
      screenPadding: isMobile ? 10 : 20
    };
  }, []);

  // Calculate optimal position with viewport constraints
  const calculatePosition = useMemo(() => {
    return (mousePos: { x: number; y: number }) => {
      const { width, height, offset, screenPadding } = tooltipConfig;
      
      let x = mousePos.x + offset;
      let y = mousePos.y - height - offset;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Horizontal positioning
      if (x + width > viewportWidth - screenPadding) {
        x = mousePos.x - width - offset;
      }
      if (x < screenPadding) {
        x = Math.max(screenPadding, (viewportWidth - width) / 2);
      }

      // Vertical positioning
      if (y < screenPadding) {
        y = mousePos.y + offset;
      }
      if (y + height > viewportHeight - screenPadding) {
        y = mousePos.y - height - offset;
      }

      return { x, y };
    };
  }, [tooltipConfig]);

  // Smooth animation using lerp (linear interpolation)
  const animateToPosition = (targetX: number, targetY: number) => {
    const animate = (currentTime: number) => {
      // Throttle to 60fps max
      if (currentTime - lastUpdateRef.current < 16) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastUpdateRef.current = currentTime;

      setSmoothPosition(current => {
        const deltaX = targetX - current.x;
        const deltaY = targetY - current.y;
        
        // Use exponential smoothing for natural movement
        const smoothingFactor = 0.15; // Adjust for more/less smoothing (0.1-0.3)
        const newX = current.x + deltaX * smoothingFactor;
        const newY = current.y + deltaY * smoothingFactor;
        
        // Stop animation when close enough
        if (Math.abs(deltaX) < 0.5 && Math.abs(deltaY) < 0.5) {
          return { x: targetX, y: targetY };
        }
        
        // Continue animation
        animationRef.current = requestAnimationFrame(animate);
        return { x: newX, y: newY };
      });
    };
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (!isVisible || !dataPoint) {
      // Cancel any ongoing animation and hide immediately
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const targetPosition = calculatePosition(position);
    targetPositionRef.current = targetPosition;
    
    // Start smooth animation to target position
    animateToPosition(targetPosition.x, targetPosition.y);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [position, isVisible, dataPoint, calculatePosition]);

  // Get responsive classes
  const getResponsiveClasses = () => {
    const isMobile = window.innerWidth < 640;
    const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
    
    return {
      container: `bg-[#1a1a1a] rounded-lg shadow-xl relative focus:outline-none border-0 outline-none ${
        isMobile ? 'p-3 w-40' : isTablet ? 'p-3.5 w-44' : 'p-4 w-48'
      }`,
      mainValue: `font-bold mb-1 ${
        isMobile ? 'text-base' : isTablet ? 'text-lg' : 'text-lg'
      }`,
      details: `flex items-center text-gray-400 ${
        isMobile ? 'text-xs' : isTablet ? 'text-sm' : 'text-sm'
      }`,
      arrow: `absolute ${
        isMobile ? 'bottom-[-5px] left-4 w-2.5 h-2.5' : isTablet ? 'bottom-[-5px] left-5 w-2.5 h-2.5' : 'bottom-[-6px] left-6 w-3 h-3'
      } bg-[#1a1a1a] rotate-45`,
      text: isMobile ? 'text-xs' : 'text-xs'
    };
  };

  if (!isVisible || !dataPoint) return null;

  const classes = getResponsiveClasses();

  return (
    <div
      className="fixed z-50 pointer-events-none focus:outline-none"
      style={{
        left: `${smoothPosition.x}px`,
        top: `${smoothPosition.y}px`,
        // Use transform instead of changing left/top for better performance
        transform: 'translate3d(0, 0, 0)',
        backfaceVisibility: 'hidden',
        perspective: '1000px',
        willChange: 'transform',
        display: isVisible ? 'block' : 'none', // Force hide when not visible
      }}
    >
      <div className={`${classes.container} text-gray-200`} style={{ border: 'none', outline: 'none' }}>
        <div className={classes.mainValue}>
          ${Number(dataPoint.value).toLocaleString(undefined, {
            minimumFractionDigits: window.innerWidth < 640 ? 0 : 2,
            maximumFractionDigits: 2,
          })}
        </div>
        <div className={classes.details}>
          <span className="mr-1 text-[#9acd32] pr-1 sm:pr-2">↑</span>
          <span className={`${classes.text} truncate flex-1`}>
            {dataPoint.displayValue}
          </span>
          <span className="ml-auto text-gray-500 text-xs">?</span>
        </div>
        <div className={classes.arrow}></div>
      </div>
    </div>
  );
};

export default DataPointDetails;