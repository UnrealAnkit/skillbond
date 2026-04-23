import MetricsDashboard from '@/components/admin/MetricsDashboard';
import UserExportButton from '@/components/admin/UserExportButton';

export default function AdminMetricsPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Platform Metrics</h1>
        <UserExportButton />
      </div>
      <MetricsDashboard />
    </div>
  );
}
