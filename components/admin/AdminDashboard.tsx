'use client';

import { useState } from 'react';
import Link from 'next/link';
import OverviewStats from './OverviewStats';
import UsersTable from './UsersTable';
import BondsTable from './BondsTable';
import UserExportButton from './UserExportButton';

interface AdminDashboardProps {
  stats: any;
  users: any[];
  bonds: any[];
}

export default function AdminDashboard({ stats, users, bonds }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'bonds'>('overview');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin Console</h1>
        <div className="flex gap-4">
          <Link 
            href="/admin/metrics"
            className="px-4 py-2 border rounded-md hover:bg-neutral-100 flex items-center justify-center text-sm font-medium"
          >
            Advanced Metrics
          </Link>
          <UserExportButton />
        </div>
      </div>

      <div className="flex space-x-4 border-b pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-2 px-1 ${activeTab === 'overview' ? 'border-b-2 border-primary font-bold' : 'text-muted-foreground'}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-2 px-1 ${activeTab === 'users' ? 'border-b-2 border-primary font-bold' : 'text-muted-foreground'}`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('bonds')}
          className={`pb-2 px-1 ${activeTab === 'bonds' ? 'border-b-2 border-primary font-bold' : 'text-muted-foreground'}`}
        >
          Bonds & Proofs
        </button>
      </div>

      <div className="mt-6">
        {activeTab === 'overview' && <OverviewStats stats={stats} />}
        {activeTab === 'users' && <UsersTable users={users} />}
        {activeTab === 'bonds' && <BondsTable bonds={bonds} />}
      </div>
    </div>
  );
}