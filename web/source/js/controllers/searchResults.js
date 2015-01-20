(function(){
  'use strict';
  angular.module('ziplist.controllers').controller('CtrlSearchResults', [
    '$scope',
    'Search',
    '$routeParams',
    '$log',
    function($scope, Search, $routeParams, $log){
      $scope.search = {
        terms: null,
        results:null
      };

     $scope.search.terms = Search.getTerms();

      function _setScope(results) {
        $scope.search.results = results.rows;
      }

      Search.retrieveResults().then(_setScope, $log.error);
  }]);
}());
