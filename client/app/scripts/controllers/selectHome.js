'use strict';

angular.module('selectHome', ['leaflet-directive', 'schools'])
    .controller('SelecthomeCtrl', [
        '$scope',
        '$routeParams',
        '$window',
        'leafletBoundsHelpers',
        'schoolsService',
        function ($scope, $routeParams, $window, leafletBoundsHelpers, schoolsService) {
            angular.extend($scope, {
                center: {},
                markers: {},
                events: {},
                isHomeSet: false,
                nextButtonClickable: false,
                tipTitle: "Now tell us where you live...",
                tipText: "Drag and click on the map to let us know where you live. When you're done, click Next and we'll be able tp suggest available bus controllers to your selected school.",
                schoolName: ''
            });

            // Now get school from ID from URL and add marker / re-center the map
            var schoolId = $routeParams.schoolId;

            console.log("Calling school service for " + schoolId);
            $scope.school = schoolsService.get({schoolId: schoolId}, function (school) {
                console.log("/mymap - getting location for school " + schoolId);
                var schoolLoc = {
                    lat: school.loc.coordinates[1],
                    lng: school.loc.coordinates[0]
                };

                $scope.schoolName = school.name;

                $scope.markers.school = {
                    lat: schoolLoc.lat,
                    lng: schoolLoc.lng,
                    draggable: false,
                    message: school.name,
                    focus: true,
                    icon: {
                        type: 'awesomeMarker',
                        icon: 'book',
                        markerColor: 'red'
                    }
                };

                $scope.center = {
                    lat: schoolLoc.lat,
                    lng: schoolLoc.lng,
                    zoom: 11
                };
            });

            // Handle clicking on the map / creating a new home marker
            $scope.$on('leafletDirectiveMap.click', function (event, args) {
                if ($scope.isHomeSet == false) {
                    var homeLoc = {
                        lat: args.leafletEvent.latlng.lat,
                        lng: args.leafletEvent.latlng.lng
                    };

                    $scope.markers.home = {
                        lat: homeLoc.lat,
                        lng: homeLoc.lng,
                        draggable: true,
                        message: 'Home',
                        focus: true,
                        icon: {
                            type: 'awesomeMarker',
                            icon: 'home'
                        }
                    };
                    $scope.isHomeSet = true;
                    $scope.nextButtonClickable = true;
                }
            });

            // Handle dragging the home marker around
            // TODO - Not sure if I need this event???
            $scope.$on('leafletDirectiveMarker.dragend', function (event, args) {
                console.log('Home marker moved: ' + JSON.stringify($scope.markers.home));
            });

            $scope.saveHomeLocation = function () {
                $scope.center = {
                    lat: $scope.markers.home.lat,
                    lng: $scope.markers.home.lng,
                    zoom: 11
                };

                $window.location.href = '#/selectbus/' + $routeParams.schoolId + "/homelat/" + $scope.center.lat + "/homelng/" + $scope.center.lng;
            };
        }]);


