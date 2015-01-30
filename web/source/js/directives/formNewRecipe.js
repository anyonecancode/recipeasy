(function(){
  'use strict';

  angular.module('recipeasy.directives').directive('formNewRecipe', [
    'Recipes',
    '$routeParams',
    '$location',
    '$log',
    function(Recipes, $routeParams, $location, $log) {
      return {
        restrict: 'A',
        controller: function($scope) {
          if ($routeParams.id) {
            Recipes.get($routeParams.id).then(function setRecipeScope(data) {
              $scope.recipe = data;
            }, $log.error);
          }
        },
        link: function($scope, element) {
          element.on('submit', function() {
            Recipes.save($scope.recipe).then(function redirect(data) {
              $location.path('/recipes/' + data._id);
            }, $log.error);
          });
        }
      };
    }]);
}());
