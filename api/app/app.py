from flask import Flask, jsonify

app = Flask(__name__)
app.debug = True
app.api_spec = None


url_prefix = '/api'


@app.route(url_prefix + '/recipes')
def index():
    RecipesList = {
        'meta': {
        },
        'data': [{'id': 1, 'title': 'Amazing Meat Loaf'}]
    }
    return jsonify(RecipesList)


@app.route(url_prefix + '/recipes/<int:id>', methods=['GET', 'POST'])
def recipe(id):
    # if method post, what return?
    Recipe = {
        'id': id,
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
