'use client';

import { useState } from 'react';
import OverviewStats from './OverviewStats';
import UsersTable from './UsersTable';
import BondsTable from './BondsTable';

interface AdminDashboardProps {
  stats: any;
  users: any[];
  bonds: any[];
}

export default function AdminDashboard({ stats, users, bonds }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'bonds'>('overview');

  return (
    <div className="space-y-6">
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