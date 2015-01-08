(function(){
  'use strict';

  angular.module('ziplist.directives').directive('formNewRecipe', [
    'Recipes',
    '$location',
    '$log',
    function(Recipes, $location, $log) {
      return {
        restrict: 'A',
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
