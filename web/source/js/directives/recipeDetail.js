(function(){
  'use strict';
  angular.module('recipeasy.directives').directive('recipeDetail', [
    '$routeParams', 'Recipes', '$log',
    function($routeParams, Recipes, $log){
      return {
        restrict: 'A',
        controller: function($scope) {
          function setScope(data){
            $scope.recipe = data;
          }
          Recipes.get($routeParams.id).then(setScope, $log.error);
        }
      };
    }]);
}());
