(function(){
  'use strict';
  angular.module('recipeasy.directives').directive('pageHeader', [
    '$routeParams',
    function($routeParams){
      return {
        restrict: 'A',
        controller: function($scope) {
          $scope.header = (($routeParams.id)?  'Edit ' : 'Add a new ') + 'recipe';
        }
      };
    }]);
}());
