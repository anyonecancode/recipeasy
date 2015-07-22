(function(){
  'use strict';
  angular.module('recipeasy.directives').directive('searchResults', [
    'Search', '$log',
    function(Search, $log){
      return {
        restrict: 'A',
        controller: function($scope) {
          $scope.search = {
            terms: null,
            results:null
          };

          function _setScope(results) {
            $scope.search.results = results.hits;
          }

          $scope.search.terms = Search.getTerms();
          Search.retrieveResults().then(_setScope, $log.error);
        }
      };
  }]);
}());
