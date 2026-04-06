-- Aqua Pulse Seed Data
-- Paste this script into your Supabase SQL Editor AFTER running schema.sql

-- Insert a Mock User Profile (replace with actual auth.uid() later if using real auth)
INSERT INTO public.profiles (id, email, full_name, farm_name)
VALUES ('00000000-0000-0000-0000-000000000001', 'demo@aquapulse.com', 'Demo User', 'Aqua Pulse Farm')
ON CONFLICT (id) DO NOTHING;

-- Insert a Deployment Zone
INSERT INTO public.deployment_zones (id, name, description, latitude, longitude, user_id)
VALUES ('11111111-1111-1111-1111-111111111111', 'North Pen', 'Primary offshore feeding pen', 44.6488, -63.5752, '00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- Insert Mock Feeders
INSERT INTO public.feeders (id, device_id, name, zone_id, user_id, online, state, battery_voltage, battery_status, hopper_percent, hopper_status, tilt_angle_deg, tilt_status, lid_closed, estop_active, remote_estop_latched, spreader_max_level, spreader_current_level, spreader_running, gate_status, gate_position_steps, feeding_active, feed_cycle_count)
VALUES 
  ('22222222-2222-2222-2222-222222222221', 'FDR-001', 'Alpha Feeder', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', true, 'IDLE', 12.5, 'OK', 85.0, 'OK', 2.1, 'OK', true, false, false, 10, 0, false, 'CLOSED', 0, false, 42),
  ('22222222-2222-2222-2222-222222222222', 'FDR-002', 'Beta Feeder', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', true, 'FAULT', 10.5, 'CRITICAL', 15.0, 'LOW', 1.5, 'OK', true, false, false, 10, 0, false, 'CLOSED', 0, false, 134),
  ('22222222-2222-2222-2222-222222222223', 'FDR-003', 'Gamma Feeder', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', false, 'IDLE', 11.8, 'OK', 45.0, 'OK', -0.5, 'OK', true, false, false, 10, 0, false, 'CLOSED', 0, false, 87)
ON CONFLICT (id) DO NOTHING;

-- Insert Mock Profiles
INSERT INTO public.feeder_profiles (feeder_id, fish_type, cage_size, fish_age, stock_count, average_fish_mass_kg)
VALUES 
  ('22222222-2222-2222-2222-222222222221', 'Salmon', '15m x 15m', 'Smolt', 5000, 0.25),
  ('22222222-2222-2222-2222-222222222222', 'Salmon', '15m x 15m', 'Grow-out', 4500, 1.2),
  ('22222222-2222-2222-2222-222222222223', 'Salmon', '15m x 15m', 'Smolt', 5000, 0.3)
ON CONFLICT (feeder_id) DO NOTHING;

-- Insert Mock Recommended Feed
INSERT INTO public.feed_recommendations (feeder_id, estimated_biomass_kg, recommended_daily_feed_kg, recommended_feed_frequency_per_day, recommended_dispense_duration_sec, recommended_spreader_level)
VALUES 
  ('22222222-2222-2222-2222-222222222221', 1250.0, 18.75, 4, 30, 8),
  ('22222222-2222-2222-2222-222222222222', 5400.0, 54.0, 6, 45, 10),
  ('22222222-2222-2222-2222-222222222223', 1500.0, 22.5, 4, 35, 8)
ON CONFLICT (feeder_id) DO NOTHING;
