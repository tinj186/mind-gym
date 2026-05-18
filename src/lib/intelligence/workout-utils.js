/**
 * Universal Normalizer with Diagnostic Telemetry Logs
 */
export function normalizeQuestionData(raw) {
  console.log("🔍 [TELEMETRY START] Ingesting raw question row:", raw);
  if (!raw) {
    console.warn("⚠️ [TELEMETRY] Ingested raw object is empty or null");
    return null;
  }

  // A. Parse modelData if it's a string (common Prisma/DB behavior)
  let modelData = raw.modelData;
  if (typeof modelData === 'string') {
    try {
      // JSON Anchor: Extract only the content between curly braces to ignore AI conversational chatter
      const start = modelData.indexOf('{');
      const end = modelData.lastIndexOf('}');
      const jsonString = (start !== -1 && end !== -1) ? modelData.substring(start, end + 1) : modelData;
      modelData = JSON.parse(jsonString.replace(/```json|```/g, '').trim());
      console.log("✅ [TELEMETRY] Successfully parsed modelData JSON object:", modelData);
    } catch (e) {
      console.error("❌ [TELEMETRY] FATAL JSON PARSE ERROR. Response was:", modelData, e);
      modelData = {};
    }
  }

  // B. Universal Path Mapping: Locate the visual engine
  let visualEngine = modelData?.visualEngine || raw.visualEngine || 
                      (modelData?.type ? { componentToRender: modelData.type, componentData: modelData } : null) ||
                      { componentToRender: "NONE" };

  if (visualEngine.componentToRender) {
    const originalType = visualEngine.componentToRender;
    visualEngine.componentToRender = visualEngine.componentToRender.toUpperCase().replace(/\s/g, '_');
    console.log(`🔄 [TELEMETRY] Standardized component type from '${originalType}' to '${visualEngine.componentToRender}'`);
  }

  // C. Extract Question Text and Support Alternate Structure Fallbacks
  // Priority: 1. content.questionText (Blueprint) -> 2. questionText (Root) -> 3. raw.questionText (DB)
  const questionText = modelData?.content?.questionText || modelData?.questionText || modelData?.content?.question || modelData?.question || raw.questionText || "Problem data missing";
  const solutionText = modelData?.content?.solutionSteps || modelData?.content?.solution || modelData?.solutionSteps || modelData?.solution || "No solution provided";
  const hintText = modelData?.content?.hint || modelData?.hint || "No hint provided";

  console.log("📊 [TELEMETRY MIDDLE] Text Extraction Mapping results:", { questionText, solutionText, hintText });

  // Debug: Temporarily inject the raw componentData payload into the question text for troubleshooting
  const debugSuffix = ` [DATA: ${moneyItemsToString(visualEngine?.componentData)}]`;

  return {
    ...raw,
    modelData,
    visualEngine,
    questionText: questionText + debugSuffix,
    question: questionText + debugSuffix,
    solution: solutionText,
    hint: hintText
  };
}

function moneyItemsToString(data) {
  const items = data?.items || data?.numbers || [];
  return items.length > 0 ? items.join(', ') : "EMPTY";
}

export function deriveVisualProps(normalized) {
  const modelData = normalized?.modelData || {};
  const componentData = normalized?.visualEngine?.componentData || {};
  
  // ✅ FIX: Declare the componentType variable from the normalized object path
  const componentType = normalized?.visualEngine?.componentToRender || "";

  const itemsLength = (componentData.items?.length || componentData.numbers?.length || 0);

  // Safe Currency Parsing: strip non-numeric symbols if total is a financial string (e.g., "$2.70" -> 2.7)
  const rawTotal = componentData.total;
  let parsedTotal = 0;
  
  if (typeof rawTotal === 'number') {
    parsedTotal = rawTotal;
  } else if (rawTotal) {
    const cleaned = String(rawTotal).replace(/[^0-9.]/g, '');
    parsedTotal = parseFloat(cleaned) || 0;
  }

  // If component type is SINGAPORE_MONEY, totalItems must represent the integer COUNT of assets, 
  // never a monetary decimal value like 2.7 which causes layout RangeErrors.
  let totalItemsCount = parsedTotal;
  if (componentType === 'SINGAPORE_MONEY' || componentType === 'NUMBER_CARDS' || String(rawTotal).includes('$') || String(rawTotal).includes('¢')) {
    totalItemsCount = itemsLength;
  } else if (totalItemsCount <= 0 || isNaN(totalItemsCount)) {
    totalItemsCount = itemsLength || 0;
  }

  // Force absolute integer representation
  totalItemsCount = Math.floor(totalItemsCount);

  const resultingProps = {
    totalItems: totalItemsCount,
    icon: componentData.emoji || componentData.icon || modelData.icon || '🎈',
    mode: componentData.mode || modelData.mode || 'GROUPING',
    expectedGroups: componentData.numGroups || componentData.groups || modelData.numGroups,
    targetSize: componentData.itemsPerGroup || componentData.size || modelData.targetGroupSize || 0
  };

  return resultingProps;
}
