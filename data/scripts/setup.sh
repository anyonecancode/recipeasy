#!/usr/bin/env sh

DBHOST=admin:pass@db:5984
SEARCHOST=search:9200
curl -X PUT $DBHOST/recipes -H "Accept: application/json" -H "Content-type: application/json"
curl -X PUT $DBHOST/_users/org.couchdb.user:ziplist -H "Accept: application/json" -H "Content-type: application/json" -d '{"name": "ziplist", "password": "pass", "roles": [], "type": "user"}'
curl -X PUT $DBHOST/recipes/_security -H "Accept: application/json" -H "Content-type: application/json" -d '{"members": {"names": ["ziplist"]}}'
curl -X PUT $DBHOST/recipes/_design/by_title -H "Accept: application/json" -H "Content-type: application/json" -d "@/app/scripts/design_doc.json"
curl -X PUT $SEARCHOST/_river/recipes/_meta -H "Accept: application/json" -H "Content-type: application/json" -d "@/app/scripts/couchdb_river.json"
