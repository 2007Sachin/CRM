-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables to ensure clean slate with new schema
DROP TABLE IF EXISTS calls;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name TEXT NOT NULL,
    company TEXT,
    industry TEXT,
    plan TEXT CHECK (plan IN ('Free', 'Pro', 'Enterprise')),
    status TEXT DEFAULT 'Active',
    usage_count INTEGER DEFAULT 0,
    revenue INTEGER DEFAULT 0,
    usage_trend TEXT CHECK (usage_trend IN ('Stable', 'Increasing', 'Decreasing')) DEFAULT 'Stable',
    signup_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_whale BOOLEAN DEFAULT FALSE,
    stack_config JSONB,
    cost_per_min NUMERIC(10, 4) DEFAULT 0,
    price_per_min NUMERIC(10, 4) DEFAULT 0,
    margin_percent NUMERIC(5, 1) DEFAULT 0
);

-- Create calls table
CREATE TABLE calls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('completed', 'failed')),
    transcript TEXT,
    latency_ms INTEGER,
    duration_seconds INTEGER,
    total_cost NUMERIC(10, 4),
    bolna_revenue NUMERIC(10, 4),
    margin_percent NUMERIC(5, 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (Demo mode: allow all)
CREATE POLICY "Allow public read access on users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on users" ON users FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on users" ON users FOR DELETE USING (true);

CREATE POLICY "Allow public read access on calls" ON calls FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on calls" ON calls FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on calls" ON calls FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on calls" ON calls FOR DELETE USING (true);
