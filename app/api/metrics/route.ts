import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Not logged in' }, { status: 401 });
    }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin only' }, { status: 403 });
    }

    const [usersCount, activeUsers, bondsStats] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('activity_logs').select('*', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - 86400000).toISOString()),
      supabase.from('skill_bonds').select('status, amount_staked')
    ]);

    const bonds = bondsStats.data || [];
    const completed = bonds.filter(b => b.status === 'completed').length;
    const failed = bonds.filter(b => b.status === 'failed').length;
    const active = bonds.filter(b => b.status === 'active').length;
    const stakedSum = bonds.reduce((acc, curr) => acc + Number(curr.amount_staked || 0), 0);

    return NextResponse.json({
      totalUsers: usersCount.count || 0,
      activeUsers24h: activeUsers.count || 0, // If table is missing, it will safely be 0
      totalBonds: bonds.length,
      activeBonds: active,
      completedBonds: completed,
      failedBonds: failed,
      totalXlmStaked: stakedSum
    });
  } catch (error: any) {
    console.error("Metrics API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
