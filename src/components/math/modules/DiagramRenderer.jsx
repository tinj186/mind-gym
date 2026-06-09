'use client';

import React from 'react';
import VisualRenderer from '../VisualRenderer';
import { normalizeQuestionData } from '@/lib/intelligence/workout-utils';

/**
 * DiagramRenderer: A structural bridge component.
 * It normalizes incoming raw modelData and handles directive-based visibility
 * before dispatching to the central VisualRenderer.
 */
export default function DiagramRenderer({ modelData: inputModelData, isQuestion, questionId, difficulty }) {
  if (!inputModelData) return null;

  // 1. Serialization Safety: Handle stringified payloads from AI or legacy DB rows
  let parsedModelData = inputModelData;
  if (typeof inputModelData === 'string') {
    try {
      parsedModelData = JSON.parse(inputModelData);
    } catch (e) {
      console.error("DiagramRenderer Adapter: Failed to parse raw modelData text string:", e);
      return null;
    }
  }

  // 2. Directive Check: Respect blueprint flags to collapse the visual container
  if (parsedModelData?.hideVisual) return null;

  // 3. Heuristic Mapping: Convert legacy schemas to modern visualEngine objects
  const normalized = normalizeQuestionData({ modelData: parsedModelData });
  if (!normalized || !normalized.visualEngine) return null;

  const type = normalized.visualEngine.componentToRender;
  const data = normalized.visualEngine.componentData;

  return (
    <div className="w-full diagram-bridge-wrapper">
      <VisualRenderer
        type={type}
        data={data}
        setIsToolOpen={() => {}} // No-op fallback for static diagram frames
        questionId={questionId}
        difficulty={difficulty}
        topic={parsedModelData?.meta?.topic || "Math"}
        attempts={0} // Force full-fidelity rendering for diagram previews
      />
    </div>
  );
}