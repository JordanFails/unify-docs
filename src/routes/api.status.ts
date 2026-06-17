import { createFileRoute } from '@tanstack/react-router';

interface IncidentUpdate {
  id: string;
  name: string;
  body: string;
  created_at: string;
}

interface AffectedComponent {
  name: string;
  status: string;
}

interface Incident {
  id: string;
  name: string;
  status: string;
  started_at: string;
  resolved_at?: string;
  updates: IncidentUpdate[];
  affected_components: AffectedComponent[];
}

interface Maintenance {
  id: string;
  name: string;
  status: string;
  started_at: string;
  ended_at?: string;
  updates: IncidentUpdate[];
  affected_components: AffectedComponent[];
}

export interface StatusData {
  ongoing_incidents: Incident[];
  in_progress_maintenances: Maintenance[];
  scheduled_maintenances: Maintenance[];
}

const WIDGET_URL = process.env.INCIDENT_IO_WIDGET_URL;

async function fetchStatus(): Promise<StatusData> {
  if (!WIDGET_URL) {
    throw new Error('INCIDENT_IO_WIDGET_URL not configured');
  }

  const res = await fetch(WIDGET_URL, {
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`Incident.io returned ${res.status}`);
  }

  return (await res.json()) as StatusData;
}

export const Route = createFileRoute('/api/status')({
  server: {
    handlers: {
      GET: async () => {
        try {
          const data = await fetchStatus();
          return new Response(JSON.stringify(data), {
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'public, max-age=30',
            },
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          return new Response(
            JSON.stringify({ error: message }),
            {
              status: 503,
              headers: { 'Content-Type': 'application/json' },
            },
          );
        }
      },
    },
  },
});
