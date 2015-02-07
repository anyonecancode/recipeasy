# Recipeasy

## Meal planning made easy

For a few years, my family was using a website call [Ziplist](http://www.ziplist.com/goodbye.html)
for meal planning. Ziplist was a recipe app that included a nice little browser toolbar plugin for
easy importing of recipes from other sites. Even more useful was the ability to make meal plans and
shopping lists based off of your recipes.

Unfortunately for us -- though fortunately for Ziplist, I hope -- they were bought out by
[Epicurious.com](http://www.epicurious.com/), and so we lost our meal planning tool. It wasn't
without its quirks and bugs, but it did what we needed it to do.

Still, I found those bugs a bit annoying, and I always had it in the back of my head that it would
be fun to try making my own meal planning app. With the demise of Ziplist, actually acting on that
idea would now also be concretely useful.

This is primarily a personal project, so development pace and feature scope will be limited. Anyone
who stumbles across this repo is welcome to fork it, send me pull requests, and use this code
(consistent with the [GNU GPL](http://www.gnu.org/licenses/gpl-3.0-standalone.html)), but I'm not
planning on deploying this anywhere public myself. As I've conceived this project, it's an app
intended for a single user (or maybe a small group of users).

I'm not trying to change the world, or disrupt any industries, or even launch yet another recipe
site. In other words, this project is most definitely _not_ Web Scale (tm). It's a fun way for me to
mess about with a few web technologies and, hopefully, make a tool I personally find useful as well.

## Architecture

Recipeasy is a web app that stores recipes. Once a recipe is added to the app, you can edit it, add
it to a planning view, and search across all stored recipes. Adding a recipe will probably only be
manual, but I might possibly expand the scope to include an auto-import tool to easily grab
recipes from other sites.

I've broken the app up into small, discrete services for the search, api, storage, and UI components.
I'm using [Docker](https://www.docker.com/) for running  the whole stack in development and,
potentially, for deployment as well.

### Database - CouchDB

I'm using CouchDB as the database/persistent storage layer. I had originally planned on using
Postgresql, but as I worked through the data model I realized that it made more sense to think of
recipes as documents rather than discrete fields joined together.

For instance, how exactly would a list of ingredients work in a relational approach? Is 1/4 teaspoon
of crushed red pepper the same ingredient as 1/4 tablespoon of ground red pepper? It might work to
have a field for "base ingredient", eg "chicken", and then fields for subtypes and amounts ("diced",
"roasted", etc), but then you've set yourself the task of normalizing the nearly infinite ways
ingredient and amounts appear in recipes.

No, it's easier to just accept that documents belong in a document store, not a relational database.

### Search - Elastic Search

Full text search across a collection of documents is pretty much the canonical use case for Elastic
Search. In fact, Elastic Search grew out of its creator's desire to create a searchable recipe store
for his wife. Sounds like a very familiar impetus....

### API - Python Flask

Since both CouchDB and Elastic Search uses JSON as their data type and HTTP as their protocal,
creating an API is a cinch. I don't need my API layer to do much beyond routing requests between
the UI and the storage and search layers, so I went with a simple Flask app.

There are various libraries to help Flask communicate with CouchDB and Elastic Search, but I just
went with urllib2. All my layers consume and output JSON over HTTP, so it seems a bit silly to use
an ORM.

### Web UI - AngularJS

The web UI is an angularjs app. Given my strippe-down approach in the other components, this might
be a bit heavy, but for now its convenience is outweighing my urge toward minimalism.


## Roadmap

I'm more or less following the semantic version approach to tagging releases.  Until I have this
deployed and in use, I'll be keeping it in the 0.xx.xx series.  I'll increment the minor version
for new features, and the patch version for updates that don't add features.

After I reach 1.x, I'll follow the standard semver approach of major releases being breaking
changes, minor adding features but keeping backward compatibility, and patch releases fixing bugs.

Prior to the 1.x, all changes are potentially breaking. At some point in the future I'll actually
add a changlelog and what I plan on doing by each release target.
