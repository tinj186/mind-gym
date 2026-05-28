"use client";

import React, { lazy, Suspense } from 'react';

// Core context blocks
export const ESSENTIAL_VISUALS = [
  "ORDINAL_LINE", "GROUPING_WORKSPACE", "NUMBER_CARDS", 
  "NUMBER_BOND", "NUMBER_PATTERN", "BASE_TEN_BLOCKS", 
  "SINGAPORE_MONEY", "MEASUREMENT_UNIT", "CLOCK_DISPLAY"
];

// 🚀 Lazy-loaded modules (Only downloaded by the browser if the question requires it)
const MeasurementUnit = lazy(() => import('./modules/MeasurementUnit'));
const SingaporeMoney = lazy(() => import('./modules/SingaporeMoney'));
const CountingObjects = lazy(() => import('./modules/CountingObjects'));
const NumberCards = lazy(() => import('./modules/NumberCards'));
const NumberPattern = lazy(() => import('./modules/NumberPattern'));
const EqualGroups = lazy(() => import('./modules/EqualGroups'));
const GroupingWorkspaceModule = lazy(() => import('./modules/GroupingWorkspace'));
const OrdinalLine = lazy(() => import('./modules/OrdinalLine'));
const BaseTenBlocks = lazy(() => import('./modules/BaseTenBlocks'));
const NumberBond = lazy(() => import('./modules/NumberBond'));
const Shape = lazy(() => import('./modules/Shape'));
const ClockDisplay = lazy(() => import('./modules/ClockDisplay'));

export default function VisualRenderer({ type, ...props }) {
  if (!type || type === "NONE" || type === "") return null;

  return (
    <Suspense fallback={
      <div className="text-center text-[10px] font-black uppercase text-slate-300 tracking-widest animate-pulse py-6">
        Loading Layout Engine Component...
      </div>
    }>
      {(() => {
        switch (type) {
          case 'MEASUREMENT_UNIT': return <MeasurementUnit {...props} />;
          case 'CLOCK_DISPLAY': return <ClockDisplay {...props} />;
          case 'SINGAPORE_MONEY': return <SingaporeMoney {...props} />;
          case 'COUNTING_OBJECTS': return <CountingObjects {...props} />;
          case 'NUMBER_CARDS': return <NumberCards {...props} />;
          case 'NUMBER_PATTERN': return <NumberPattern {...props} />;
          case 'EQUAL_GROUPS': return <EqualGroups {...props} />;
          case 'GROUPING_WORKSPACE': return <GroupingWorkspaceModule {...props} />;
          case 'ORDINAL_LINE': return <OrdinalLine {...props} />;
          case 'BASE_TEN_BLOCKS': return <BaseTenBlocks {...props} />;
          case 'NUMBER_BOND': return <NumberBond {...props} />;
          case 'SHAPE': return <Shape {...props} />;
          
          default:
            return (
              <div className="text-center space-y-2 py-4">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Unknown Visual Signature</p>
                <code className="text-[10px] bg-white p-2 rounded-lg text-slate-400 block max-w-xs mx-auto overflow-x-auto">
                  {JSON.stringify(props.data)}
                </code>
              </div>
            );
        }
      })()}
    </Suspense>
  );
}