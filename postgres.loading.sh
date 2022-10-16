#!/bin/sh

set -e
  
host="$1"
shift
  
until POSTGRES_HOST=postgres-users yarn typeorm query 'DROP TABLE IF EXISTS public."user"' ; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done
  
>&2 echo "Postgres is up - executing command"

POSTGRES_HOST=postgres-users yarn db:migration:generate migrations/InitialConfig
POSTGRES_HOST=postgres-users yarn db:migrate
yarn start:prod && tail -f /dev/null