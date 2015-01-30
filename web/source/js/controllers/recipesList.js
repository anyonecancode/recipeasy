(function(){
  'use strict';
  angular.module('recipeasy.controllers').controller('CtrlRecipesList', [
    '$scope',
    'Recipes',
    '$log',
    function($scope, Recipes, $log){

      $scope.recipes = [];

      function _setScope(recipes) {
        $scope.recipes = recipes.rows;
      }

      Recipes.list().then(_setScope, $log.error);
  }]);
}());
