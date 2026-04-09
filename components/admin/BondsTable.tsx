import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProofReview from './ProofReview';

interface BondsTableProps {
  bonds: any[];
}

export default function BondsTable({ bonds }: BondsTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedBond, setExpandedBond] = useState<string | null>(null);

  const filteredBonds = bonds.filter((bond) => {
    const matchesSearch = bond.title.toLowerCase().includes(search.toLowerCase()) || bond.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || bond.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-500/10 text-blue-500';
      case 'completed': return 'bg-green-500/10 text-green-500';
      case 'failed': return 'bg-red-500/10 text-red-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bonds & Proofs Management</CardTitle>
        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          <Input 
            placeholder="Search bonds by title or ID..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground border-b">
              <tr>
                <th className="px-4 py-3 font-medium">Bond Title</th>
                <th className="px-4 py-3 font-medium">Creator</th>
                <th className="px-4 py-3 font-medium">Stake</th>
                <th className="px-4 py-3 font-medium">Dates</th>
                <th className="px-4 py-3 font-medium">Participants</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredBonds.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No bonds found.</td>
                </tr>
              ) : (
                filteredBonds.map((bond) => (
                  <React.Fragment key={bond.id}>
                    <tr className="hover:bg-muted/50 cursor-pointer" onClick={() => setExpandedBond(expandedBond === bond.id ? null : bond.id)}>
                      <td className="px-4 py-3 font-medium">{bond.title}</td>
                      <td className="px-4 py-3 text-xs">{bond.profiles?.email || 'Unknown'}</td>
                      <td className="px-4 py-3">{bond.stake_amount} XLM</td>
                      <td className="px-4 py-3 text-xs">
                        {new Date(bond.start_date).toLocaleDateString()} - <br/>
                        {new Date(bond.end_date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-center">{bond.bond_participants?.length || 0}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={getStatusColor(bond.status)}>
                          {bond.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right text-muted-foreground">
                        {expandedBond === bond.id ? '▼' : '▶'}
                      </td>
                    </tr>
                    {expandedBond === bond.id && (
                      <tr>
                        <td colSpan={7} className="p-0 border-b">
                          <div className="p-6 bg-muted/20 border-t">
                            <ProofReview bond={bond} />
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}