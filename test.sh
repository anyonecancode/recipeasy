#!/bin/bash
DB_HOST='db'
value=`cat data/scripts/couchdb_river.json`
#value="hello ${HOST}"
echo $(eval echo $value)
