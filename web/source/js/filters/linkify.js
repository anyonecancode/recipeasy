(function(){
  'use strict';
  angular.module('recipeasy.filters').filter('linkify', function(){
    return function(string) {
      if (string.indexOf('http') !== 0) {
        return string;
      }
      return '<a href="' + string + '">' + string + '</a>';
    };
  });
}());
