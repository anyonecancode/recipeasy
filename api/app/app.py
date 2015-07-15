from flask import Flask, request, Response
import urllib2
from json import dumps as to_json, loads as from_json
from base64 import encodestring
from hashlib import md5
from os import getenv
from elasticsearch import Elasticsearch
from bs4 import BeautifulSoup as bs4

app = Flask(__name__)
app.debug = getenv('RECIPEASY_API_DEBUG', False)
app.api_spec = None

url_prefix = getenv('RECIPEASY_API_URL_PREFIX', '/api')

DB_PROTOCOL = getenv('RECIPEASY_DB_PROTOCOL', 'http')
DB_HOST = getenv('RECIPEASY_DB_HOST', 'db')
DB_PORT = getenv('RECIPEASY_DB_PORT', '5984')

ACCOUNT_USER = getenv('RECIPEASY_DB_ACCOUNT_USER', 'recipeasy')
ACCOUNT_PASSWORD = getenv('RECIPEASY_DB_ACCOUNT_PASSWORD', 'pass')
base64string = encodestring('%s:%s' % (ACCOUNT_USER, ACCOUNT_PASSWORD))[:-1]

SEARCH_PROTOCOL = getenv('RECIPEASY_SEARCH_PROTOCOL', 'http')
SEARCH_HOST = getenv('RECIPEASY_SEARCH_HOST', 'search')
SEARCH_PORT = getenv('RECIPEASY_SEARCH_PORT', '9200')

search_client = Elasticsearch(["{0}://{1}:{2}".format(
    SEARCH_PROTOCOL, SEARCH_HOST, SEARCH_PORT)])

last_search_seq = 1


def dbconn(endpoint, data=None, to_object=False):
    url = "{0}://{1}:{2}/{3}".format(DB_PROTOCOL, DB_HOST, DB_PORT, endpoint)

    if data:
        data = to_json(data)

    req = urllib2.Request(url, data, {'Content-Type': 'application/json'})
    req.add_header("Authorization", "Basic %s" % base64string)
    handle = urllib2.urlopen(req)

    if to_object:
        return from_json(handle.read())
    else:
        return Response(handle.read(), mimetype='application/json')


def get_db_changelog():
    last_search_seq = search_client.get('recipes',
                                        doc_type='changes',
                                        id=1)['_source']['last_seq']

    db_changes_endpoint = "{0}/_changes?filter=by_title/recipes&since={1}".format(
        ACCOUNT_USER, last_search_seq)

    return dbconn(db_changes_endpoint, None, True)


def update_search():
    latest_changes = get_db_changelog()

    if len(latest_changes['results']) < 1:
        return

    for result in latest_changes['results']:
        record = dbconn('%s/%s' % (ACCOUNT_USER, result['id']), None, True)
        try:
            search_client.index(index='recipes',
                                doc_type='recipe',
                                id=result['id'],
                                body=record)
        except Exception, e:
            app.logger.info(e)

    search_client.index(index='recipes',
                        doc_type='changes',
                        id=1,
                        body={'last_seq': latest_changes['last_seq']})


@app.route(url_prefix + '/recipes', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        recipe = request.json
        if '_id' not in recipe:
            recipe['_id'] = md5(repr(recipe)).hexdigest()
        try:
            confirmation = dbconn(ACCOUNT_USER, recipe)
            update_search()
            return confirmation
        except Exception, e:
            app.logger.error(e)
            return Response('{"details": "%s"}' %
                            e.reason, e.code, mimetype='application/json')
    else:
        endpoint = '%s/_design/by_title/_view/ByTitle' % ACCOUNT_USER
        return dbconn(endpoint)


@app.route(url_prefix + '/recipes/<recipe_id>', methods=['GET'])
def recipe(recipe_id):
    endpoint = '%s/%s' % (ACCOUNT_USER, recipe_id)
    return dbconn(endpoint)


@app.route(url_prefix + '/search', methods=['POST'])
def search():
    update_search()
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
    res = search_client.search(index='recipes', body=data)
    return Response(to_json(res), mimetype='application/json')


@app.route(url_prefix + '/import', methods=['POST'])
def import_recipe():
    Recipe = {}
    source = 'http://sample:8080'
    req = urllib2.Request(source)
    handle = urllib2.urlopen(req)
    soup = bs4(handle.read(), 'html.parser')
    Recipe['title'] = soup.title.string
    Recipe['servings'] = soup.find_all('span', itemprop='recipeYield')[0].string
    # Strip non-numeric
    Recipe['source'] = source
    Recipe['description'] = soup.find_all('p', itemprop='description')[0].string
    # Ensure utf-8
    return Response(to_json(Recipe))

if __name__ == '__main__':
    app.run('0.0.0.0')
