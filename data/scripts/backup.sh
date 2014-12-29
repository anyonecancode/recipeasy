#!/usr/bin/env bash
#
# Export a list of CouchDB databases from the server to JSON files.
# Then bundle the exported files into a tar archive.
TS=$(date "+%Y%m%d-%H%M%S")
TAR_FILE="/backups/backup-${TS}.tar.gz"
DBHOST=admin:pass@db:5984
DATABASES=(recipes)

FILES=""
for DATABASE in ${DATABASES}; do
  FILE="/tmp/${DATABASE}.json"

  curl -X GET $DBHOST/${DATABASE}/_all_docs?include_docs=true > ${FILE}

  # Build a list of the files to add to the archive.
  FILES="${FILES} ${FILE}"
done

# Tar and gzip the exported files.
tar -zcf ${TAR_FILE} ${FILES}
