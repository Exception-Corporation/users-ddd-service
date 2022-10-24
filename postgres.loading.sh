#!/bin/sh

set -e
  
host="$1"
shift
  
until POSTGRES_HOST=$host yarn typeorm query 'SELECT * FROM public."user"' ; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done
  
>&2 echo "Postgres is up - executing command"

until POSTGRES_HOST=$host yarn --silent db:migration:generate migrations/InitialConfig ; do
  >&2 echo "Migration running"
  sleep 1
  break
done

POSTGRES_HOST=$host yarn --silent db:migrate 
yarn start:prod && tail -f /dev/null