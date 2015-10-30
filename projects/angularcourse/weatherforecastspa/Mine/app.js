var myApp = angular.module("myApp",['ngRoute','ngResource']);

myApp.config(function($routeProvider) {
    
    $routeProvider
        .when('/', { 
                templateUrl: 'pages/main.html',
                controller: 'mainController'
            })
        .when('/forecast', {
                templateUrl: 'pages/forecast.html',
                controller: 'forecastController'
            })
        .when('/forecast/:days', {
                templateUrl: 'pages/forecast.html',
                controller: 'forecastController'
            });
});

/* filters */
myApp.filter('formatWeatherDT', function() {
    return function(dt) {
        return new Date(dt * 1000);
    };
});
myApp.filter('formatWeatherTempF', function($sce) {
    return function(K) {
        return Math.round((K - 273.15)* 1.8000 + 32.00);
    };
});


/* controllers */
myApp.controller('mainController',['$scope','forecastService',function($scope,forecastService) {
    
    $scope.city = forecastService.City;
    
    $scope.$watch('city',function() {
        forecastService.City = $scope.city;
    });
    
}]);

myApp.controller('forecastController',['$scope','$resource','$routeParams','forecastService',function($scope,$resource,$routeParams,forecastService) {
    
    $scope.days = $routeParams.days || 2;
    
    $scope.city = forecastService.City;
    
    /* e6135d3ab52414b943656a3cd9d2b2df */
    /* api.openweathermap.org/data/2.5/forecast/daily?q={city name},{country code}&cnt={cnt} */
    $scope.weatherAPI = $resource('http://api.openweathermap.org/data/2.5/forecast/daily', { callback: 'JSON_CALLBACK', APPID: 'e6135d3ab52414b943656a3cd9d2b2df' }, { get: { method: 'JSONP' } });
    
    $scope.weatherResult = $scope.weatherAPI.get( { q: $scope.city, cnt: $scope.days } );
    
    console.log($scope.weatherResult);
}]);


/* services */
myApp.service('forecastService',function() {
    this.City = 'Lawrence, KS';
});