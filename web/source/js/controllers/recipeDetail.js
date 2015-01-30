(function(){
  'use strict';
  angular.module('recipeasy.controllers').controller('CtrlRecipeDetail', [
    '$scope', '$routeParams', 'Recipes', '$log',
    function($scope, $routeParams, Recipes, $log){
      function setScope(data){
        $scope.recipe = data;
      }

      Recipes.get($routeParams.id).then(setScope, $log.error);
  }]);
}());
