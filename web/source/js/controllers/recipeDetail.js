(function(){
  'use strict';
  angular.module('ziplist.controllers').controller('CtrlRecipeDetail', [
    '$scope', '$routeParams', 'Recipes', '$log',
    function($scope, $routeParams, Recipes, $log){

      Recipes.get($routeParams.id).then(function(data) {
        $scope.recipe = data;
        },
      $log.error);

      $scope.$on('contentChanged', function(){
        Recipes.save($scope.recipe);
      });
  }]);
}());
