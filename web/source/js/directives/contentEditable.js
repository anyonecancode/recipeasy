(function(){
  'use strict';

  angular.module('ziplist.directives').directive('contenteditable', function() {
    return {
      restrict: 'A',
      require: '?ngModel',
      link: function(scope, element, attrs, ngModel) {
        if (!ngModel) {
          return;
        }

        element.bind('keyup', function(){
          ngModel.$setViewValue(element.html());
          scope.$emit('contentChanged');
        });
      }
    };
  });
}());
