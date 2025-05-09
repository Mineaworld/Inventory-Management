import * as React from "react";
import { Tooltip as RechartsTooltip } from "recharts";

/**
 * @typedef {Object} ChartConfigItem
 * @property {string} label
 * @property {string} color
 * @typedef {Record<string, ChartConfigItem>} ChartConfig
 */

export function ChartContainer({ config, children }) {
  // Provide config via context if needed, or just as a prop
  return <div className="w-full h-full">{children}</div>;
}

export function ChartTooltip({ content, ...props }) {
  // Wrap recharts Tooltip for custom content
  return <RechartsTooltip {...props} content={content} />;
}

export function ChartTooltipContent({ active, payload, label, indicator }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border bg-popover p-2 text-popover-foreground shadow-sm min-w-[120px]">
      <div className="mb-1 text-xs font-medium text-muted-foreground">{label}</div>
      <div className="flex flex-col gap-1">
        {payload.map((entry, idx) => (
          <div key={idx} className="flex items-center gap-2 text-xs">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: entry.color }}
            />
            <span>{entry.name}:</span>
            <span className="font-semibold">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 