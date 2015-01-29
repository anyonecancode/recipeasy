from flask import Flask, request, Response
import urllib2
from json import dumps as to_json
from base64 import encodestring
from hashlib import md5
from os import getenv

app = Flask(__name__)
app.debug = getenv('RECIPEASY_API_DEBUG', False)
app.api_spec = None

url_prefix = getenv('RECIPEASY_API_URL_PREFIX', '/api')

DB_PROTOCOL = getenv('RECIPEASY_DB_PROTOCOL', 'http')
DB_HOST = getenv('RECIPEASY_DB_HOST', 'db')
DB_PORT = getenv('RECIPEASY_DB_PORT', '5984')

ADMIN_USER = getenv('RECIPEASY_DB_ACCOUNT_USER', 'recipeasy')
ADMIN_PASSWORD = getenv('RECIPEASY_DB_ACCOUNT_PASSWORD', 'pass')
base64string = encodestring('%s:%s' % (ADMIN_USER, ADMIN_PASSWORD))[:-1]

ACCOUNT_USER = getenv('RECIPEASY_DB_ACCOUNT_USER', 'recipeasy')
ACCOUNT_PASSWORD = getenv('RECIPEASY_DB_ACCOUNT_PASSWORD', 'pass')

SEARCH_PROTOCOL = getenv('RECIPEASY_SEARCH_PROTOCOL', 'http')
SEARCH_HOST = getenv('RECIPEASY_SEARCH_HOST', 'search')
SEARCH_PORT = getenv('RECIPEASY_SEARCH_PORT', '9200')


def dbconn(endpoint, data=None):
    url = "{0}://{1}:{2}/{3}".format(DB_PROTOCOL, DB_HOST, DB_PORT, endpoint)

    if data:
        data = to_json(data)

    req = urllib2.Request(url, data, {'Content-Type': 'application/json'})
    req.add_header("Authorization", "Basic %s" % base64string)
    handle = urllib2.urlopen(req)
    return Response(handle.read(), mimetype='application/json')


@app.route(url_prefix + '/recipes', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        recipe = request.json
        if '_id' not in recipe:
            recipe['_id'] = md5(repr(recipe)).hexdigest()
        try:
            return dbconn(ACCOUNT_USER, recipe)
        except Exception, e:
            return Response('{"details": "%s"}' % e.reason, e.code, mimetype='application/json')
    else:
        endpoint = '%s/_design/by_title/_view/ByTitle' % ACCOUNT_USER
        return dbconn(endpoint)


@app.route(url_prefix + '/recipes/<recipe_id>', methods=['GET'])
def recipe(recipe_id):
    endpoint = '%s/%s' % (ACCOUNT_USER, recipe_id)
    return dbconn(endpoint)


@app.route(url_prefix + '/search', methods=['POST'])
def search():
    terms = request.json['terms']
    endpoint = "{0}://{1}:{2}/recipes/_search".format(SEARCH_PROTOCOL, SEARCH_HOST, SEARCH_PORT)
    data = {
        "query": {
            "bool": {
                "should": [
                    {"match": {"title": terms}},
                    {"match": {"description":  terms}},
                    {"match": {"ingredients":  terms}},
                    {"match": {"directions":  terms}}
                ]
            }
        },
        "highlight": {
            "fields": {
                "title": {},
                "description": {},
                "ingredients": {},
                "directions": {}
            }
        }
    }
    req = urllib2.Request(endpoint, to_json(data), {'Content-Type': 'application/json'})
    handle = urllib2.urlopen(req)
    return Response(handle.read(), mimetype='application/json')


if __name__ == '__main__':
    app.run('0.0.0.0')
