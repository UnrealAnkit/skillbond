import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface UsersTableProps {
  users: any[];
}

export default function UsersTable({ users }: UsersTableProps) {
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter((user) =>
    user.email?.toLowerCase().includes(search.toLowerCase()) ||
    user.wallet_address?.toLowerCase().includes(search.toLowerCase()) ||
    user.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users Management</CardTitle>
        <div className="mt-4">
          <Input 
            placeholder="Search by email, wallet, or ID..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground border-b">
              <tr>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Wallet Address</th>
                <th className="px-4 py-3 font-medium">Joined Date</th>
                <th className="px-4 py-3 font-medium text-right">Bonds Created</th>
                <th className="px-4 py-3 font-medium text-right">Bonds Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No users found.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium">{user.email || 'N/A'}</td>
                    <td className="px-4 py-3 font-mono text-xs">{user.wallet_address || 'Unlinked'}</td>
                    <td className="px-4 py-3">{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">{user.bondsCreated}</td>
                    <td className="px-4 py-3 text-right">{user.bondsJoined}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}