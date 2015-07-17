(function(){
'use strict';

angular.module('recipeasy', [
  'ngRoute',
  'ngSanitize',
  'recipeasy.controllers',
  'recipeasy.services',
  'recipeasy.directives',
  'recipeasy.filters'
])
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
  $locationProvider.html5Mode(true);
  $routeProvider
  .when('/', {
    controller: 'CtrlRecipesList',
    templateUrl: '/partials/recipes_list.html'
  })
  .when('/recipes', {
    controller: 'CtrlRecipesList',
    templateUrl: '/partials/recipes_list.html'
  })
  .when('/recipes/:id', {
    controller: 'CtrlRecipeDetail',
    templateUrl: '/partials/recipe_detail.html'
  })
  .when('/new-recipe', {
    templateUrl: '/partials/recipe_new.html'
  })
  .when('/edit-recipe/:id', {
    templateUrl: '/partials/recipe_new.html'
  })
  .when('/search', {
    controller: 'CtrlSearchResults',
    templateUrl: '/partials/search_results.html'
  })
  .otherwise({
    controller: 'Ctrl404',
    templateUrl: '/partials/404.html'
  });
}]);

angular.module('recipeasy.controllers', ['recipeasy.services']);
angular.module('recipeasy.services', ['ngResource']);
angular.module('recipeasy.directives',[]);
angular.module('recipeasy.filters',[]);

}());
