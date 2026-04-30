import { createClient } from '@/lib/supabase/server';
import { getPlatformMetrics } from '@/lib/metrics';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const metrics = await getPlatformMetrics(supabase);
    return NextResponse.json(metrics);
  } catch (error: any) {
    console.error("Public Metrics API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
