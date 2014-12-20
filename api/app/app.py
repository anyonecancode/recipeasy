from flask import Flask, jsonify, request, Response
import urllib2
import json
import base64

app = Flask(__name__)
app.debug = True
app.api_spec = None


url_prefix = '/api'
username = 'ziplist'
password = 'pass'
base64string = base64.encodestring('%s:%s' % (username, password))[:-1]


def createRecipe(recipe):
    url = 'http://db:5984/recipes'
    data = json.dumps(recipe)
    req = urllib2.Request(url, data, {'Content-Type': 'application/json'})
    req.add_header("Authorization", "Basic %s" % base64string)
    handle = urllib2.urlopen(req)
    return Response(handle.read(), mimetype='application/json')


@app.route(url_prefix + '/recipes', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        return createRecipe(request.json)
    else:
        url = 'http://db:5984/recipes/'
        req = urllib2.Request(url)
        req.add_header("Authorization", "Basic %s" % base64string)
        handle = urllib2.urlopen(req)
        return Response(handle.read(), mimetype='application/json')


@app.route(url_prefix + '/recipes/<id>', methods=['GET', 'POST'])
def recipe(id):
    url = "http://db:5984/recipes/%s" % id
    req = urllib2.Request(url)
    req.add_header("Authorization", "Basic %s" % base64string)
    handle = urllib2.urlopen(req)
    return Response(handle.read(), mimetype='application/json')
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
