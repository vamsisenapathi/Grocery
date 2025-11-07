-- Initialize the database for the grocery backend application
-- This file is executed automatically when the PostgreSQL container starts

-- Create the database if it doesn't exist (though Docker should handle this)
-- The POSTGRES_DB environment variable should create the database automatically

-- Set timezone
SET timezone = 'UTC';

-- Enable UUID extension for PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- You can add any additional database initialization here
-- Tables will be created automatically by Hibernate DDL