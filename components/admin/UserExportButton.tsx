'use client';
import { Button } from '@/components/ui/button';

export default function UserExportButton() {
  return (
    <Button onClick={() => window.open('/api/export/users', '_blank')} variant="outline">
      Export Users (CSV)
    </Button>
  );
}
