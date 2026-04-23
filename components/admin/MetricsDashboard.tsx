'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type MetricsResponse = {
  totalUsers: number;
  dau: number;
  transactions24h: number;
  transactions30d: number;
  totalTransactions: number;
  retention7d: number;
  totalXlmStaked: number;
  activeBonds: number;
  completedBonds: number;
  failedBonds: number;
};

export default function MetricsDashboard() {
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
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
        <CardHeader><CardTitle>DAU (24h)</CardTitle></CardHeader>
        <CardContent><p className="text-2xl font-bold">{metrics.dau}</p></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Transactions (24h)</CardTitle></CardHeader>
        <CardContent><p className="text-2xl font-bold">{metrics.transactions24h}</p></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Transactions (30d)</CardTitle></CardHeader>
        <CardContent><p className="text-2xl font-bold">{metrics.transactions30d}</p></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Total Transactions</CardTitle></CardHeader>
        <CardContent><p className="text-2xl font-bold">{metrics.totalTransactions}</p></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>7d Retention</CardTitle></CardHeader>
        <CardContent><p className="text-2xl font-bold">{metrics.retention7d}%</p></CardContent>
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
