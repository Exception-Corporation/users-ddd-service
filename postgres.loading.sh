#!/bin/sh

set -e
  
host="$1"
shift
  
until POSTGRES_HOST=$host yarn typeorm query 'SELECT datname FROM pg_database' ; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done
  
>&2 echo "Postgres is up - executing command"

until POSTGRES_HOST=$host yarn --silent db:migration:generate migrations/InitialConfig ; do
  >&2 echo "Migration creating"
  sleep 1
  break
done

until POSTGRES_HOST=$host yarn --silent db:migrate  ; do
  >&2 echo "Migration running"
  sleep 1
  break
done

until POSTGRES_HOST=$host yarn create:user ; do
  >&2 echo "Creating admin"
  sleep 1
  break
done

pm2-runtime start ecosystem.yml