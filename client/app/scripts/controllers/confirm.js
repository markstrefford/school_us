'use strict';

angular.module('confirm', ['proposals', 'schools', 'users'])
    .controller('ConfirmCtrl', [
        '$scope',
        '$routeParams',
        '$http',
        '$location',
        '$window',
        'proposalsService',
        'schoolsService',
        'usersService',
        //'proposalsTransactionService',
        //function ($scope, $routeParams, $http, $location, proposalsService, schoolsService, usersService, proposalsTransactionService) {
        function ($scope, $routeParams, $http, $location, $window, proposalsService, schoolsService, usersService) {

                // User must press Confirm!!
            $scope.displayPayment = 0;

            $scope.school = schoolsService.get({schoolId: $routeParams.schoolId}, function (school) {
                console.log("viewProposals - getting data for school " + $routeParams.schoolId);
            });

            $scope.user = usersService.get({userId: $routeParams.userId}, function (user) {
                console.log("viewProposals - getting data for user " + $routeParams.userId);
            });

            $scope.proposal = proposalsService.get({proposalId: $routeParams.proposalId}, function(proposal) {
                console.log("viewProposals - getting data for proposal " + $routeParams.proposalId);
            });

            $scope.confirmProposal = function () {
                $scope.displayPayment = 1;
            }

            // If there is a status of 'confirmed' when this controller is called, then redirect to My Sumamry page
            // TODO - Something better around "switch", such as http://encosia.com/first-class-functions-as-an-alternative-to-javascripts-switch-statement/
            if ( $routeParams.status == 'confirmed' ) {
                console.log("$routeParams.status=" + $routeParams.status);
                //window.location.path('/mysummary/' + $routeParams.userId);
                window.location.path('/mysummary');
            }

            /* Now handle users pressing buttons on the page!! */

            $scope.cancelProposal = function () {
                console.log("Proposal cancelled!!!!");
                // TODO - Use "back" functionality to go to previous page
            }

            /*
            Handle user selecting "Confirm and Pay"
             */
            $scope.makePayment = function (user, proposal) {
                console.log("You've just pressed confirm and your details are:");
                console.log("User: " + angular.toJson(user));

                // Do some "card processing stuff" here :-)
                // TODO - Replace all of this with Paypal or Stripe or whatever...
                user.cardccv = "";
                user.cardtoken = "nnnnnnnnnn";
                console.log("User: " + angular.toJson(user));
                console.log("Proposal: " + angular.toJson(proposal));
                // Save this user to the back end
                //user.$update({userId: user._id});

                // TODO - Ensure that the route / proposal / available seats / etc. is updated with this user!
                /*
                 * This is a transaction, so increase the number of allocated seats and add
                 * this parent to the list of parents
                 */
                // $scope.proposals = proposalsBySchoolService.query({schoolId: schoolId}, function (proposals) {
                // TODO - Replace these with search(), etc. to compile the URL properly
                // TODO - see http://docs.angularjs.org/guide/dev_guide.services.$location
                var confirm_ok_url = $location.absUrl() + "/confirmed";
                var confirm_fail_url = $location.absUrl() + "/failed";
                var payment_token = "token";
                var confirmUrl = "http://schoolus.local:3001/confirm?" +
                    "proposalId=" + proposal._id +
                    "&userId=" + user._id +
                    "&token=" + payment_token +
                    "&confirm_ok_url=" + confirm_ok_url +
                    "&confirm_fail_url=" + confirm_fail_url;
                console.log("Redirecting to server confirm page..." + confirmUrl);

                // Redirect to the server
                window.location.assign(confirmUrl);
            }

 }]);


