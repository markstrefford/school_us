'use strict';

angular.module('selectSchool', ['leaflet-directive', 'schools'])
    .controller('SelectschoolCtrl', [
        '$scope',
        '$routeParams',
        '$window',
        'leafletBoundsHelpers',
        'schoolsService',
        function ($scope, $routeParams, $window, leafletBoundsHelpers, schoolsService) {
            console.log("SelectschoolCtrl()");

            // Centre map on Cheshire for now...
            angular.extend($scope, {
                center: {
                    lat: 53.2,
                    lng: -2.6,
                    zoom: 8
                },
                markers: {},
                events: {},
                nextButtonClickable: false,
                tipTitle: "Begin by selecting which school you want transport to...",
                tipText: "The red markers on the map show each of the schools, or you can choose from the list below.",
                schoolName: ''
            });

            $scope.schools = schoolsService.query(function (schools) {
                console.log($scope.schools.length + ' schools available');
                var sid = 0;

                angular.forEach($scope.schools, function (school) {
                    console.log("Processing " + school.name);
                    // TODO - Clean up data in MongoDB to ensure it is float not string here!!
                    var lat = parseFloat(school.loc.coordinates[1]);
                    var lng = parseFloat(school.loc.coordinates[0]);
                    // Create marker
                    var schoolMarker = {
                        lat: lat,
                        lng: lng,
                        message: school.name,
                        draggable: false,
                        focus: false,
                        icon: {
                            type: 'awesomeMarker',
                            icon: 'book',
                            markerColor: 'red'
                        }
                    };

                    $scope.markers[school._id] = schoolMarker;
                });

                // Zoom in a bit now!
                $scope.center.zoom = 10;

                // TODO - Add the new map centre!
                $scope.events.marker = {
                    enable: ['click'],
                    logic: 'emit'
                };

                // Call this if someone clicks on a marker
                $scope.$on('leafletDirectiveMarker.click', function (event, args) {
                    $scope.selectedSchool = schoolsService.get({schoolId: args.markerName}, function (school) {
                        $scope.selectedSchool = school;     // TODO - Should be return instead??
                        $scope.nextButtonClickable = true;
                    });
                });
            });

            // Come here when someone clicks the "Next" button
            // TODO - Handle someone selecting from the school list rather than just the marker
            $scope.schoolSelected = function (selectedSchool) {
                console.log("You've selected " + selectedSchool.name);
                //$scope.mapPhase = 'home';
                $window.location.href = '#/selecthome/' + selectedSchool._id;

            };

            // Call here if one of the school "select" buttons is pressed
            $scope.schoolSelectButton = function (schoolId) {
                $scope.selectedSchool = schoolsService.get({schoolId: schoolId}, function (school) {
                    $scope.selectedSchool = school;
                    console.log("You've selected " + $scope.selectedSchool.name);
                    //$scope.mapPhase = 'home';
                    $window.location.href = '#/selecthome/' + $scope.selectedSchool._id;

                });
            };
        }
    ])
;
