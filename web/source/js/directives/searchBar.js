(function(){
  'use strict';
  angular.module('recipeasy.directives').directive('searchBar', [
    'Search',
    '$location',
    function(Search, $location){
      return {
        restrict: 'A',
        link: function($scope, element){
          element.on('submit', function() {
            $location.path('/search').search('terms', $scope.search.terms);
            Search.query($scope.search.terms);
          });
        }
      };
    }]);
}());
