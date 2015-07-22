(function(){
'use strict';

angular.module('recipeasy', [
  'ngRoute',
  'ngSanitize',
  'recipeasy.services',
  'recipeasy.directives',
  'recipeasy.filters'
])
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
  $locationProvider.html5Mode(true);
  $routeProvider
  .when('/', {
    templateUrl: '/partials/recipes_list.html'
  })
  .when('/recipes', {
    templateUrl: '/partials/recipes_list.html'
  })
  .when('/recipes/:id', {
    templateUrl: '/partials/recipe_detail.html'
  })
  .when('/new-recipe', {
    templateUrl: '/partials/recipe_create_edit.html'
  })
  .when('/edit-recipe/:id', {
    templateUrl: '/partials/recipe_create_edit.html'
  })
  .when('/search', {
    templateUrl: '/partials/search_results.html'
  })
  .otherwise({
    templateUrl: '/partials/404.html'
  });
}]);

angular.module('recipeasy.services', ['ngResource']);
angular.module('recipeasy.directives',[]);
angular.module('recipeasy.filters',[]);

}());
