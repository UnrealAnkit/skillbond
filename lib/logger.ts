import { createClient } from '@/lib/supabase/server';

export async function logUserActivity(userId: string, action: string, entityType?: string, entityId?: string, metadata: any = {}) {
  try {
    const supabase = await createClient();
    await supabase.from('activity_logs').insert({
      user_id: user_id,
      action,
      entity_type: entityType,
      entity_id: entityId,
      metadata
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}
export async function logSystemEvent(level: 'INFO' | 'WARN' | 'ERROR', source: string, message: string, context: any = {}) {
  try {
    const supabase = await createClient();
    await supabase.from('system_logs').insert({
      level,
      source,
      message,
      context,
      stack_trace: context.stack || null
    });
  } catch (error) {
    console.error('Failed to write system log:', error);
  }
}