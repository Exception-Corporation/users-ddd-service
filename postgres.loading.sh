#!/bin/sh

set -e
  
host="$1"
shift
  
until POSTGRES_HOST=postgres-users yarn typeorm query 'SELECT * FROM public."user"' ; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done
  
>&2 echo "Postgres is up - executing command"

yarn start:prod && tail -f /dev/null