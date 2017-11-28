(function() {
    'use strict';
    /*--------------JQUERY--------------------*/
    $(document).ready(function() {
        // $('body').css();
    })
    /*--------------JQUERY--------------------*/

    var app = angular.module('myApp', ['ngMaterial', 'ngMdIcons', 'ngMessages', 'ngAnimate', 'ngAria', 'ngRoute'])
        .config(function($mdThemingProvider) {
            $mdThemingProvider.theme('login-screen')
                .primaryPalette('orange');
            // .dark();

        });

    app.controller('stopWatchDemoCtrl', ['$scope', function($scope){
        $scope.stopwatch = { interval:65, log: []};
        $scope.showStop = 0;
        $scope.showPlay = 1;
        $scope.showReset = 0;
    }])
    app.filter('mins', function () {
        return function (input) {
            if(input){
                var elapsed = input.getTime();
                elapsed %= 3600000;
                var mins = parseInt(elapsed / 60000,10);
                return mins;
            }
        };
    })
    app.filter('secs', function () {
        function addZero(x, n) {
            while (x.toString().length < n) {
                x = "0" + x;
            }
            return x;
        }
        return function (input) {
            if(input){
                var elapsed = input.getTime();
                elapsed %= 3600000;
                elapsed %= 60000;
                var secs = addZero(parseInt(elapsed / 1000,10),2);
                return secs;
            }
        };
    })
    app.filter('ms', function () {
        function addZero(x, n) {
            while (x.toString().length < n) {
                x = "0" + x;
            }
            return x;
        }
        return function (input) {
            if(input){
                var elapsed = input.getTime();
                elapsed %= 3600000;
                elapsed %= 60000;
                var ms = addZero(parseInt(input.getMilliseconds() / 10),2);
                return ms;
            }
        };
    })
    app.directive('bbStopwatch', ['StopwatchFactory', function(StopwatchFactory){
        return {
            restrict: 'EA',
            scope: true,
            link: function(scope, elem, attrs){   
                
                var stopwatchService = new StopwatchFactory(scope[attrs.options]);
                
                scope.startTimer = stopwatchService.startTimer; 
                scope.stopTimer = stopwatchService.stopTimer;
                scope.resetTimer = stopwatchService.resetTimer;
                
            }
        };
    }])
    app.factory('StopwatchFactory', ['$interval',    function($interval){
        
        return function(options){

            var startTime = 0,
                currentTime = null,
                offset = 0,
                interval = null,
                self = this;
            
            if(!options.interval){
                options.interval = 100;
            }

            options.elapsedTime = new Date(0);

            self.running = false;
            
            self.updateTime = function(){
                currentTime = new Date().getTime();
                var timeElapsed = offset + (currentTime - startTime);
                options.elapsedTime.setTime(timeElapsed);
            };

            self.startTimer = function(){
                if(self.running === false){
                    startTime = new Date().getTime();
                    interval = $interval(self.updateTime,options.interval);
                    self.running = true;
                }
            };

            self.stopTimer = function(){
                if( self.running === false) {
                    return;
                }
                self.updateTime();
                offset = offset + currentTime - startTime;
                $interval.cancel(interval);  
                self.running = false;
            };

            self.resetTimer = function(){
              self.stopTimer()
              startTime = new Date().getTime();
              options.elapsedTime.setTime(0);
            };

            self.cancelTimer = function(){
              $interval.cancel(interval);
            };

            return self;

        };


    }]);
})();