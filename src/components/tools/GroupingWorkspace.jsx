'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generatePositions } from '@/lib/utils/layout';

export default function GroupingWorkspace({ modelData, onClose, questionId, difficulty, targetGroupSize = 10, mode = 'GROUPING', expectedGroups, showTargetSize = true }) {
  const containerRef = useRef(null);
  const [items, setItems] = useState([]);
  const [groups, setGroups] = useState([]); // { id, x, y, itemIds }
  const [dragStart, setDragStart] = useState(null);
  const [currentDrag, setCurrentDrag] = useState(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [isShaking, setIsShaking] = useState(false);
  const [lockedGroupSize, setLockedGroupSize] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Resize handler to ensure coordinate translations stay accurate
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setDims({ w: entry.contentRect.width, h: entry.contentRect.height });
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Handle both array-based (Counting) and scalar-based (Mult/Div) group structures
    let groupsData = [];
    if (modelData.type === 'EQUAL_GROUPS' || modelData.type === 'MULTIPLICATION_PICTORIAL') {
      // Convert "4 groups of 3" into [3, 3, 3, 3] for the position generator
      groupsData = Array(modelData.groups).fill(modelData.itemsPerGroup);
    } else {
      groupsData = Array.isArray(modelData.groups) ? modelData.groups : [];
    }
    
    const iconPool = modelData.icons || [modelData.icon || '🍎'];
    
    // Use shared deterministic utility
    const positions = generatePositions(groupsData, questionId || JSON.stringify(groupsData), difficulty);

    const scattered = positions.map((pos, idx) => {
      const groupIdx = parseInt(pos.id.split('-')[1]);
      return {
        ...pos,
        icon: iconPool[groupIdx] || iconPool[0],
        isGrouped: false
      };
    });
    setItems(scattered);
  }, [modelData, questionId, difficulty]);

  const handlePointerDown = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setDragStart({ x, y });
    setCurrentDrag({ x, y });
  };

  const handlePointerMove = (e) => {
    if (!dragStart) return;
    const rect = containerRef.current.getBoundingClientRect();
    setCurrentDrag({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handlePointerUp = () => {
    if (!dragStart || !currentDrag) {
      setDragStart(null);
      setCurrentDrag(null);
      return;
    }

    const left = Math.min(dragStart.x, currentDrag.x);
    const top = Math.min(dragStart.y, currentDrag.y);
    const right = Math.max(dragStart.x, currentDrag.x);
    const bottom = Math.max(dragStart.y, currentDrag.y);

    // Safety check for dimensions to avoid division by zero
    const width = dims.w || 1;
    const height = dims.h || 1;

    const selectedItems = items.filter(item => 
      !item.isGrouped &&
      item.x >= (left / width) * 100 && item.x <= (right / width) * 100 &&
      item.y >= (top / height) * 100 && item.y <= (bottom / height) * 100
    );

    const selectedCount = selectedItems.length;

    if (selectedCount === 0) {
      setDragStart(null);
      setCurrentDrag(null);
      return;
    }

    let isValidSelection = false;
    if (mode === 'SHARING') {
      if (!lockedGroupSize) {
        setLockedGroupSize(selectedCount);
        isValidSelection = true;
      } else if (selectedCount === lockedGroupSize) {
        isValidSelection = true;
      } else {
        setErrorMessage("All groups must be the same size!");
      }
    } else {
      isValidSelection = selectedCount === targetGroupSize;
    }

    if (isValidSelection) {
      setErrorMessage(null);
      const groupId = `group-${groups.length}`;

      // Calculate "Parking Spot" at the top corner
      const groupsPerRow = 4;
      const gIdx = groups.length;
      const col = gIdx % groupsPerRow;
      const row = Math.floor(gIdx / groupsPerRow);
      
      const storageX = 110 + (col * 210); // Spaced horizontally
      const storageY = 80 + (row * 120);  // Spaced vertically if many groups

      setGroups(prev => [...prev, { id: groupId, x: storageX, y: storageY, itemIds: selectedItems.map(i => i.id) }]);
      setItems(prev => prev.map(item => 
        selectedItems.find(si => si.id === item.id) 
          ? { ...item, isGrouped: true, groupId } 
          : item
      ));
    } else {
      // Provide visual feedback for incorrect counts
      if (mode === 'GROUPING' && selectedCount !== targetGroupSize) {
        setErrorMessage(`Try to group exactly ${targetGroupSize} items!`);
      }
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
        setErrorMessage(null);
      }, 1000);
    }

    setDragStart(null);
    setCurrentDrag(null);
  };

  const getGroupedPos = (itemId, groupId) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return { x: 0, y: 0 };
    const index = group.itemIds.indexOf(itemId);
    const col = index % 5;
    const row = Math.floor(index / 5);
    return {
      x: group.x + (col - 2) * 35,
      y: group.y + (row - 0.5) * 40
    };
  };

  // Track items that haven't been assigned to a group (remainders)
  const remainingCount = items.filter(i => !i.isGrouped).length;

  const isSharingError = mode === 'SHARING' && lockedGroupSize && remainingCount > 0 && remainingCount < lockedGroupSize;
  const isSharingComplete = mode === 'SHARING' && lockedGroupSize && remainingCount === 0;
  const isSharingSuccess = isSharingComplete && groups.length === expectedGroups;

  const handleReset = () => {
    setGroups([]);
    setItems(items.map(i => ({ ...i, isGrouped: false })));
    setLockedGroupSize(null);
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-4xl h-[80vh] rounded-[3rem] shadow-2xl border-4 border-white flex flex-col overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center min-h-[100px]">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Grouping Workspace</h2>
            <p className="text-xs font-bold text-slate-400 min-h-[1rem]">
              {mode === 'SHARING' 
                ? `Drag a box to form ${expectedGroups} equal groups!` 
                : showTargetSize ? <span>Drag a box around <span className="text-blue-500">{targetGroupSize} items</span> to group them!</span> : null}
            </p>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-black hover:bg-red-50 hover:text-red-500 transition-colors">✕</button>
        </div>
        <div ref={containerRef} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} className="flex-1 relative bg-slate-50 overflow-hidden cursor-crosshair touch-none">
          {dragStart && currentDrag && (
            <div className="absolute border-2 border-blue-400 bg-blue-400/10 rounded-lg pointer-events-none z-50" style={{ left: Math.min(dragStart.x, currentDrag.x), top: Math.min(dragStart.y, currentDrag.y), width: Math.abs(currentDrag.x - dragStart.x), height: Math.abs(currentDrag.y - dragStart.y) }} />
          )}
          {groups.map((g, idx) => (
            <motion.div key={g.id} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="absolute border-4 border-blue-500/20 bg-blue-500/5 rounded-2xl flex items-center justify-center pointer-events-none" style={{ left: g.x - 90, top: g.y - 50, width: 180, height: 100 }}>
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md">
                {mode === 'SHARING' ? `Group ${idx + 1}` : targetGroupSize}
              </span>
            </motion.div>
          ))}
          {items.map(item => {
            const isRemainder = !item.isGrouped && isSharingError;
            const pos = item.isGrouped ? getGroupedPos(item.id, item.groupId) : { x: (item.x / 100) * dims.w, y: (item.y / 100) * dims.h };
            return (
              <motion.div key={item.id} layoutId={item.id} className="absolute text-4xl select-none" initial={false} animate={{ 
                  x: pos.x - 20, 
                  y: pos.y - 20,
                  rotate: isShaking && !item.isGrouped ? [0, -10, 10, -10, 10, 0] : 0,
                  scale: isRemainder ? 1.15 : 1,
                  filter: isRemainder ? 'drop-shadow(0 0 12px rgba(239,68,68,0.9))' : 'drop-shadow(0 0 0px rgba(0,0,0,0))'
                }} transition={{ 
                  type: 'spring', 
                  stiffness: 300, 
                  damping: 30,
                  rotate: { type: 'tween', duration: 0.5 },
                  scale: { type: 'spring', stiffness: 400, damping: 25 }
                }}>
                {item.icon}
              </motion.div>
            );
          })}
        </div>
        <div className="bg-slate-900 p-6 flex justify-between items-center min-h-[120px]">
          <div className="flex gap-8">
            <div className="flex flex-col max-w-xl">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live Helper</span>
              <span className="text-sm font-bold text-white leading-relaxed">
                {errorMessage || (
                  mode === 'SHARING' 
                    ? (!lockedGroupSize 
                        ? "Drag a box to start. How many will be in each group?" 
                        : isSharingError 
                          ? `Oh no! You have ${remainingCount} items left over. ${items.length} cannot be shared equally into groups of ${lockedGroupSize}. Click Reset to try a different size.`
                          : isSharingComplete
                            ? (isSharingSuccess ? `Success! You shared ${items.length} into ${expectedGroups} groups of ${lockedGroupSize}.` : `You made ${groups.length} equal groups, but we need ${expectedGroups}. Click Reset to try a different size!`)
                            : `You are making groups of ${lockedGroupSize}. Try to share all items equally.`)
                    : `${groups.length} groups of ${targetGroupSize} formed`
                )}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Left Over</span>
              <span className="text-2xl font-black text-white">{remainingCount} left over</span>
            </div>
          </div>
          <div className="flex gap-4">
            {lockedGroupSize && (
              <button onClick={handleReset} className="px-8 py-3 bg-slate-700 text-white font-black rounded-2xl hover:bg-slate-600 transition-all active:scale-95">
                Reset
              </button>
            )}
            <button onClick={onClose} className="px-8 py-3 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-500 shadow-xl transition-all active:scale-95">I'm Ready!</button>
          </div>
        </div>
      </div>
    </div>
  );
}