/*
 * Controllers for myDetails page
 *
 *      - Get school details from using school.get(....)
 *      - Get user details using user.get(....)
 *      - Use this info to render the map
 *
 */
'use strict';

angular.module('myDetails', ['leaflet-directive', 'schools', 'users'])
    .controller('MyDetailsCtrl', ['$scope', '$routeParams', '$http', '$q', '$rootScope', '$location', 'schoolsService', 'usersService',
        function ($scope, $routeParams, $http, $q, $rootScope, $location, schoolsService, usersService) {

            /*
             * Promise functionality from this SO post...
             *
             * http://stackoverflow.com/questions/15299850/angularjs-wait-for-multiple-resource-queries-to-complete
             *
             * TODO - See if we REALLY need $q here!!!?
             */
            function getSchool() {
                var d = $q.defer();
                var school = schoolsService.get({schoolId: $routeParams.schoolId}, function (school) {
                    console.log("About to d.resolve(school)");
                    d.resolve(school);
                });
                console.log("About to d.promise school");
                return d.promise;
            }

            function getUser() {
                var d = $q.defer();
                var school = usersService.get({userId: '51f2433a836df1ffcd0b0d0c'}, function (user) {
                    d.resolve(user);
                    console.log("About to d.resolve(user)");
                });
                console.log("About to d.promise user");
                return d.promise;
            }


            $q.all([
                    getSchool(),
                    getUser()
                ]).then(function (data) {
                    var school = $scope.school = data[0];
                    var user = $scope.user = data[1];

                    console.log("Ready to extend scope!!");
                    console.log("School json: " + angular.toJson(school));
                    console.log("User json: " + angular.toJson(user));

                    //var schoolLat = $scope.school.loc.coordinates[0];
                    //var schoolLng = $scope.school.loc.coordinates[1];

                    //var userLat = $scope.school.loc.coordinates[0];
                    //var userLng = $scope.school.loc.coordinates[1];

                    var markers = {
                        school: {
                            lat: $scope.school.loc.coordinates[1],
                            lng: $scope.school.loc.coordinates[0],
                            draggable: false,
                            message: $scope.school.name,
                            focus: true
                        },
                        home: {
                            lat: $scope.user.loc.coordinates[1],
                            lng: $scope.user.loc.coordinates[0],
                            draggable: false,
                            message: $scope.user.name,
                            focus: true
                        }
                        /* TODO : Make map auto-zoom using boundaries */
                    };
                    console.log("Markers are " + angular.toJson(markers));
                    $scope.markers = markers;
                });

            // Default map - start with a good chunk of the UK centred on Cheshire!
            // TODO - Auto-locate this!!!
            angular.extend($scope, {
                center: {
                    lat: 53.19773940,
                    lng: -2.3683596,
                    zoom: 6
                },
                markers: {}
            })


            // Call this function when user clicks "Check Available Buses"
            $scope.findBuses = function (user, school) {
                console.log("findBuses called with: UserId=" + user._id + ", " + "Town=" + user.town + ", Postcode=" + user.postcode + ", schoolId=" + school._id);
                //TODO - Check for updates to user and write any updates as required...
                $location.path('/viewproposals/' + school._id + "/" + user._id);
            }


        }]);

