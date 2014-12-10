(function(){
  'use strict';

  angular.module('ziplist.services').factory(
    'Recipes', [
    '$resource',
    function($resource){
      var _resource = $resource('/api/recipes/:id', {id: '@id'}),
        _recipes = {},
        exports = {};

      exports.list = function() {
        return _resource.get().$promise;
      };

      exports.get = function(id) {
        _recipes[id] = _recipes[id] || _resource.get({id: id}).$promise;
        return _recipes[id];
      };

      exports.save = function(recipe) {
        _recipes[recipe.id] = _resource.save(recipe).$promise.then(cacheRecipe);
        //if post doesn't return recipe, what then? cache the passed in recipe...
        return _recipes[recipe.id];
      };

      return exports;
  }]);
}());
