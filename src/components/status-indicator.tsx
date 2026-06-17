import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { cn } from '@/lib/cn';

interface StatusSummary {
  status: 'operational' | 'degraded' | 'outage' | 'maintenance' | 'unknown';
  label: string;
  incidentCount: number;
  maintenanceCount: number;
}

export function StatusIndicator({ className }: { className?: string }) {
  const [summary, setSummary] = useState<StatusSummary>({
    status: 'unknown',
    label: 'Loading…',
    incidentCount: 0,
    maintenanceCount: 0,
  });

  useEffect(() => {
    fetch('/api/status')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load');
        return r.json();
      })
      .then((data) => {
        const incidents = data.ongoing_incidents?.length ?? 0;
        const maintenances =
          (data.in_progress_maintenances?.length ?? 0) +
          (data.scheduled_maintenances?.length ?? 0);

        if (incidents > 0) {
          setSummary({
            status: 'outage',
            label: `${incidents} incident${incidents > 1 ? 's' : ''}`,
            incidentCount: incidents,
            maintenanceCount: maintenances,
          });
        } else if (maintenances > 0) {
          setSummary({
            status: 'maintenance',
            label: `${maintenances} maintenance`,
            incidentCount: 0,
            maintenanceCount: maintenances,
          });
        } else {
          setSummary({
            status: 'operational',
            label: 'All systems operational',
            incidentCount: 0,
            maintenanceCount: 0,
          });
        }
      })
      .catch(() => {
        setSummary({
          status: 'unknown',
          label: 'Status unavailable',
          incidentCount: 0,
          maintenanceCount: 0,
        });
      });
  }, []);

  const dotColor = {
    operational: 'bg-emerald-500',
    degraded: 'bg-amber-500',
    outage: 'bg-red-500',
    maintenance: 'bg-blue-500',
    unknown: 'bg-fd-muted-foreground',
  }[summary.status];

  return (
    <Link
      to="/status"
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors hover:bg-fd-accent',
        className,
      )}
      title={summary.label}
    >
      <span className={cn('relative flex h-2 w-2')}>
        <span
          className={cn(
            'absolute inline-flex h-full w-full animate-ping rounded-full opacity-40',
            dotColor,
            summary.status === 'operational' && 'hidden',
          )}
        />
        <span className={cn('relative inline-flex h-2 w-2 rounded-full', dotColor)} />
      </span>
      <span className="text-fd-muted-foreground">{summary.label}</span>
    </Link>
  );
}
