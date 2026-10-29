/*
|--------------------------------------------------------------------------
| Loading placeholders for the whole CRM
|--------------------------------------------------------------------------
| Listings use <TableSkeleton />. Everything else uses these:
|
|   <Skeleton />          one animated block (give it a size)
|   <DetailsSkeleton />   details / view pages
|   <FormSkeleton />      create / edit pages and forms
|   <DashboardSkeleton /> dashboard
|   <PanelSkeleton />     settings panels, cards
|   <ListSkeleton />      small lists (modals, dropdowns, activity)
*/

export function Skeleton({
  className = "",
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <div
      className={`ts-sh rounded ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}

const card = "rounded-xl border border-gray-200 bg-white p-5 shadow-sm";

const Wrap = ({ children }: { children: React.ReactNode }) => (
  <div className="space-y-5" role="status" aria-label="Loading">
    {children}
  </div>
);

const TitleBar = () => (
  <div className="flex items-center justify-between">
    <div className="space-y-2">
      <Skeleton className="h-6 w-56" />
      <Skeleton className="h-3.5 w-40" delay={80} />
    </div>
    <div className="flex gap-2">
      <Skeleton className="h-9 w-24 rounded-lg" />
      <Skeleton className="h-9 w-28 rounded-lg" delay={80} />
    </div>
  </div>
);

const Fields = ({ count, cols }: { count: number; cols: string }) => (
  <div className={`grid gap-4 ${cols}`}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="space-y-2">
        <Skeleton className="h-3 w-24" delay={i * 60} />
        <Skeleton className="h-9 w-full rounded-lg" delay={i * 60} />
      </div>
    ))}
  </div>
);

export function FormSkeleton({ fields = 8 }: { fields?: number }) {
  return (
    <Wrap>
      <TitleBar />
      <div className={card}>
        <Skeleton className="mb-5 h-4 w-40" />
        <Fields count={fields} cols="sm:grid-cols-2 lg:grid-cols-3" />
      </div>
      <div className="flex justify-end gap-3">
        <Skeleton className="h-10 w-24 rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" delay={80} />
      </div>
    </Wrap>
  );
}

export function DetailsSkeleton() {
  return (
    <Wrap>
      <TitleBar />
      <div className="grid gap-5 lg:grid-cols-3">
        {[0, 1, 2].map((c) => (
          <div key={c} className={card}>
            <div className="mb-4 flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-full" delay={c * 90} />
              <Skeleton className="h-4 w-32" delay={c * 90} />
            </div>
            <div className="space-y-3">
              {[0, 1, 2, 3].map((r) => (
                <div key={r} className="flex justify-between gap-4">
                  <Skeleton className="h-3.5 w-24" delay={(c + r) * 70} />
                  <Skeleton className="h-3.5 w-32" delay={(c + r) * 70} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className={card}>
        <Skeleton className="mb-4 h-4 w-44" />
        <div className="space-y-3">
          {[0, 1, 2, 3].map((r) => (
            <Skeleton key={r} className="h-4 w-full" delay={r * 80} />
          ))}
        </div>
      </div>
    </Wrap>
  );
}

export function DashboardSkeleton() {
  return (
    <Wrap>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`${card} flex items-center gap-4`}>
            <Skeleton className="h-12 w-12 rounded-xl" delay={i * 90} />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-24" delay={i * 90} />
              <Skeleton className="h-6 w-20" delay={i * 90} />
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        {[0, 1].map((i) => (
          <div key={i} className={card}>
            <Skeleton className="mb-4 h-4 w-40" />
            <Skeleton className="h-56 w-full rounded-lg" delay={i * 120} />
          </div>
        ))}
      </div>
      <div className={card}>
        <Skeleton className="mb-4 h-4 w-48" />
        <ListSkeleton rows={4} />
      </div>
    </Wrap>
  );
}

export function PanelSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-4 py-2" role="status" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center justify-between gap-6">
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-48" delay={i * 70} />
            <Skeleton className="h-3 w-72 max-w-full" delay={i * 70} />
          </div>
          <Skeleton className="h-8 w-20 rounded-lg" delay={i * 70} />
        </div>
      ))}
    </div>
  );
}

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3" role="status" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 shrink-0 rounded-full" delay={i * 70} />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-3.5 w-3/4" delay={i * 70} />
            <Skeleton className="h-3 w-1/2" delay={i * 70} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Skeleton;
