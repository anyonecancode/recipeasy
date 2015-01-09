from flask import Flask, jsonify, request, Response
import urllib2
import json
import base64
import hashlib

app = Flask(__name__)
app.debug = True
app.api_spec = None


url_prefix = '/api'
username = 'ziplist'
password = 'pass'
base64string = base64.encodestring('%s:%s' % (username, password))[:-1]


def dbconn(url, data=None):
    url = 'http://db:5984/' + url

    if data:
        data = json.dumps(data)

    req = urllib2.Request(url, data, {'Content-Type': 'application/json'})
    req.add_header("Authorization", "Basic %s" % base64string)
    handle = urllib2.urlopen(req)
    return Response(handle.read(), mimetype='application/json')


@app.route(url_prefix + '/recipes', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        recipe = request.json
        if '_id' not in recipe:
            recipe['_id'] = hashlib.md5(repr(recipe)).hexdigest()
        try:
            return dbconn('recipes', recipe)
        except Exception, e:
            return Response('{"details": "%s"}' % e.reason, e.code, mimetype='application/json')
    else:
        url = 'recipes/_design/by_title/_view/ByTitle'
        return dbconn(url)


@app.route(url_prefix + '/recipes/<id>', methods=['GET', 'POST'])
def recipe(id):
    url = "recipes/%s" % id
    return dbconn(url)


if __name__ == '__main__':
    app.run('0.0.0.0')
