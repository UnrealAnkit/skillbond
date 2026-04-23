'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MetricsDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/metrics')
      .then(async res => {
        const data = await res.json();
        if (!res.ok || data.error) {
          throw new Error(data.error || 'Failed to load metrics');
        }
        setMetrics(data);
      })
      .catch(err => setError(err.message));
  }, []);

  if (error) return <div className="p-4 text-red-500 bg-red-100 rounded-md">Error: {error}</div>;
  if (!metrics) return <div className="p-4 animate-pulse">Loading metrics...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader><CardTitle>Total Users</CardTitle></CardHeader>
        <CardContent><p className="text-2xl font-bold">{metrics.totalUsers}</p></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Active Users (24h)</CardTitle></CardHeader>
        <CardContent><p className="text-2xl font-bold">{metrics.activeUsers24h}</p></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Total XLM Staked</CardTitle></CardHeader>
        <CardContent><p className="text-2xl font-bold">{metrics.totalXlmStaked} XLM</p></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Bonds (Active/Done/Fail)</CardTitle></CardHeader>
        <CardContent><p className="text-2xl font-bold">{metrics.activeBonds} / {metrics.completedBonds} / {metrics.failedBonds}</p></CardContent>
      </Card>
    </div>
  );
}
