#!/usr/bin/env sh

DBHOST=admin:pass@db:5984

curl -X PUT $DBHOST/recipes
curl -X PUT $DBHOST/_users/org.couchdb.user:ziplist -H "Accept: application/json" -H "Content-type: application/json" -d '{"name": "ziplist", "password": "pass", "roles": [], "type": "user"}'
curl -X PUT $DBHOST/recipes/_security -H "Accept: application/json" -H "Content-type: application/json" -d '{"members": {"names": ["ziplist"]}}'
curl -X PUT $DBHOST/recipes/_design/by_title -H "Accept: application/json" -H "Content-type: application/json" -d '{"_id":"_design/by_title","language":"javascript","views":{"ByTitle":{"map":"function(doc) {if (doc.title) {emit(doc.title, doc.title);}}"}}}'
