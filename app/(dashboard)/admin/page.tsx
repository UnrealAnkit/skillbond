import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { updateBondStatus } from '@/actions/admin';

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Admin authentication will be handled using Supabase (I will configure credentials and roles)
  // For now, let's load bonds and proofs

  const { data: bonds } = await supabase
    .from('skill_bonds')
    .select('*, profiles(full_name, username)')
    .order('created_at', { ascending: false });

  const { data: proofs } = await supabase
    .from('proof_submissions')
    .select('*, profiles(full_name, username), skill_bonds(title)')
    .order('submitted_at', { ascending: false });

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage all active bonds and review submitted proofs.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Proof Submissions</CardTitle>
            <CardDescription>Review and verify user work.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {proofs?.length === 0 ? (
              <p className="text-sm text-muted-foreground">No proofs submitted yet.</p>
            ) : (
              proofs?.slice(0, 5).map((proof) => (
                <div key={proof.id} className="flex flex-col gap-2 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">Bond: {proof.skill_bonds?.title}</span>
                    <Badge variant={proof.status === 'pending' ? 'warning' : proof.status === 'approved' ? 'success' : 'danger'}>{proof.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">By {proof.profiles?.full_name || proof.profiles?.username}</p>
                  {proof.file_url && <a href={proof.file_url} target="_blank" rel="noreferrer" className="text-blue-500 text-sm hover:underline">View Uploaded Proof</a>}
                  {proof.link_url && <a href={proof.link_url} target="_blank" rel="noreferrer" className="text-blue-500 text-sm hover:underline">View Proof Link</a>}
                  <p className="text-sm mt-2">{proof.content}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Bonds</CardTitle>
            <CardDescription>Manage bonds and their statuses.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {bonds?.length === 0 ? (
              <p className="text-sm text-muted-foreground">No bonds created yet.</p>
            ) : (
              bonds?.slice(0, 5).map((bond) => {
                const completeAction = updateBondStatus.bind(null, bond.id, 'completed');
                const failAction = updateBondStatus.bind(null, bond.id, 'failed');

                return (
                  <div key={bond.id} className="flex flex-col gap-3 p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <Link href={`/bond/${bond.id}`} className="font-medium hover:underline">
                        {bond.title}
                      </Link>
                      <Badge>{bond.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Creator: {bond.profiles?.full_name || bond.profiles?.username}</p>
                    
                    {['active', 'under_review'].includes(bond.status) && (
                      <div className="flex gap-2 mt-2">
                        <form action={completeAction}>
                          <Button size="sm" variant="default" type="submit">Approve (Complete)</Button>
                        </form>
                        <form action={failAction}>
                          <Button size="sm" variant="danger" type="submit">Reject (Fail)</Button>
                        </form>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}