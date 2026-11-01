import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, ArrowRight, Layers, Scale, RefreshCw, HelpCircle, Sparkles, ChevronDown, ChevronUp, Eye, Plus, Trash2, Zap, RotateCcw, X, Lightbulb } from 'lucide-react';
import MultiStepInput from '@/components/math/MultiStepInput';

/**
 * Vertical Curly Bracket SVG for Comparative Bar Models
 */
const CurlyBracket = () => (
  <svg width="100%" height="100%" viewBox="0 0 30 100" preserveAspectRatio="none" className="text-slate-400">
    <path d="M 5 0 C 15 0, 15 5, 15 15 L 15 40 C 15 45, 20 50, 25 50 C 20 50, 15 55, 15 60 L 15 85 C 15 95, 15 100, 5 100" fill="none" stroke="currentColor" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round"/>
  </svg>
);

/**
 * Miniature Preview Diagrams for each Bar Model Archetype
 */
function ComparisonPreview() {
  return (
    <div className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between text-xs font-black text-slate-500 uppercase tracking-wider">
        <span>Parallel Comparison Bars</span>
        <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
          Aligned Baseline
        </span>
      </div>

      <div className="space-y-3 max-w-lg mx-auto py-2">
        {/* Entity A */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-bold text-slate-600">
            <span>Entity A</span>
            <span className="text-slate-400 font-mono">Base Value</span>
          </div>
          <div className="h-9 bg-indigo-500 rounded-xl w-3/5 flex items-center justify-center text-white text-xs font-black shadow-sm">
            Base Quantity
          </div>
        </div>

        {/* Entity B */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-bold text-slate-600">
            <span>Entity B</span>
            <span className="text-emerald-600 font-bold font-mono">+ Difference</span>
          </div>
          <div className="flex items-center h-9 gap-1.5">
            <div className="h-full bg-indigo-500 rounded-xl w-3/5 flex items-center justify-center text-white text-xs font-black shadow-sm">
              Same as A
            </div>
            <div className="h-full bg-emerald-500 rounded-xl flex-1 flex items-center justify-center text-white text-xs font-black shadow-sm border border-emerald-400 border-dashed">
              + More
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-200 text-center">
        <p className="text-xs font-bold text-slate-600">
          Compares distinct quantities side-by-side using parallel bars aligned to a common baseline, highlighting differences.
        </p>
      </div>
    </div>
  );
}

function PartWholePreview() {
  return (
    <div className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between text-xs font-black text-slate-500 uppercase tracking-wider">
        <span>Single Partitioned Bar</span>
        <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
          Parts of a Whole
        </span>
      </div>

      <div className="space-y-3 max-w-lg mx-auto py-2">
        {/* Whole Bracket */}
        <div className="text-center">
          <span className="text-xs font-black text-slate-700 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-xs">
            Total / Whole
          </span>
          <div className="w-full h-2.5 border-x-2 border-t-2 border-slate-400 rounded-t-lg mt-1" />
        </div>

        {/* Single bar divided into parts */}
        <div className="flex h-10 w-full rounded-xl overflow-hidden border-2 border-slate-300 shadow-sm">
          <div className="w-2/5 bg-blue-500 flex items-center justify-center text-white text-xs font-black border-r-2 border-white">
            Part 1
          </div>
          <div className="w-3/5 bg-amber-500 flex items-center justify-center text-white text-xs font-black">
            Part 2
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-200 text-center">
        <p className="text-xs font-bold text-slate-600">
          Divides a single whole amount into two or more parts to find unknown parts or the combined total.
        </p>
      </div>
    </div>
  );
}

function BeforeAfterPreview() {
  return (
    <div className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between text-xs font-black text-slate-500 uppercase tracking-wider">
        <span>Two Time States</span>
        <span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
          Transfer / Change
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto py-1">
        {/* BEFORE */}
        <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2 shadow-xs">
          <div className="text-[10px] font-black uppercase text-slate-400">1. Before State</div>
          <div className="space-y-1.5">
            <div className="h-6 bg-indigo-400 rounded-lg w-4/5 text-[10px] font-black text-white flex items-center px-2">A (Initial)</div>
            <div className="h-6 bg-slate-400 rounded-lg w-2/5 text-[10px] font-black text-white flex items-center px-2">B (Initial)</div>
          </div>
        </div>

        {/* AFTER */}
        <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2 shadow-xs">
          <div className="text-[10px] font-black uppercase text-emerald-600 flex items-center justify-between">
            <span>2. After Transfer</span>
            <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 rounded font-black">Change</span>
          </div>
          <div className="space-y-1.5">
            <div className="h-6 bg-indigo-500 rounded-lg w-3/5 text-[10px] font-black text-white flex items-center px-2">A (New)</div>
            <div className="h-6 bg-slate-500 rounded-lg w-3/5 text-[10px] font-black text-white flex items-center px-2">B (New)</div>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-200 text-center">
        <p className="text-xs font-bold text-slate-600">
          Tracks internal transfers, giving/receiving, or state changes between entities across time.
        </p>
      </div>
    </div>
  );
}

function EmptyPreview() {
  return (
    <div className="w-full bg-slate-50/70 border-2 border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-2">
      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
        <Eye className="w-5 h-5" />
      </div>
      <h5 className="text-sm font-black text-slate-700">Model Preview Window</h5>
      <p className="text-xs text-slate-400 max-w-xs font-medium">
        Select a bar model archetype from the dropdown above to preview how its structure works.
      </p>
    </div>
  );
}

/**
 * Normalization helper for entity names (lowercased, alphanumeric only)
 */
function normalizeName(str) {
  return (str || '').toString().toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Normalization helper for numbers (strips commas, currency symbols, signs, spaces)
 */
function normalizeNumber(val) {
  if (val === null || val === undefined) return '';
  return val.toString().replace(/[,+\-\s$]/g, '').trim();
}

/**
 * Parameter Check for Student Part-Whole Bar Model
 * Validates the student's partitioned parts and whole target against problem config.
 */
export function checkPartWholeParameters(userParts = [], userWhole = '', config = {}) {
  if (!userParts || userParts.length === 0) {
    return {
      isValid: false,
      defect: 'NO_PARTS_BUILT',
      errorMsg: "Click '+ Add Part to Bar' to add your first part of the whole!",
      details: null
    };
  }

  const expectedParts = config?.parts || [];
  const expectedWhole = config?.whole || { label: 'Target', value: '' };

  // 1. Check part count
  if (userParts.length < expectedParts.length) {
    const partNames = expectedParts.map(p => p.name).join(', ');
    return {
      isValid: false,
      defect: 'INSUFFICIENT_PARTS',
      errorMsg: `This problem requires ${expectedParts.length} parts in the whole bar (${partNames}). You currently have ${userParts.length} part(s).`,
      details: { expectedCount: expectedParts.length, actualCount: userParts.length }
    };
  }

  if (userParts.length > expectedParts.length) {
    return {
      isValid: false,
      defect: 'TOO_MANY_PARTS',
      errorMsg: `This problem only has ${expectedParts.length} parts. Please remove unnecessary extra parts.`,
      details: { expectedCount: expectedParts.length, actualCount: userParts.length }
    };
  }

  // 2. Check blank part names
  const blankPart = userParts.find(p => !p.name || !p.name.trim());
  if (blankPart) {
    return {
      isValid: false,
      defect: 'MISSING_PART_LABEL',
      errorMsg: "Please enter a name label for all parts in the bar.",
      details: null
    };
  }

  // 3. Check each expected part is represented
  for (const expPart of expectedParts) {
    const matched = userParts.find(p => normalizeName(p.name) === normalizeName(expPart.name));
    if (!matched) {
      return {
        isValid: false,
        defect: `MISSING_PART_${expPart.id || expPart.name}`,
        errorMsg: `Missing part for "${expPart.name}". Please ensure "${expPart.name}" is included in the partitioned bar.`,
        details: { missingPart: expPart.name }
      };
    }

    // Check shortfall flag
    if (expPart.isShortfall && !matched.isShortfall) {
      return {
        isValid: false,
        defect: 'MISSING_SHORTFALL_FLAG',
        errorMsg: `"${expPart.name}" is the shortfall/missing amount. Please click "Shortfall Segment" to mark it.`,
        details: { part: expPart.name }
      };
    }

    if (!expPart.isShortfall && matched.isShortfall) {
      return {
        isValid: false,
        defect: 'UNEXPECTED_SHORTFALL_FLAG',
        errorMsg: `"${expPart.name}" is a known collected quantity, not a shortfall segment.`,
        details: { part: expPart.name }
      };
    }

    // Check value if expected is not unknown '?'
    if (expPart.value !== undefined && expPart.value !== null && expPart.value !== '?') {
      const expVal = normalizeNumber(expPart.value);
      const actVal = normalizeNumber(matched.value);
      if (!actVal) {
        return {
          isValid: false,
          defect: 'MISSING_PART_VALUE',
          errorMsg: `Please enter the value (${expPart.displayValue || Number(expPart.value).toLocaleString()}) for "${expPart.name}".`,
          details: { part: expPart.name, expectedValue: expPart.displayValue || expPart.value }
        };
      }
      if (actVal !== expVal) {
        return {
          isValid: false,
          defect: 'INCORRECT_PART_VALUE',
          errorMsg: `The value for "${expPart.name}" should be ${expPart.displayValue || Number(expPart.value).toLocaleString()}, but got "${matched.value}".`,
          details: { part: expPart.name, expected: expVal, actual: actVal }
        };
      }
    }
  }

  // 4. Check whole / target value (if expected whole is not unknown '?')
  if (expectedWhole.value !== undefined && expectedWhole.value !== null && expectedWhole.value !== '?') {
    const expWhole = normalizeNumber(expectedWhole.value);
    const actWhole = normalizeNumber(userWhole);
    if (!actWhole) {
      return {
        isValid: false,
        defect: 'MISSING_TARGET_VALUE',
        errorMsg: `Please enter the target amount (${expectedWhole.displayValue || Number(expectedWhole.value).toLocaleString()}) for the Target Whole bracket.`,
        details: { expectedTarget: expectedWhole.displayValue || expectedWhole.value }
      };
    }
    if (actWhole !== expWhole) {
      return {
        isValid: false,
        defect: 'INCORRECT_TARGET_VALUE',
        errorMsg: `The target amount should be ${expectedWhole.displayValue || Number(expectedWhole.value).toLocaleString()}, but got "${userWhole}".`,
        details: { expected: expWhole, actual: actWhole }
      };
    }
  }

  return { isValid: true, defect: null, errorMsg: null, details: null };
}

/**
 * Parameter Check for Student Before-and-After Bar Model
 * Uses the comparison parameter check to validate Before State,
 * and validates the resulting After State entities and relations.
 */
export function checkBeforeAfterParameters(beforeBars = [], afterBars = [], transferOrConfig = {}, maybeConfig = {}) {
  const actualConfig = (maybeConfig && (maybeConfig.entities || maybeConfig.problemType || maybeConfig.target || maybeConfig.correctModelType))
    ? maybeConfig
    : (transferOrConfig && (transferOrConfig.entities || transferOrConfig.problemType || transferOrConfig.target || transferOrConfig.correctModelType))
      ? transferOrConfig
      : {};

  const rawBefore = Array.isArray(beforeBars) ? beforeBars : (beforeBars.beforeBars || []);
  const rawAfter = Array.isArray(afterBars) ? afterBars : (afterBars.afterBars || []);

  if (!rawBefore || rawBefore.length === 0) {
    return {
      isValid: false,
      defect: 'INSUFFICIENT_BEFORE_BARS',
      errorMsg: "Please configure the entity bars in the Before State (At First).",
      details: null
    };
  }

  // 1. Validate Before State using standard comparison parameter check!
  const beforeCheck = checkBarModelParameters(rawBefore, actualConfig, {});
  if (!beforeCheck.isValid) {
    return {
      isValid: false,
      defect: `BEFORE_${beforeCheck.defect}`,
      errorMsg: `Before State: ${beforeCheck.errorMsg}`,
      details: beforeCheck.details
    };
  }

  // 2. Validate After State presence
  if (!rawAfter || rawAfter.length === 0) {
    return {
      isValid: false,
      defect: 'INSUFFICIENT_AFTER_BARS',
      errorMsg: "Please configure the entity bars in the After State (In the End).",
      details: null
    };
  }

  // Check each entity represented in Before State exists in After State
  for (const bBar of rawBefore) {
    if (!bBar.name || !bBar.name.trim()) continue;
    const matched = rawAfter.find(a => normalizeName(a.name) === normalizeName(bBar.name));
    if (!matched) {
      return {
        isValid: false,
        defect: 'MISSING_AFTER_ENTITY',
        errorMsg: `Missing bar for "${bBar.name}" in the After State (In the End).`,
        details: { entity: bBar.name }
      };
    }
  }

  // 3. For Equalizing Problems: Validate that After State reflects equal quantities
  const isEqualizing = actualConfig?.problemType === 'EQUALIZING_TRANSFER' || 
    actualConfig?.equalizedValue || 
    actualConfig?.targetType === 'TRANSFER' ||
    (actualConfig?.target?.type === 'DIFFERENCE' && actualConfig?.transferAmount);

  if (isEqualizing && rawAfter.length >= 2) {
    // Check for conflicting non-zero difference segments in after state
    const conflictingDiff = rawAfter.find(a => a.hasDifference && a.diffValue && a.diffValue !== '?' && Number(normalizeNumber(a.diffValue)) > 0);
    if (conflictingDiff) {
      return {
        isValid: false,
        defect: 'AFTER_HAS_CONFLICTING_DIFF',
        errorMsg: `In the end, both entities have an equal number. Remove difference segments from "${conflictingDiff.name}" in the After State.`,
        details: { entity: conflictingDiff.name }
      };
    }

    const lengths = rawAfter.map(a => Number(a.length) || 50);
    const lengthSpread = Math.max(...lengths) - Math.min(...lengths);
    if (lengthSpread > 20) {
      return {
        isValid: false,
        defect: 'AFTER_STATE_NOT_EQUAL',
        errorMsg: "In the end, both entities have an equal number. Adjust the bars in the After State to show equal lengths (e.g. 50% each or 1 unit each).",
        details: { spread: lengthSpread }
      };
    }
  }

  return {
    isValid: true,
    defect: null,
    errorMsg: null,
    details: null
  };
}

/**
 * Comprehensive Parameter Check for Student Bar Model Drawing
 * Validates the student's structured bar state against problem config entities.
 * Returns defect classification for rich learning analytics and targeted feedback.
 */
export function checkBarModelParameters(userBars = [], config = {}, totalState = {}) {
  if (config?.correctModelType === 'PART_WHOLE') {
    const parts = Array.isArray(userBars) ? userBars : (userBars.parts || []);
    const whole = userBars.whole || '';
    return checkPartWholeParameters(parts, whole, config);
  }

  const isBAModel = Array.isArray(config?.correctModelType)
    ? config.correctModelType.includes('BEFORE_AFTER')
    : config?.correctModelType === 'BEFORE_AFTER';
  if (isBAModel && (userBars?.beforeBars || userBars?.afterBars)) {
    return checkBeforeAfterParameters(userBars.beforeBars, userBars.afterBars, userBars.transfer, config);
  }

  const rawBars = Array.isArray(userBars) ? userBars : (userBars.bars || []);
  const hasTotal = totalState.hasCombinedTotal ?? userBars.hasCombinedTotal ?? false;
  const totalVal = totalState.combinedTotalValue ?? userBars.combinedTotalValue ?? '';

  if (!rawBars || rawBars.length === 0) {
    return {
      isValid: false,
      defect: 'NO_BARS_BUILT',
      errorMsg: "Click '+ Build Bar' to add your first entity bar!",
      details: null
    };
  }

  const blankBar = rawBars.find(b => !b.name || !b.name.trim());
  if (blankBar) {
    return {
      isValid: false,
      defect: 'MISSING_ENTITY_LABEL',
      errorMsg: "Please enter a name label for all your bars.",
      details: null
    };
  }

  const expectedEntities = config?.entities || [];
  if (expectedEntities.length === 0) {
    return { isValid: true, defect: null, errorMsg: null, details: null };
  }

  // 1. Check bar count
  if (rawBars.length < expectedEntities.length) {
    const entityNames = expectedEntities.map(e => e.name).join(', ');
    return {
      isValid: false,
      defect: 'INSUFFICIENT_BARS',
      errorMsg: `This problem requires ${expectedEntities.length} bars (${entityNames}). You have only built ${rawBars.length} bar(s).`,
      details: { expectedCount: expectedEntities.length, actualCount: rawBars.length }
    };
  }

  if (rawBars.length > expectedEntities.length) {
    return {
      isValid: false,
      defect: 'TOO_MANY_BARS',
      errorMsg: `This problem only compares ${expectedEntities.length} entities. Please remove unnecessary extra bars.`,
      details: { expectedCount: expectedEntities.length, actualCount: rawBars.length }
    };
  }

  // 2. Check each expected entity is represented
  for (const expEntity of expectedEntities) {
    const matched = rawBars.find(b => normalizeName(b.name) === normalizeName(expEntity.name));
    if (!matched) {
      return {
        isValid: false,
        defect: `MISSING_ENTITY_${expEntity.id || expEntity.name}`,
        errorMsg: `Missing bar for "${expEntity.name}". Please ensure "${expEntity.name}" is represented in your model.`,
        details: { missingEntity: expEntity.name }
      };
    }
  }

  // 3. Validate Base Entity
  let expectedBase = expectedEntities.find(e => e.relation === 'BASE') || expectedEntities[0];
  let compEntities = expectedEntities.filter(e => e.relation === 'MORE' || e.relation === 'FEWER');

  // Flexible baseline for 2-entity difference/transfer: either entity can serve as base reference!
  if ((config?.target?.type === 'DIFFERENCE' || config?.target?.type === 'TRANSFER' || config?.problemType === 'EQUALIZING_TRANSFER' || config?.problemType === 'DIFFERENCE_DEDUCTION') && expectedEntities.length === 2 && !config?.total) {
    const barWithoutDiff = rawBars.find(b => !b.hasDifference);
    if (barWithoutDiff) {
      const matchedEntity = expectedEntities.find(e => normalizeName(e.name) === normalizeName(barWithoutDiff.name));
      if (matchedEntity && matchedEntity.id !== expectedBase.id) {
        const otherEntity = expectedEntities.find(e => e.id !== matchedEntity.id);
        const isOtherLarger = Number(otherEntity.value || 0) >= Number(matchedEntity.value || 0);
        expectedBase = { ...matchedEntity, relation: 'BASE' };
        compEntities = [{
          ...otherEntity,
          relation: isOtherLarger ? 'MORE' : 'FEWER',
          diffValue: otherEntity.diffValue !== undefined ? otherEntity.diffValue : (expectedBase.diffValue || '?'),
          displayDiff: otherEntity.displayDiff !== undefined ? otherEntity.displayDiff : (expectedBase.displayDiff || '?'),
          actualDiff: otherEntity.actualDiff || expectedBase.actualDiff
        }];
      }
    }
  }

  const baseBar = rawBars.find(b => normalizeName(b.name) === normalizeName(expectedBase.name));
  if (baseBar) {
    if (baseBar.hasDifference) {
      return {
        isValid: false,
        defect: 'BASE_ENTITY_HAS_DIFF',
        errorMsg: `"${expectedBase.name}" is the base reference quantity and should not have a difference segment attached.`,
        details: { entity: expectedBase.name }
      };
    }

    if (expectedBase.value !== undefined && expectedBase.value !== null && expectedBase.value !== '') {
      const expVal = normalizeNumber(expectedBase.value);
      const actVal = normalizeNumber(baseBar.value);
      const displayVal = expectedBase.displayValue || (expectedBase.value === '?' ? '?' : Number(expectedBase.value).toLocaleString());

      if (expVal === '?') {
        if (actVal && actVal !== '?') {
          return {
            isValid: false,
            defect: 'INCORRECT_BASE_VALUE',
            errorMsg: `"${expectedBase.name}" is an unknown quantity. Mark it with "?" or leave it as 1 unit.`,
            details: { entity: expectedBase.name, expected: '?', actual: actVal }
          };
        }
      } else {
        if (!actVal) {
          return {
            isValid: false,
            defect: 'MISSING_BASE_VALUE',
            errorMsg: `Please enter the base value (${displayVal}) inside "${expectedBase.name}"'s bar.`,
            details: { entity: expectedBase.name, expectedValue: displayVal }
          };
        }
        if (actVal !== expVal) {
          return {
            isValid: false,
            defect: 'INCORRECT_BASE_VALUE',
            errorMsg: `The value for "${expectedBase.name}" should be ${displayVal}, but got "${baseBar.value}".`,
            details: { entity: expectedBase.name, expected: expVal, actual: actVal }
          };
        }
      }
    }
  }

  // 4. Validate Comparative Entities (MORE / FEWER)
  for (const comp of compEntities) {
    const compBar = rawBars.find(b => normalizeName(b.name) === normalizeName(comp.name));
    if (!compBar) continue;

    if (!compBar.hasDifference) {
      return {
        isValid: false,
        defect: `MISSING_DIFFERENCE_${comp.relation}`,
        errorMsg: `"${comp.name}" differs from ${comp.relativeTo || 'the base'}. Click "+ Diff" on "${comp.name}"'s bar to add the comparison.`,
        details: { entity: comp.name, expectedRelation: comp.relation }
      };
    }

    if (comp.relation === 'MORE' && compBar.diffType !== 'MORE') {
      return {
        isValid: false,
        defect: 'INVERTED_RELATION_MORE',
        errorMsg: `"${comp.name}" should have MORE (+ difference), but is marked as fewer.`,
        details: { entity: comp.name, expectedDiffType: 'MORE', actualDiffType: compBar.diffType }
      };
    }

    if (comp.relation === 'FEWER' && compBar.diffType !== 'FEWER') {
      return {
        isValid: false,
        defect: 'INVERTED_RELATION_FEWER',
        errorMsg: `"${comp.name}" should have FEWER (- shortage bracket), but is marked as more.`,
        details: { entity: comp.name, expectedDiffType: 'FEWER', actualDiffType: compBar.diffType }
      };
    }

    if (comp.diffValue !== undefined && comp.diffValue !== null && comp.diffValue !== '') {
      const expDiff = normalizeNumber(comp.diffValue);
      const actDiff = normalizeNumber(compBar.diffValue);
      const displayDiff = comp.displayDiff || (comp.diffValue === '?' ? '?' : Number(comp.diffValue).toLocaleString());

      // Multi-segment difference support:
      const segments = (compBar.diffSegments && compBar.diffSegments.length > 0)
        ? compBar.diffSegments
        : [{ value: compBar.diffValue }];

      const segmentValues = segments.map(s => normalizeNumber(s.value));
      const numericSegments = segmentValues.map(v => Number(v)).filter(n => !isNaN(n) && n > 0);
      const sumOfSegments = numericSegments.reduce((acc, curr) => acc + curr, 0);

      if (expDiff === '?') {
        const isActualDiffMatch = comp.actualDiff && (
          normalizeNumber(actDiff) === normalizeNumber(comp.actualDiff) ||
          sumOfSegments === Number(comp.actualDiff)
        );
        if (segments.length > 1) {
          if (sumOfSegments > 0 && !isActualDiffMatch && actDiff && actDiff !== '?') {
            return {
              isValid: false,
              defect: 'INCORRECT_DIFF_VALUE',
              errorMsg: `The difference for "${comp.name}" is unknown or should total ${comp.actualDiff ? Number(comp.actualDiff).toLocaleString() : '?'}, but the sum of your segments is ${sumOfSegments.toLocaleString()}.`,
              details: { entity: comp.name, expected: comp.actualDiff || '?', actual: sumOfSegments }
            };
          }
        } else {
          if (actDiff && actDiff !== '?' && !isActualDiffMatch) {
            return {
              isValid: false,
              defect: 'INCORRECT_DIFF_VALUE',
              errorMsg: `The difference for "${comp.name}" is unknown. Mark it with "?" or leave it blank.`,
              details: { entity: comp.name, expected: '?', actual: actDiff }
            };
          }
        }
      } else {
        if (segments.length > 1) {
          const isSumMatch = sumOfSegments === Number(expDiff) || (comp.actualDiff && sumOfSegments === Number(comp.actualDiff));
          if (!isSumMatch) {
            return {
              isValid: false,
              defect: 'INCORRECT_DIFF_VALUE',
              errorMsg: `The total difference for "${comp.name}" should be ${displayDiff}, but the sum of your difference segments (${numericSegments.map(n => n.toLocaleString()).join(' + ')}) is ${sumOfSegments.toLocaleString()}.`,
              details: { entity: comp.name, expected: expDiff, actual: sumOfSegments }
            };
          }
        } else {
          if (!actDiff) {
            return {
              isValid: false,
              defect: 'MISSING_DIFF_VALUE',
              errorMsg: `Please enter the difference value for "${comp.name}" (${displayDiff}).`,
              details: { entity: comp.name, expectedDiff: displayDiff }
            };
          }
          if (actDiff !== expDiff) {
            return {
              isValid: false,
              defect: 'INCORRECT_DIFF_VALUE',
              errorMsg: `The difference amount for "${comp.name}" should be ${displayDiff}, but got "${compBar.diffValue}".`,
              details: { entity: comp.name, expected: expDiff, actual: actDiff }
            };
          }
        }
      }
    }
  }

  // 5. Validate Combined Total Bracket
  const expectsTotal = Boolean(config?.total || config?.target?.type === 'TOTAL');
  if (expectsTotal) {
    if (!hasTotal) {
      return {
        isValid: false,
        defect: 'MISSING_COMBINED_TOTAL',
        errorMsg: "This problem involves a combined total. Click '+ Combined Total' to add the total bracket to your model.",
        details: null
      };
    }

    const expTotalVal = config?.total?.value;
    const isTargetTotal = config?.total?.isTarget || config?.target?.type === 'TOTAL';

    if (!isTargetTotal && expTotalVal !== undefined && expTotalVal !== null && expTotalVal !== '') {
      const expNorm = normalizeNumber(expTotalVal);
      const actNorm = normalizeNumber(totalVal);
      const displayTotal = config?.total?.displayValue || Number(expTotalVal).toLocaleString();

      if (!actNorm) {
        return {
          isValid: false,
          defect: 'MISSING_TOTAL_VALUE',
          errorMsg: `Please enter the combined total (${displayTotal}) in the total bracket.`,
          details: { expected: displayTotal }
        };
      }
      if (actNorm !== expNorm) {
        return {
          isValid: false,
          defect: 'INCORRECT_TOTAL_VALUE',
          errorMsg: `The combined total should be ${displayTotal}, but got "${totalVal}".`,
          details: { expected: expNorm, actual: actNorm }
        };
      }
    } else if (isTargetTotal) {
      const actNorm = normalizeNumber(totalVal);
      if (actNorm && actNorm !== '?' && expTotalVal !== undefined && actNorm !== normalizeNumber(expTotalVal)) {
        return {
          isValid: false,
          defect: 'INCORRECT_TOTAL_VALUE',
          errorMsg: `The combined total is unknown. Mark it with "?" or leave it blank.`,
          details: { expected: '?', actual: actNorm }
        };
      }
    }
  } else {
    if (hasTotal) {
      return {
        isValid: false,
        defect: 'UNEXPECTED_COMBINED_TOTAL',
        errorMsg: "This problem compares entities directly and does not have a combined total. Please remove the total bracket.",
        details: null
      };
    }
  }

  return { isValid: true, defect: null, errorMsg: null, details: null };
}

/**
 * Model Solution Bar Model
 * Renders the reference pictorial blueprint for students to inspect
 * when an error occurs or when the solution is revealed.
 */
export function ModelSolutionBarModel({ config = {}, title = "Model Solution: Bar Model Blueprint" }) {
  if (config?.correctModelType === 'PART_WHOLE') {
    const parts = config?.parts || [];
    const whole = config?.whole || { label: 'Target', displayValue: '?' };
    if (!parts || parts.length === 0) return null;

    return (
      <div className="bg-emerald-50/70 border-2 border-emerald-300 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm animate-in fade-in duration-200">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-emerald-200">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-emerald-950">
                {title}
              </h4>
              <span className="text-[10px] text-emerald-700 font-bold">
                Part-Whole Model: Target Divided into Known Parts and Shortfall
              </span>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-300">
            Ideal Reference
          </span>
        </div>

        {/* Unified Part-Whole Diagram Canvas */}
        <div className="p-5 bg-white border-2 border-emerald-100 rounded-2xl space-y-4 shadow-xs">
          {/* Top Whole Bracket */}
          <div className="space-y-1">
            <div className="text-center">
              <span className="text-xs font-black text-slate-800 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full shadow-2xs">
                {whole.label || "Target"}: {whole.displayValue || (whole.value !== undefined ? (whole.value === '?' ? '?' : Number(whole.value).toLocaleString()) : "?")}
              </span>
            </div>
            <div className="w-full h-3 border-x-2 border-t-2 border-slate-700 rounded-t-md mx-auto" />
          </div>

          {/* Single Partitioned Bar */}
          <div className="flex h-12 w-full rounded-xl overflow-hidden border-2 border-slate-300 shadow-sm">
            {parts.map((p, idx) => {
              const isShortfall = p.isShortfall;
              const bgClass = isShortfall 
                ? "bg-slate-100 border-2 border-dashed border-slate-400 text-slate-700" 
                : idx === 0 
                  ? "bg-blue-500 text-white border-r-2 border-white" 
                  : "bg-amber-500 text-white border-r-2 border-white";
              const valText = p.displayValue || (p.value !== undefined ? (p.value === '?' ? '?' : Number(p.value).toLocaleString()) : '?');

              return (
                <div
                  key={p.id || idx}
                  style={{ flex: isShortfall ? 1.5 : 2 }}
                  className={`flex flex-col items-center justify-center px-2 py-1 text-center font-sans ${bgClass}`}
                >
                  <span className="text-[11px] font-black uppercase tracking-tight truncate w-full">
                    {p.name}
                  </span>
                  <span className="text-xs font-bold font-mono tracking-tight truncate w-full">
                    {valText}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const entities = config?.entities || [];
  const target = config?.target || { type: 'TOTAL', label: 'Total' };
  const itemName = config?.itemName || 'units';

  const isBeforeAfterModel = config?.correctModelType === 'BEFORE_AFTER' || 
    config?.problemType === 'EQUALIZING_TRANSFER' || 
    (Array.isArray(config?.correctModelType) && config?.correctModelType[0] === 'BEFORE_AFTER');

  if (isBeforeAfterModel) {
    const nameA = config.transferFrom || config.entities?.[0]?.name || 'Entity A';
    const nameB = config.transferTo || config.entities?.[1]?.name || 'Entity B';
    const largerVal = config.largerValue || config.entities?.find(e => normalizeName(e.name) === normalizeName(nameA))?.value;
    const smallerVal = config.smallerValue || config.entities?.find(e => normalizeName(e.name) === normalizeName(nameB))?.value;
    const diffVal = config.differenceValue || config.difference?.value;
    const transferVal = config.transferAmount || config.transfer?.value;
    const equalVal = config.equalizedValue;

    const diffDisplay = (diffVal && diffVal !== '?' && !isNaN(Number(diffVal))) 
      ? Number(diffVal).toLocaleString() 
      : (config.displayDifference || (transferVal ? (Number(transferVal) * 2).toLocaleString() : '?'));
    const transferDisplay = (transferVal && !isNaN(Number(transferVal))) 
      ? Number(transferVal).toLocaleString() 
      : (config.displayTransfer || '?');
    const equalDisplay = (equalVal && !isNaN(Number(equalVal))) 
      ? Number(equalVal).toLocaleString() 
      : (config.displayEqualized || '1 unit');
    const largerDisplay = (largerVal && largerVal !== '?' && !isNaN(Number(largerVal))) 
      ? Number(largerVal).toLocaleString() 
      : (config.entities?.[0]?.displayValue || '');
    const smallerDisplay = (smallerVal && smallerVal !== '?' && !isNaN(Number(smallerVal))) 
      ? Number(smallerVal).toLocaleString() 
      : (config.entities?.[1]?.displayValue || '');

    return (
      <div className="bg-emerald-50/70 border-2 border-emerald-300 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm animate-in fade-in duration-200">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-emerald-200">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-emerald-950">
                {title}
              </h4>
              <span className="text-[10px] text-emerald-700 font-bold">
                Before & After Model (Two Time States)
              </span>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-300">
            Ideal Reference
          </span>
        </div>

        {/* 1. Before State Box */}
        <div className="p-4 bg-white border border-emerald-200 rounded-2xl space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">
              1. Before State (At First)
            </span>
            <span className="text-[10px] font-bold text-slate-500">
              Difference = {diffDisplay}
            </span>
          </div>

          <div className="space-y-2 pt-1">
            {/* Entity A Bar (Has Difference) */}
            <div className="flex items-center gap-2">
              <span className="w-20 text-right text-xs font-black text-slate-800 truncate">{nameA}</span>
              <div className="flex-1 pl-2 border-l-4 border-indigo-500 border-dashed">
                <div className="flex items-center h-9 bg-slate-50 rounded-lg p-1 border border-slate-200">
                  <div style={{ width: '48%' }} className="h-full bg-indigo-600 rounded flex items-center justify-center text-xs font-bold text-white px-2 truncate">
                    {largerDisplay || "Base Unit"}
                  </div>
                  {transferVal ? (
                    <>
                      <div style={{ width: '18%' }} className="h-full ml-1 bg-emerald-500 rounded flex items-center justify-center text-xs font-black text-white px-1 truncate border border-emerald-400 border-dashed" title="Amount transferred">
                        +{transferDisplay}
                      </div>
                      <div style={{ width: '18%' }} className="h-full ml-1 bg-teal-500 rounded flex items-center justify-center text-xs font-black text-white px-1 truncate border border-teal-400 border-dashed" title="Amount to equalize">
                        +{transferDisplay}
                      </div>
                    </>
                  ) : (
                    <div style={{ width: '28%' }} className="h-full ml-1 bg-emerald-500 rounded flex items-center justify-center text-xs font-black text-white px-2 truncate border border-emerald-400 border-dashed">
                      +{diffDisplay}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Entity B Bar (Base) */}
            <div className="flex items-center gap-2">
              <span className="w-20 text-right text-xs font-black text-slate-800 truncate">{nameB}</span>
              <div className="flex-1 pl-2 border-l-4 border-indigo-500 border-dashed">
                <div className="flex items-center h-9 bg-slate-50 rounded-lg p-1 border border-slate-200">
                  <div style={{ width: '48%' }} className="h-full bg-indigo-500 rounded flex items-center justify-center text-xs font-bold text-white px-2 truncate">
                    {smallerDisplay || "Base Unit"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. After State Box */}
        <div className="p-4 bg-white border border-emerald-200 rounded-2xl space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">
              2. After State (In the End)
            </span>
            <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Resulting Quantities
            </span>
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-2">
              <span className="w-20 text-right text-xs font-black text-slate-800 truncate">{nameA}</span>
              <div className="flex-1 pl-2 border-l-4 border-emerald-500 border-dashed">
                <div className="flex items-center h-9 bg-slate-50 rounded-lg p-1 border border-slate-200">
                  <div style={{ width: '50%' }} className="h-full bg-emerald-600 rounded flex items-center justify-center text-xs font-bold text-white px-2 truncate">
                    {equalDisplay}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-20 text-right text-xs font-black text-slate-800 truncate">{nameB}</span>
              <div className="flex-1 pl-2 border-l-4 border-emerald-500 border-dashed">
                <div className="flex items-center h-9 bg-slate-50 rounded-lg p-1 border border-slate-200">
                  <div style={{ width: '50%' }} className="h-full bg-emerald-600 rounded flex items-center justify-center text-xs font-bold text-white px-2 truncate">
                    {equalDisplay}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Target Indicator */}
        <div className="flex items-center justify-between p-3 bg-white border border-emerald-200 rounded-xl">
          <span className="text-xs font-bold text-emerald-950">Target to Solve:</span>
          <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
            {target?.label || "Difference at First"}
          </span>
        </div>
      </div>
    );
  }

  if (!entities || entities.length === 0) return null;

  return (
    <div className="bg-emerald-50/70 border-2 border-emerald-300 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-emerald-200">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-emerald-950">
              {title}
            </h4>
            <span className="text-[10px] text-emerald-700 font-bold">
              Comparative Bar Model Aligned to Common Baseline
            </span>
          </div>
        </div>
        <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-300">
          Ideal Reference
        </span>
      </div>

      {/* Unified Comparative Bar Canvas */}
      <div className="p-4 sm:p-5 bg-white border-2 border-emerald-100 rounded-2xl shadow-xs overflow-x-auto">
        <div className="flex items-center gap-2 sm:gap-3 min-w-max">
          <div className="flex-1 space-y-3 min-w-[260px]">
            {entities.map((e, idx) => {
              const isBase = e.relation === 'BASE';
              const isMore = e.relation === 'MORE';
              const isFewer = e.relation === 'FEWER';
              const cleanDiffNum = (e.displayDiff && e.displayDiff !== '?') 
                ? e.displayDiff.replace(/[+\-]/g, '').trim()
                : (e.diffValue && e.diffValue !== '?' && !isNaN(Number(e.diffValue)))
                ? Number(e.diffValue).toLocaleString()
                : (e.actualDiff && !isNaN(Number(e.actualDiff)))
                ? Number(e.actualDiff).toLocaleString()
                : (e.displayDiff || e.diffValue || '?').replace(/[+\-]/g, '').trim() || '?';

              return (
                <div key={e.id || idx} className="flex items-center gap-2 sm:gap-3">
                  {/* Entity Name */}
                  <div className="w-20 sm:w-24 text-right shrink-0">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-800 truncate block">
                      {e.name}
                    </span>
                  </div>

                  {/* Vertical Starting Line & Bar Track */}
                  <div className="flex-1 pl-3 border-l-4 border-indigo-500 border-dashed py-0.5">
                    <div className="flex items-center h-11 bg-slate-50/80 rounded-xl border border-slate-200 p-1 shadow-xs relative overflow-visible">
                      {/* Solid Base Segment */}
                      <div
                        style={{ width: isFewer ? '38%' : '50%' }}
                        className={`h-full rounded-lg flex items-center justify-center text-xs font-black text-white shadow-xs px-2 truncate shrink-0 ${
                          idx === 0 ? 'bg-indigo-600' : idx === 1 ? 'bg-indigo-500' : 'bg-indigo-400'
                        }`}
                      >
                        {isBase ? (e.displayValue || (e.value ? Number(e.value).toLocaleString() : "")) : ""}
                      </div>

                      {/* MORE: Solid green segment protruding */}
                      {isMore && (
                        <div
                          style={{ width: '22%' }}
                          className="h-full rounded-lg ml-1 px-2 flex items-center justify-center text-xs font-black text-white shadow-xs border border-emerald-400 border-dashed bg-emerald-500 truncate shrink-0"
                        >
                          +{cleanDiffNum || "Diff"}
                        </div>
                      )}

                      {/* FEWER: Shortage gap with bottom bracket and unsigned diff */}
                      {isFewer && (
                        <div
                          style={{ width: '16%' }}
                          className="relative h-full ml-1 flex flex-col justify-between items-center py-1 px-1 overflow-visible select-none shrink-0"
                        >
                          {/* Vertical dotted reference line from bar above */}
                          <div className="absolute right-0 -top-6 bottom-0 w-0 border-r-2 border-dotted border-rose-400 pointer-events-none z-10">
                            <span className="absolute -top-1 -right-[3px] w-1.5 h-1.5 bg-rose-500 rounded-full" />
                            <span className="absolute -bottom-1 -right-[3px] w-1.5 h-1.5 bg-rose-500 rounded-full" />
                          </div>

                          {/* Guide floor */}
                          <div className="absolute inset-0 bg-rose-50/20 border-b border-dashed border-rose-200 rounded-lg pointer-events-none" />

                          {/* Unsigned Number */}
                          <div className="relative z-10 flex-1 flex items-center justify-center">
                            <span className="text-[11px] font-black text-rose-700 font-mono tracking-tight px-1.5 py-0.2 bg-white rounded border border-rose-200 shadow-2xs truncate">
                              {cleanDiffNum}
                            </span>
                          </div>

                          {/* Bottom Bracket */}
                          <div className="relative z-10 w-full h-2 border-x-2 border-b-2 border-rose-500 rounded-b-md">
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-x-3 border-x-transparent border-t-3 border-t-rose-500" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right-side Total Bracket */}
          {(target?.type === 'TOTAL' || config?.total) && (
            <div className="flex items-center gap-1.5 shrink-0 pl-1 py-1">
              <div className="w-7 sm:w-8 h-24 max-h-full py-1 text-slate-400 shrink-0">
                <CurlyBracket />
              </div>
              <div className="flex flex-col items-start gap-0.5 px-3 py-1.5 bg-emerald-50 rounded-2xl border-2 border-emerald-300 shadow-2xs shrink-0">
                <span className="text-[10px] font-black text-emerald-900 uppercase tracking-widest">
                  {config?.total?.label || "Total"}
                </span>
                <span className="text-xs font-black font-mono text-emerald-800">
                  {config?.total?.isTarget || target?.type === 'TOTAL' 
                    ? `? ${itemName}` 
                    : `${config?.total?.displayValue || (config?.total?.value !== undefined ? Number(config?.total?.value).toLocaleString() : '?')} ${itemName}`}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      {target?.type === 'BAR' && (
        <div className="flex items-center justify-between bg-indigo-50 p-3 rounded-2xl border border-indigo-200 text-xs">
          <span className="font-bold text-indigo-950">Target to Solve:</span>
          <span className="font-black text-indigo-800 bg-indigo-200 px-2.5 py-0.5 rounded-lg">
            Find {target.label || 'Entity'}'s Amount
          </span>
        </div>
      )}
      {target?.type === 'DIFFERENCE' && (
        <div className="flex items-center justify-between bg-rose-50 p-3 rounded-2xl border border-rose-200 text-xs">
          <span className="font-bold text-rose-950">Target to Solve:</span>
          <span className="font-black text-rose-800 bg-rose-200 px-2.5 py-0.5 rounded-lg">
            Find Difference
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Compact Bar Canvas
 * Read-only display of the student's verified model during calculation
 */
export function CompactBarCanvas({ 
  bars = [], 
  target = {}, 
  itemName = "units", 
  onEdit,
  isPartWhole = false,
  parts = [],
  whole = {},
  total = null,
  isBeforeAfter = false,
  beforeBars = [],
  afterBars = [],
  transfer = {}
}) {
  if (isBeforeAfter) {
    if (!beforeBars || beforeBars.length === 0) return null;

    return (
      <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-5 space-y-3 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-700">
              Verified Before & After Model Reference
            </span>
          </div>
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-2.5 py-1 rounded-xl transition-all cursor-pointer"
            >
              Edit Blueprint ✎
            </button>
          )}
        </div>

        {/* 1. Before State Box */}
        <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
            1. Before State (At First)
          </span>
          <div className="space-y-1.5">
            {beforeBars.map((bar, idx) => {
              const cleanDiff = (bar.diffValue || "").replace(/[+\-]/g, '').trim();
              return (
                <div key={bar.id || idx} className="flex items-center gap-2">
                  <span className="w-20 text-right text-xs font-black text-slate-800 truncate">{bar.name}</span>
                  <div className="flex-1 pl-2 border-l-4 border-indigo-500 border-dashed">
                    <div className="flex items-center h-8 bg-slate-50 rounded-lg p-1 border border-slate-200">
                      <div style={{ width: `${bar.length || 50}%` }} className="h-full bg-indigo-600 rounded flex items-center justify-center text-xs font-bold text-white px-2 truncate">
                        {bar.value || ""}
                      </div>
                      {bar.hasDifference && (() => {
                        const segments = (bar.diffSegments && bar.diffSegments.length > 0)
                          ? bar.diffSegments
                          : [{ id: `${bar.id}-seg-1`, value: bar.diffValue, length: 24 }];
                        return (
                          <>
                            {segments.map((seg, sIdx) => {
                              const cleanDiff = (seg.value || "").replace(/[+\-]/g, '').trim();
                              return (
                                <div
                                  key={seg.id || sIdx}
                                  style={{ width: `${seg.length || 24}%` }}
                                  className="h-full bg-emerald-500 rounded ml-1 flex items-center justify-center text-xs font-black text-white px-2 truncate border border-emerald-400 border-dashed shadow-2xs shrink-0"
                                >
                                  +{cleanDiff || "Diff"}
                                </div>
                              );
                            })}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. After State Box */}
        <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block">
            2. After State (In the End)
          </span>
          <div className="space-y-1.5">
            {afterBars.map((bar, idx) => (
              <div key={bar.id || idx} className="flex items-center gap-2">
                <span className="w-20 text-right text-xs font-black text-slate-800 truncate">{bar.name}</span>
                <div className="flex-1 pl-2 border-l-4 border-emerald-500 border-dashed">
                  <div className="flex items-center h-8 bg-slate-50 rounded-lg p-1 border border-slate-200">
                    <div style={{ width: '50%' }} className="h-full bg-emerald-600 rounded flex items-center justify-center text-xs font-bold text-white px-2 truncate">
                      {bar.value || "1 unit"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isPartWhole) {
    if (!parts || parts.length === 0) return null;

    return (
      <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-5 space-y-3 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-700">
              Verified Part-Whole Model Reference
            </span>
          </div>
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-2.5 py-1 rounded-xl transition-all cursor-pointer"
            >
              Edit Blueprint ✎
            </button>
          )}
        </div>

        {/* Partitioned Bar Canvas */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
          {/* Top Whole Bracket */}
          <div className="space-y-1">
            <div className="text-center">
              <span className="text-xs font-black text-slate-800 bg-amber-100 border border-amber-300 px-3 py-0.5 rounded-full shadow-2xs">
                {whole.label || "Target"}: {whole.value || "?"}
              </span>
            </div>
            <div className="w-full h-2.5 border-x-2 border-t-2 border-slate-600 rounded-t-sm" />
          </div>

          {/* Partitioned Bar */}
          <div className="flex h-11 w-full rounded-xl overflow-hidden border-2 border-slate-300 shadow-sm">
            {parts.map((p, idx) => {
              const isShortfall = p.isShortfall;
              const bgClass = isShortfall 
                ? "bg-slate-100 border-2 border-dashed border-slate-400 text-slate-700" 
                : idx === 0 
                  ? "bg-blue-500 text-white border-r-2 border-white" 
                  : "bg-amber-500 text-white border-r-2 border-white";
              const valText = p.value || '?';

              return (
                <div
                  key={p.id || idx}
                  style={{ width: `${p.length || 33}%` }}
                  className={`flex flex-col items-center justify-center px-2 py-1 text-center font-sans ${bgClass}`}
                >
                  <span className="text-[10px] font-black uppercase tracking-tight truncate w-full">
                    {p.name}
                  </span>
                  <span className="text-xs font-bold font-mono tracking-tight truncate w-full">
                    {valText}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (!bars || bars.length === 0) return null;

  return (
    <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-5 space-y-3 shadow-xs">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-black uppercase tracking-wider text-slate-700">
            Verified Bar Model Reference
          </span>
        </div>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-2.5 py-1 rounded-xl transition-all cursor-pointer"
          >
            Edit Blueprint ✎
          </button>
        )}
      </div>

      {/* Bars Stack */}
      <div className="p-3 bg-white rounded-2xl border border-slate-200 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          <div className="flex-1 space-y-2 min-w-[240px]">
            {bars.map((bar, idx) => {
              const isBottom = (bar.bracketPosition || 'bottom') === 'bottom';
              const cleanDiff = (bar.diffValue || "").replace(/[+\-]/g, '').trim();

              return (
                <div key={bar.id || idx} className="flex items-center gap-2">
                  <div className="w-20 text-right shrink-0">
                    <span className="text-xs font-black uppercase text-slate-800 truncate block">
                      {bar.name || `Bar ${idx + 1}`}
                    </span>
                  </div>
                  <div className="flex-1 pl-2.5 border-l-4 border-indigo-500 border-dashed py-0.5">
                    <div className="flex items-center h-9 bg-slate-50 rounded-lg border border-slate-200 p-0.5 overflow-visible relative">
                      <div
                        style={{ width: `${bar.length || 50}%` }}
                        className={`h-full rounded-md flex items-center justify-center text-xs font-black text-white px-2 truncate shrink-0 ${
                          idx === 0 ? 'bg-indigo-600' : idx === 1 ? 'bg-indigo-500' : 'bg-indigo-400'
                        }`}
                      >
                        {bar.value || ""}
                      </div>

                      {bar.hasDifference && (
                        bar.diffType === 'FEWER' ? (
                          <div
                            style={{ width: `${bar.diffLength || 20}%` }}
                            className="relative h-full ml-1 flex flex-col justify-between items-center py-0.5 px-1 overflow-visible select-none shrink-0"
                          >
                            <div className={`absolute right-0 w-0 border-r-2 border-dotted border-rose-400 pointer-events-none z-10 ${
                              isBottom ? '-top-5 bottom-0' : 'top-0 -bottom-5'
                            }`} />
                            {isBottom ? (
                              <>
                                <div className="relative z-10 flex-1 flex items-center justify-center">
                                  <span className="text-[10px] font-black text-rose-700 font-mono tracking-tight px-1 py-0.2 bg-white rounded border border-rose-200">
                                    {cleanDiff}
                                  </span>
                                </div>
                                <div className="relative z-10 w-full h-1.5 border-x-2 border-b-2 border-rose-500 rounded-b-sm" />
                              </>
                            ) : (
                              <>
                                <div className="relative z-10 w-full h-1.5 border-x-2 border-t-2 border-rose-500 rounded-t-sm" />
                                <div className="relative z-10 flex-1 flex items-center justify-center">
                                  <span className="text-[10px] font-black text-rose-700 font-mono tracking-tight px-1 py-0.2 bg-white rounded border border-rose-200">
                                    {cleanDiff}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        ) : (
                          (() => {
                            const segments = (bar.diffSegments && bar.diffSegments.length > 0)
                              ? bar.diffSegments
                              : [{ id: `${bar.id}-seg-1`, value: bar.diffValue, length: bar.diffLength || 20 }];
                            const segColors = [
                              'bg-emerald-500 border-emerald-400 text-white',
                              'bg-teal-500 border-teal-400 text-white',
                              'bg-emerald-600 border-emerald-500 text-white',
                              'bg-cyan-600 border-cyan-500 text-white'
                            ];
                            return (
                              <>
                                {segments.map((seg, sIdx) => {
                                  const cleanVal = (seg.value || "").replace(/[+\-]/g, '').trim();
                                  return (
                                    <div
                                      key={seg.id || sIdx}
                                      style={{ width: `${seg.length || 18}%` }}
                                      className={`h-full rounded-md ml-1 px-1.5 flex items-center justify-center text-xs font-black border border-dashed truncate shrink-0 ${segColors[sIdx % segColors.length]}`}
                                    >
                                      {cleanVal ? `+${cleanVal}` : "+ More"}
                                    </div>
                                  );
                                })}
                              </>
                            );
                          })()
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right-side Total Bracket */}
          {(target?.type === 'TOTAL' || total) && (
            <div className="flex items-center gap-1 shrink-0 pl-1 py-1">
              <div className="w-6 sm:w-7 h-20 max-h-full py-0.5 text-slate-400 shrink-0">
                <CurlyBracket />
              </div>
              <div className="flex flex-col items-start gap-0.5 px-2.5 py-1 bg-amber-50 rounded-xl border border-amber-300 shadow-2xs shrink-0">
                <span className="text-[9px] font-black text-amber-950 uppercase tracking-widest">
                  {total?.label || "Total"}
                </span>
                <span className="text-xs font-black font-mono text-amber-900">
                  {total?.isTarget || target?.type === 'TOTAL' 
                    ? `? ${itemName}` 
                    : `${total?.displayValue || (total?.value !== undefined ? Number(total?.value).toLocaleString() : '?')} ${itemName}`}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      {target?.type === 'BAR' && (
        <div className="flex items-center justify-between bg-indigo-50 px-3 py-2 rounded-xl border border-indigo-200 text-xs">
          <span className="font-bold text-indigo-950">Target to Solve:</span>
          <span className="font-black text-indigo-800 bg-indigo-200 px-2.5 py-0.5 rounded-lg">
            Find {target.label || 'Entity'}'s Amount
          </span>
        </div>
      )}
      {target?.type === 'DIFFERENCE' && (
        <div className="flex items-center justify-between bg-rose-50 px-3 py-2 rounded-xl border border-rose-200 text-xs">
          <span className="font-bold text-rose-950">Target to Solve:</span>
          <span className="font-black text-rose-800 bg-rose-200 px-2.5 py-0.5 rounded-lg">
            Find Difference
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * 🏷️ EditablePercentBadge
 * Displays a percentage with click-to-edit capability, allowing users to either
 * drag the slider or click the number to key in an exact percentage directly.
 */
function EditablePercentBadge({
  value,
  onChange,
  min = 10,
  max = 90,
  disabled = false,
  colorClass = "text-indigo-600",
  placeholder = "—"
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempVal, setTempVal] = useState(String(value ?? ''));
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isEditing) {
      setTempVal(String(value ?? ''));
    }
  }, [value, isEditing]);

  if (disabled) {
    return <span className="font-mono text-slate-400 text-[11px] font-bold select-none">{placeholder}</span>;
  }

  const handleCommit = () => {
    const parsed = parseInt(tempVal, 10);
    if (!isNaN(parsed)) {
      const clamped = Math.max(min, Math.min(max, parsed));
      onChange(clamped);
      setTempVal(String(clamped));
    } else {
      setTempVal(String(value ?? min));
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempVal(String(value ?? ''));
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="inline-flex items-center bg-white border-2 border-indigo-500 rounded-lg px-1.5 py-0.5 shadow-2xs">
        <input
          ref={inputRef}
          type="number"
          min={min}
          max={max}
          value={tempVal}
          onChange={(e) => setTempVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleCommit();
            } else if (e.key === 'Escape') {
              e.preventDefault();
              handleCancel();
            }
          }}
          onBlur={handleCommit}
          onFocus={(e) => e.target.select()}
          autoFocus
          className="w-8 text-[11px] font-mono font-black text-indigo-900 bg-transparent text-right outline-none p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span className="text-[10px] font-mono font-black text-indigo-600 ml-0.5 select-none">%</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsEditing(true)}
      title="Click to key in custom percentage"
      className={`font-mono text-[11px] font-black ${colorClass} hover:bg-indigo-50 hover:border-indigo-300 border border-dashed border-transparent px-1.5 py-0.5 rounded-lg transition-all cursor-pointer inline-flex items-center gap-1 group`}
    >
      <span>{value}%</span>
      <span className="text-[9px] opacity-0 group-hover:opacity-100 text-indigo-400 transition-opacity">✎</span>
    </button>
  );
}

/**
 * BarParametersEditor
 * Clean, full-width responsive parameter editor card for individual bars in the Comparison model.
 */
function BarParametersEditor({
  bar,
  barIndex,
  entities = [],
  onUpdate,
  onToggleDiff,
  onAddDiffSegment,
  onUpdateDiffSegment,
  onRemoveDiffSegment,
  onDelete,
  onCollapse
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full p-4 sm:p-5 bg-white border-2 border-indigo-100 rounded-2xl shadow-sm space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <span className="text-xs font-black text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
            {barIndex + 1}
          </span>
          Editing {bar.name || `Bar ${barIndex + 1}`} Parameters
        </span>
        <button
          type="button"
          onClick={onCollapse}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-xl flex items-center gap-1 cursor-pointer transition-all"
        >
          <ChevronUp className="w-3.5 h-3.5" />
          Done
        </button>
      </div>

      {/* Row 1: Name, Value, Length (Aligned 5 / 3 / 4 columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
        {/* Name input */}
        <div className="sm:col-span-5 space-y-1">
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">
            Bar Label / Name
          </label>
          <input
            type="text"
            value={bar.name}
            onChange={(e) => onUpdate(bar.id, 'name', e.target.value)}
            placeholder="e.g. Zhi Xuan"
            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500 shadow-2xs"
          />
          {entities.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-0.5">
              {entities.map(ent => (
                <button
                  key={ent.name}
                  type="button"
                  onClick={() => onUpdate(bar.id, 'name', ent.name)}
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 hover:bg-indigo-100 hover:text-indigo-700 text-slate-700 transition-all cursor-pointer border border-slate-200/60"
                >
                  +{ent.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Value Label */}
        <div className="sm:col-span-3 space-y-1">
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">
            Value Label
          </label>
          <input
            type="text"
            value={bar.value}
            onChange={(e) => onUpdate(bar.id, 'value', e.target.value)}
            placeholder="e.g. 13,400"
            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500 shadow-2xs"
          />
        </div>

        {/* Bar Length Slider */}
        <div className="sm:col-span-4 space-y-1">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-slate-500">
            <span>Bar Length</span>
            <EditablePercentBadge
              value={bar.length || 50}
              onChange={(val) => onUpdate(bar.id, 'length', val)}
              min={10}
              max={90}
            />
          </div>
          <input
            type="range"
            min="10"
            max="90"
            value={bar.length || 50}
            onChange={(e) => onUpdate(bar.id, 'length', Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>
      </div>

      {/* Row 2: Difference Segment Parameters (Matching 5 / 3 / 4 columns) */}
      {/* Row 2: Difference Segment Parameters */}
      <div className="pt-3 border-t border-slate-100 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              Difference Segment (+ Diff)
            </span>
            <button
              type="button"
              onClick={() => onToggleDiff(bar.id)}
              className={`px-3 py-1 rounded-xl text-xs font-black tracking-wide border transition-all cursor-pointer ${
                bar.hasDifference
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white border-slate-300 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'
              }`}
            >
              {bar.hasDifference ? "✓ Has Difference" : "+ Add Difference"}
            </button>
          </div>

          {bar.hasDifference && (
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-xl border border-slate-200 shadow-2xs">
                <button
                  type="button"
                  onClick={() => onUpdate(bar.id, 'diffType', 'MORE')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                    bar.diffType === 'MORE'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-white'
                  }`}
                >
                  + More (Protruding)
                </button>
                <button
                  type="button"
                  onClick={() => onUpdate(bar.id, 'diffType', 'FEWER')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                    bar.diffType === 'FEWER'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-white'
                  }`}
                >
                  - Fewer (Shortage Bracket)
                </button>
              </div>

              {bar.diffType === 'FEWER' && (
                <div className="flex items-center gap-0.5 bg-rose-50 p-0.5 rounded-xl border border-rose-200">
                  <button
                    type="button"
                    onClick={() => onUpdate(bar.id, 'bracketPosition', 'bottom')}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${
                      (bar.bracketPosition || 'bottom') === 'bottom'
                        ? 'bg-rose-600 text-white shadow-2xs'
                        : 'text-rose-700 hover:bg-rose-100'
                    }`}
                  >
                    Bottom ⤓
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdate(bar.id, 'bracketPosition', 'top')}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${
                      bar.bracketPosition === 'top'
                        ? 'bg-rose-600 text-white shadow-2xs'
                        : 'text-rose-700 hover:bg-rose-100'
                    }`}
                  >
                    Top ⤒
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {!bar.hasDifference && (
          <p className="text-[10px] text-slate-400 font-medium">
            No difference attached. Click "+ Add Difference" to add a comparison segment.
          </p>
        )}

        {/* When FEWER: Single shortage bracket controls */}
        {bar.hasDifference && bar.diffType === 'FEWER' && (
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start bg-rose-50/50 p-3 rounded-xl border border-rose-200">
            <div className="sm:col-span-5 space-y-1">
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">
                Shortage Value
              </label>
              <input
                type="text"
                value={bar.diffValue || ''}
                onChange={(e) => onUpdate(bar.id, 'diffValue', e.target.value)}
                placeholder="e.g. 5,000"
                className="w-full border rounded-xl px-3 py-1.5 text-xs font-bold bg-white border-slate-300 text-slate-900 focus:outline-none focus:border-rose-500 shadow-2xs"
              />
            </div>
            <div className="sm:col-span-7 space-y-1">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-slate-500">
                <span>Shortage Bracket Width</span>
                <EditablePercentBadge
                  value={bar.diffLength || 20}
                  onChange={(val) => onUpdate(bar.id, 'diffLength', val)}
                  min={5}
                  max={60}
                  colorClass="text-rose-600"
                />
              </div>
              <input
                type="range"
                min="5"
                max="60"
                value={bar.diffLength || 20}
                onChange={(e) => onUpdate(bar.id, 'diffLength', Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* When MORE: Multi-Segment Difference Controls! */}
        {bar.hasDifference && bar.diffType !== 'FEWER' && (() => {
          const segments = (bar.diffSegments && bar.diffSegments.length > 0)
            ? bar.diffSegments
            : [{ id: `${bar.id}-seg-1`, value: bar.diffValue || '', length: bar.diffLength || 20 }];

          return (
            <div className="space-y-2.5">
              <div className="space-y-2">
                {segments.map((seg, sIdx) => (
                  <div
                    key={seg.id || sIdx}
                    className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase text-emerald-800 flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] flex items-center justify-center font-bold">
                          {sIdx + 1}
                        </span>
                        Difference Segment {sIdx + 1}
                        {segments.length > 1 && (
                          <span className="text-[9px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.2 rounded-full">
                            Partitioned Part
                          </span>
                        )}
                      </span>
                      {segments.length > 1 && (
                        <button
                          type="button"
                          onClick={() => onRemoveDiffSegment(bar.id, seg.id)}
                          className="text-[10px] font-bold text-rose-600 hover:text-rose-800 hover:bg-rose-100/60 px-2 py-0.5 rounded cursor-pointer transition-all flex items-center gap-1"
                          title="Remove this segment"
                        >
                          <Trash2 className="w-3 h-3" />
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                      <div className="sm:col-span-5 space-y-1">
                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">
                          Segment Value
                        </label>
                        <input
                          type="text"
                          value={seg.value || ''}
                          onChange={(e) => onUpdateDiffSegment(bar.id, seg.id, 'value', e.target.value)}
                          placeholder="e.g. 8,000"
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500 shadow-2xs font-mono"
                        />
                      </div>
                      <div className="sm:col-span-7 space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-slate-500">
                          <span>Segment Width</span>
                          <EditablePercentBadge
                            value={seg.length || 18}
                            onChange={(val) => onUpdateDiffSegment(bar.id, seg.id, 'length', val)}
                            min={5}
                            max={60}
                            colorClass="text-emerald-600"
                          />
                        </div>
                        <input
                          type="range"
                          min="5"
                          max="60"
                          value={seg.length || 18}
                          onChange={(e) => onUpdateDiffSegment(bar.id, seg.id, 'length', Number(e.target.value))}
                          className="w-full accent-emerald-600 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* + Add Another Segment Button */}
              {segments.length < 4 && (
                <button
                  type="button"
                  onClick={() => onAddDiffSegment(bar.id)}
                  className="w-full py-2 px-3 text-xs font-black text-emerald-700 hover:text-emerald-800 bg-white hover:bg-emerald-50 border-2 border-dashed border-emerald-300 hover:border-emerald-400 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-2xs active:scale-[0.99]"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-600" />
                  <span>+ Add Another Segment (e.g. [ 8,000 ] + [ 8,000 ])</span>
                </button>
              )}
            </div>
          );
        })()}
      </div>

      {/* Footer: Delete Bar & Done */}
      <div className="pt-2 flex items-center justify-between border-t border-slate-100">
        <button
          type="button"
          onClick={() => onDelete(bar.id)}
          className="text-xs font-bold text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 flex items-center gap-1.5 transition-all cursor-pointer"
          title="Delete this bar"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete Bar
        </button>

        <button
          type="button"
          onClick={onCollapse}
          className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-1.5 rounded-xl flex items-center gap-1 transition-all cursor-pointer"
        >
          <ChevronUp className="w-3.5 h-3.5" />
          Done / Collapse
        </button>
      </div>
    </motion.div>
  );
}

/**
 * InteractiveBarBuilder
 * 
 * An interactive 3-stage bar model solver designed for structured problem sums.
 * Stage 1: Model Type Selection (Metacognition)
 * Stage 2: Model Inspection & Variable Assignment (Pictorial Blueprint with Parameter Checking)
 * Stage 3: Step-by-Step Multi-Step Calculations (Abstract Calculation with Verified Model)
 */
export default function InteractiveBarBuilder({ 
  config = {}, 
  steps = [], 
  onSubmit, 
  onDefect,
  disabled = false, 
  level,
  initialStage = 1,
  isAdminReview = false
}) {
  const correctModelType = config.correctModelType || "COMPARISON";
  const [selectedModel, setSelectedModel] = useState(
    isAdminReview ? (Array.isArray(correctModelType) ? correctModelType[0] : correctModelType) : null
  );
  const activeModel = selectedModel || (Array.isArray(correctModelType) ? correctModelType[0] : correctModelType);
  const isBeforeAfter = activeModel === 'BEFORE_AFTER';
  const isPartWhole = !isBeforeAfter && (activeModel === 'PART_WHOLE');
  const [currentStage, setCurrentStage] = useState(initialStage);
  const [confirmationStatus, setConfirmationStatus] = useState('idle'); // 'idle' | 'correct' | 'incorrect'

  const isModelMatch = Array.isArray(correctModelType)
    ? correctModelType.includes(selectedModel)
    : selectedModel === correctModelType;

  // Stage 2: Interactive Bar Builder State & Defect Tracking
  const [userBars, setUserBars] = useState([]);
  const [hasCombinedTotal, setHasCombinedTotal] = useState(false);
  const [combinedTotalValue, setCombinedTotalValue] = useState('');
  const [userParts, setUserParts] = useState([]);
  const [userWhole, setUserWhole] = useState('');
  const [userBeforeBars, setUserBeforeBars] = useState([]);
  const [userAfterBars, setUserAfterBars] = useState([]);
  const [userTransfer, setUserTransfer] = useState({ giver: '', receiver: '', amount: '' });
  const [stage2Status, setStage2Status] = useState('idle'); // 'idle' | 'correct' | 'incorrect'
  const [stage2ErrorMsg, setStage2ErrorMsg] = useState(null);
  const [showModelSolution, setShowModelSolution] = useState(false);
  const [defectHistory, setDefectHistory] = useState([]);

  const modelOptions = config.modelOptions || [
    { id: "COMPARISON", label: "Comparison Model", description: "Compare quantities across distinct entities" },
    { id: "PART_WHOLE", label: "Part-Whole Model", description: "Divide a single whole quantity into parts" },
    { id: "BEFORE_AFTER", label: "Before & After Model", description: "Show transfers or changes across time states" }
  ];
  const entities = config.entities || [];
  const target = config.target || { type: "TOTAL", label: "Total" };
  const calculationSteps = steps.length > 0 ? steps : (config.steps || []);

  const handleSelectModel = (modelId) => {
    if (disabled) return;
    setSelectedModel(modelId || null);
    setConfirmationStatus('idle'); // User can freely consider options without immediate verification
  };

  const handleConfirmModel = () => {
    if (disabled || !selectedModel) return;
    if (confirmationStatus === 'correct') {
      handleProceedToStage2();
      return;
    }
    if (isModelMatch) {
      setConfirmationStatus('correct');
    } else {
      setConfirmationStatus('incorrect');
    }
  };

  const handleAutoFillBeforeAfter = () => {
    const nameA = config.transferFrom || config.entities?.[0]?.name || 'Entity A';
    const nameB = config.transferTo || config.entities?.[1]?.name || 'Entity B';
    const largerVal = config.largerValue || config.entities?.find(e => normalizeName(e.name) === normalizeName(nameA))?.value || '';
    const smallerVal = config.smallerValue || config.entities?.find(e => normalizeName(e.name) === normalizeName(nameB))?.value || '';
    const diffVal = config.differenceValue || config.difference?.value || '';
    const transferVal = config.transferAmount || '';
    const equalVal = config.equalizedValue || '';

    const diffSegments = (transferVal && !isNaN(Number(transferVal)))
      ? [
          { id: 'before-seg-1', value: Number(transferVal).toLocaleString(), length: 20 },
          { id: 'before-seg-2', value: Number(transferVal).toLocaleString(), length: 20 }
        ]
      : diffVal
        ? [{ id: 'before-seg-1', value: config.target?.type === 'DIFFERENCE' ? '?' : Number(diffVal).toLocaleString(), length: 25 }]
        : [{ id: 'before-seg-1', value: '?', length: 25 }];

    setUserBeforeBars([
      {
        id: 'before-1',
        name: nameA,
        value: largerVal ? (largerVal === '?' ? '?' : Number(largerVal).toLocaleString()) : '',
        length: 65,
        hasDifference: true,
        diffType: 'MORE',
        diffValue: diffVal ? (config.target?.type === 'DIFFERENCE' ? '?' : Number(diffVal).toLocaleString()) : (transferVal ? (Number(transferVal) * 2).toLocaleString() : '?'),
        diffSegments: diffSegments,
        isCollapsed: false
      },
      {
        id: 'before-2',
        name: nameB,
        value: smallerVal ? (smallerVal === '?' ? '?' : Number(smallerVal).toLocaleString()) : '',
        length: 42,
        hasDifference: false,
        diffType: 'MORE',
        diffValue: '',
        diffSegments: [],
        isCollapsed: false
      }
    ]);

    setUserTransfer({
      giver: nameA,
      receiver: nameB,
      amount: transferVal ? Number(transferVal).toLocaleString() : ''
    });

    setUserAfterBars([
      {
        id: 'after-1',
        name: `${nameA} (In the end)`,
        value: equalVal ? Number(equalVal).toLocaleString() : '1 unit',
        length: 50,
        hasDifference: false,
        diffType: 'MORE',
        diffValue: '',
        diffSegments: [],
        isCollapsed: false
      },
      {
        id: 'after-2',
        name: `${nameB} (In the end)`,
        value: equalVal ? Number(equalVal).toLocaleString() : '1 unit',
        length: 50,
        hasDifference: false,
        diffType: 'MORE',
        diffValue: '',
        diffSegments: [],
        isCollapsed: false
      }
    ]);

    setStage2Status('idle');
    setStage2ErrorMsg(null);
  };

  const handleResetBeforeAfter = () => {
    if (disabled) return;
    const nameA = config.transferFrom || config.entities?.[0]?.name || 'Entity A';
    const nameB = config.transferTo || config.entities?.[1]?.name || 'Entity B';
    setUserBeforeBars([
      { id: 'before-1', name: nameA, value: '', length: 65, hasDifference: true, diffType: 'MORE', diffValue: '', isCollapsed: false },
      { id: 'before-2', name: nameB, value: '', length: 42, hasDifference: false, diffType: 'MORE', diffValue: '', isCollapsed: false }
    ]);
    setUserTransfer({ giver: nameA, receiver: nameB, amount: '' });
    setUserAfterBars([
      { id: 'after-1', name: `${nameA} (In the end)`, value: '1 unit', length: 50, hasDifference: false, diffType: 'MORE', diffValue: '', isCollapsed: false },
      { id: 'after-2', name: `${nameB} (In the end)`, value: '1 unit', length: 50, hasDifference: false, diffType: 'MORE', diffValue: '', isCollapsed: false }
    ]);
    setStage2Status('idle');
    setStage2ErrorMsg(null);
  };

  const handleUpdateBeforeBar = (id, field, val) => {
    setUserBeforeBars(prev => prev.map(b => b.id === id ? { ...b, [field]: val } : b));
    setStage2Status('idle');
    setStage2ErrorMsg(null);
  };

  const handleToggleCollapseBeforeBar = (id) => {
    setUserBeforeBars(prev => prev.map(b => b.id === id ? { ...b, isCollapsed: !b.isCollapsed } : b));
  };

  const handleToggleBeforeDiff = (id) => {
    setUserBeforeBars(prev => prev.map(b => {
      if (b.id !== id) return b;
      const willHave = !b.hasDifference;
      return {
        ...b,
        hasDifference: willHave,
        diffSegments: willHave ? [{ id: `${b.id}-seg-1`, value: b.diffValue || '', length: 25 }] : []
      };
    }));
    setStage2Status('idle');
    setStage2ErrorMsg(null);
  };

  const handleBeforeAddDiffSegment = (id) => {
    setUserBeforeBars(prev => prev.map(b => {
      if (b.id !== id) return b;
      const current = (b.diffSegments && b.diffSegments.length > 0)
        ? b.diffSegments
        : [{ id: `${b.id}-seg-1`, value: b.diffValue || '', length: 25 }];
      return {
        ...b,
        diffSegments: [...current, { id: `${b.id}-seg-${Date.now()}`, value: '', length: 20 }]
      };
    }));
    setStage2Status('idle');
    setStage2ErrorMsg(null);
  };

  const handleBeforeUpdateDiffSegment = (barId, segId, field, val) => {
    setUserBeforeBars(prev => prev.map(b => {
      if (b.id !== barId) return b;
      const current = (b.diffSegments && b.diffSegments.length > 0)
        ? b.diffSegments
        : [{ id: `${b.id}-seg-1`, value: b.diffValue || '', length: 25 }];
      const updated = current.map(s => s.id === segId ? { ...s, [field]: val } : s);
      return {
        ...b,
        diffSegments: updated,
        diffValue: updated[0] ? updated[0].value : b.diffValue
      };
    }));
    setStage2Status('idle');
    setStage2ErrorMsg(null);
  };

  const handleBeforeRemoveDiffSegment = (barId, segId) => {
    setUserBeforeBars(prev => prev.map(b => {
      if (b.id !== barId) return b;
      const current = b.diffSegments || [];
      const filtered = current.filter(s => s.id !== segId);
      return {
        ...b,
        diffSegments: filtered.length > 0 ? filtered : [{ id: `${b.id}-seg-1`, value: '', length: 25 }],
        diffValue: filtered[0] ? filtered[0].value : ''
      };
    }));
    setStage2Status('idle');
    setStage2ErrorMsg(null);
  };

  const handleUpdateAfterBar = (id, field, val) => {
    setUserAfterBars(prev => prev.map(b => b.id === id ? { ...b, [field]: val } : b));
    setStage2Status('idle');
    setStage2ErrorMsg(null);
  };

  const handleToggleCollapseAfterBar = (id) => {
    setUserAfterBars(prev => prev.map(b => b.id === id ? { ...b, isCollapsed: !b.isCollapsed } : b));
  };

  const handleToggleAfterDiff = (id) => {
    setUserAfterBars(prev => prev.map(b => {
      if (b.id !== id) return b;
      const willHave = !b.hasDifference;
      return {
        ...b,
        hasDifference: willHave,
        diffSegments: willHave ? [{ id: `${b.id}-seg-1`, value: b.diffValue || '', length: 20 }] : []
      };
    }));
    setStage2Status('idle');
    setStage2ErrorMsg(null);
  };

  const handleAfterAddDiffSegment = (id) => {
    setUserAfterBars(prev => prev.map(b => {
      if (b.id !== id) return b;
      const current = (b.diffSegments && b.diffSegments.length > 0)
        ? b.diffSegments
        : [{ id: `${b.id}-seg-1`, value: b.diffValue || '', length: 20 }];
      return {
        ...b,
        diffSegments: [...current, { id: `${b.id}-seg-${Date.now()}`, value: '', length: 20 }]
      };
    }));
    setStage2Status('idle');
    setStage2ErrorMsg(null);
  };

  const handleAfterUpdateDiffSegment = (barId, segId, field, val) => {
    setUserAfterBars(prev => prev.map(b => {
      if (b.id !== barId) return b;
      const current = (b.diffSegments && b.diffSegments.length > 0)
        ? b.diffSegments
        : [{ id: `${b.id}-seg-1`, value: b.diffValue || '', length: 20 }];
      const updated = current.map(s => s.id === segId ? { ...s, [field]: val } : s);
      return {
        ...b,
        diffSegments: updated,
        diffValue: updated[0] ? updated[0].value : b.diffValue
      };
    }));
    setStage2Status('idle');
    setStage2ErrorMsg(null);
  };

  const handleAfterRemoveDiffSegment = (barId, segId) => {
    setUserAfterBars(prev => prev.map(b => {
      if (b.id !== barId) return b;
      const current = b.diffSegments || [];
      const filtered = current.filter(s => s.id !== segId);
      return {
        ...b,
        diffSegments: filtered.length > 0 ? filtered : [{ id: `${b.id}-seg-1`, value: '', length: 20 }],
        diffValue: filtered[0] ? filtered[0].value : ''
      };
    }));
    setStage2Status('idle');
    setStage2ErrorMsg(null);
  };

  const handleProceedToStage2 = () => {
    if (isModelMatch || isAdminReview) {
      if (isBeforeAfter && userBeforeBars.length === 0) {
        handleAutoFillBeforeAfter();
      } else if (isPartWhole && userParts.length === 0) {
        const initialParts = (config.parts || []).map((p, idx) => ({
          id: `part-${idx + 1}`,
          name: '',
          value: '',
          length: Math.round(100 / (config.parts?.length || 3)),
          isShortfall: !!p.isShortfall
        }));
        setUserParts(initialParts.length > 0 ? initialParts : [
          { id: 'part-1', name: '', value: '', length: 35, isShortfall: false },
          { id: 'part-2', name: '', value: '', length: 35, isShortfall: false },
          { id: 'part-3', name: '', value: '', length: 30, isShortfall: true }
        ]);
      } else if (!isPartWhole && !isBeforeAfter && userBars.length === 0) {
        handleAutoFillBars();
      }
      setCurrentStage(2);
    }
  };

  // Part-Whole Stage 2 Handlers
  const handleAddPart = () => {
    if (disabled) return;
    const newPart = {
      id: `part-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: "",
      value: "",
      length: 30,
      isShortfall: false
    };
    setUserParts(prev => [...prev, newPart]);
    setStage2Status('idle');
    setStage2ErrorMsg(null);
  };

  const handleUpdatePart = (id, field, val) => {
    setUserParts(prev => prev.map(p => {
      if (p.id !== id) return p;
      return { ...p, [field]: val };
    }));
    setStage2Status('idle');
    setStage2ErrorMsg(null);
  };

  const handleDeletePart = (id) => {
    setUserParts(prev => prev.filter(p => p.id !== id));
    setStage2Status('idle');
    setStage2ErrorMsg(null);
  };

  const handleAutoFillParts = () => {
    const parts = (config.parts || []).map((p, idx) => ({
      id: `part-${idx + 1}`,
      name: p.name,
      value: p.displayValue || (p.value !== undefined ? `${p.value}` : ''),
      length: Math.round(100 / (config.parts?.length || 3)),
      isShortfall: !!p.isShortfall
    }));
    setUserParts(parts);
    setUserWhole(config.whole?.displayValue || (config.whole?.value !== undefined ? `${config.whole.value}` : ''));
    setStage2Status('idle');
    setStage2ErrorMsg(null);
  };

  const handleClearParts = () => {
    setUserParts([]);
    setUserWhole('');
    setStage2Status('idle');
    setStage2ErrorMsg(null);
  };

  // Stage 2 Bar Construction Handlers
  const handleAddBar = () => {
    if (disabled) return;
    const newBar = {
      id: `bar-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: "",
      length: 50,
      value: "",
      hasDifference: false,
      diffType: 'MORE',
      diffLength: 20,
      diffValue: "",
      bracketPosition: 'bottom',
      isTarget: false,
      isCollapsed: false
    };
    setUserBars(prev => [...prev, newBar]);
    setStage2Status('idle');
    setStage2ErrorMsg(null);
  };

  const handleToggleCollapseBar = (id) => {
    setUserBars(prev => prev.map(bar => {
      if (bar.id !== id) return bar;
      return { ...bar, isCollapsed: !bar.isCollapsed };
    }));
  };

  const handleToggleCollapseAll = () => {
    const anyExpanded = userBars.some(b => !b.isCollapsed);
    setUserBars(prev => prev.map(b => ({ ...b, isCollapsed: anyExpanded })));
  };

  const handleUpdateBar = (id, field, val) => {
    setUserBars(prev => prev.map(bar => {
      if (bar.id !== id) return bar;
      let finalVal = val;
      if (field === 'diffValue' && bar.diffType === 'FEWER') {
        finalVal = val.replace(/[+\-]/g, '');
      }
      if (field === 'diffType' && val === 'FEWER' && bar.diffValue) {
        return { ...bar, diffType: val, diffValue: bar.diffValue.replace(/[+\-]/g, '').trim(), bracketPosition: bar.bracketPosition || 'bottom' };
      }
      return { ...bar, [field]: finalVal };
    }));
    setStage2Status('idle');
    setStage2ErrorMsg(null);
  };

  const handleDeleteBar = (id) => {
    setUserBars(prev => prev.filter(bar => bar.id !== id));
    setStage2Status('idle');
    setStage2ErrorMsg(null);
  };

  const handleToggleDifference = (id) => {
    setUserBars(prev => prev.map(bar => {
      if (bar.id !== id) return bar;
      const willHave = !bar.hasDifference;
      const defaultSegs = willHave
        ? [{ id: `${bar.id}-seg-1`, value: bar.diffValue ? bar.diffValue.replace(/[+\-]/g, '').trim() : '', length: bar.diffLength || 20 }]
        : [];
      return {
        ...bar,
        hasDifference: willHave,
        diffType: bar.diffType || 'MORE',
        diffLength: bar.diffLength || 20,
        diffValue: willHave ? (bar.diffValue ? bar.diffValue.replace(/[+\-]/g, '').trim() : '') : '',
        diffSegments: defaultSegs,
        bracketPosition: bar.bracketPosition || 'bottom'
      };
    }));
    setStage2Status('idle');
    setStage2ErrorMsg(null);
  };

  const handleAddDiffSegment = (barId) => {
    setUserBars(prev => prev.map(bar => {
      if (bar.id !== barId) return bar;
      const currentSegments = (bar.diffSegments && bar.diffSegments.length > 0)
        ? bar.diffSegments
        : [{ id: `${bar.id}-seg-1`, value: bar.diffValue || '', length: bar.diffLength || 20 }];

      const newSegId = `${bar.id}-seg-${Date.now()}`;
      const newSegments = [
        ...currentSegments,
        { id: newSegId, value: '', length: 18 }
      ];
      return {
        ...bar,
        diffSegments: newSegments
      };
    }));
    setStage2Status('idle');
    setStage2ErrorMsg(null);
  };

  const handleUpdateDiffSegment = (barId, segId, field, value) => {
    setUserBars(prev => prev.map(bar => {
      if (bar.id !== barId) return bar;
      const currentSegments = (bar.diffSegments && bar.diffSegments.length > 0)
        ? bar.diffSegments
        : [{ id: `${bar.id}-seg-1`, value: bar.diffValue || '', length: bar.diffLength || 20 }];

      const updatedSegments = currentSegments.map(seg => {
        if (seg.id !== segId) return seg;
        return { ...seg, [field]: value };
      });

      const firstSeg = updatedSegments[0];
      return {
        ...bar,
        diffSegments: updatedSegments,
        diffValue: firstSeg ? firstSeg.value : bar.diffValue,
        diffLength: firstSeg ? firstSeg.length : bar.diffLength
      };
    }));
    setStage2Status('idle');
    setStage2ErrorMsg(null);
  };

  const handleRemoveDiffSegment = (barId, segId) => {
    setUserBars(prev => prev.map(bar => {
      if (bar.id !== barId) return bar;
      const currentSegments = bar.diffSegments || [];
      const filtered = currentSegments.filter(s => s.id !== segId);
      if (filtered.length === 0) {
        return {
          ...bar,
          diffSegments: [{ id: `${bar.id}-seg-1`, value: '', length: 20 }],
          diffValue: ''
        };
      }
      return {
        ...bar,
        diffSegments: filtered,
        diffValue: filtered[0].value,
        diffLength: filtered[0].length
      };
    }));
    setStage2Status('idle');
    setStage2ErrorMsg(null);
  };

  const handleAutoFillBars = () => {
    if (!entities || entities.length === 0) {
      setUserBars([
        { id: 'bar-1', name: 'Entity A', length: 50, value: '10,000', hasDifference: false, diffType: 'MORE', diffLength: 20, diffValue: '', isTarget: false, isCollapsed: true },
        { id: 'bar-2', name: 'Entity B', length: 50, value: '', hasDifference: true, diffType: 'MORE', diffLength: 20, diffValue: '5,000', isTarget: false, isCollapsed: true },
        { id: 'bar-3', name: 'Entity C', length: 50, value: '', hasDifference: true, diffType: 'FEWER', diffLength: 20, diffValue: '5,000', bracketPosition: 'bottom', isTarget: true, isCollapsed: true }
      ]);
      setStage2Status('idle');
      return;
    }
    const filled = entities.map((e, idx) => {
      const rawDiff = e.displayDiff || e.diffValue || '';
      const cleanDiff = `${rawDiff}`.replace(/[+\-]/g, '').trim();
      const hasDiff = e.relation === 'MORE' || e.relation === 'FEWER';

      let defaultSegments = [];
      if (hasDiff && e.relation !== 'FEWER') {
        if (config.problemType === 'EQUALIZING_TRANSFER' && config.transferAmount) {
          const tVal = Number(config.transferAmount).toLocaleString();
          defaultSegments = [
            { id: `bar-${idx + 1}-seg-1`, value: tVal, length: 18 },
            { id: `bar-${idx + 1}-seg-2`, value: tVal, length: 18 }
          ];
        } else {
          defaultSegments = [
            { id: `bar-${idx + 1}-seg-1`, value: cleanDiff, length: 20 }
          ];
        }
      }

      return {
        id: `bar-${idx + 1}`,
        name: e.name,
        length: 50,
        value: e.displayValue || (e.value !== undefined && e.value !== null ? (e.value === '?' ? '?' : Number(e.value).toLocaleString()) : ''),
        hasDifference: hasDiff,
        diffType: e.relation === 'FEWER' ? 'FEWER' : 'MORE',
        diffLength: defaultSegments.length > 1 ? 36 : 20,
        diffValue: defaultSegments.length > 1 ? defaultSegments[0].value : cleanDiff,
        diffSegments: defaultSegments,
        bracketPosition: 'bottom',
        isTarget: target?.type === 'BAR' && target?.targetEntity === e.id,
        isCollapsed: true // Default to tightly collapsed bar model view
      };
    });
    setUserBars(filled);
    if (config.total || target?.type === 'TOTAL') {
      setHasCombinedTotal(true);
      setCombinedTotalValue(config.total?.isTarget || target?.type === 'TOTAL' ? '?' : (config.total?.displayValue || (config.total?.value !== undefined ? Number(config.total.value).toLocaleString() : '')));
    } else {
      setHasCombinedTotal(false);
      setCombinedTotalValue('');
    }
    setStage2Status('idle');
    setStage2ErrorMsg(null);
  };

  const handleClearBars = () => {
    setUserBars([]);
    setHasCombinedTotal(false);
    setCombinedTotalValue('');
    setStage2Status('idle');
    setStage2ErrorMsg(null);
  };

  const handleVerifyStage2 = () => {
    if (disabled) return;
    if (stage2Status === 'correct') {
      handleProceedToStage3();
      return;
    }

    const checkRes = isBeforeAfter
      ? checkBeforeAfterParameters(userBeforeBars, userAfterBars, userTransfer, config)
      : isPartWhole 
      ? checkPartWholeParameters(userParts, userWhole, config)
      : checkBarModelParameters(userBars, config, { hasCombinedTotal, combinedTotalValue });

    if (!checkRes.isValid) {
      setStage2Status('incorrect');
      setStage2ErrorMsg(checkRes.errorMsg);
      const defectEntry = {
        defect: checkRes.defect,
        errorMsg: checkRes.errorMsg,
        details: checkRes.details,
        attempt: defectHistory.length + 1,
        time: Date.now(),
        snapshot: isBeforeAfter
          ? { beforeBars: userBeforeBars, afterBars: userAfterBars, transfer: userTransfer }
          : isPartWhole 
          ? { parts: userParts, whole: userWhole } 
          : { bars: userBars, hasCombinedTotal, combinedTotalValue }
      };
      setDefectHistory(prev => [...prev, defectEntry]);
      if (onDefect) {
        try { onDefect(defectEntry); } catch(e) {}
      }
      return;
    }

    setStage2Status('correct');
    setStage2ErrorMsg(null);
    setShowModelSolution(false);
  };

  const handleProceedToStage3 = () => {
    setCurrentStage(3);
  };

  useEffect(() => {
    if (isAdminReview || initialStage >= 2) {
      if (isBeforeAfter && userBeforeBars.length === 0) {
        handleAutoFillBeforeAfter();
      } else if (isPartWhole && userParts.length === 0) {
        handleAutoFillParts();
      } else if (!isPartWhole && !isBeforeAfter && userBars.length === 0) {
        handleAutoFillBars();
      }
    }
  }, [isAdminReview, initialStage, isBeforeAfter, isPartWhole]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* 🧭 Stage Progress Header (Single-line) */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 bg-slate-900 text-white rounded-2xl shadow-md border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-sm shrink-0">
            {currentStage}
          </div>
          <div className="text-sm font-black tracking-tight">
            {currentStage === 1 && "Step 1: Choose the Bar Model Type"}
            {currentStage === 2 && "Step 2: Build the Bar Model Blueprint"}
            {currentStage === 3 && "Step 3: Calculate & Solve Equations"}
          </div>
        </div>

        {/* Stage Pills */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3].map((stageNum) => (
            <button
              key={stageNum}
              type="button"
              onClick={() => {
                if (isAdminReview || isModelMatch) {
                  if (stageNum === 2) {
                    if (isBeforeAfter && userBeforeBars.length === 0) {
                      handleAutoFillBeforeAfter();
                    } else if (isPartWhole && userParts.length === 0) {
                      handleAutoFillParts();
                    } else if (!isPartWhole && !isBeforeAfter && userBars.length === 0) {
                      handleAutoFillBars();
                    }
                  }
                  setCurrentStage(stageNum);
                }
              }}
              disabled={!isAdminReview && !isModelMatch && stageNum > 1}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                currentStage === stageNum
                  ? 'bg-indigo-500 text-white shadow-md scale-105'
                  : isAdminReview || (isModelMatch && currentStage > stageNum)
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer border border-slate-700'
                  : 'bg-slate-900/50 text-slate-600 cursor-not-allowed'
              }`}
            >
              {stageNum === 1 ? "1. Archetype" : stageNum === 2 ? "2. Blueprint" : "3. Equations"}
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          STAGE 1: MODEL TYPE SELECTION (SIMPLIFIED WITH DROPDOWN & PREVIEW)
         ══════════════════════════════════════════════════════════════════════ */}
      {currentStage === 1 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="space-y-4"
        >
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
            
            {/* Dropdown Selector */}
            <div className="space-y-2">
              <label htmlFor="bar-model-select" className="block text-sm font-black text-slate-800">
                Select the type of Bar Model to use:
              </label>
              <div className="relative max-w-xl">
                <select
                  id="bar-model-select"
                  disabled={disabled}
                  value={selectedModel || ""}
                  onChange={(e) => handleSelectModel(e.target.value)}
                  className="w-full appearance-none bg-slate-50 border-2 border-slate-300 hover:border-indigo-500 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 rounded-2xl px-4 py-3 text-base font-bold text-slate-900 transition-all cursor-pointer shadow-xs pr-10"
                >
                  <option value="" disabled>-- Choose a Bar Model archetype --</option>
                  {modelOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label} ({opt.id === 'COMPARISON' ? 'Compare distinct entities' : opt.id === 'PART_WHOLE' ? 'Divide a total into parts' : 'Track transfers / change over time'})
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                  <ChevronDown className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Dedicated Model Preview Window (Clean header without redundant label) */}
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-indigo-500" />
                  Model Preview Window
                </span>
              </div>

              {selectedModel === 'COMPARISON' && <ComparisonPreview />}
              {selectedModel === 'PART_WHOLE' && <PartWholePreview />}
              {selectedModel === 'BEFORE_AFTER' && <BeforeAfterPreview />}
              {!selectedModel && <EmptyPreview />}
            </div>

            {/* Bottom Confirmation Bar */}
            <div className="pt-2">
              {!selectedModel ? (
                <button
                  type="button"
                  disabled
                  className="w-full py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Select a Bar Model to Confirm
                </button>
              ) : confirmationStatus === 'correct' ? (
                <motion.button
                  type="button"
                  initial={{ scale: 0.99 }}
                  animate={{ scale: 1 }}
                  onClick={handleProceedToStage2}
                  className="w-full py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer transition-all active:scale-[0.99] shadow-md ring-4 ring-emerald-100 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Confirm & Build Blueprint
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              ) : confirmationStatus === 'incorrect' ? (
                <motion.button
                  type="button"
                  initial={{ x: -4 }}
                  animate={{ x: [-4, 4, -4, 4, 0] }}
                  transition={{ duration: 0.3 }}
                  onClick={handleConfirmModel}
                  className="w-full py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider bg-rose-500 hover:bg-rose-600 text-white cursor-pointer transition-all active:scale-[0.99] shadow-sm flex items-center justify-center gap-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  Incorrect Model — Try Another Type
                </motion.button>
              ) : (
                <button
                  type="button"
                  disabled={disabled}
                  onClick={handleConfirmModel}
                  className="w-full py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white cursor-pointer transition-all active:scale-[0.99] shadow-sm flex items-center justify-center gap-2"
                >
                  Confirm Model Selection
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        </motion.div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          STAGE 2: BAR-BY-BAR MODEL BUILDER (INTERACTIVE)
         ══════════════════════════════════════════════════════════════════════ */}
      {currentStage === 2 && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="space-y-4"
        >
          {isBeforeAfter ? (
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
              {/* Top Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    Before & After Bar Model Canvas
                  </span>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    Two Time States
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAutoFillBeforeAfter}
                    className="px-2.5 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200 transition-all flex items-center gap-1 cursor-pointer"
                    title="Auto-fill with problem data for rapid review"
                  >
                    <Zap className="w-3.5 h-3.5 text-indigo-600" />
                    Auto-Fill
                  </button>
                  <button
                    type="button"
                    onClick={handleResetBeforeAfter}
                    className="px-2.5 py-1.5 text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-200 transition-all flex items-center gap-1 cursor-pointer"
                    title="Reset blueprint"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset
                  </button>
                </div>
              </div>

              {/* ══════════════════════════════════════════════════════════════
                  Section 1: BEFORE STATE (At First)
                 ══════════════════════════════════════════════════════════════ */}
              <div className="p-4 sm:p-5 bg-slate-50/70 border-2 border-slate-200 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">1</span>
                    Before State (At First)
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    Comparative Bars with Common Baseline
                  </span>
                </div>

                {/* Live Canvas Preview for Before State */}
                <div className="space-y-2">
                  {userBeforeBars.map((bar, idx) => {
                    return (
                      <div key={bar.id} className="flex items-center gap-2 sm:gap-3">
                        {/* Entity Name */}
                        <div className="w-20 sm:w-24 text-right shrink-0">
                          <span className="text-xs font-black uppercase tracking-wider text-slate-800 truncate block">
                            {bar.name || `Bar ${idx + 1}`}
                          </span>
                        </div>

                        {/* Bar Track with Baseline */}
                        <div className="flex-1 pl-3 border-l-4 border-indigo-500 border-dashed py-0.5">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 flex items-center h-11 bg-white rounded-xl border border-slate-200 p-1 shadow-xs overflow-visible relative">
                              {/* Base segment */}
                              <div 
                                style={{ width: `${bar.length || 50}%` }} 
                                className={`h-full rounded-lg flex items-center justify-center text-xs font-black text-white shadow-xs transition-all duration-150 px-2 truncate shrink-0 ${
                                  idx === 0 ? 'bg-indigo-600' : 'bg-indigo-500'
                                }`}
                              >
                                {bar.value || ""}
                              </div>

                              {/* Difference Segment / Bracket */}
                              {bar.hasDifference && (
                                bar.diffType === 'FEWER' ? (
                                  (() => {
                                    const cleanDiffNum = (bar.diffValue || "").replace(/[+\-]/g, '').trim();
                                    const isBottomBracket = (bar.bracketPosition || (idx > 0 ? 'bottom' : 'top')) === 'bottom';
                                    return (
                                      <div
                                        style={{ width: `${bar.diffLength || 20}%` }}
                                        className="relative h-full ml-1 flex flex-col justify-between items-center py-1 px-1 transition-all duration-150 overflow-visible select-none shrink-0"
                                      >
                                        <div
                                          className={`absolute right-0 w-0 border-r-2 border-dotted border-rose-400 pointer-events-none z-10 ${
                                            isBottomBracket ? '-top-6 bottom-0' : 'top-0 -bottom-6'
                                          }`}
                                        >
                                          <span className="absolute -top-1 -right-[3px] w-1.5 h-1.5 bg-rose-500 rounded-full" />
                                          <span className="absolute -bottom-1 -right-[3px] w-1.5 h-1.5 bg-rose-500 rounded-full" />
                                        </div>
                                        <div className={`absolute inset-0 bg-rose-50/20 rounded-lg pointer-events-none ${
                                          isBottomBracket ? 'border-b border-dashed border-rose-200' : 'border-t border-dashed border-rose-200'
                                        }`} />
                                        <div className="relative z-10 flex-1 flex items-center justify-center">
                                          <span className="text-[11px] font-black text-rose-700 font-mono tracking-tight px-1.5 py-0.2 bg-white/95 rounded border border-rose-200 shadow-2xs truncate max-w-full">
                                            {cleanDiffNum || "Diff"}
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })()
                                ) : (
                                  (() => {
                                    const segments = (bar.diffSegments && bar.diffSegments.length > 0)
                                      ? bar.diffSegments
                                      : [{ id: `${bar.id}-seg-1`, value: bar.diffValue, length: bar.diffLength || 20 }];
                                    const segColors = [
                                      'bg-emerald-500 border-emerald-400 text-white',
                                      'bg-teal-500 border-teal-400 text-white',
                                      'bg-emerald-600 border-emerald-500 text-white',
                                      'bg-cyan-600 border-cyan-500 text-white'
                                    ];
                                    return (
                                      <>
                                        {segments.map((seg, sIdx) => {
                                          const cleanVal = (seg.value || "").replace(/[+\-]/g, '').trim();
                                          const colorClass = segColors[sIdx % segColors.length];
                                          return (
                                            <div
                                              key={seg.id || sIdx}
                                              style={{ width: `${seg.length || 18}%` }}
                                              className={`h-full rounded-lg ml-1 px-2 flex items-center justify-center text-xs font-black shadow-xs border border-dashed transition-all duration-150 truncate shrink-0 ${colorClass}`}
                                              title={`Difference segment ${sIdx + 1}: ${cleanVal || '+ Diff'}`}
                                            >
                                              {cleanVal ? `+${cleanVal}` : `+Diff ${sIdx + 1}`}
                                            </div>
                                          );
                                        })}
                                      </>
                                    );
                                  })()
                                )
                              )}
                            </div>

                            {/* Collapse/Expand Arrow Tag */}
                            <button
                              type="button"
                              onClick={() => handleToggleCollapseBeforeBar(bar.id)}
                              className={`h-9 px-2 rounded-lg flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                                bar.isCollapsed
                                  ? 'bg-white hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200'
                                  : 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs'
                              }`}
                              title={bar.isCollapsed ? "Edit bar parameters" : "Collapse into bar height"}
                            >
                              {bar.isCollapsed ? (
                                <ChevronDown className="w-4 h-4 text-slate-500" />
                              ) : (
                                <ChevronUp className="w-4 h-4 text-indigo-600" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Parameters Editor for Before State */}
                {userBeforeBars.some(b => !b.isCollapsed) && (
                  <div className="space-y-3 pt-3 border-t-2 border-dashed border-slate-200 w-full">
                    {userBeforeBars.filter(b => !b.isCollapsed).map((bar) => (
                      <BarParametersEditor
                        key={bar.id}
                        bar={bar}
                        barIndex={userBeforeBars.findIndex(b => b.id === bar.id)}
                        entities={entities}
                        onUpdate={handleUpdateBeforeBar}
                        onToggleDiff={handleToggleBeforeDiff}
                        onAddDiffSegment={handleBeforeAddDiffSegment}
                        onUpdateDiffSegment={handleBeforeUpdateDiffSegment}
                        onRemoveDiffSegment={handleBeforeRemoveDiffSegment}
                        onCollapse={() => handleToggleCollapseBeforeBar(bar.id)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* ══════════════════════════════════════════════════════════════
                  Section 2: AFTER STATE (In the End)
                 ══════════════════════════════════════════════════════════════ */}
              <div className="p-4 sm:p-5 bg-slate-50/70 border-2 border-slate-200 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">2</span>
                    After State (In the End)
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700">
                    Resulting Quantities Aligned to Baseline
                  </span>
                </div>

                {/* Live Canvas Preview for After State */}
                <div className="space-y-2">
                  {userAfterBars.map((bar, idx) => (
                    <div key={bar.id} className="flex items-center gap-2 sm:gap-3">
                      {/* Entity Name */}
                      <div className="w-20 sm:w-24 text-right shrink-0">
                        <span className="text-xs font-black uppercase tracking-wider text-slate-800 truncate block">
                          {bar.name || `Bar ${idx + 1}`}
                        </span>
                      </div>

                      {/* Bar Track with Baseline */}
                      <div className="flex-1 pl-3 border-l-4 border-emerald-500 border-dashed py-0.5">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 flex items-center h-11 bg-white rounded-xl border border-slate-200 p-1 shadow-xs overflow-visible relative">
                            {/* Base segment */}
                            <div 
                              style={{ width: `${bar.length || 50}%` }} 
                              className="h-full rounded-lg flex items-center justify-center text-xs font-black text-white shadow-xs transition-all duration-150 px-2 truncate shrink-0 bg-emerald-600"
                            >
                              {bar.value || "1 unit"}
                            </div>

                            {/* Difference Segment (if student configured diff in After) */}
                            {bar.hasDifference && (
                              <div
                                style={{ width: `${bar.diffLength || 20}%` }}
                                className="h-full rounded-lg ml-1 px-2 flex items-center justify-center text-xs font-black shadow-xs border border-dashed transition-all duration-150 truncate shrink-0 bg-teal-500 text-white"
                              >
                                +{bar.diffValue || "Diff"}
                              </div>
                            )}
                          </div>

                          {/* Collapse/Expand Arrow Tag */}
                          <button
                            type="button"
                            onClick={() => handleToggleCollapseAfterBar(bar.id)}
                            className={`h-9 px-2 rounded-lg flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                              bar.isCollapsed
                                ? 'bg-white hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 border border-slate-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs'
                            }`}
                            title={bar.isCollapsed ? "Edit bar parameters" : "Collapse into bar height"}
                          >
                            {bar.isCollapsed ? (
                              <ChevronDown className="w-4 h-4 text-slate-500" />
                            ) : (
                              <ChevronUp className="w-4 h-4 text-emerald-600" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Parameters Editor for After State */}
                {userAfterBars.some(b => !b.isCollapsed) && (
                  <div className="space-y-3 pt-3 border-t-2 border-dashed border-slate-200 w-full">
                    {userAfterBars.filter(b => !b.isCollapsed).map((bar) => (
                      <BarParametersEditor
                        key={bar.id}
                        bar={bar}
                        barIndex={userAfterBars.findIndex(b => b.id === bar.id)}
                        entities={entities}
                        onUpdate={handleUpdateAfterBar}
                        onToggleDiff={handleToggleAfterDiff}
                        onAddDiffSegment={handleAfterAddDiffSegment}
                        onUpdateDiffSegment={handleAfterUpdateDiffSegment}
                        onRemoveDiffSegment={handleAfterRemoveDiffSegment}
                        onCollapse={() => handleToggleCollapseAfterBar(bar.id)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Verification Footer Banner */}
              <div className="pt-2">
                {stage2Status === 'correct' ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-3 animate-in fade-in">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div>
                        <div className="text-xs font-black text-emerald-950 uppercase tracking-wide">
                          Model Blueprint Verified!
                        </div>
                        <p className="text-xs text-emerald-800 font-semibold">
                          Both Before and After states correctly model the transfer. Proceed to solve the equations!
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleProceedToStage3}
                      className="w-full py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer transition-all active:scale-[0.99] shadow-sm flex items-center justify-center gap-2"
                    >
                      Proceed to Step 3: Equations
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : stage2Status === 'incorrect' ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
                      <div className="flex items-center gap-2.5">
                        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        <div>
                          <div className="text-xs font-black text-rose-950 uppercase tracking-wide">
                            Model Blueprint Error
                          </div>
                          <p className="text-xs text-rose-800 font-semibold mt-0.5">
                            {stage2ErrorMsg || "Incomplete Model — Configure Before & After states and transfer amount."}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowModelSolution(prev => !prev)}
                        className="px-3.5 py-1.5 bg-white hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-black border border-rose-300 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs shrink-0"
                      >
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>{showModelSolution ? "Hide Model Solution" : "View Model Solution"}</span>
                      </button>
                    </div>

                    {showModelSolution && (
                      <div className="animate-in fade-in slide-in-from-top-2">
                        <ModelSolutionBarModel config={config} />
                      </div>
                    )}

                    <button
                      type="button"
                      disabled={disabled}
                      onClick={handleVerifyStage2}
                      className="w-full py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider bg-rose-600 hover:bg-rose-700 text-white cursor-pointer transition-all active:scale-[0.99] shadow-sm flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Check & Verify Again
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={handleVerifyStage2}
                    className="w-full py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white cursor-pointer transition-all active:scale-[0.99] shadow-sm flex items-center justify-center gap-2"
                  >
                    Check & Verify Model Blueprint
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : isPartWhole ? (
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
              {/* Top Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    Part-Whole Bar Model Canvas
                  </span>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    Single Partitioned Bar
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAutoFillParts}
                    className="px-2.5 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200 transition-all flex items-center gap-1 cursor-pointer"
                    title="Auto-fill parts with problem data for rapid review"
                  >
                    <Zap className="w-3.5 h-3.5 text-indigo-600" />
                    Auto-Fill
                  </button>
                  {userParts.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearParts}
                      className="px-2.5 py-1.5 text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-200 transition-all flex items-center gap-1 cursor-pointer"
                      title="Clear all parts"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Live Canvas Preview */}
              <div className="p-5 sm:p-6 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-4">
                {/* Whole Bracket */}
                <div className="space-y-1 max-w-xl mx-auto">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xs font-black text-slate-700 uppercase">
                      {config.whole?.label || "Target Whole"}:
                    </span>
                    <input
                      type="text"
                      value={userWhole}
                      onChange={(e) => {
                        setUserWhole(e.target.value);
                        setStage2Status('idle');
                        setStage2ErrorMsg(null);
                      }}
                      placeholder="e.g. 45,000 or ?"
                      className="w-36 px-3 py-1 text-center font-mono font-bold text-xs bg-white border-2 border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none"
                    />
                  </div>
                  <div className="w-full h-3 border-x-2 border-t-2 border-slate-700 rounded-t-md mx-auto" />
                </div>

                {/* The Partitioned Bar */}
                {userParts.length > 0 ? (
                  <div className="flex h-14 w-full rounded-2xl overflow-hidden border-2 border-slate-300 shadow-sm bg-white">
                    {userParts.map((p, idx) => {
                      const isShortfall = p.isShortfall;
                      const bgClass = isShortfall 
                        ? "bg-slate-100 border-2 border-dashed border-slate-400 text-slate-700" 
                        : idx === 0 
                          ? "bg-blue-500 text-white border-r-2 border-white" 
                          : "bg-amber-500 text-white border-r-2 border-white";

                      return (
                        <div
                          key={p.id}
                          style={{ width: `${p.length || 33}%` }}
                          className={`flex flex-col items-center justify-center px-2 py-1 text-center font-sans transition-all ${bgClass}`}
                        >
                          <span className="text-[11px] font-black uppercase tracking-tight truncate w-full">
                            {p.name || `Part ${idx + 1}`}
                          </span>
                          <span className="text-xs font-bold font-mono tracking-tight truncate w-full">
                            {p.value || "?"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs font-bold text-slate-400 border-2 border-dashed border-slate-300 rounded-2xl">
                    No parts added yet. Click "+ Add Part to Bar" below to partition the whole!
                  </div>
                )}
              </div>

              {/* Parts Parameters Editor */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-600">
                    Parts of the Whole ({userParts.length})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddPart}
                    className="px-3 py-1.5 text-xs font-black text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Part to Bar
                  </button>
                </div>

                {userParts.map((part, idx) => (
                  <div key={part.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                      <div className="sm:col-span-4 space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                          Part Name / Entity
                        </label>
                        <input
                          type="text"
                          value={part.name}
                          onChange={(e) => handleUpdatePart(part.id, 'name', e.target.value)}
                          placeholder={`e.g. ${idx === 0 ? 'Shanti' : idx === 1 ? 'Kumar' : 'Shortfall'}`}
                          className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-3 space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                          Value / Quantity
                        </label>
                        <input
                          type="text"
                          value={part.value}
                          onChange={(e) => handleUpdatePart(part.id, 'value', e.target.value)}
                          placeholder="e.g. 15,000 or ?"
                          className="w-full px-3 py-2 text-xs font-mono font-bold text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-3 flex items-center gap-2 pt-4">
                        <button
                          type="button"
                          onClick={() => handleUpdatePart(part.id, 'isShortfall', !part.isShortfall)}
                          className={`px-3 py-2 rounded-xl text-xs font-black transition-all border cursor-pointer w-full flex items-center justify-center gap-1.5 ${
                            part.isShortfall
                              ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-2xs'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {part.isShortfall ? '⚠ Shortfall Segment' : 'Regular Part'}
                        </button>
                      </div>

                      <div className="sm:col-span-2 flex items-center justify-end pt-4">
                        <button
                          type="button"
                          onClick={() => handleDeletePart(part.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-transparent hover:border-rose-200 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-1 border-t border-slate-200/60">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase shrink-0">
                        <span>Segment Size:</span>
                        <EditablePercentBadge
                          value={part.length}
                          onChange={(val) => handleUpdatePart(part.id, 'length', val)}
                          min={5}
                          max={90}
                        />
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="90"
                        value={part.length}
                        onChange={(e) => handleUpdatePart(part.id, 'length', Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Status / Verify */}
              <div className="pt-2 border-t border-slate-100">
                {stage2Status === 'correct' ? (
                  <motion.button
                    type="button"
                    initial={{ scale: 0.99 }}
                    animate={{ scale: 1 }}
                    onClick={handleProceedToStage3}
                    className="w-full py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer transition-all active:scale-[0.99] shadow-md ring-4 ring-emerald-100 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Part-Whole Model Verified — Solve Equations
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                ) : stage2Status === 'incorrect' ? (
                  <div className="space-y-3">
                    <div className="p-4 bg-rose-50 rounded-2xl border-2 border-rose-200 flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
                      <div className="flex items-start gap-2.5 max-w-lg">
                        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-black text-rose-950 uppercase tracking-wide">
                            Model Blueprint Error
                          </div>
                          <p className="text-xs text-rose-800 font-semibold mt-0.5">
                            {stage2ErrorMsg || "Incomplete Model — Build all parts and whole target."}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowModelSolution(prev => !prev)}
                        className="px-3.5 py-1.5 bg-white hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-black border border-rose-300 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                      >
                        <span>💡</span>
                        <span>{showModelSolution ? "Hide Model Solution" : "View Model Solution"}</span>
                      </button>
                    </div>

                    {showModelSolution && (
                      <div className="animate-in fade-in slide-in-from-top-2">
                        <ModelSolutionBarModel config={config} />
                      </div>
                    )}

                    <button
                      type="button"
                      disabled={disabled}
                      onClick={handleVerifyStage2}
                      className="w-full py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider bg-rose-600 hover:bg-rose-700 text-white cursor-pointer transition-all active:scale-[0.99] shadow-sm flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Check & Verify Again
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={handleVerifyStage2}
                    className="w-full py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white cursor-pointer transition-all active:scale-[0.99] shadow-sm flex items-center justify-center gap-2"
                  >
                    Check & Verify Part-Whole Model
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
            
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  Comparative Bar Model Canvas
                </span>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  Aligned Baseline
                </span>
              </div>

              <div className="flex items-center gap-2">
                {userBars.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const next = !hasCombinedTotal;
                      setHasCombinedTotal(next);
                      if (!next) {
                        setCombinedTotalValue('');
                      } else if (config.total?.isTarget || target?.type === 'TOTAL') {
                        setCombinedTotalValue('?');
                      }
                      setStage2Status('idle');
                      setStage2ErrorMsg(null);
                    }}
                    className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded-xl border transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer ${
                      hasCombinedTotal 
                        ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100' 
                        : 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                    }`}
                    title={hasCombinedTotal ? "Remove combined total bracket" : "Add combined total bracket connecting all bars"}
                  >
                    {hasCombinedTotal ? (
                      <>
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                        <span>Remove Total</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5 text-amber-700" />
                        <span>+ Combined Total</span>
                      </>
                    )}
                  </button>
                )}

                {isAdminReview && (
                  <>
                    <button
                      type="button"
                      onClick={handleAutoFillBars}
                      className="px-2.5 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200 transition-all flex items-center gap-1 cursor-pointer"
                      title="Auto-fill bars with problem data for rapid review"
                    >
                      <Zap className="w-3.5 h-3.5 text-indigo-600" />
                      Auto-Fill
                    </button>
                    {userBars.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearBars}
                        className="px-2.5 py-1.5 text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-200 transition-all flex items-center gap-1 cursor-pointer"
                        title="Clear all bars"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Clear
                      </button>
                    )}
                  </>
                )}

                <button
                  type="button"
                  onClick={handleAddBar}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Build Bar
                </button>
              </div>
            </div>

            {/* Empty Canvas State */}
            {userBars.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="text-sm font-black text-slate-800">Your Bar Model Canvas is Empty</h5>
                  <p className="text-xs text-slate-500 font-semibold max-w-sm mt-0.5">
                    Click "+ Build Bar" above to start constructing your model bar by bar.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddBar}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Build First Bar
                </button>
              </div>
            ) : (
              /* Unified Comparative Bar Canvas: Compact live model on top, full-width parameter editor below */
              <div className="p-4 sm:p-5 bg-slate-50/70 border-2 border-slate-200 rounded-2xl space-y-4 w-full">
                {/* ══ 1. The Live Visual Bars Stack with Side Total Bracket ══ */}
                <div className="flex items-center gap-2 sm:gap-3 w-full">
                  <div className="flex-1 space-y-2">
                {userBars.map((bar, idx) => (
                  <div key={bar.id} className="transition-all duration-200">
                    
                    {/* ══ The Single-Line Bar Row (Matches the exact height of the bar!) ══ */}
                    <div className="flex items-center gap-2 sm:gap-3">
                      {/* Left of Starting Line: Entity Label */}
                      <div className="w-20 sm:w-24 text-right shrink-0">
                        <span className="text-xs font-black uppercase tracking-wider text-slate-800 truncate block">
                          {bar.name || `Bar ${idx + 1}`}
                        </span>
                      </div>

                      {/* Vertical Starting Line & Bar Track */}
                      <div className="flex-1 pl-3 border-l-4 border-indigo-500 border-dashed py-0.5">
                        <div className="flex items-center gap-2">
                          {/* The Bar Track */}
                          <div className="flex-1 flex items-center h-11 bg-white rounded-xl border border-slate-200 p-1 shadow-xs overflow-visible relative">
                            {/* Base Solid Segment: Internally empty if value is not filled */}
                            <div
                              style={{ width: `${bar.length}%` }}
                              className={`h-full rounded-lg flex items-center justify-center text-xs font-black text-white shadow-xs transition-all duration-150 px-2 truncate shrink-0 ${
                                idx === 0 ? 'bg-indigo-600' : idx === 1 ? 'bg-indigo-500' : 'bg-indigo-400'
                              }`}
                            >
                              {bar.value || ""}
                            </div>

                            {/* Difference Segment / Bracket */}
                            {bar.hasDifference && (
                              bar.diffType === 'FEWER' ? (
                                /* WHEN LESS / FEWER: Open shortage gap with bracket and unsigned numeric value */
                                (() => {
                                  const cleanDiffNum = (bar.diffValue || "").replace(/[+\-]/g, '').trim();
                                  const isBottomBracket = (bar.bracketPosition || (idx > 0 ? 'bottom' : 'top')) === 'bottom';
                                  return (
                                    <div
                                      style={{ width: `${bar.diffLength}%` }}
                                      className="relative h-full ml-1 flex flex-col justify-between items-center py-1 px-1 transition-all duration-150 overflow-visible select-none shrink-0"
                                      title="Difference bracket showing comparison with reference"
                                    >
                                      {/* Vertical dotted alignment reference line reaching down from the longer bar above (or to bar below) */}
                                      <div
                                        className={`absolute right-0 w-0 border-r-2 border-dotted border-rose-400 pointer-events-none z-10 ${
                                          isBottomBracket ? '-top-6 bottom-0' : 'top-0 -bottom-6'
                                        }`}
                                      >
                                        <span className="absolute -top-1 -right-[3px] w-1.5 h-1.5 bg-rose-500 rounded-full" />
                                        <span className="absolute -bottom-1 -right-[3px] w-1.5 h-1.5 bg-rose-500 rounded-full" />
                                      </div>

                                      {/* Subtle open gap floor/ceiling guide */}
                                      <div className={`absolute inset-0 bg-rose-50/20 rounded-lg pointer-events-none ${
                                        isBottomBracket ? 'border-b border-dashed border-rose-200' : 'border-t border-dashed border-rose-200'
                                      }`} />

                                      {isBottomBracket ? (
                                        <>
                                          {/* Unsigned Number (strictly numeric, no + or - sign) above bottom bracket */}
                                          <div className="relative z-10 flex-1 flex items-center justify-center">
                                            <span className="text-[11px] font-black text-rose-700 font-mono tracking-tight px-1.5 py-0.2 bg-white/95 rounded border border-rose-200 shadow-2xs truncate max-w-full">
                                              {cleanDiffNum || "5,000"}
                                            </span>
                                          </div>

                                          {/* Bottom Bracket: Horizontal line at bottom with upward ticks on left and right, and center downward cusp */}
                                          <div className="relative z-10 w-full h-2 border-x-2 border-b-2 border-rose-500 rounded-b-md">
                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-x-3 border-x-transparent border-t-3 border-t-rose-500" />
                                          </div>
                                        </>
                                      ) : (
                                        <>
                                          {/* Top Bracket: Horizontal line at top with downward ticks on left and right, and center upward cusp */}
                                          <div className="relative z-10 w-full h-2 border-x-2 border-t-2 border-rose-500 rounded-t-md">
                                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-x-3 border-x-transparent border-b-3 border-b-rose-500" />
                                          </div>

                                          {/* Unsigned Number (strictly numeric, no + or - sign) below top bracket */}
                                          <div className="relative z-10 flex-1 flex items-center justify-center">
                                            <span className="text-[11px] font-black text-rose-700 font-mono tracking-tight px-1.5 py-0.2 bg-white/95 rounded border border-rose-200 shadow-2xs truncate max-w-full">
                                              {cleanDiffNum || "5,000"}
                                            </span>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  );
                                })()
                              ) : (
                                /* WHEN MORE: Solid green protruding extra difference section (Single or Multi-Segment) */
                                (() => {
                                  const segments = (bar.diffSegments && bar.diffSegments.length > 0)
                                    ? bar.diffSegments
                                    : [{ id: `${bar.id}-seg-1`, value: bar.diffValue, length: bar.diffLength || 20 }];

                                  const segColors = [
                                    'bg-emerald-500 border-emerald-400 text-white',
                                    'bg-teal-500 border-teal-400 text-white',
                                    'bg-emerald-600 border-emerald-500 text-white',
                                    'bg-cyan-600 border-cyan-500 text-white'
                                  ];

                                  return (
                                    <>
                                      {segments.map((seg, sIdx) => {
                                        const cleanVal = (seg.value || "").replace(/[+\-]/g, '').trim();
                                        const colorClass = segColors[sIdx % segColors.length];
                                        return (
                                          <div
                                            key={seg.id || sIdx}
                                            style={{ width: `${seg.length || 18}%` }}
                                            className={`h-full rounded-lg ml-1 px-2 flex items-center justify-center text-xs font-black shadow-xs border border-dashed transition-all duration-150 truncate shrink-0 ${colorClass}`}
                                            title={`Difference segment ${sIdx + 1}: ${cleanVal || '+ Diff'}`}
                                          >
                                            {cleanVal ? `+${cleanVal}` : `+Diff ${sIdx + 1}`}
                                          </div>
                                        );
                                      })}
                                    </>
                                  );
                                })()
                              )
                            )}
                          </div>

                          {/* Collapse/Expand Arrow Tag right at the end of the bar */}
                          <button
                            type="button"
                            onClick={() => handleToggleCollapseBar(bar.id)}
                            className={`h-9 px-2 rounded-lg flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                              bar.isCollapsed
                                ? 'bg-white hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200'
                                : 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs'
                            }`}
                            title={bar.isCollapsed ? "Edit bar parameters" : "Collapse into bar height"}
                          >
                            {bar.isCollapsed ? (
                              <ChevronDown className="w-4 h-4 text-slate-500" />
                            ) : (
                              <ChevronUp className="w-4 h-4 text-indigo-600" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                                      </div>
                ))}
              </div>

              {/* Right-side Combined Total Bracket (added by student!) */}
                  {hasCombinedTotal && (
                    <div className="flex items-center gap-1.5 shrink-0 pl-1 py-1 animate-in fade-in duration-150">
                      <div className="w-7 sm:w-8 h-28 max-h-full py-1 text-slate-400 shrink-0">
                        <CurlyBracket />
                      </div>
                      <div className="flex flex-col items-start gap-1 p-2.5 bg-white rounded-2xl border-2 border-amber-300 shadow-sm shrink-0">
                        <div className="flex items-center justify-between w-full gap-2">
                          <span className="text-[10px] font-black text-amber-900 uppercase tracking-widest">
                            {config.total?.label || "Total"}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setHasCombinedTotal(false);
                              setCombinedTotalValue('');
                              setStage2Status('idle');
                              setStage2ErrorMsg(null);
                            }}
                            className="text-slate-400 hover:text-rose-600 transition-colors p-0.5 rounded-full cursor-pointer"
                            title="Remove Total Bracket"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={combinedTotalValue}
                          onChange={(e) => {
                            setCombinedTotalValue(e.target.value);
                            setStage2Status('idle');
                            setStage2ErrorMsg(null);
                          }}
                          placeholder={config.total?.isTarget || target?.type === 'TOTAL' ? '?' : 'Enter total'}
                          className="w-24 sm:w-28 text-xs font-black font-mono text-indigo-700 bg-amber-50/50 border border-amber-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        {config?.itemName && (
                          <span className="text-[9px] font-bold text-slate-400 uppercase truncate max-w-[100px]">
                            {config.itemName}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

            {/* ══ 2. Full-Width Responsive Parameter Editors for Expanded Bars ══ */}
            {userBars.some(b => !b.isCollapsed) && (
              <div className="space-y-3 pt-3 border-t-2 border-dashed border-slate-200 w-full">
                {userBars.filter(b => !b.isCollapsed).map((bar) => (
                  <BarParametersEditor
                    key={bar.id}
                    bar={bar}
                    barIndex={userBars.findIndex(b => b.id === bar.id)}
                    entities={entities}
                    onUpdate={handleUpdateBar}
                    onToggleDiff={handleToggleDifference}
                    onAddDiffSegment={handleAddDiffSegment}
                    onUpdateDiffSegment={handleUpdateDiffSegment}
                    onRemoveDiffSegment={handleRemoveDiffSegment}
                    onDelete={handleDeleteBar}
                    onCollapse={() => handleToggleCollapseBar(bar.id)}
                  />
                ))}
              </div>
            )}
              </div>
            )}
            {target.type === 'BAR' && userBars.length > 0 && (
              <div className="flex items-center justify-between bg-indigo-50/80 p-3.5 rounded-2xl border border-indigo-200 text-xs">
                <span className="font-bold text-indigo-950">Target to Solve:</span>
                <span className="font-black text-indigo-800 bg-indigo-200 px-3 py-1 rounded-xl">
                  Find {target.label || 'Entity'}'s Amount
                </span>
              </div>
            )}
            {target.type === 'DIFFERENCE' && userBars.length > 0 && (
              <div className="flex items-center justify-between bg-rose-50/80 p-3.5 rounded-2xl border border-rose-200 text-xs">
                <span className="font-bold text-rose-950">Target to Solve:</span>
                <span className="font-black text-rose-800 bg-rose-200 px-3 py-1 rounded-xl">
                  Find Difference
                </span>
              </div>
            )}

            {/* Bottom Confirmation Bar */}
            <div className="pt-2">
              {userBars.length === 0 ? (
                <button
                  type="button"
                  disabled
                  className="w-full py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Build at least one bar to check
                </button>
              ) : stage2Status === 'correct' ? (
                <motion.button
                  type="button"
                  initial={{ scale: 0.99 }}
                  animate={{ scale: 1 }}
                  onClick={handleProceedToStage3}
                  className="w-full py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer transition-all active:scale-[0.99] shadow-md ring-4 ring-emerald-100 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Bar Model Verified — Solve Equations
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              ) : stage2Status === 'incorrect' ? (
                <div className="space-y-3">
                  <div className="p-4 bg-rose-50 rounded-2xl border-2 border-rose-200 flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
                    <div className="flex items-start gap-2.5 max-w-lg">
                      <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-black text-rose-950 uppercase tracking-wide">
                          Model Blueprint Error
                        </div>
                        <p className="text-xs text-rose-800 font-semibold mt-0.5">
                          {stage2ErrorMsg || "Incomplete Model — Build all entity bars and labels."}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowModelSolution(prev => !prev)}
                      className="px-3.5 py-1.5 bg-white hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-black border border-rose-300 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <span>💡</span>
                      <span>{showModelSolution ? "Hide Model Solution" : "View Model Solution"}</span>
                    </button>
                  </div>

                  {/* Expandable Model Solution Bar Model */}
                  {showModelSolution && (
                    <div className="animate-in fade-in slide-in-from-top-2">
                      <ModelSolutionBarModel config={config} />
                    </div>
                  )}

                  {/* Re-verify Button */}
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={handleVerifyStage2}
                    className="w-full py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider bg-rose-600 hover:bg-rose-700 text-white cursor-pointer transition-all active:scale-[0.99] shadow-sm flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Check & Verify Again
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={disabled}
                  onClick={handleVerifyStage2}
                  className="w-full py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white cursor-pointer transition-all active:scale-[0.99] shadow-sm flex items-center justify-center gap-2"
                >
                  Check & Verify Bar Model
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
          )}
        </motion.div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          STAGE 3: STEP-BY-STEP CALCULATION WORKSPACE (MultiStepInput)
         ══════════════════════════════════════════════════════════════════════ */}
      {currentStage === 3 && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="space-y-6"
        >
          {/* Visual Bar Model Reference (Student's verified model) */}
          {isBeforeAfter ? (
            userBeforeBars.length > 0 ? (
              <CompactBarCanvas 
                isBeforeAfter={true}
                beforeBars={userBeforeBars}
                afterBars={userAfterBars}
                transfer={userTransfer}
                itemName={config.itemName || "units"}
                onEdit={() => setCurrentStage(2)} 
              />
            ) : (
              <ModelSolutionBarModel config={config} title="Reference Before & After Model Blueprint" />
            )
          ) : isPartWhole ? (
            userParts.length > 0 ? (
              <CompactBarCanvas 
                isPartWhole={true}
                parts={userParts}
                whole={{ label: config.whole?.label || 'Target', value: userWhole }}
                itemName={config.itemName || "units"}
                onEdit={() => setCurrentStage(2)} 
              />
            ) : (
              <ModelSolutionBarModel config={config} title="Reference Part-Whole Model Blueprint" />
            )
          ) : (
            userBars.length > 0 ? (
              <CompactBarCanvas 
                bars={userBars} 
                target={target} 
                itemName={config.itemName || "Total"} 
                total={hasCombinedTotal ? { label: config.total?.label || 'Total', value: combinedTotalValue, displayValue: combinedTotalValue } : null}
                onEdit={() => setCurrentStage(2)} 
              />
            ) : (
              <ModelSolutionBarModel config={config} title="Reference Bar Model Blueprint" />
            )
          )}

          {/* Canonical Structured MultiStepInput */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                Solve Multi-Step Equations
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                Use your verified bar model diagram above to solve each step
              </span>
            </div>

            <MultiStepInput
              steps={calculationSteps}
              onSubmit={onSubmit}
              disabled={disabled}
              level={level}
            />
          </div>
        </motion.div>
      )}

    </div>
  );
}
