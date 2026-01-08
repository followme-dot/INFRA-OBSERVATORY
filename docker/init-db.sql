-- =============================================
-- INFRA OBSERVATORY - Database Initialization
-- =============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For text search

-- Note: TimescaleDB extension is enabled by default in the timescale/timescaledb image

-- Create the observatory database if it doesn't exist (handled by POSTGRES_DB env var)

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE observatory TO postgres;

-- =============================================
-- Initial Platform Data
-- =============================================

-- We'll insert initial platforms via Alembic migrations or seed script
-- This is just for reference

/*
INSERT INTO platforms (code, name, description, color, criticality) VALUES
('infrabank', 'INFRABANK', 'Banca Digital Híbrida TradFi + DeFi', '#00d4ff', 'critical'),
('infrapay', 'INFRA PAY & TREASURY', 'Pagos Internacionales y Tesorería IA', '#7c3aed', 'critical'),
('infravault', 'INFRA VAULT CORE', 'Plataforma Multilateral de Liquidez', '#10b981', 'critical'),
('infradigital', 'INFRA DIGITAL ASSETS', 'Custodia y Trading Institucional', '#f59e0b', 'critical'),
('infracoinn', 'INFRACOINN', 'Tokenización de Activos Reales', '#ec4899', 'high'),
('infradevtech', 'INFRA Dev·Tech', 'DevTools SaaS Marketplace', '#3b82f6', 'high'),
('infraforge', 'INFRA FORGE', 'Smart Contracts AI', '#ef4444', 'medium'),
('infrainsurance', 'INFRA Global Insurance', 'Seguros Multi-Línea', '#06b6d4', 'critical'),
('infraschool', 'INFRA SCHOOL', 'EdTech + Fintech Educativo', '#8b5cf6', 'medium');
*/

-- Log successful initialization
DO $$
BEGIN
    RAISE NOTICE 'INFRA Observatory database initialized successfully';
END
$$;
