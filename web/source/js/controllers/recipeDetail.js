(function(){
  'use strict';
  angular.module('ziplist.controllers').controller('CtrlRecipeDetail', [
    '$scope',
    '$routeParams',
    'Recipes',
    '$log',
    function($scope, $routeParams, Recipes, $log){

      var id = $routeParams.id;

      function setScope (recipe) {
        $scope.recipe = recipe;
      }

      Recipes.get(id).then(setScope, $log.error);
      Recipes.get(id);
      Recipes.get(id);

      $scope.$on('contentChanged', function(){
        Recipes.save($scope.recipe);
      });
  }]);
}());
