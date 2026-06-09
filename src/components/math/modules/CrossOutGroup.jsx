import React from 'react';

const CrossOutGroup = ({ totalItems, crossedItems, selectedIcon }) => {
  // Safety fallback defaults
  const total = Number(totalItems) || 0;
  const crossed = Number(crossedItems) || 0;
  const icon = selectedIcon || '🍎';

  // Create an array of length totalItems
  const items = Array.from({ length: total });

  return (
    <div className="flex flex-wrap gap-3 sm:gap-4 justify-center items-center p-4 max-w-2xl mx-auto">
      {items.map((_, index) => {
        // Cross out items starting from the end (mimicking "taking away")
        const isCrossedOut = index >= total - crossed;

        return (
          <div 
            key={index} 
            className="relative flex justify-center items-center text-5xl sm:text-6xl select-none"
          >
            {/* The base icon */}
            <span 
              className={`transition-opacity duration-300 ${isCrossedOut ? 'opacity-30 grayscale' : 'opacity-100 drop-shadow-md'}`}
            >
              {icon}
            </span>
            
            {/* The cross-out overlay (Red X) */}
            {isCrossedOut && (
              <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                <div className="absolute w-full h-1.5 sm:h-2 bg-red-500 rounded-full rotate-45 scale-x-125 shadow-sm" />
                <div className="absolute w-full h-1.5 sm:h-2 bg-red-500 rounded-full -rotate-45 scale-x-125 shadow-sm" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CrossOutGroup;
