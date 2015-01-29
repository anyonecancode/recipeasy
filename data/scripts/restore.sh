#!/usr/bin/env bash

ARCHVE="$(ls -1r /backups | head -1)"
EXPORT=/tmp/export.json
IMPORT_FILE=import.json

tar -Ozxf /backups/$ARCHVE > $EXPORT

echo '{"docs":[' > "${IMPORT_FILE}"
cat "${EXPORT}" | \
  sed 's/{\"total_rows\":.*,\"offset\":.*,\"rows\":\[//' | \
  sed 's/.$//' | \
  sed 's/{\"id\":.*,\"key\".*,\"value\":.*,\"doc\"://' | \
  sed 's/\"_rev\":\"[^\"]*\",//' | \
  sed 's/},$/,/' | \
  sed 's/}$//' \
  >> "${IMPORT_FILE}"
echo "}" >> "${IMPORT_FILE}"


DB_PROTOCOL=${RECIPEASY_DB_PROTOCOL-http}
DB_USER=${RECIPEASY_DB_ADMIN_USER-admin}
DB_PASS=${RECIPEASY_DB_ADMIN_PASSWORD-pass}
DB_HOST=${RECIPEASY_DB_HOST-db}
DB_PORT=${RECIPEASY_DB_PORT-5984}
DB_NAME=${RECIPEASY_DB_ACCOUNT_USER-recipeasy}
CURLHOST=${DB_PROTOCOL}://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}

curl -d @"${IMPORT_FILE}" \
  -X POST \
  -H 'Content-Type: application/json' \
  ${CURLHOST}/${DB_NAME}/_bulk_docs
