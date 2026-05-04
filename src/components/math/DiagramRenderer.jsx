'use client';

import React from 'react';
import BarModelRenderer from './BarModelRenderer';
import PlaceValueChart from './PlaceValueChart';
import CountingObjects from './CountingObjects';
import EqualGroups from './EqualGroups';
import BaseTenBlocks from './BaseTenBlocks';
import NumberPattern from './NumberPattern';
import OrdinalLine from './OrdinalLine';
import NumberCards from './NumberCards';
import NumberBond from './NumberBond';
import CompareObjects from './CompareObjects';
import GroupingWorkspace from '@/components/tools/GroupingWorkspace';

export default function DiagramRenderer({ modelData: inputModelData, isQuestion, questionId, difficulty }) {
  const [isOpen, setIsOpen] = React.useState(false);

  if (!inputModelData) return null;

  // Safety parse if the field comes in as a string
  const modelData = typeof inputModelData === 'string' ? JSON.parse(inputModelData) : inputModelData;

  // Respect blueprint/AI decision to hide visuals for abstract logic questions
  if (modelData?.hideVisual) return null;

  const type = modelData?.type;

  if (type === 'PART_WHOLE' || type === 'COMPARISON') {
    return <BarModelRenderer data={modelData} />;
  }

  if (type === 'PLACE_VALUE_CHART') {
    return <PlaceValueChart data={modelData} />;
  }

  if (type === 'COUNTING_OBJECTS') {
    const countingData = { ...modelData, items: modelData.items || [] };
    return <CountingObjects data={countingData} isQuestion={isQuestion} questionId={questionId} difficulty={difficulty} />;
  }

  if (type === 'EQUAL_GROUPS') {
    const groupsData = { ...modelData, items: modelData.items || modelData.elements || [] };
    return <EqualGroups data={groupsData} isQuestion={isQuestion} />;
  }

  if (type === 'BASE_TEN_BLOCKS') {
    return <BaseTenBlocks data={modelData} />;
  }

  if (type === 'NUMBER_PATTERN') {
    // Safely map 'items' to 'sequence' for pedagogically correct component rendering
    const patternData = { ...modelData, sequence: modelData.sequence || modelData.items || [] };
    return <NumberPattern data={patternData} isQuestion={isQuestion} />;
  }

  if (type === 'GROUPING_WORKSPACE') {
    return (
      <div className="mt-4 space-y-4">
        {/* PICTORIAL PREVIEW: Shows the items in a diagram box before launching the tool */}
        <div className="bg-slate-50/50 rounded-3xl p-6 border-2 border-dashed border-slate-200">
          <CountingObjects 
            data={{ ...modelData, items: modelData.items || [] }} 
            isQuestion={isQuestion} 
            questionId={questionId} 
            difficulty={difficulty} 
          />
        </div>

        <div className="flex justify-center">
          <button 
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all active:scale-95 shadow-lg"
          >
            <span>🖱️ Launch Interactive Tool</span>
          </button>
        </div>

        {isOpen && (
          <GroupingWorkspace 
            modelData={modelData} 
            onClose={() => setIsOpen(false)}
            questionId={questionId} 
            difficulty={difficulty}
            mode={modelData.mode}
            targetGroupSize={modelData.targetGroupSize}
            expectedGroups={modelData.expectedGroups}
          />
        )}
      </div>
    );
  }

  if (type === 'NUMBER_CARDS') {
    // Safely map 'items' to 'numbers' so the component renders correctly
    const cardData = { ...modelData, numbers: modelData.numbers || modelData.items || [] };
    return <NumberCards data={cardData} />;
  }

  if (type === 'COMPARE_OBJECTS') {
    const compareData = { ...modelData, sets: modelData.sets || modelData.items || [] };
    return <CompareObjects data={compareData} />;
  }

  if (type === 'ORDINAL_LINE') {
    const ordinalData = { ...modelData, items: modelData.items || modelData.sequence || [] };
    return <OrdinalLine data={ordinalData} isQuestion={isQuestion} difficulty={difficulty} />;
  }

  if (type === 'NUMBER_BOND') {
    // Map 'items' from the universal fix to 'numbers'
    const cardData = { ...modelData, numbers: modelData.numbers || modelData.items || [] };
    return <NumberCards data={cardData} />;
  }

  return null;
}