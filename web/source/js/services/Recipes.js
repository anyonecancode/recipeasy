(function(){
  'use strict';

  angular.module('recipeasy.services').factory(
    'Recipes', [
    '$resource',
    '$log',
    function($resource, $log){
      var _resource = $resource('/api/recipes/:id', {id: '@id'}, {import: {method:'POST', url: '/api/import'}}),
        _recipeList,
        _recipes = {},
        exports = {};

      exports.list = function() {
        _recipeList = _recipeList || _resource.get().$promise;
        return _recipeList;
      };

      exports.get = function(id) {
        _recipes[id] = _recipes[id] || _resource.get({id: id}).$promise;
        return _recipes[id];
      };

      exports.save = function(recipe) {
        var self = this;
        recipe.type = 'recipe';
        return _resource.save(recipe).$promise.then(
          function(response) {
            //Reset _recipeList
            _recipeList = null;
            self.list();

            //Cache the new recipe, resetting the cache if this is an update
            if (recipe._id) {
              _recipes[recipe._id] = null;
            }
            return self.get(response.id);
          },
          $log.error);
      };

      exports.import = function(source) {
        return _resource.import(source).$promise;
      };

      return exports;
  }]);
}());
