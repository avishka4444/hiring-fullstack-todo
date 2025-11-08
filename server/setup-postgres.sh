#!/bin/bash

# PostgreSQL Setup Script
# This script helps set up PostgreSQL for the TODO app

PG_DATA_DIR="/opt/homebrew/var/postgresql@14"
PG_HBA_CONF="$PG_DATA_DIR/pg_hba.conf"
DB_NAME="todo_db"
DB_USER="avishka"

echo "🔧 PostgreSQL Setup Script"
echo "=========================="
echo ""

# Check if PostgreSQL is running
if ! brew services list | grep -q "postgresql@14.*started"; then
    echo "❌ PostgreSQL is not running. Starting it..."
    brew services start postgresql@14
    sleep 2
fi

echo "📝 Step 1: Backing up pg_hba.conf..."
cp "$PG_HBA_CONF" "$PG_HBA_CONF.backup"

echo "📝 Step 2: Temporarily enabling trust authentication..."
# Create a modified version with trust for local connections
cat > "$PG_HBA_CONF" << 'EOF'
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   all             all                                     trust
host    all             all             127.0.0.1/32            trust
host    all             all             ::1/128                 trust
local   replication     all                                     trust
host    replication     all             127.0.0.1/32            trust
host    replication     all             ::1/128                 trust
EOF

echo "🔄 Step 3: Restarting PostgreSQL..."
brew services restart postgresql@14
sleep 3

echo "📝 Step 4: Setting up database and user..."
# Create database if it doesn't exist
psql -d postgres -c "CREATE DATABASE $DB_NAME;" 2>/dev/null || echo "Database might already exist"

# Set password for user (you can change 'todo_password' to your preferred password)
PASSWORD="${1:-todo_password}"
psql -d postgres -c "ALTER USER $DB_USER WITH PASSWORD '$PASSWORD';" 2>/dev/null || \
psql -d postgres -c "CREATE USER $DB_USER WITH PASSWORD '$PASSWORD';" 2>/dev/null

# Grant privileges
psql -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;" 2>/dev/null

echo "📝 Step 5: Restoring secure authentication..."
# Restore original with md5
cat > "$PG_HBA_CONF" << 'EOF'
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   all             all                                     md5
host    all             all             127.0.0.1/32            md5
host    all             all             ::1/128                 md5
local   replication     all                                     md5
host    replication     all             127.0.0.1/32            md5
host    replication     all             ::1/128                 md5
EOF

echo "🔄 Step 6: Restarting PostgreSQL with secure authentication..."
brew services restart postgresql@14
sleep 3

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Database connection details:"
echo "   Database: $DB_NAME"
echo "   User: $DB_USER"
echo "   Password: $PASSWORD"
echo ""
echo "💡 Update your .env file with:"
echo "   DATABASE_URL=\"postgresql://$DB_USER:$PASSWORD@localhost:5432/$DB_NAME?schema=public\""
echo ""

