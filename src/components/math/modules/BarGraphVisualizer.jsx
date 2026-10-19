import React from 'react';

const DEFAULT_COLORS = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#f43f5e', // rose
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#6366f1'  // indigo
];

export default function BarGraphVisualizer({ data: inputData, hideCardStyles = false }) {
  if (!inputData) return null;

  const {
    title = '',
    xAxisLabel = '',
    yAxisLabel = '',
    data = [],
    scaleStep = 10,
    orientation = 'vertical',
    showGridLines = true,
    missingBar = '',
    maxScale: explicitMaxScale = null,
    showScaleNumbers = true
  } = inputData;

  const isHorizontal = String(orientation).toLowerCase() === 'horizontal';

  // Calculate maximum value to determine scale range
  const rawMaxVal = Math.max(...data.map(d => (d.category === missingBar ? 0 : Number(d.value) || 0)), 10);
  const step = Math.max(1, Number(scaleStep) || 10);
  
  // Choose upper limit as a clean multiple of scaleStep above rawMaxVal
  let maxVal = explicitMaxScale ? Number(explicitMaxScale) : Math.ceil((rawMaxVal + step * 0.5) / step) * step;
  if (maxVal < step * 2) maxVal = step * 2;

  // Generate tick values from 0 up to maxVal
  const ticks = [];
  for (let val = 0; val <= maxVal; val += step) {
    ticks.push(val);
  }

  // Dimensions for SVG
  const width = 560;
  const height = 360;

  const containerStyle = hideCardStyles
    ? "w-full flex flex-col items-center justify-center space-y-3 bg-transparent p-0 border-0 shadow-none"
    : "w-full max-w-xl mx-auto p-5 bg-white rounded-3xl border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] flex flex-col items-center justify-center space-y-3";

  if (isHorizontal) {
    // -------------------------------------------------------------
    // HORIZONTAL ORIENTATION (Categories on Y, Values on X)
    // -------------------------------------------------------------
    const maxCatLen = Math.max(...data.map(d => String(d.category || '').length), 5);
    const labelOffset = yAxisLabel ? 42 : 16;
    const marginLeft = Math.max(130, Math.min(190, labelOffset + Math.round(maxCatLen * 8) + 16));
    const marginRight = 30;
    const marginTop = 40;
    const marginBottom = 60;
    const plotWidth = width - marginLeft - marginRight;
    const plotHeight = height - marginTop - marginBottom;

    const numBars = data.length || 1;
    const barBand = plotHeight / numBars;
    const barThickness = Math.min(32, barBand * 0.65);

    return (
      <div className={containerStyle}>
        {title && (
          <div className="text-center">
            <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-wide">
              {title}
            </h3>
          </div>
        )}

        <div className="w-full overflow-x-auto flex justify-center">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full max-w-[560px] h-auto select-none font-sans"
            style={{ maxHeight: '380px' }}
          >
            {/* Background Chart Area */}
            <rect
              x={marginLeft}
              y={marginTop}
              width={plotWidth}
              height={plotHeight}
              fill="#f8fafc"
              rx={6}
            />

            {/* Vertical Grid Lines & X-Axis Ticks */}
            {ticks.map((val) => {
              const x = marginLeft + (val / maxVal) * plotWidth;
              return (
                <g key={`x-tick-${val}`}>
                  {showGridLines && (
                    <line
                      x1={x}
                      y1={marginTop}
                      x2={x}
                      y2={marginTop + plotHeight}
                      stroke="#e2e8f0"
                      strokeWidth={1.5}
                      strokeDasharray={val === 0 ? undefined : "3 3"}
                    />
                  )}
                  {/* Tick mark */}
                  <line
                    x1={x}
                    y1={marginTop + plotHeight}
                    x2={x}
                    y2={marginTop + plotHeight + 6}
                    stroke="#334155"
                    strokeWidth={1.5}
                  />
                  {/* Tick label */}
                  {showScaleNumbers && (
                    <text
                      x={x}
                      y={marginTop + plotHeight + 20}
                      textAnchor="middle"
                      className="text-xs font-bold fill-slate-700"
                      fontSize="11"
                    >
                      {val}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Y-Axis Line */}
            <line
              x1={marginLeft}
              y1={marginTop}
              x2={marginLeft}
              y2={marginTop + plotHeight}
              stroke="#0f172a"
              strokeWidth={2}
            />
            {/* X-Axis Line */}
            <line
              x1={marginLeft}
              y1={marginTop + plotHeight}
              x2={marginLeft + plotWidth}
              y2={marginTop + plotHeight}
              stroke="#0f172a"
              strokeWidth={2}
            />

            {/* Horizontal Bars */}
            {data.map((item, idx) => {
              const centerY = marginTop + idx * barBand + barBand / 2;
              const y = centerY - barThickness / 2;
              const isMissing = item.category === missingBar;
              const barLen = isMissing ? 0 : Math.max(0, (Number(item.value) / maxVal) * plotWidth);
              const color = item.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length];

              return (
                <g key={`h-bar-${idx}`}>
                  {/* Category Label (Y-axis) */}
                  <text
                    x={marginLeft - 12}
                    y={centerY + 4}
                    textAnchor="end"
                    className="text-xs font-bold fill-slate-800"
                    fontSize="11"
                  >
                    {item.category}
                  </text>

                  {isMissing ? (
                    /* Missing Bar Placeholder */
                    <g>
                      <rect
                        x={marginLeft + 4}
                        y={y}
                        width={60}
                        height={barThickness}
                        fill="rgba(241, 245, 249, 0.8)"
                        stroke="#94a3b8"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        rx={4}
                      />
                      <text
                        x={marginLeft + 34}
                        y={centerY + 5}
                        textAnchor="middle"
                        className="text-sm font-black fill-slate-400"
                        fontSize="14"
                      >
                        ?
                      </text>
                    </g>
                  ) : (
                    /* Normal Bar */
                    <rect
                      x={marginLeft}
                      y={y}
                      width={barLen}
                      height={barThickness}
                      fill={color}
                      stroke={item.highlight ? '#0f172a' : '#1e293b'}
                      strokeWidth={item.highlight ? 2.5 : 1}
                      rx={4}
                    />
                  )}
                </g>
              );
            })}

            {/* X-Axis Label */}
            {xAxisLabel && (
              <text
                x={marginLeft + plotWidth / 2}
                y={height - 15}
                textAnchor="middle"
                className="text-xs font-black fill-slate-900 uppercase tracking-wider"
                fontSize="12"
              >
                {xAxisLabel}
              </text>
            )}

            {/* Y-Axis Label */}
            {yAxisLabel && (
              <text
                x={18}
                y={marginTop + plotHeight / 2}
                textAnchor="middle"
                transform={`rotate(-90 18 ${marginTop + plotHeight / 2})`}
                className="text-xs font-black fill-slate-900 uppercase tracking-wider"
                fontSize="12"
              >
                {yAxisLabel}
              </text>
            )}
          </svg>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VERTICAL ORIENTATION (Categories on X, Values on Y)
  // -------------------------------------------------------------
  const maxTickLen = Math.max(...ticks.map(t => String(t).length), 1);
  const marginLeft = Math.max(70, Math.min(100, 38 + maxTickLen * 8));
  const marginRight = 30;
  const marginTop = 40;
  const marginBottom = 65;
  const plotWidth = width - marginLeft - marginRight;
  const plotHeight = height - marginTop - marginBottom;

  const numBars = data.length || 1;
  const barBand = plotWidth / numBars;
  const barThickness = Math.min(48, barBand * 0.65);

  return (
    <div className={containerStyle}>
      {title && (
        <div className="text-center">
          <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-wide">
            {title}
          </h3>
        </div>
      )}

      <div className="w-full overflow-x-auto flex justify-center">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full max-w-[560px] h-auto select-none font-sans"
          style={{ maxHeight: '380px' }}
        >
          {/* Background Plot Area */}
          <rect
            x={marginLeft}
            y={marginTop}
            width={plotWidth}
            height={plotHeight}
            fill="#f8fafc"
            rx={6}
          />

          {/* Horizontal Grid Lines & Y-Axis Ticks */}
          {ticks.map((val) => {
            const y = marginTop + plotHeight - (val / maxVal) * plotHeight;
            return (
              <g key={`y-tick-${val}`}>
                {showGridLines && (
                  <line
                    x1={marginLeft}
                    y1={y}
                    x2={marginLeft + plotWidth}
                    y2={y}
                    stroke="#e2e8f0"
                    strokeWidth={1.5}
                    strokeDasharray={val === 0 ? undefined : "3 3"}
                  />
                )}
                {/* Tick mark */}
                <line
                  x1={marginLeft - 6}
                  y1={y}
                  x2={marginLeft}
                  y2={y}
                  stroke="#334155"
                  strokeWidth={1.5}
                />
                {/* Tick label */}
                {showScaleNumbers && (
                  <text
                    x={marginLeft - 10}
                    y={y + 4}
                    textAnchor="end"
                    className="text-xs font-bold fill-slate-700"
                    fontSize="11"
                  >
                    {val}
                  </text>
                )}
              </g>
            );
          })}

          {/* Y-Axis Line */}
          <line
            x1={marginLeft}
            y1={marginTop}
            x2={marginLeft}
            y2={marginTop + plotHeight}
            stroke="#0f172a"
            strokeWidth={2}
          />
          {/* X-Axis Line */}
          <line
            x1={marginLeft}
            y1={marginTop + plotHeight}
            x2={marginLeft + plotWidth}
            y2={marginTop + plotHeight}
            stroke="#0f172a"
            strokeWidth={2}
          />

          {/* Vertical Bars */}
          {data.map((item, idx) => {
            const centerX = marginLeft + idx * barBand + barBand / 2;
            const x = centerX - barThickness / 2;
            const isMissing = item.category === missingBar;
            const barH = isMissing ? 0 : Math.max(0, (Number(item.value) / maxVal) * plotHeight);
            const y = marginTop + plotHeight - barH;
            const color = item.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length];

            return (
              <g key={`v-bar-${idx}`}>
                {/* Category Label (X-axis) */}
                <text
                  x={centerX}
                  y={marginTop + plotHeight + 20}
                  textAnchor="middle"
                  className="text-xs font-bold fill-slate-800"
                  fontSize="11"
                >
                  {item.category}
                </text>

                {isMissing ? (
                  /* Missing Bar Placeholder */
                  <g>
                    <rect
                      x={x}
                      y={marginTop + plotHeight - 60}
                      width={barThickness}
                      height={60}
                      fill="rgba(241, 245, 249, 0.8)"
                      stroke="#94a3b8"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      rx={4}
                    />
                    <text
                      x={centerX}
                      y={marginTop + plotHeight - 25}
                      textAnchor="middle"
                      className="text-sm font-black fill-slate-400"
                      fontSize="14"
                    >
                      ?
                    </text>
                  </g>
                ) : (
                  /* Normal Bar */
                  <rect
                    x={x}
                    y={y}
                    width={barThickness}
                    height={barH}
                    fill={color}
                    stroke={item.highlight ? '#0f172a' : '#1e293b'}
                    strokeWidth={item.highlight ? 2.5 : 1}
                    rx={4}
                  />
                )}
              </g>
            );
          })}

          {/* X-Axis Label */}
          {xAxisLabel && (
            <text
              x={marginLeft + plotWidth / 2}
              y={height - 15}
              textAnchor="middle"
              className="text-xs font-black fill-slate-900 uppercase tracking-wider"
              fontSize="12"
            >
              {xAxisLabel}
            </text>
          )}

          {/* Y-Axis Label */}
          {yAxisLabel && (
            <text
              x={18}
              y={marginTop + plotHeight / 2}
              textAnchor="middle"
              transform={`rotate(-90 18 ${marginTop + plotHeight / 2})`}
              className="text-xs font-black fill-slate-900 uppercase tracking-wider"
              fontSize="12"
            >
              {yAxisLabel}
            </text>
          )}
        </svg>
      </div>
    </div>
  );
}
