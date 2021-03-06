(function(){
  'use strict';

  angular.module('recipeasy.services').factory('Search', [
    '$resource',
    '$routeParams',
    function($resource, $routeParams){
      var _resource = $resource('/api/search'),
        _searchTerms = '',
        _results,
      exports = {};

      exports.query = function(terms){
        _searchTerms = terms;
        _results = _resource.save({'terms': _searchTerms}).$promise;
        return _results;
      };

      exports.getTerms = function() {
        _searchTerms = _searchTerms || $routeParams.terms;
        return _searchTerms;
      };

      exports.retrieveResults = function(){
        return _results || this.query(this.getTerms());
      };

      return exports;

    }]);
}());

