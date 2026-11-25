import React from 'react';

/**
 * FractionText
 * Renders inline mixed numbers (e.g. "4 2/3", "Y 5/X", "? 1/4") and fractions (e.g. "53/X", "19/5", "?/7")
 * as stacked vertical fractions while leaving normal prose, units (km/h), and spaced division ("19 / 5") untouched.
 */
const FRACTION_TOKEN_RE =
  /(?:^|(?<=[\s(=,+\-*×÷]))(?:(\d+|[A-Z]|\?)\s+)?(\d+|[A-Z]|\?)\/(\d+|[A-Z]|\?)(?=$|[\s).,;!?=+\-*×÷])/g;

export default function FractionText({ text }) {
  if (text === null || text === undefined) return null;
  const str = String(text);

  const nodes = [];
  let lastIndex = 0;
  let match;
  FRACTION_TOKEN_RE.lastIndex = 0;

  while ((match = FRACTION_TOKEN_RE.exec(str)) !== null) {
    const [full, whole, num, den] = match;
    if (match.index > lastIndex) {
      nodes.push(str.slice(lastIndex, match.index));
    }

    nodes.push(
      <span
        key={`${match.index}-${full}`}
        className="inline-flex items-center align-middle gap-1 mx-0.5"
      >
        {whole && <span className="font-black leading-none">{whole}</span>}
        <span className="inline-flex flex-col items-center justify-center leading-none text-[0.82em] align-middle">
          <span className="px-1 pb-[2px] border-b-2 border-current font-black">{num}</span>
          <span className="px-1 pt-[2px] font-black">{den}</span>
        </span>
      </span>
    );

    lastIndex = match.index + full.length;
  }

  if (lastIndex < str.length) {
    nodes.push(str.slice(lastIndex));
  }

  return <>{nodes.length > 0 ? nodes : str}</>;
}
