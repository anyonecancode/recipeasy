#!/usr/bin/env sh

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


curl -d @"${IMPORT_FILE}" \
  -X POST \
  -H 'Content-Type: application/json' \
  http://admin:pass@db:5984/recipes/_bulk_docs
