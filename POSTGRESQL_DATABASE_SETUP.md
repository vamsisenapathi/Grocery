# PostgreSQL Database Setup Guide
## Grocery Store Application - Complete Database Configuration

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [PostgreSQL Installation](#postgresql-installation)
3. [Database Creation](#database-creation)
4. [User Setup](#user-setup)
5. [Application Configuration](#application-configuration)
6. [Database Schema](#database-schema)
7. [Sample Data Loading](#sample-data-loading)
8. [Verification & Testing](#verification--testing)
9. [Common Issues & Troubleshooting](#common-issues--troubleshooting)
10. [Backup & Restore](#backup--restore)

---

## Prerequisites

### Required Software
- **PostgreSQL 12+** (Recommended: PostgreSQL 15 or 18)
- **Java 25.0.1** (for running the Spring Boot application)
- **Maven 3.9.11** (for building the project)

### System Requirements
- Minimum 4GB RAM
- 10GB free disk space
- Windows/Linux/macOS operating system

---

## PostgreSQL Installation

### Windows Installation

#### Option 1: Using Official Installer

1. **Download PostgreSQL**
   - Visit: https://www.postgresql.org/download/windows/
   - Download PostgreSQL installer (latest version)
   - Choose 64-bit version for Windows

2. **Run Installer**
   ```
   - Double-click the downloaded .exe file
   - Follow the setup wizard
   - Choose installation directory: C:\Program Files\PostgreSQL\<version>
   - Select components: PostgreSQL Server, pgAdmin 4, Command Line Tools
   ```

3. **Set Superuser Password**
   - When prompted, set password for `postgres` user
   - **Remember this password** - you'll need it later
   - Recommended password: `admin` (for development) or strong password for production

4. **Configure Port**
   - Default port: `5432`
   - Keep default unless port is already in use

5. **Locale Settings**
   - Use default locale settings

6. **Complete Installation**
   - Click through remaining steps
   - Launch Stack Builder: **No** (not required)

#### Option 2: Using Chocolatey (Package Manager)

```powershell
# Install Chocolatey first (if not installed)
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))

# Install PostgreSQL
choco install postgresql -y

# Verify installation
psql --version
```

### Linux Installation (Ubuntu/Debian)

```bash
# Update package list
sudo apt update

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify installation
psql --version
sudo -u postgres psql --version
```

### macOS Installation

```bash
# Using Homebrew
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Verify installation
psql --version
```

---

## Database Creation

### Method 1: Using psql Command Line

#### Windows
```powershell
# Open PowerShell or Command Prompt
# Navigate to PostgreSQL bin directory
cd "C:\Program Files\PostgreSQL\<version>\bin"

# Connect to PostgreSQL as postgres user
.\psql.exe -U postgres

# Enter the password you set during installation
```

#### Linux/macOS
```bash
# Switch to postgres user
sudo -u postgres psql

# Or connect directly
psql -U postgres
```

### Create Database

```sql
-- Create the database
CREATE DATABASE grocerydb;

-- Verify database creation
\l

-- Connect to the database
\c grocerydb

-- Verify connection
SELECT current_database();
```

**Expected Output:**
```
CREATE DATABASE
You are now connected to database "grocerydb" as user "postgres".
 current_database 
------------------
 grocerydb
(1 row)
```

---

## User Setup

### Create Application User

```sql
-- Create user with password
CREATE USER admin WITH PASSWORD 'admin';

-- Grant all privileges on database
GRANT ALL PRIVILEGES ON DATABASE grocerydb TO admin;

-- Connect to grocerydb
\c grocerydb

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO admin;

-- Grant future table privileges
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO admin;

-- Verify user creation
\du
```

**Expected Output:**
```
                                   List of roles
 Role name |                         Attributes                         | Member of 
-----------+------------------------------------------------------------+-----------
 admin     |                                                            | {}
 postgres  | Superuser, Create role, Create DB, Replication, Bypass RLS | {}
```

### Alternative: Superuser Privileges (Development Only)

```sql
-- Grant superuser privileges (NOT recommended for production)
ALTER USER admin WITH SUPERUSER;

-- Verify
\du admin
```

**⚠️ Security Note**: For production environments, use minimal privileges:
```sql
GRANT CONNECT ON DATABASE grocerydb TO admin;
GRANT USAGE ON SCHEMA public TO admin;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO admin;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO admin;
```

---

## Application Configuration

### File: `application.yml`

Located at: `src/main/resources/application.yml`

```yaml
spring:
  application:
    name: grocery-backend
  
  datasource:
    url: jdbc:postgresql://localhost:5432/grocerydb
    username: admin
    password: admin
    driver-class-name: org.postgresql.Driver
  
  jpa:
    hibernate:
      ddl-auto: create  # Options: create, update, validate, none
    show-sql: true
    properties:
      hibernate:
        format_sql: true
        dialect: org.hibernate.dialect.PostgreSQLDialect
    database-platform: org.hibernate.dialect.PostgreSQLDialect
    defer-datasource-initialization: true
  
  sql:
    init:
      mode: never  # Options: always, never, embedded
      data-locations: classpath:data.sql

server:
  port: 8081
  servlet:
    context-path: /api/v1

jwt:
  secret: grocery-store-secret-key-for-jwt-token-generation-minimum-256-bits-required-for-hs256-algorithm
  expiration: 86400000 # 24 hours

logging:
  level:
    com.groceryapp.backend: DEBUG
    org.springframework.web: DEBUG
    org.hibernate.SQL: DEBUG
    org.hibernate.type.descriptor.sql.BasicBinder: TRACE
```

### Configuration Options Explained

| Property | Value | Description |
|----------|-------|-------------|
| `ddl-auto: create` | create, update, validate, none | **create**: Drop and recreate tables on startup<br>**update**: Update schema without dropping<br>**validate**: Only validate schema<br>**none**: No schema management |
| `show-sql: true` | true/false | Log SQL statements to console |
| `format_sql: true` | true/false | Format SQL for readability |
| `init.mode: never` | always, never, embedded | **always**: Run data.sql on startup<br>**never**: Don't run data.sql<br>**embedded**: Run only for embedded DBs |

### Environment-Specific Configuration

#### Development Environment
```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: create  # Recreate tables on each run
    show-sql: true      # Show SQL in logs
  sql:
    init:
      mode: always      # Load sample data
```

#### Production Environment
```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: validate  # Only validate, don't modify
    show-sql: false       # Disable SQL logging
  sql:
    init:
      mode: never         # Don't auto-load data
```

---

## Database Schema

### Automatic Schema Creation

The application uses **JPA/Hibernate** to automatically create database tables based on entity classes.

### Entity Classes

| Entity | Description | Primary Key |
|--------|-------------|-------------|
| **User** | Customer accounts | UUID |
| **Product** | Product catalog | UUID |
| **Category** | Product categories | UUID |
| **Subcategory** | Product subcategories | UUID |
| **Cart** | Shopping carts | UUID |
| **CartItem** | Items in cart | UUID |
| **Order** | Customer orders | UUID |
| **OrderItem** | Items in order | UUID |
| **Address** | Delivery addresses | UUID |

### Generated Tables

When you start the application, Hibernate will create these tables:

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subcategories table
CREATE TABLE subcategories (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category_id UUID REFERENCES categories(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category_id UUID REFERENCES categories(id),
    subcategory_id UUID REFERENCES subcategories(id),
    stock_quantity INTEGER DEFAULT 0,
    in_stock BOOLEAN DEFAULT true,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Carts table
CREATE TABLE carts (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cart Items table
CREATE TABLE cart_items (
    id UUID PRIMARY KEY,
    cart_id UUID REFERENCES carts(id),
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Addresses table
CREATE TABLE addresses (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    full_name VARCHAR(255),
    phone_number VARCHAR(20),
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    is_default BOOLEAN DEFAULT false,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id),
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    payment_method VARCHAR(50),
    delivery_address_id UUID REFERENCES addresses(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items table
CREATE TABLE order_items (
    id UUID PRIMARY KEY,
    order_id UUID REFERENCES orders(id),
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL
);
```

### Indexes (Auto-created by JPA)

```sql
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_subcategory ON products(subcategory_id);
CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX idx_cart_items_product ON cart_items(product_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_addresses_user ON addresses(user_id);
```

---

## Sample Data Loading

### Option 1: Automatic Loading (Recommended for Development)

**Configuration:**
```yaml
spring:
  sql:
    init:
      mode: always
      data-locations: classpath:data.sql
```

The `data.sql` file contains 162 sample products across categories:
- 38 Fruits products
- Multiple Vegetables products
- And more...

### Option 2: Manual Loading

```bash
# Navigate to backend directory
cd "Grocery Store Backend JavaSpringboot"

# Load data using psql
psql -U admin -d grocerydb -f data.sql

# Enter password when prompted
```

### Option 3: Using pgAdmin 4

1. Open pgAdmin 4
2. Connect to server (localhost)
3. Navigate to: Databases → grocerydb
4. Right-click on grocerydb → **Query Tool**
5. Open `data.sql` file
6. Click **Execute** (F5)

### Verify Data Load

```sql
-- Check products count
SELECT COUNT(*) FROM products;

-- Expected: 162 rows

-- View sample products
SELECT id, name, category, price, stock_quantity 
FROM products 
LIMIT 10;

-- Check categories
SELECT DISTINCT category FROM products;
```

---

## Verification & Testing

### Step 1: Check PostgreSQL Service

#### Windows
```powershell
# Check if PostgreSQL service is running
Get-Service -Name postgresql*

# Start service if stopped
Start-Service postgresql-x64-<version>
```

#### Linux
```bash
# Check service status
sudo systemctl status postgresql

# Start if stopped
sudo systemctl start postgresql
```

### Step 2: Test Database Connection

```bash
# Test connection with psql
psql -U admin -d grocerydb -h localhost -p 5432

# If successful, you'll see:
# grocerydb=>
```

### Step 3: Verify Tables

```sql
-- List all tables
\dt

-- Expected output:
Schema |    Name       | Type  | Owner
-------+---------------+-------+-------
public | addresses     | table | admin
public | cart_items    | table | admin
public | carts         | table | admin
public | categories    | table | admin
public | order_items   | table | admin
public | orders        | table | admin
public | products      | table | admin
public | subcategories | table | admin
public | users         | table | admin
```

### Step 4: Start Application & Test

```bash
# Navigate to backend directory
cd "Grocery Store Backend JavaSpringboot"

# Clean and build
mvn clean package -DskipTests

# Run application
java -jar target/grocery-backend.jar
```

**Check logs for:**
```
Started GroceryAppBackendApplication in X seconds
Tomcat started on port(s): 8081 (http)
```

### Step 5: Test API Endpoints

```bash
# Test health endpoint
curl http://localhost:8081/api/v1/health

# Test products endpoint (requires authentication)
curl http://localhost:8081/api/v1/products
```

---

## Common Issues & Troubleshooting

### Issue 1: Connection Refused

**Error:**
```
org.postgresql.util.PSQLException: Connection to localhost:5432 refused
```

**Solutions:**
```bash
# Check if PostgreSQL is running
# Windows
Get-Service postgresql*

# Linux
sudo systemctl status postgresql

# Start PostgreSQL
# Windows
net start postgresql-x64-15

# Linux
sudo systemctl start postgresql
```

### Issue 2: Authentication Failed

**Error:**
```
FATAL: password authentication failed for user "admin"
```

**Solutions:**

1. **Reset Password:**
```sql
-- Connect as postgres superuser
psql -U postgres

-- Reset password
ALTER USER admin WITH PASSWORD 'admin';
```

2. **Check pg_hba.conf:**
```bash
# Location (Windows): C:\Program Files\PostgreSQL\<version>\data\pg_hba.conf
# Location (Linux): /etc/postgresql/<version>/main/pg_hba.conf

# Add/modify this line:
host    all             all             127.0.0.1/32            md5

# Restart PostgreSQL
```

### Issue 3: Database Does Not Exist

**Error:**
```
FATAL: database "grocerydb" does not exist
```

**Solution:**
```sql
-- Connect as postgres
psql -U postgres

-- Create database
CREATE DATABASE grocerydb;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE grocerydb TO admin;
```

### Issue 4: Port Already in Use

**Error:**
```
Port 5432 is already in use
```

**Solutions:**

**Option A: Change PostgreSQL Port**
```
# Edit postgresql.conf
# Windows: C:\Program Files\PostgreSQL\<version>\data\postgresql.conf
# Linux: /etc/postgresql/<version>/main/postgresql.conf

# Change line:
port = 5433  # or any available port

# Restart PostgreSQL
# Update application.yml:
spring.datasource.url=jdbc:postgresql://localhost:5433/grocerydb
```

**Option B: Stop Conflicting Service**
```powershell
# Windows - Find process using port 5432
netstat -ano | findstr :5432

# Kill process
taskkill /PID <process_id> /F
```

### Issue 5: Schema/Table Already Exists

**Error:**
```
relation "products" already exists
```

**Solution:**
```yaml
# Change application.yml
spring:
  jpa:
    hibernate:
      ddl-auto: update  # Instead of create
```

Or manually drop tables:
```sql
-- Drop all tables (use with caution!)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO admin;
```

---

## Backup & Restore

### Create Backup

```bash
# Backup entire database
pg_dump -U admin -h localhost -d grocerydb -F c -f grocerydb_backup.dump

# Backup with SQL format
pg_dump -U admin -h localhost -d grocerydb -f grocerydb_backup.sql

# Backup specific table
pg_dump -U admin -h localhost -d grocerydb -t products -f products_backup.sql
```

### Restore Backup

```bash
# Restore custom format
pg_restore -U admin -h localhost -d grocerydb grocerydb_backup.dump

# Restore SQL format
psql -U admin -h localhost -d grocerydb < grocerydb_backup.sql

# Restore to new database
createdb -U postgres newdb
pg_restore -U admin -h localhost -d newdb grocerydb_backup.dump
```

### Automated Backup Script (Windows PowerShell)

```powershell
# backup-db.ps1
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupFile = "grocerydb_backup_$timestamp.sql"
$pgDumpPath = "C:\Program Files\PostgreSQL\15\bin\pg_dump.exe"

& $pgDumpPath -U admin -h localhost -d grocerydb -f $backupFile

Write-Host "Backup created: $backupFile"
```

### Automated Backup Script (Linux)

```bash
#!/bin/bash
# backup-db.sh

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="grocerydb_backup_$TIMESTAMP.sql"

pg_dump -U admin -h localhost -d grocerydb -f $BACKUP_FILE

echo "Backup created: $BACKUP_FILE"
```

---

## Performance Optimization

### Vacuum & Analyze

```sql
-- Vacuum database
VACUUM ANALYZE;

-- Vacuum specific table
VACUUM ANALYZE products;

-- Full vacuum (locks table)
VACUUM FULL products;
```

### Monitor Query Performance

```sql
-- Enable query timing
\timing

-- Explain query plan
EXPLAIN ANALYZE 
SELECT * FROM products WHERE category_id = '<uuid>';

-- Check slow queries
SELECT pid, now() - pg_stat_activity.query_start AS duration, query
FROM pg_stat_activity
WHERE state = 'active' 
  AND now() - pg_stat_activity.query_start > interval '5 minutes';
```

### Connection Pooling (Recommended)

```yaml
# application.yml
spring:
  datasource:
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000
```

---

## Security Best Practices

### 1. Strong Passwords
```sql
-- Use strong passwords in production
ALTER USER admin WITH PASSWORD 'StrongP@ssw0rd!2024$';
```

### 2. Restrict Network Access

Edit `pg_hba.conf`:
```
# Allow localhost only
host    grocerydb       admin           127.0.0.1/32            md5

# Deny all others
host    all             all             0.0.0.0/0               reject
```

### 3. SSL/TLS Encryption

```yaml
# application.yml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/grocerydb?ssl=true&sslmode=require
```

### 4. Regular Updates
```bash
# Update PostgreSQL regularly
sudo apt update && sudo apt upgrade postgresql
```

---

## Quick Reference Commands

### PostgreSQL Commands
```bash
# Start PostgreSQL
sudo systemctl start postgresql  # Linux
net start postgresql-x64-15      # Windows

# Stop PostgreSQL
sudo systemctl stop postgresql   # Linux
net stop postgresql-x64-15       # Windows

# Restart PostgreSQL
sudo systemctl restart postgresql  # Linux
net stop postgresql-x64-15 && net start postgresql-x64-15  # Windows

# Status
sudo systemctl status postgresql  # Linux
Get-Service postgresql*           # Windows PowerShell
```

### psql Commands
```sql
\l              -- List databases
\c grocerydb    -- Connect to database
\dt             -- List tables
\d products     -- Describe table
\du             -- List users
\q              -- Quit
```

### Useful SQL Queries
```sql
-- Check database size
SELECT pg_size_pretty(pg_database_size('grocerydb'));

-- Check table sizes
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size(tablename::regclass)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(tablename::regclass) DESC;

-- Active connections
SELECT * FROM pg_stat_activity WHERE datname = 'grocerydb';

-- Kill connection
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE datname = 'grocerydb' AND pid <> pg_backend_pid();
```

---

## Summary Checklist

- [ ] PostgreSQL installed and running
- [ ] Database `grocerydb` created
- [ ] User `admin` created with password `admin`
- [ ] Privileges granted to admin user
- [ ] `application.yml` configured correctly
- [ ] Application starts without errors
- [ ] Tables created automatically by Hibernate
- [ ] Sample data loaded (if using data.sql)
- [ ] API endpoints accessible
- [ ] Backup strategy implemented

---

## Support & Resources

### Official Documentation
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Spring Boot Data JPA**: https://spring.io/projects/spring-data-jpa
- **Hibernate Docs**: https://hibernate.org/orm/documentation/

### Community Support
- **Stack Overflow**: https://stackoverflow.com/questions/tagged/postgresql
- **PostgreSQL Mailing Lists**: https://www.postgresql.org/list/

---

## Conclusion

This guide provides a complete step-by-step setup for the PostgreSQL database for the Grocery Store application. Follow each section carefully, and refer to the troubleshooting section if you encounter any issues.

**Current Application Configuration:**
- **Database**: `grocerydb`
- **User**: `admin`
- **Password**: `admin`
- **Port**: `5432`
- **Host**: `localhost`

**Application runs on:**
- **Port**: `8081`
- **Context Path**: `/api/v1`
- **Full Base URL**: `http://localhost:8081/api/v1`

---

*Last Updated: November 13, 2025*
*Version: 1.0.0*
*Application: Grocery Store Backend v1.0.0*
