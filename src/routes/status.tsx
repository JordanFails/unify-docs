import { createFileRoute, Link } from '@tanstack/react-router';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  WrenchIcon,
  ArrowRightIcon,
  RefreshCwIcon,
} from 'lucide-react';

interface IncidentUpdate {
  id: string;
  name: string;
  body: string;
  created_at: string;
}

interface AffectedComponent {
  name: string;
  status?: string;
  current_status?: string;
}

interface Incident {
  id: string;
  name: string;
  status: string;
  started_at: string;
  resolved_at?: string;
  updates?: IncidentUpdate[];
  last_update_at?: string;
  last_update_message?: string;
  affected_components?: AffectedComponent[];
}

interface Maintenance {
  id: string;
  name: string;
  status: string;
  started_at?: string;
  scheduled_start?: string;
  starts_at?: string;
  ended_at?: string;
  updates?: IncidentUpdate[];
  last_update_at?: string;
  last_update_message?: string;
  affected_components?: AffectedComponent[];
}

interface StatusData {
  ongoing_incidents: Incident[];
  in_progress_maintenances: Maintenance[];
  scheduled_maintenances: Maintenance[];
}

export const Route = createFileRoute('/status')({
  component: StatusPage,
});

function StatusPage() {
  const [data, setData] = useState<StatusData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = () => {
    setLoading(true);
    setError(null);
    fetch('/api/status')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : 'Failed to load status');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 60_000);
    return () => clearInterval(interval);
  }, []);

  const hasIssues =
    (data?.ongoing_incidents?.length ?? 0) > 0 ||
    (data?.in_progress_maintenances?.length ?? 0) > 0;

  const overallStatus = data
    ? hasIssues
      ? 'degraded'
      : 'operational'
    : 'unknown';

  return (
    <HomeLayout {...baseOptions()}>
      <main className="mx-auto w-full max-w-3xl px-6 py-16">
        {/* Header */}
        <div className="mb-10 text-center">
          <div
            className={cn(
              'mx-auto mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium',
              overallStatus === 'operational' &&
                'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-400',
              overallStatus === 'degraded' &&
                'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-400',
              overallStatus === 'unknown' &&
                'border-fd-border bg-fd-muted/50 text-fd-muted-foreground',
            )}
          >
            {overallStatus === 'operational' && (
              <>
                <CheckCircleIcon className="h-4 w-4" />
                All Systems Operational
              </>
            )}
            {overallStatus === 'degraded' && (
              <>
                <AlertTriangleIcon className="h-4 w-4" />
                Service Disruption
              </>
            )}
            {overallStatus === 'unknown' && (
              <>
                <ClockIcon className="h-4 w-4" />
                Loading Status…
              </>
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight">System Status</h1>
          <p className="mt-2 text-fd-muted-foreground">
            Live status of Unify services and infrastructure.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400">
            <div className="flex items-center gap-2">
              <AlertTriangleIcon className="h-4 w-4" />
              <span className="font-medium">Unable to load status</span>
            </div>
            <p className="mt-1">{error}</p>
            <p className="mt-2 text-xs">
              If this persists, check that{' '}
              <code className="rounded bg-red-100 px-1 py-0.5 dark:bg-red-900/50">
                INCIDENT_IO_WIDGET_URL
              </code>{' '}
              is configured in your environment.
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && !data && (
          <div className="flex items-center justify-center py-16">
            <RefreshCwIcon className="h-6 w-6 animate-spin text-fd-muted-foreground" />
          </div>
        )}

        {data && (
          <>
            {/* Ongoing Incidents */}
            <Section
              title="Ongoing Incidents"
              icon={<AlertTriangleIcon className="h-5 w-5 text-red-500" />}
              count={data.ongoing_incidents.length}
              empty="No ongoing incidents."
            >
              {data.ongoing_incidents.map((incident) => (
                <IncidentCard key={incident.id} incident={incident} />
              ))}
            </Section>

            {/* In-Progress Maintenance */}
            <Section
              title="Active Maintenance"
              icon={<WrenchIcon className="h-5 w-5 text-blue-500" />}
              count={data.in_progress_maintenances.length}
              empty="No maintenance in progress."
            >
              {data.in_progress_maintenances.map((m) => (
                <MaintenanceCard key={m.id} maintenance={m} />
              ))}
            </Section>

            {/* Scheduled Maintenance */}
            <Section
              title="Scheduled Maintenance"
              icon={<ClockIcon className="h-5 w-5 text-amber-500" />}
              count={data.scheduled_maintenances.length}
              empty="No scheduled maintenance."
            >
              {data.scheduled_maintenances.map((m) => (
                <MaintenanceCard key={m.id} maintenance={m} scheduled />
              ))}
            </Section>
          </>
        )}

        {/* Footer */}
        <div className="mt-12 border-t pt-6 text-center">
          <p className="text-xs text-fd-muted-foreground">
            Status powered by{' '}
            <a
              href="https://incident.io"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-fd-foreground"
            >
              Incident.io
            </a>
            .
          </p>
          <Link
            to="/"
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-fd-primary hover:underline"
          >
            Back to docs
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
        </div>
      </main>
    </HomeLayout>
  );
}

