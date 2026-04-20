export interface BarSegment {
  id: string;
  value: number; // Relative width/units
  label?: string; // e.g., "30" or "?"
  isUnknown?: boolean;
  color?: string;
}

export interface BarRow {
  id: string;
  title: string; // e.g., "Ali", "Total"
  segments: BarSegment[];
}

export interface ComparisonBracket {
  id: string;
  fromBarId: string;
  toBarId: string;
  differenceLabel: string;
}

export function generateId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}`;
}

export function serializeModel(rows: BarRow[], brackets: ComparisonBracket[], questionText: string): string {
  const modelDescription = rows.map(row => {
    const totalUnits = row.segments.reduce((acc, s) => acc + s.value, 0);
    const segmentDetails = row.segments.map(s => 
      s.isUnknown ? `[ID: ${s.id}, ?]` : `[ID: ${s.id}, label: ${s.label || 'none'}, value: ${s.value}]`
    ).join(", ");
    
    return `Row "${row.title}" (ID: ${row.id}): ${totalUnits} units total, consisting of: ${segmentDetails}`;
  }).join(" | ");

  const bracketDescription = brackets.map(b => {
    const fromRow = rows.find(r => r.id === b.fromBarId);
    const toRow = rows.find(r => r.id === b.toBarId);
    const fromVal = fromRow?.segments.reduce((acc, s) => acc + s.value, 0) || 0;
    const toVal = toRow?.segments.reduce((acc, s) => acc + s.value, 0) || 0;
    const diff = Math.abs(fromVal - toVal);
    return `Comparison (ID: ${b.id}): The difference between Row ${b.fromBarId} and Row ${b.toBarId} is "${diff}"`;
  }).join(" | ");

  return `Question: ${questionText} | Model State: ${modelDescription}. ${bracketDescription}`;
}
