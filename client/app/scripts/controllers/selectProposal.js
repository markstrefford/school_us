'use strict';

angular.module('selectproposal', ['leaflet-directive', 'schools', 'users', 'proposals', 'companies'])
    .controller('SelectproposalCtrl', [
        '$scope',
        '$routeParams',
        'leafletBoundsHelpers',
        '$window',
        '_',
        'schoolsService',
        'proposalsService',
        'proposalsBySchoolService',
        'companiesService',
        function ($scope, $routeParams, leafletBoundsHelpers, $window, _, schoolsService, proposalsService, proposalsBySchoolService, companiesService) {
            var schoolId = $routeParams.schoolId;
            var homeLoc = {
                lat: parseFloat($routeParams.lat),
                lng: parseFloat($routeParams.lng)
            };

            angular.extend($scope, {
                center: {
                    lat: homeLoc.lat,
                    lng: homeLoc.lng,
                    zoom: 11
                },
                markers: {},
                events: {},
                nextButtonClickable: false,
                tipTitle: "Choose an existing bus route or request a new one",
                tipText: ''
            });

            // Redraw school
            $scope.school = schoolsService.get({schoolId: schoolId}, function (school) {
                $scope.schoolName = school.name;
                $scope.markers.school = {
                    lat: school.loc.coordinates[1],
                    lng: school.loc.coordinates[0],
                    draggable: false,
                    message: school.name,
                    focus: false,
                    icon: {
                        type: 'awesomeMarker',
                        icon: 'book',
                        markerColor: 'red'
                    }
                };
                $scope.tipText = "Review the list below or click on the Orange markers on the map to review details of the bus companies providing services to " + school.name + "."
            });

            // Redraw home
            $scope.markers.home = {
                draggable: false,
                focus: false,
                message: 'Home',
                lat: homeLoc.lat,
                lng: homeLoc.lng,
                icon: {
                    type: 'awesomeMarker',
                    icon: 'home'
                }
            };

            // Function to get details of a proposal based on its ID
            $scope.getSelectedProposal = function (proposals, proposalId) {
                return _.find(proposals, function (proposal) {
                    return (proposal._id == proposalId)
                });
            };

            $scope.registerURL = function(proposalId) {
                return '#/register/' + $routeParams.schoolId + "/homelat/" + $scope.center.lat + "/homelng/" + $scope.center.lng + "/proposal/" + proposalId;
            };

            // Now get proposals for the selected school
            $scope.proposals = proposalsBySchoolService.query({schoolId: schoolId}, function (proposals) {
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
                    $scope.markers[proposal._id] = proposalMarker;
                });
                $scope.numProposals = $scope.proposals.length;

                // Set up marker events
                $scope.events.marker = {
                    enable: ['click'],
                    logic: 'emit'
                };

                $scope.$on('leafletDirectiveMarker.click', function (event, args) {
                    $scope.selectedProposal = $scope.getSelectedProposal($scope.proposals, args.markerName);
                    $scope.nextButtonClickable = true;

                });
            });

            $scope.selectProposal = function () {
                $window.location.href = $scope.registerURL($scope.selectedProposal._id);

            };
            $scope.selectProposalButton = function (proposalId) {
                $scope.selectedProposal = $scope.getSelectedProposal($scope.proposals, proposalId);
                $window.location.href = $scope.registerURL(proposalId);

            };
        }]);
