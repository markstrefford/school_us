'use strict';

angular.module('main', ['ui.bootstrap'])
    .controller('MainCtrl', ['$scope', '$window',
        function ($scope, $window) {

            console.log("MainCtrl: redirecting to select school");


            $scope.getStarted = function () {
                console.log("getStarted()");
                $window.location.href = '#/selectschool';

            };

            //PhoneListCtrl.$inject = ['$scope', 'schoolsService'];

        }]);

