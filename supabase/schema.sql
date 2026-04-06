-- Aqua Pulse Supabase SQL Schema
-- Paste this script directly into your Supabase SQL Editor to set up the backend.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Define Enums for States
CREATE TYPE feeder_state AS ENUM ('IDLE', 'PRECHECK', 'SPINUP', 'DISPENSE', 'CLEARING', 'COMPLETE', 'FAULT', 'ESTOP');
CREATE TYPE hopper_status AS ENUM ('OK', 'LOW', 'CRITICAL');
CREATE TYPE battery_status AS ENUM ('OK', 'LOW', 'CRITICAL');

-- Table: users (Extends Supabase auth.users if needed, or standalone profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    farm_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: deployment_zones (Group cages geographically)
CREATE TABLE IF NOT EXISTS public.deployment_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    latitude DECIMAL,
    longitude DECIMAL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: feeders (Main device registry)
CREATE TABLE IF NOT EXISTS public.feeders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    zone_id UUID REFERENCES public.deployment_zones(id) ON DELETE SET NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Current Status Cache
    online BOOLEAN DEFAULT false,
    state feeder_state DEFAULT 'IDLE',
    
    -- Telemetry Cache
    battery_voltage DECIMAL(5, 2) DEFAULT 12.5,
    battery_status battery_status DEFAULT 'OK',
    hopper_percent DECIMAL(5, 2) DEFAULT 100.0,
    hopper_status hopper_status DEFAULT 'OK',
    tilt_angle_deg DECIMAL(5, 2) DEFAULT 0.0,
    tilt_status TEXT DEFAULT 'OK',
    
    -- Mechanical Safety Cache
    lid_closed BOOLEAN DEFAULT true,
    estop_active BOOLEAN DEFAULT false,
    remote_estop_latched BOOLEAN DEFAULT false,
    
    -- Spreader and Gate Info
    spreader_max_level INT DEFAULT 10,
    spreader_current_level INT DEFAULT 0,
    spreader_running BOOLEAN DEFAULT false,
    spreader_status TEXT DEFAULT 'OK',
    
    gate_status TEXT DEFAULT 'CLOSED',
    gate_position_steps INT DEFAULT 0,
    feeding_active BOOLEAN DEFAULT false,
    
    -- Operational Logs
    feed_cycle_count INT DEFAULT 0,
    last_feed_result TEXT,
    last_fault_message TEXT,
    signal_strength INT DEFAULT -50,
    location_name TEXT,
    
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: feeder_profiles (Fish configuration and settings)
CREATE TABLE IF NOT EXISTS public.feeder_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    feeder_id UUID UNIQUE REFERENCES public.feeders(id) ON DELETE CASCADE,
    
    -- Fish Data
    fish_type TEXT DEFAULT 'Salmon',
    cage_size TEXT,
    fish_age TEXT,
    stock_count INT DEFAULT 0,
    average_fish_mass_kg DECIMAL(6, 3),
    
    -- Settings
    hopper_warning_threshold DECIMAL DEFAULT 20.0,
    battery_warning_threshold DECIMAL DEFAULT 11.5,
    battery_critical_threshold DECIMAL DEFAULT 10.8,
    tilt_critical_threshold DECIMAL DEFAULT 15.0,
    
    notes TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: feed_recommendations (Derived by Aqua Pulse, synced back)
CREATE TABLE IF NOT EXISTS public.feed_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    feeder_id UUID UNIQUE REFERENCES public.feeders(id) ON DELETE CASCADE,
    
    estimated_biomass_kg DECIMAL(10, 2),
    recommended_daily_feed_kg DECIMAL(8, 2),
    recommended_feed_frequency_per_day INT,
    recommended_dispense_duration_sec INT,
    recommended_spreader_level INT,
    
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: feeder_telemetry (Time-series history)
CREATE TABLE IF NOT EXISTS public.feeder_telemetry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    feeder_id UUID REFERENCES public.feeders(id) ON DELETE CASCADE,
    
    state feeder_state,
    battery_voltage DECIMAL(5, 2),
    hopper_percent DECIMAL(5, 2),
    tilt_angle_deg DECIMAL(5, 2),
    
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Create index for faster querying
CREATE INDEX idx_telemetry_feeder_recorded ON public.feeder_telemetry(feeder_id, recorded_at DESC);

-- Table: feeder_alerts
CREATE TABLE IF NOT EXISTS public.feeder_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    feeder_id UUID REFERENCES public.feeders(id) ON DELETE CASCADE,
    
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
    type TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_alerts_feeder_unread ON public.feeder_alerts(feeder_id, is_read);


-- Row Level Security (Simple setup for Demo)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deployment_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feeders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feeder_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feeder_telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feeder_alerts ENABLE ROW LEVEL SECURITY;

-- Allow everything for authenticated users for the scope of the prototype
CREATE POLICY "Allow authenticated read/write on profiles" ON public.profiles FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated read/write on zones" ON public.deployment_zones FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated read/write on feeders" ON public.feeders FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated read/write on feeder_profiles" ON public.feeder_profiles FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated read/write on feed_recommendations" ON public.feed_recommendations FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated read/write on telemetry" ON public.feeder_telemetry FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated read/write on alerts" ON public.feeder_alerts FOR ALL TO authenticated USING (true);
