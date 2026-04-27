import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || profile?.role !== 'admin') {
    return new NextResponse('Unauthorized', { status: 403 });
  }

  const { data, error } = await supabase.from('profiles').select('id, wallet_address, username');
  if (error || !data) return new NextResponse('Error fetching data', { status: 500 });

  const csvContent = [
    ['Username', 'Wallet Address'].join(','),
    ...data.map(row => [row.username || 'N/A', row.wallet_address || 'N/A'].join(','))
  ].join('\n');

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="users_export.csv"',
    },
  });
}
