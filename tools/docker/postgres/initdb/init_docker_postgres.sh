#!/usr/bin/env bash
DATABASE_NAME="yumzy_foods"
DATABASE_USER="postgres"
DATABASE_PASSWORD="postgres"

echo "*** CREATING DATABASE ***"

# create default database
gosu -v --single <<EOSQL
    DROP DATABASE IF EXISTS "$DATABASE_NAME";
    CREATE DATABASE "$DATABASE_NAME";
    DROP USER IF EXISTS "$DATABASE_USER"
    CREATE USER "$DATABASE_USER" with encrypted password "$DATABASE_PASSWORD";
    GRANT ALL PRIVILEGES ON DATABASE "$DATABASE_NAME" TO "$DATABASE_USER";
EOSQL

echo "*** DATABASE CREATED ***"
