import { createClient } from '@/lib/supabase/server';
import { getPlatformMetrics } from '@/lib/metrics';
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

    const metrics = await getPlatformMetrics(supabase);

    return NextResponse.json(metrics);
  } catch (error: any) {
    console.error("Metrics API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
