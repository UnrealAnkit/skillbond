-- Error & Transaction Logs Table
CREATE TABLE IF NOT EXISTS system_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    level VARCHAR(50) NOT NULL, -- 'ERROR', 'WARN', 'INFO'
    source VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    stack_trace TEXT,
    context JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view system logs" ON system_logs
    FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE INDEX IF NOT EXISTS idx_system_logs_level ON system_logs(level);
