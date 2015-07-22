(function(){
  'use strict';
  angular.module('recipeasy.directives').directive('recipesList', [
    'Recipes',
    '$log',
    function(Recipes, $log){
      return {
        restrict: 'A',
        controller: function($scope) {
          $scope.recipes = [];

          function _setScope(recipes) {
            $scope.recipes = recipes.rows;
          }

          Recipes.list().then(_setScope, $log.error);
        }
      };
    }]);
}());
