import React, { useEffect, useRef } from 'react';

interface DarqubeChartWidgetProps {
  symbol?: string;
  height?: number;
}

export default function DarqubeChartWidget({
  symbol,
  height = 550
}: DarqubeChartWidgetProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (msg: MessageEvent) => {
      const widget = iframeRef.current;
      if (!widget) return;

      const styles = msg.data?.styles;
      const token = msg.data?.token;
      try {
        const urlToken = widget.src ? new URL(widget.src).searchParams.get('token') : null;
        if (styles && token === urlToken) {
          Object.keys(styles).forEach((key) => {
            widget.style.setProperty(key, styles[key]);
          });
        }
      } catch (e) {
        // Ignore cross-origin URL parsing issues if any
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Build the URL with token and optional symbol if provided
  const widgetUrl = `https://widget.darqube.com/advanced-chart-widget?token=6a6161ebb1ae5c09b4997a66${symbol ? `&symbol=${encodeURIComponent(symbol)}` : ''}`;

  return (
    <div className="w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs my-2">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-700 gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            DarQube Advanced Chart Widget 📊
          </span>
        </div>

        {symbol && (
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 border border-indigo-200/60 font-mono">
            {symbol}
          </span>
        )}
      </div>

      {/* Widget Container */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: `${height}px` }}>
        <iframe
          ref={iframeRef}
          id="AdvancedChartWidget-lhjeadj"
          data-widget-name="AdvancedChartWidget"
          src={widgetUrl}
          style={{
            border: 'none',
            width: '100%',
            height: `${height}px`,
            display: 'block'
          }}
          title="DarQube Advanced Chart Widget"
        />
      </div>
    </div>
  );
}
