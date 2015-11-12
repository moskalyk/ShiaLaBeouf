 
 var Mean = angular.module('Mean', ['ngRoute']);

 // configure our routes
 Mean.config(function($routeProvider) {

     $routeProvider
     .when('/', {
         templateUrl: 'views/home.html',
         controller: 'homeController'
     })
    .otherwise({
        redirectTo: '/'
      });
 });
 
 Mean.controller('mainController', function($scope) {
 });

 Mean.factory('socket', function ($rootScope) {
  	// var socket = io.connect('http://localhost:3000');
    var socket = io.connect('https://shialabeouf.herokuapp.com');

    console.log("socket created");
    return {
        on: function (eventName, callback) {
        	console.log('on-ing')
            function wrapper() {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            }
 
            socket.on(eventName, wrapper);
 
            return function () {
                socket.removeListener(eventName, wrapper);
            };
        },
 
        emit: function (eventName, data, callback) {
        	console.log('emit-ing')

            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if(callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        }
    };
});

