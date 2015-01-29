#!/usr/bin/env bash

DB_USER=${RECIPEASY_DB_ADMIN_USER-admin}
DB_PASS=${RECIPEASY_DB_ADMIN_PASSWORD-pass}
DB_HOST=${RECIPEASY_DB_HOST-db}
DB_PORT=${RECIPEASY_DB_PORT-5984}
DB_NAME=${RECIPEASY_DB_ACCOUNT_USER-recipeasy}

TS=$(date "+%Y%m%d-%H%M%S")
TAR_FILE="/backups/backup-${TS}.tar.gz"
CURLHOST=${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}
FILE="/tmp/${DB_NAME}.json"
curl -X GET ${CURLHOST}/${DB_NAME}/_all_docs?include_docs=true > ${FILE}

# Tar and gzip the exported files.
tar -zcf ${TAR_FILE} ${FILE}
