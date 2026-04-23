import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.user_metadata?.role !== 'admin') {
    return new NextResponse('Unauthorized', { status: 403 });
  }

  const { data, error } = await supabase.from('profiles').select('id, wallet_address, username, email');
  if (error || !data) return new NextResponse('Error fetching data', { status: 500 });

  const csvContent = [
    ['Email', 'Wallet Address'].join(','),
    ...data.map(row => [row.email || 'N/A', row.wallet_address].join(','))
  ].join('\n');

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="users_export.csv"',
    },
  });
}
