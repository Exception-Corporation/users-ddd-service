#!/bin/sh

# Set -e option to exit script if any command fails
set -e

# Declare function to check if Postgres is available
check_postgres_availability() {
  until POSTGRES_HOST=$postgres_host POSTGRES_PORT=5432 yarn typeorm query 'SELECT datname FROM pg_database' ; do
    >&2 echo "Postgres is unavailable - sleeping"
    sleep 1
  done
}

# Declare function to create initial database configuration
create_initial_config() {
  until POSTGRES_HOST=$postgres_host POSTGRES_PORT=5432 yarn --silent db:migration:generate migrations/InitialConfig ; do
    >&2 echo "Migration creating"
    sleep 1
    break
  done
}

# Declare function to run database migrations
run_database_migrations() {
  until POSTGRES_HOST=$postgres_host POSTGRES_PORT=5432 yarn --silent db:migrate  ; do
    >&2 echo "Migration running"
    sleep 1
    break
  done
}

# Declare function to create admin user
create_admin_user() {
  until POSTGRES_HOST=$postgres_host POSTGRES_PORT=5432 yarn create:user ; do
    >&2 echo "Creating admin"
    sleep 1
    break
  done
}

# Get Postgres host from command line argument
postgres_host="$1"
shift

# Check if Postgres is available and retry until it is
check_postgres_availability

# Create initial database configuration and run migrations
create_initial_config
run_database_migrations

# Create admin user
create_admin_user

# Start pm2 runtime
pm2-runtime start ecosystem.yml
