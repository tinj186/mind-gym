"use client";

import React, { lazy, Suspense } from 'react';
import IconGrid from '@/components/math/modules/IconGrid';

// Core context blocks
export const ESSENTIAL_VISUALS = [
  "ORDINAL_LINE", "GROUPING_WORKSPACE", "NUMBER_CARDS", 
  "NUMBER_BOND", "NUMBER_PATTERN", "BASE_TEN_BLOCKS", 
  "SINGAPORE_MONEY", "MEASUREMENT_UNIT", "CLOCK_DISPLAY",
  "SHAPE_DISPLAY", "PLACE_VALUE_CHART", "VERTICAL_ALGORITHM"
  // "PICTURE_GRAPH_DISPLAY" // Not essential, lazy-loaded
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
const PlaceValueChart = lazy(() => import('./modules/PlaceValueChart'));
const ClockDisplay = lazy(() => import('./modules/ClockDisplay'));
const ShapeDisplay = lazy(() => import('./modules/ShapeDisplay'));
const PictureGraphDisplay = lazy(() => import('./modules/PictureGraphDisplay'));
const CrossOutGroup = lazy(() => import('./modules/CrossOutGroup'));
const TwoSetComparison = lazy(() => import('./modules/TwoSetComparison'));
const TFMatrixTable = lazy(() => import('./modules/TFMatrixTable'));
const VerticalAlgorithm = lazy(() => import('./modules/VerticalAlgorithm'));

export default function VisualRenderer({ type, ...props }) {
  const activeType = (
    type || 
    props.visualEngine?.componentToRender || 
    props.data?.type || 
    "").toString().toUpperCase().trim().replace(/[\s-]/g, '_');

  if (!activeType || activeType === "NONE" || activeType === "") return null;

  return (
    <Suspense fallback={
      <div className="text-center text-[10px] font-black uppercase text-slate-300 tracking-widest animate-pulse py-6">
        Loading Layout Engine Component...
      </div>
    }>
      {(() => {
        switch (activeType) {
          case 'MEASUREMENT_UNIT': return <MeasurementUnit {...props} />;
          case 'CLOCK_DISPLAY': return <ClockDisplay {...props} />;
          case 'SINGAPORE_MONEY': return <SingaporeMoney {...props} />;
          case 'COUNTING_OBJECTS': 
            return <CountingObjects {...props} isQuestion={props.attempts === 0} />;
          case 'RENDER_ICON_GRID':
          case 'ICON_GRID':
            return <IconGrid data={props.data} modelData={props.modelData} visualProps={props.visualProps} />;
          case 'MULTI_COMPONENT': {
            const data = props.visualEngine?.componentData || props.data || {};
            return (
              <div className={`flex flex-col sm:flex-row gap-6 md:gap-12 justify-center items-center ${data.className || ''}`}>
                {data.components?.map((comp, idx) => (
                  <div key={idx}>
                    <VisualRenderer {...props} visualEngine={comp} data={comp.componentData} />
                  </div>
                ))}
              </div>
            );
          }
          case 'NUMBER_CARDS': return <NumberCards {...props} />;
          case 'NUMBER_PATTERN': return <NumberPattern {...props} />;
          case 'EQUAL_GROUPS': return <EqualGroups {...props} />;
          case 'GROUPING_WORKSPACE': return <GroupingWorkspaceModule {...props} />;
          case 'ORDINAL_LINE': return <OrdinalLine {...props} />;
          case 'BASE_TEN_BLOCKS': return <BaseTenBlocks {...props} />;
          case 'NUMBER_BOND': return <NumberBond {...props} />;
          case 'PLACE_VALUE_CHART': return <PlaceValueChart data={props.visualEngine?.componentData || props.data} />;
          case 'SHAPE': return <Shape {...props} />;
          case 'SHAPE_DISPLAY': return <ShapeDisplay data={props.visualEngine?.componentData || props.data} hideCardStyles={props.hideCardStyles} />;
          case 'PICTURE_GRAPH_DISPLAY': return <PictureGraphDisplay data={props.visualEngine?.componentData || props.data} hideCardStyles={props.hideCardStyles} />;
          case 'CROSS_OUT_GROUP': {
            const data = props.visualEngine?.componentData || props.data || {};
            return <CrossOutGroup totalItems={data.totalItems} crossedItems={data.crossedItems} selectedIcon={data.icon} />;
          }
          case 'TWO_SET_COMPARISON': {
            const data = props.visualEngine?.componentData || props.data || {};
            return <TwoSetComparison setA={data.setA} setB={data.setB} />;
          }
          case 'TF_MATRIX_TABLE': {
            const data = props.visualEngine?.componentData || props.data || {};
            return <TFMatrixTable statements={data.statements} entities={data.entities} />;
          }
          case 'VERTICAL_ALGORITHM': {
            const data = props.visualEngine?.componentData || props.data || {};
            return <VerticalAlgorithm data={data} />;
          }
          
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