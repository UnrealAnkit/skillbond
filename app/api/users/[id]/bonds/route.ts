import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { id } = params;

  const { data, error } = await supabase
    .from('bond_participants')
    .select(`
      bond_id,
      joined_at,
      status,
      claimed,
      skill_bonds (*)
    `)
    .eq('user_id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  return NextResponse.json(data);
}
