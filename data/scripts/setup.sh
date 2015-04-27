#!/usr/bin/env bash

#Setup Couchdb
DB_HOST=${RECIPEASY_DB_HOST-db}
DB_PORT=${RECIPEASY_DB_PORT-5984}
DB_PROTOCOL=${RECIPEASY_DB_PROTOCOL-http}
DB_ADMIN_USER=${RECIPEASY_DB_ADMIN_USER-admin}
DB_ADMIN_PASSWORD=${RECIPEASY_DB_ADMIN_PASSWORD-pass}
DB_NAME=${RECIPEASY_DB_ACCOUNT_USER-recipeasy}
DB_ACCOUNT_USER=${RECIPEASY_DB_ACCOUNT_USER-recipeasy}
DB_ACCOUNT_PASSWORD=${RECIPEASY_DB_ACCOUNT_PASSWORD-pass}

CURLHOST=${DB_ADMIN_USER}:${DB_ADMIN_PASSWORD}@${DB_HOST}:${DB_PORT}

curl -X PUT ${CURLHOST}/${DB_NAME} -H "Accept: application/json" -H "Content-type: application/json"

curl -X PUT ${CURLHOST}/_users/org.couchdb.user:${DB_ACCOUNT_USER} \
  -H "Accept: application/json" \
  -H "Content-type: application/json" \
  -d '{"name": "'${DB_ACCOUNT_USER}'", "password": "'${DB_ACCOUNT_PASSWORD}'", "roles": [], "type": "user"}'

curl -X PUT ${CURLHOST}/${DB_NAME}/_security \
  -H "Accept: application/json" \
  -H "Content-type: application/json" \
  -d '{"members": {"names": ["'${DB_ACCOUNT_USER}'"]}}'

curl -X PUT ${CURLHOST}/${DB_NAME}/_design/by_title \
  -H "Accept: application/json" \
  -H "Content-type: application/json" \
  -d "@/app/scripts/design_doc.json"



#Setup Elasticsearch
SEARCH_HOST=${RECIPEASY_SEARCH_HOST-search}
SEARCH_PORT=${RECIPEASY_SEARCH_PORT-9200}
SEARCH_PROTOCOL=${RECIPEASY_SEARCH_PROTOCOL-http}

echo "Setting up recipes index"

curl -X PUT ${SEARCH_HOST}:${SEARCH_PORT}/recipes \
  -H "Accept: application/json" \
  -H "Content-type: application/json" \

echo "Setting up search-db change tracker"
curl -X PUT ${SEARCH_HOST}:${SEARCH_PORT}/recipes/changes/1 \
  -H "Accept: application/json" \
  -H "Content-type: application/json" \
  -d '{"last_seq":"1"}'