function Section({
  title,
  icon,
  count,
  empty,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  count: number;
  empty: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <div className="mb-4 flex items-center gap-2">
        {icon}
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="ml-auto text-xs text-fd-muted-foreground">
          {count} {count === 1 ? 'item' : 'items'}
        </span>
      </div>
      {count === 0 ? (
        <p className="rounded-xl border bg-fd-card/50 px-4 py-6 text-center text-sm text-fd-muted-foreground">
          {empty}
        </p>
      ) : (
        <div className="flex flex-col gap-3">{children}</div>
      )}
    </section>
  );
}

function IncidentCard({ incident }: { incident: Incident }) {
  const updates = incident.updates ?? [];
  const latestUpdate = updates[updates.length - 1];
  const components = incident.affected_components ?? [];

  // Fall back to last_update_message/last_update_at if updates array is empty
  const updateBody = latestUpdate?.body ?? incident.last_update_message;
  const updateDate = latestUpdate?.created_at ?? incident.last_update_at;

  return (
    <div className="rounded-xl border bg-fd-card p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold">{incident.name}</h3>
          <p className="mt-0.5 text-xs text-fd-muted-foreground">
            Started {formatDate(incident.started_at)} · Status:{' '}
            <span className="font-medium text-red-500">{incident.status}</span>
          </p>
        </div>
        <StatusBadge status={incident.status} />
      </div>

      {components.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {components.map((c) => (
            <span
              key={c.name}
              className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-950/50 dark:text-red-400"
            >
              {c.name}
            </span>
          ))}
        </div>
      )}

      {updateBody && (
        <div className="mt-3 rounded-lg bg-fd-muted/40 p-3 text-sm">
          {updateDate && (
            <p className="text-xs text-fd-muted-foreground">
              {formatDate(updateDate)}
            </p>
          )}
          <p className="mt-1">{updateBody}</p>
        </div>
      )}
    </div>
  );
}

function MaintenanceCard({
  maintenance,
  scheduled,
}: {
  maintenance: Maintenance;
  scheduled?: boolean;
}) {
  const updates = maintenance.updates ?? [];
  const latestUpdate = updates[updates.length - 1];
  const components = maintenance.affected_components ?? [];

  // Fall back to last_update_message/last_update_at if updates array is empty
  const updateBody = latestUpdate?.body ?? maintenance.last_update_message;
  const updateDate = latestUpdate?.created_at ?? maintenance.last_update_at;

  // Scheduled maintenances use scheduled_start/starts_at instead of started_at
  const dateRaw =
    maintenance.started_at ??
    maintenance.scheduled_start ??
    maintenance.starts_at;
  const dateLabel = scheduled ? 'Scheduled for' : 'Started';
  const dateStr = dateRaw ? formatDate(dateRaw) : 'TBD';

  return (
    <div className="rounded-xl border bg-fd-card p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold">{maintenance.name}</h3>
          <p className="mt-0.5 text-xs text-fd-muted-foreground">
            {dateLabel} {dateStr} · Status:{' '}
            <span className="font-medium text-blue-500">{maintenance.status}</span>
          </p>
        </div>
        <StatusBadge status={maintenance.status} />
      </div>

      {components.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {components.map((c) => (
            <span
              key={c.name}
              className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950/50 dark:text-blue-400"
            >
              {c.name}
            </span>
          ))}
        </div>
      )}

      {updateBody && (
        <div className="mt-3 rounded-lg bg-fd-muted/40 p-3 text-sm">
          {updateDate && (
            <p className="text-xs text-fd-muted-foreground">
              {formatDate(updateDate)}
            </p>
          )}
          <p className="mt-1">{updateBody}</p>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    investigating: 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400',
    identified: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
    monitoring: 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
    resolved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
    maintenance_scheduled:
      'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
    maintenance_in_progress:
      'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
    maintenance_complete:
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
  };

  return (
    <span
      className={cn(
        'shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
        colors[status] ??
          'bg-fd-muted text-fd-muted-foreground',
      )}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
}

function formatDate(iso: string | undefined | null): string {
  if (!iso) return 'TBD';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return 'Invalid Date';
  try {
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}
