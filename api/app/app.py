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
    # if method post, what return?
    Recipe = {
        '_id': id,
        'title': 'Amazing Meat Loaf',
        'servings': 4,
        'description': 'This delicious meatloaf is a sure crowd-pleaser!',
        'ingredients':  """
              1/4 cup ketchup
              1/2 lb. ground beef
              1/2 lb. ground pork
              1 egg
              1/3 cup dry quick oats
              1/2 envelope dry onion soup mix
              """,
        'instructions': """
              Preheat oven to 350 degrees.
              Mix 3 Tbsp ketchup, beef, pork, eggs, oats and soup mix. Shape into a loaf. Place on a greased cookie sheet. Top with 1 Tbsp ketchup. Bake until meat thermometer inserted in the center reads 160 degrees F, 1 to 1 1/4 hours. Let stand 15 minutes before serving.
              """
    }
    return jsonify(Recipe)


if __name__ == '__main__':
    app.run('0.0.0.0')
