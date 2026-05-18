'use client';

import React from 'react';
import VisualRenderer from '@/components/gym/VisualRenderer';
import { normalizeQuestionData } from '@/lib/intelligence/workout-utils';

export default function DiagramRenderer({ modelData: inputModelData, isQuestion, questionId, difficulty }) {
  if (!inputModelData) return null;

  // 1. Safe Parse check if the incoming property payload arrives as a string container
  let parsedModelData = inputModelData;
  if (typeof inputModelData === 'string') {
    try {
      parsedModelData = JSON.parse(inputModelData);
    } catch (e) {
      console.error("DiagramRenderer Adapter: Failed to parse raw modelData text string:", e);
      return null;
    }
  }

  // 2. Respect blueprint directives to hide visual elements for abstract numeric channels
  if (parsedModelData?.hideVisual) return null;

  // 3. Leverage the central universal normalizer to handle legacy schemas and modern visual mappings cleanly
  const normalized = normalizeQuestionData({ modelData: parsedModelData });
  if (!normalized || !normalized.visualEngine) return null;

  const type = normalized.visualEngine.componentToRender;
  const data = normalized.visualEngine.componentData;

  // 4. Route directly into the master renderer using standard environment fallbacks
  return (
    <div className="w-full unified-diagram-wrapper">
      <VisualRenderer
        type={type}
        data={data}
        visualProps={null}
        setIsToolOpen={() => {}} // No-op fallback for admin preview layout frames
        questionId={questionId}
        difficulty={difficulty}
        topic={parsedModelData?.meta?.topic || "Math"}
        attempts={0} // Force full rendering on admin view frames
        isExam={false}
      />
    </div>
  );
}