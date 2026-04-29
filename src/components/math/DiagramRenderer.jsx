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

export default function DiagramRenderer({ modelData: inputModelData, isQuestion, questionId, difficulty }) {
  if (!inputModelData) return null;

  // Safety parse if the field comes in as a string
  const modelData = typeof inputModelData === 'string' ? JSON.parse(inputModelData) : inputModelData;

  const type = modelData?.type;

  if (type === 'PART_WHOLE' || type === 'COMPARISON') {
    return <BarModelRenderer data={modelData} />;
  }

  if (type === 'PLACE_VALUE_CHART') {
    return <PlaceValueChart data={modelData} />;
  }

  if (type === 'COUNTING_OBJECTS') {
    return <CountingObjects data={modelData} isQuestion={isQuestion} questionId={questionId} difficulty={difficulty} />;
  }

  if (type === 'EQUAL_GROUPS') {
    return <EqualGroups data={modelData} isQuestion={isQuestion} />;
  }

  if (type === 'BASE_TEN_BLOCKS') {
    return <BaseTenBlocks data={modelData} />;
  }

  if (type === 'NUMBER_PATTERN') {
    return <NumberPattern data={modelData} isQuestion={isQuestion} />;
  }

  if (type === 'NUMBER_CARDS') {
    return <NumberCards data={modelData} />;
  }

  if (type === 'COMPARE_OBJECTS') {
    return <CompareObjects data={modelData} />;
  }

  if (type === 'ORDINAL_LINE') {
    // Ensure OrdinalLine receives the object containing the items array
    const ordinalData = { ...modelData, items: modelData.items || [] };
    return <OrdinalLine data={ordinalData} />;
  }

  if (type === 'NUMBER_BOND') {
    // Map 'items' from the universal fix to 'numbers' if cards component expects it
    const cardData = { ...modelData, numbers: modelData.numbers || modelData.items || [] };
    return <NumberCards data={cardData} />;
  }

  return null;
}