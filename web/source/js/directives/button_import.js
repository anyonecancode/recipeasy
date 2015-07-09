(function(){
  'use strict';
  angular.module('recipeasy.directives').directive('buttonImport', [
    'Recipes',
    '$location',
    '$log',
    function(Recipes, $location, $log){
      return {
        restrict: 'A',
        link: function($scope, element){
          element.on('click', function(event) {
            var source = angular.element(event.target).scope().recipe['source'];
            Recipes.import(source).then(function success(data) {
              //blah
            }, $log.error);
          });

        }
      };
    }]);
}());
