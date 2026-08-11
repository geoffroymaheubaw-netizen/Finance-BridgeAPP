import React from 'react';
import { DrawingShape, ChartViewportBounds, PixelPoint } from './types';
import { CoordinateUtils } from './CoordinateUtils';

interface ShapeRendererProps {
  shapes: DrawingShape[];
  currentDrawingShape: DrawingShape | null;
  selectedId: string | null;
  hoveredId: string | null;
  bounds: ChartViewportBounds;
  onSelectShape: (id: string) => void;
  onStartHandleDrag: (handleIndex: number) => void;
}

export const ShapeRenderer: React.FC<ShapeRendererProps> = ({
  shapes,
  currentDrawingShape,
  selectedId,
  hoveredId,
  bounds,
  onSelectShape,
  onStartHandleDrag,
}) => {
  const allShapesToRender = [...shapes];
  if (currentDrawingShape) {
    allShapesToRender.push(currentDrawingShape);
  }

  const getDashArray = (style: string): string => {
    if (style === 'dashed') return '6,6';
    if (style === 'dotted') return '2,4';
    return 'none';
  };

  const renderSingleShape = (shape: DrawingShape) => {
    if (shape.isHidden) return null;

    const isSelected = shape.id === selectedId;
    const isHovered = shape.id === hoveredId;
    const { style } = shape;
    const strokeDasharray = getDashArray(style.strokeStyle);

    const pixels: PixelPoint[] = shape.points.map((pt) => CoordinateUtils.chartToPixel(pt, bounds));

    if (pixels.length === 0) return null;

    const p0 = pixels[0];
    const p1 = pixels[1] || p0;
    const p2 = pixels[2] || p1;

    let shapeContent: React.ReactNode = null;

    switch (shape.type) {
      case 'line':
      case 'trendline':
        shapeContent = (
          <line
            x1={p0.x}
            y1={p0.y}
            x2={p1.x}
            y2={p1.y}
            stroke={style.strokeColor}
            strokeWidth={isSelected ? style.strokeWidth + 1 : style.strokeWidth}
            strokeDasharray={strokeDasharray}
            opacity={style.opacity}
          />
        );
        break;

      case 'arrow':
        const angle = Math.atan2(p1.y - p0.y, p1.x - p0.x);
        const arrowLength = 10;
        const a1 = angle - Math.PI / 6;
        const a2 = angle + Math.PI / 6;
        const arrowP1 = { x: p1.x - arrowLength * Math.cos(a1), y: p1.y - arrowLength * Math.sin(a1) };
        const arrowP2 = { x: p1.x - arrowLength * Math.cos(a2), y: p1.y - arrowLength * Math.sin(a2) };

        shapeContent = (
          <g opacity={style.opacity}>
            <line
              x1={p0.x}
              y1={p0.y}
              x2={p1.x}
              y2={p1.y}
              stroke={style.strokeColor}
              strokeWidth={style.strokeWidth}
              strokeDasharray={strokeDasharray}
            />
            <polygon
              points={`${p1.x},${p1.y} ${arrowP1.x},${arrowP1.y} ${arrowP2.x},${arrowP2.y}`}
              fill={style.strokeColor}
            />
          </g>
        );
        break;

      case 'horizontal_line':
        shapeContent = (
          <g opacity={style.opacity}>
            <line
              x1={bounds.padLeft}
              y1={p0.y}
              x2={bounds.padLeft + bounds.chartWidth}
              y2={p0.y}
              stroke={style.strokeColor}
              strokeWidth={style.strokeWidth}
              strokeDasharray={strokeDasharray}
            />
            <rect
              x={bounds.padLeft + bounds.chartWidth + 2}
              y={p0.y - 10}
              width={55}
              height={20}
              rx={4}
              fill={style.strokeColor}
            />
            <text
              x={bounds.padLeft + bounds.chartWidth + 29.5}
              y={p0.y + 4}
              textAnchor="middle"
              fill="#ffffff"
              fontSize={10}
              fontWeight="bold"
            >
              ${shape.points[0]?.price.toFixed(2)}
            </text>
          </g>
        );
        break;

      case 'vertical_line':
        shapeContent = (
          <line
            x1={p0.x}
            y1={bounds.padTop}
            x2={p0.x}
            y2={bounds.padTop + bounds.chartHeight}
            stroke={style.strokeColor}
            strokeWidth={style.strokeWidth}
            strokeDasharray={strokeDasharray}
            opacity={style.opacity}
          />
        );
        break;

      case 'ray':
        const dx = p1.x - p0.x;
        const dy = p1.y - p0.y;
        const farPt = { x: p0.x + dx * 100, y: p0.y + dy * 100 };
        shapeContent = (
          <line
            x1={p0.x}
            y1={p0.y}
            x2={farPt.x}
            y2={farPt.y}
            stroke={style.strokeColor}
            strokeWidth={style.strokeWidth}
            strokeDasharray={strokeDasharray}
            opacity={style.opacity}
          />
        );
        break;

      case 'rectangle':
        const x = Math.min(p0.x, p1.x);
        const y = Math.min(p0.y, p1.y);
        const w = Math.abs(p1.x - p0.x);
        const h = Math.abs(p1.y - p0.y);
        shapeContent = (
          <rect
            x={x}
            y={y}
            width={w}
            height={h}
            fill={style.fillColor}
            stroke={style.strokeColor}
            strokeWidth={style.strokeWidth}
            strokeDasharray={strokeDasharray}
            opacity={style.opacity}
            rx={4}
          />
        );
        break;

      case 'circle':
        const radius = CoordinateUtils.distanceBetweenPixels(p0, p1);
        shapeContent = (
          <circle
            cx={p0.x}
            cy={p0.y}
            r={radius}
            fill={style.fillColor}
            stroke={style.strokeColor}
            strokeWidth={style.strokeWidth}
            strokeDasharray={strokeDasharray}
            opacity={style.opacity}
          />
        );
        break;

      case 'ellipse':
        const rx = Math.abs(p1.x - p0.x) / 2;
        const ry = Math.abs(p1.y - p0.y) / 2;
        const cx = (p0.x + p1.x) / 2;
        const cy = (p0.y + p1.y) / 2;
        shapeContent = (
          <ellipse
            cx={cx}
            cy={cy}
            rx={rx}
            ry={ry}
            fill={style.fillColor}
            stroke={style.strokeColor}
            strokeWidth={style.strokeWidth}
            strokeDasharray={strokeDasharray}
            opacity={style.opacity}
          />
        );
        break;

      case 'triangle':
        shapeContent = (
          <polygon
            points={`${p0.x},${p0.y} ${p1.x},${p1.y} ${p2.x},${p2.y}`}
            fill={style.fillColor}
            stroke={style.strokeColor}
            strokeWidth={style.strokeWidth}
            strokeDasharray={strokeDasharray}
            opacity={style.opacity}
          />
        );
        break;

      case 'polygon':
        const polyPointsStr = pixels.map((pt) => `${pt.x},${pt.y}`).join(' ');
        shapeContent = (
          <polygon
            points={polyPointsStr}
            fill={style.fillColor}
            stroke={style.strokeColor}
            strokeWidth={style.strokeWidth}
            strokeDasharray={strokeDasharray}
            opacity={style.opacity}
          />
        );
        break;

      case 'parallel_channel':
        const offsetY = p2.y - p1.y;
        const p0Channel = { x: p0.x, y: p0.y + offsetY };
        const p1Channel = { x: p1.x, y: p1.y + offsetY };
        shapeContent = (
          <g opacity={style.opacity}>
            <polygon
              points={`${p0.x},${p0.y} ${p1.x},${p1.y} ${p1Channel.x},${p1Channel.y} ${p0Channel.x},${p0Channel.y}`}
              fill={style.fillColor}
            />
            <line x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} stroke={style.strokeColor} strokeWidth={style.strokeWidth} />
            <line
              x1={p0Channel.x}
              y1={p0Channel.y}
              x2={p1Channel.x}
              y2={p1Channel.y}
              stroke={style.strokeColor}
              strokeWidth={style.strokeWidth}
            />
            <line
              x1={(p0.x + p0Channel.x) / 2}
              y1={(p0.y + p0Channel.y) / 2}
              x2={(p1.x + p1Channel.x) / 2}
              y2={(p1.y + p1Channel.y) / 2}
              stroke={style.strokeColor}
              strokeWidth={1}
              strokeDasharray="4,4"
            />
          </g>
        );
        break;

      case 'regression_channel':
        const channelOffset = 25;
        shapeContent = (
          <g opacity={style.opacity}>
            <polygon
              points={`${p0.x},${p0.y - channelOffset} ${p1.x},${p1.y - channelOffset} ${p1.x},${p1.y + channelOffset} ${p0.x},${p0.y + channelOffset}`}
              fill={style.fillColor || 'rgba(99, 102, 241, 0.12)'}
            />
            <line
              x1={p0.x}
              y1={p0.y - channelOffset}
              x2={p1.x}
              y2={p1.y - channelOffset}
              stroke={style.strokeColor}
              strokeWidth={style.strokeWidth}
              strokeDasharray="4,4"
            />
            <line x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} stroke={style.strokeColor} strokeWidth={style.strokeWidth + 0.5} />
            <line
              x1={p0.x}
              y1={p0.y + channelOffset}
              x2={p1.x}
              y2={p1.y + channelOffset}
              stroke={style.strokeColor}
              strokeWidth={style.strokeWidth}
              strokeDasharray="4,4"
            />
          </g>
        );
        break;

      case 'fib_retracement':
        const price0 = shape.points[0]?.price || 0;
        const price1 = shape.points[1]?.price || price0;
        const priceDiff = price1 - price0;
        const fibLevels = [
          { level: 0, color: '#64748b' },
          { level: 0.236, color: '#f23645' },
          { level: 0.382, color: '#f59e0b' },
          { level: 0.5, color: '#089981' },
          { level: 0.618, color: '#3b82f6' },
          { level: 0.786, color: '#8b5cf6' },
          { level: 1.0, color: '#64748b' },
        ];
        const startX = Math.min(p0.x, p1.x);
        const endX = Math.max(p0.x, p1.x);

        shapeContent = (
          <g opacity={style.opacity}>
            {fibLevels.map((fib) => {
              const fibPrice = price0 + priceDiff * fib.level;
              const fibPt = CoordinateUtils.chartToPixel({ price: fibPrice, timeRatio: 0 }, bounds);
              return (
                <g key={fib.level}>
                  <line
                    x1={startX}
                    y1={fibPt.y}
                    x2={endX}
                    y2={fibPt.y}
                    stroke={fib.color}
                    strokeWidth={1.5}
                    strokeDasharray={fib.level === 0 || fib.level === 1 ? 'none' : '4,4'}
                  />
                  <text
                    x={endX + 4}
                    y={fibPt.y + 3}
                    fill={fib.color}
                    fontSize={10}
                    fontWeight="bold"
                    className="select-none"
                  >
                    {(fib.level * 100).toFixed(1)}% (${fibPrice.toFixed(2)})
                  </text>
                </g>
              );
            })}
          </g>
        );
        break;

      case 'fib_extension':
        const priceExt0 = shape.points[0]?.price || 0;
        const priceExt1 = shape.points[1]?.price || priceExt0;
        const extDiff = priceExt1 - priceExt0;
        const fibExtLevels = [
          { level: 0, color: '#64748b' },
          { level: 0.618, color: '#3b82f6' },
          { level: 1.0, color: '#089981' },
          { level: 1.618, color: '#8b5cf6' },
          { level: 2.618, color: '#f59e0b' },
        ];
        const startExtX = Math.min(p0.x, p1.x);
        const endExtX = Math.max(p0.x, p1.x) + 40;

        shapeContent = (
          <g opacity={style.opacity}>
            {fibExtLevels.map((fib) => {
              const fibPrice = priceExt1 + extDiff * fib.level;
              const fibPt = CoordinateUtils.chartToPixel({ price: fibPrice, timeRatio: 0 }, bounds);
              return (
                <g key={fib.level}>
                  <line
                    x1={startExtX}
                    y1={fibPt.y}
                    x2={endExtX}
                    y2={fibPt.y}
                    stroke={fib.color}
                    strokeWidth={1.5}
                    strokeDasharray={fib.level === 0 ? 'none' : '4,4'}
                  />
                  <text
                    x={endExtX + 4}
                    y={fibPt.y + 3}
                    fill={fib.color}
                    fontSize={10}
                    fontWeight="bold"
                    className="select-none"
                  >
                    Ext {(fib.level * 100).toFixed(1)}% (${fibPrice.toFixed(2)})
                  </text>
                </g>
              );
            })}
          </g>
        );
        break;

      case 'text':
      case 'note':
        shapeContent = (
          <g opacity={style.opacity}>
            <rect
              x={p0.x - 4}
              y={p0.y - 18}
              width={Math.max(60, (shape.text || 'Texte').length * 8 + 16)}
              height={26}
              rx={6}
              fill={style.fillColor || '#0f172a'}
              stroke={style.strokeColor}
              strokeWidth={1}
            />
            <text
              x={p0.x + 4}
              y={p0.y - 1}
              fill={style.textColor || '#ffffff'}
              fontSize={style.fontSize || 12}
              fontWeight="bold"
            >
              {shape.text || 'Texte'}
            </text>
          </g>
        );
        break;

      case 'price_label':
        const prVal = shape.points[0]?.price.toFixed(2);
        shapeContent = (
          <g opacity={style.opacity}>
            <rect x={p0.x - 30} y={p0.y - 12} width={60} height={24} rx={6} fill="#3b82f6" />
            <text x={p0.x} y={p0.y + 4} textAnchor="middle" fill="#ffffff" fontSize={11} fontWeight="bold">
              ${prVal}
            </text>
          </g>
        );
        break;

      case 'emoji':
        shapeContent = (
          <text
            x={p0.x}
            y={p0.y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={24}
            className="select-none"
          >
            {shape.emoji || '🎯'}
          </text>
        );
        break;

      case 'brush':
      case 'highlighter':
        if (shape.freehandPath && shape.freehandPath.length > 0) {
          const pathPixels = shape.freehandPath.map((pt) => CoordinateUtils.chartToPixel(pt, bounds));
          const pathD = pathPixels.reduce((acc, pt, idx) => (idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`), '');
          shapeContent = (
            <path
              d={pathD}
              stroke={style.strokeColor}
              strokeWidth={shape.type === 'highlighter' ? 12 : style.strokeWidth * 1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              opacity={shape.type === 'highlighter' ? 0.4 : style.opacity}
            />
          );
        }
        break;

      case 'measure':
        const priceA = shape.points[0]?.price || 0;
        const priceB = shape.points[1]?.price || priceA;
        const pDiff = priceB - priceA;
        const pPct = ((pDiff / (priceA || 1)) * 100).toFixed(2);
        const rectX = Math.min(p0.x, p1.x);
        const rectY = Math.min(p0.y, p1.y);
        const rectW = Math.abs(p1.x - p0.x);
        const rectH = Math.abs(p1.y - p0.y);
        const isPos = pDiff >= 0;

        shapeContent = (
          <g opacity={0.9}>
            <rect
              x={rectX}
              y={rectY}
              width={rectW}
              height={rectH}
              fill={isPos ? 'rgba(8, 153, 129, 0.15)' : 'rgba(242, 54, 69, 0.15)'}
              stroke={isPos ? '#089981' : '#f23645'}
              strokeWidth={1.5}
              strokeDasharray="4,4"
            />
            <rect
              x={(p0.x + p1.x) / 2 - 60}
              y={(p0.y + p1.y) / 2 - 15}
              width={120}
              height={30}
              rx={6}
              fill="#0f172a"
              stroke={isPos ? '#089981' : '#f23645'}
            />
            <text
              x={(p0.x + p1.x) / 2}
              y={(p0.y + p1.y) / 2 + 4}
              textAnchor="middle"
              fill={isPos ? '#34d399' : '#f87171'}
              fontSize={11}
              fontWeight="bold"
            >
              {isPos ? '+' : ''}
              {pDiff.toFixed(2)}$ ({pPct}%)
            </text>
          </g>
        );
        break;

      default:
        break;
    }

    return (
      <g
        key={shape.id}
        onClick={(e) => {
          e.stopPropagation();
          onSelectShape(shape.id);
        }}
        className="cursor-pointer pointer-events-auto"
      >
        {/* Selection/Hover Highlight glow */}
        {(isSelected || isHovered) && (
          <g className="pointer-events-none">
            {pixels.map((p, idx) => (
              <circle
                key={idx}
                cx={p.x}
                cy={p.y}
                r={isSelected ? 6 : 4}
                fill="#ffffff"
                stroke="#3b82f6"
                strokeWidth={2}
                className="transition-transform duration-100"
              />
            ))}
          </g>
        )}

        {shapeContent}

        {/* Drag handles for selected shapes */}
        {isSelected && !shape.isLocked && (
          <g>
            {pixels.map((p, handleIdx) => (
              <circle
                key={`handle_${handleIdx}`}
                cx={p.x}
                cy={p.y}
                r={5}
                fill="#3b82f6"
                stroke="#ffffff"
                strokeWidth={2}
                className="cursor-grab hover:scale-125 transition-transform"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  onStartHandleDrag(handleIdx);
                }}
              />
            ))}
          </g>
        )}
      </g>
    );
  };

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-visible">
      {allShapesToRender.map((shape) => renderSingleShape(shape))}
    </svg>
  );
};
