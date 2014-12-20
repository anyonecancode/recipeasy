(function(){
  'use strict';

  angular.module('ziplist.directives').directive('formNewRecipe', [
    'Recipes',
    function(Recipes) {
      return {
        restrict: 'A',
        link: function(scope, element) {
          element.on('submit', function() {
            Recipes.save(scope.recipe);
          });
        }
      };
    }]);
}());
