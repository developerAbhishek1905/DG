const WIDTHS = ["w-3/4", "w-1/2", "w-2/3", "w-5/6", "w-2/5", "w-3/5"];

type Props = { rows?: number; cols?: number; headings?: string[] };

const STYLES = `
@keyframes tsShimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
@keyframes tsLoadBar{0%{transform:translateX(-100%)}100%{transform:translateX(300%)}}
@keyframes tsRowIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.ts-sh{background-color:#eef0f4;background-image:linear-gradient(90deg,#eef0f4 0,#f8f9fb 40%,#eef0f4 80%);background-size:800px 100%;background-repeat:no-repeat;animation:tsShimmer 1.3s linear infinite}
.ts-row{animation:tsRowIn .35s ease both}
`;

const Sh = ({ className = "", delay = 0 }: { className?: string; delay?: number }) => (
  <div className={`ts-sh ${className}`} style={{ animationDelay: `${delay}ms` }} />
);

/** One skeleton cell, shaped by its position in the row. */
const Cell = ({ r, c, count }: { r: number; c: number; count: number }) => {
  const d = (r + c) * 90;

  if (c === 0) {
    return (
      <div className="flex items-center gap-3">
        <Sh className="h-9 w-9 shrink-0 rounded-full" delay={d} />
        <div className="min-w-0 flex-1 space-y-2">
          <Sh className={`h-3.5 rounded ${WIDTHS[r % WIDTHS.length]}`} delay={d} />
          <Sh className="h-2.5 w-1/3 rounded" delay={d} />
        </div>
      </div>
    );
  }

  if (count > 3 && c === count - 1) {
    return (
      <div className="flex gap-2">
        <Sh className="h-8 w-8 rounded-lg" delay={d} />
        <Sh className="h-8 w-8 rounded-lg" delay={d} />
      </div>
    );
  }

  if (count > 4 && c === count - 2) {
    return <Sh className="h-6 w-16 rounded-full" delay={d} />;
  }

  return <Sh className={`h-3.5 rounded ${WIDTHS[(r + c) % WIDTHS.length]}`} delay={d} />;
};

/** Animated table-shaped placeholder shown while a listing is loading. */
export default function TableSkeleton({ rows = 8, cols = 6, headings }: Props) {
  const count = headings?.length ?? cols;

  return (
    <div
      className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
      role="status"
      aria-label="Loading"
    >
      <div className="h-1 w-full overflow-hidden bg-blue-100">
        <div className="h-full w-1/3 animate-[tsLoadBar_1.2s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-[#123B7A] to-blue-400" />
      </div>

      <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-2.5 text-xs font-medium text-gray-400">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#123B7A]" />
        </span>
        Loading data...
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] table-fixed text-left">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              {Array.from({ length: count }).map((_, c) => (
                <th key={c} className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {headings ? headings[c] : <Sh className="h-3 w-16 rounded" />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {Array.from({ length: rows }).map((_, r) => (
              <tr key={r} className="ts-row" style={{ animationDelay: `${r * 55}ms` }}>
                {Array.from({ length: count }).map((_, c) => (
                  <td key={c} className="px-5 py-4">
                    <Cell r={r} c={c} count={count} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/60 px-5 py-3">
        <Sh className="h-3 w-32 rounded" />
        <div className="flex gap-2">
          <Sh className="h-8 w-8 rounded-lg" />
          <Sh className="h-8 w-8 rounded-lg" />
          <Sh className="h-8 w-8 rounded-lg" />
        </div>
      </div>

      <style>{STYLES}</style>
    </div>
  );
}

/** Skeleton rows to drop inside an existing <tbody> while loading. */
export function TableSkeletonRows({ rows = 6, cols }: { rows?: number; cols: number }) {
  return (
    <>
      <tr className="hidden">
        <td>
          <style>{STYLES}</style>
        </td>
      </tr>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} className="ts-row" style={{ animationDelay: `${r * 55}ms` }}>
          {Array.from({ length: cols }).map((_, c) => (
            <td key={c} className="px-4 py-3.5">
              <Cell r={r} c={c} count={cols} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
