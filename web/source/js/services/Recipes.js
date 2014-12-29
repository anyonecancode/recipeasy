(function(){
  'use strict';

  angular.module('ziplist.services').factory(
    'Recipes', [
    '$resource',
    '$log',
    function($resource, $log){
      var _resource = $resource('/api/recipes/:id', {id: '@id'}),
        _recipeList,
        _recipes = {},
        exports = {};

      function cacheRecipe(recipe) {
      }

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
        return _resource.save(recipe).$promise.then(
          function(response) {
            //Reset _recipeList
            _recipeList = null;
            self.list();

            //Cache the new recipe
            return self.get(response.id);
          },
          $log.error);
      };

      return exports;
  }]);
}());