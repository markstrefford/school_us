'use strict';
/*
 * Controller to handle the map.  It does 3 things:
 *
 * 1) Allow a user to choose the school
 * 2) Show us where they live
 * 3) Select a bus route if one is available
 *
 * TODO - Should this be split up into smaller functions?
 */
angular.module('myMap', ['leaflet-directive', 'schools', 'users', 'proposals', 'companies'])
    .controller('MymapCtrl',
    [
        '$scope',
        '$routeParams',
        'leafletBoundsHelpers',
        'schoolsService',
        'proposalsService',
        'proposalsBySchoolService',
        'companiesService',
        function ($scope, $routeParams, leafletBoundsHelpers, schoolsService, proposalsService, proposalsBySchoolService, companiesService) {
            // Centre map on Cheshire for now...
            angular.extend($scope, {
                center: {
                    lat: 53.2,
                    lng: -2.6,
                    zoom: 8
                },
                markers: {},
                events: {},

                isHomeSet: false,
                nextButtonClickable: false,
                tipTitle: "Begin by selecting which school you want transport to...",
                tipText: "The red markers on the map show each of the schools, or you can choose from the list below.",
                showSchools: false,
                schoolName: '',
                mapPhase: ''    // Start by selecting a school
            });

            console.log("Map phase = " + $scope.mapPhase);

            //
            // Watch for changes to mapPhase, and then do the relevant stuff!
            // TODO - Use newMapPhase/oldMapPhase to manage backward/forward buttons perhaps
            //
            $scope.$watch('mapPhase', function (newMapPhase, oldMapPhase) {
                console.log("$watch triggered with " + $scope.mapPhase + ", " + newMapPhase + ", " + oldMapPhase);
                //
                // Handle the 'select school' phase of the map
                //
                if ($scope.mapPhase == 'school') {
                    console.log('myMap.chooseSchool()');

                    // Set up templates for side bar and next button
                    $scope.mapSideBarTemplate = '/selectSchoolTemplate.html';
                    $scope.buttonTemplate = '/schoolNextButton.html';

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

                            console.log('Adding marker ' + schoolId);
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
                }

                // Come here when someone clicks the "Next" button
                // TODO - Handle someone selecting from the school list rather than just the marker
                $scope.schoolSelected = function (selectedSchool) {
                    console.log("You've selected " + selectedSchool.name);
                    $scope.mapPhase = 'home';

                };

                // Call here if one of the school "select" buttons is pressed
                $scope.schoolSelectButton = function (schoolId) {
                    $scope.selectedSchool = schoolsService.get({schoolId: schoolId}, function (school) {
                        $scope.selectedSchool = school;
                        console.log("You've selected " + $scope.selectedSchool.name);
                        $scope.mapPhase = 'home';

                    });
                };


                //
                // Handle the 'show me where you live' part of the map process
                //
                if ($scope.mapPhase == 'home') {
                    // Now get school from ID from URL and add marker / re-center the map
                    var schoolId = $routeParams.schoolId;   // TODO - Do I need to do this?
                    $scope.tipTitle = "Now tell us where you live..";
                    $scope.tipText = "Drag and click on the map to let us know where you live. When you're done, click Next and we'll be able tp suggest available bus controllers to your selected school.";

                    $scope.mapSideBarTemplate = '/selectHomeTemplate.html';
                    $scope.buttonTemplate = '/homeNextButton.html';

                    $scope.events = {};
                    $scope.markers = {};

                    $scope.school = schoolsService.get({schoolId: $scope.selectedSchool._id}, function (school) {
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

                        $scope.mapPhase = 'proposal';
                    };
                }

                //
                // Handle the proposal phase of the map process
                //
                if ($scope.mapPhase == 'proposal') {
                    console.log('*** SHOW PROPOSALS NOW ***');
                    // TODO - Add these to the side bar templates!
                    $scope.tipTitle = "Choose an existing bus route or request a new one";
                    $scope.tipText = "Review the list below or click on the Orange markers on the map to review details of the bus companies providing services to " + $scope.schoolName + ".";

                    // Switch off old stuff
                    $scope.nextButtonClickable = false;
                    $scope.events = {};
                    $scope.markers.home.draggable = false;
                    $scope.markers.home.focus = false;

                    // Set up the partials
                    $scope.mapSideBarTemplate = '/selectProposalTemplate.html';
                    $scope.buttonTemplate = '/proposalNextButton.html';

                    // Now get proposals for the selected school
                    $scope.proposals = proposalsBySchoolService.query({schoolId: $scope.selectedSchool._id}, function (proposals) {
                        console.log("viewProposals - getting proposals for school " + schoolId);

                        // Now show proposals for the school (TODO - perhaps within a certain range of my home location?)

                        angular.forEach($scope.proposals, function (proposal) {
                            proposal.freeseats = proposal.bussize - proposal.users.length;
                            proposal.expandText = "More...";
                            proposal.more = false;

                            proposal.times = "Pickup at 8am, Drop-off at 4:15pm"; // TODO - Add in a pickup location / time to the Mongo docs
                            proposal.company = companiesService.get({companyId: proposal.company}, function (company) {
                                return(company.description);
                            });

                            // TODO - Clean up data in MongoDB to ensure it is float not string here!!

                            var html = '<span>' + proposal.buscompany + '<br/>' + proposal.freeseats +
                                ' seats remaining</span>';

                            var proposalMarker = {
                                lat: parseFloat(proposal.loc.coordinates[1]),
                                lng: parseFloat(proposal.loc.coordinates[0]),
                                message: html,
                                draggable: false,
                                focus: false,
                                icon: {
                                    type: 'awesomeMarker',
                                    icon: 'arrow-down',
                                    markerColor: 'orange'
                                }
                            }
                            // TODO - Handle events when a proposal is clicked!
                            console.log('Adding marker ' + proposal._id); // + ": " + JSON.stringify(proposalMarker));
                            $scope.markers[proposal._id] = proposalMarker;
                            //$scope.proposals[proposal._id] = proposal; // Store in scope for later!
                        });
                        //console.log("Proposals after forEach: " + angular.toJson($scope.proposals));
                        $scope.numProposals = $scope.proposals.length;
                    });

                    $scope.selectProposal = function (proposalId) {
                        // $scope.busCompany =
                        $scope.selectedProposal = $scope.proposals[proposalId];
                        console.log("$scope.selectProposal()");
                        $scope.mapPhase = 'register';
                    };

                    // Set up marker events
                    $scope.events.marker = {
                        enable: ['click'],
                        logic: 'emit'
                    };

                    $scope.$on('leafletDirectiveMarker.click', function (event, args) {
                        console.log(args);
                        $scope.selectedProposal = $scope.proposals[args.markerName];
                        console.log("selectedProposal=" + JSON.stringify($scope.selectedProposal));
                    });

                }

                // Provide details and then make payment...
                if ($scope.mapPhase == 'register') {
                    console.log('Register for this proposal');

                    $scope.tipTitle = "Enter your details below";
                    $scope.tipText = "Please enter your details and we can register you for a place with " + $scope.selectedProposal + " travelling to " + $scope.schoolName + ".";

                    // Switch off old stuff
                    $scope.nextButtonClickable = false;
                    $scope.events = {};
                    $scope.markers.home.draggable = false;
                    $scope.markers.home.focus = false;

                    // Set up the partials
                    $scope.mapSideBarTemplate = '/registerTemplate.html';
                    $scope.buttonTemplate = '/registerNextButton.html';


                }
            });

            // Now start at the 'select school' phase
            $scope.mapPhase = 'school'    // Start by selecting a school
        }]);
