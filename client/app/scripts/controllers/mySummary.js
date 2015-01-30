'use strict';

angular.module('mysummary', ['proposals', 'schools', 'users'])
    .controller('MySummaryCtrl', [
        '$scope',
        '$routeParams',
        '$http',
        '$location',
        '$window',
        'proposalsByUserService',
        'usersService',
        //'proposalsTransactionService',
        //function ($scope, $routeParams, $http, $location, proposalsService, schoolsService, usersService, proposalsTransactionService) {
        function ($scope, $routeParams, $http, $location, $window, proposalsByUserService, usersService) {

            // TODO - Remove schoolId as not required here, but take out from URL first!!
            var schoolId = $routeParams.schoolId;

            // Get the user details
            $scope.user = usersService.get({userId: $routeParams.userId}, function (user) {
                console.log("viewProposals - getting data for user " + $routeParams.userId);
            });

            // Get the proposals for this user
            $scope.proposals = proposalsByUserService.query({userId: $routeParams.userId}, function (proposals) {
                //$scope.proposals = proposalsBySchoolService.query(function (proposals) {
                console.log("viewProposals - getting proposals for user " + $routeParams.userId);
                $scope.numProposals = $scope.proposals.length;
            });
        }
    ])

