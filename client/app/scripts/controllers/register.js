'use strict';

angular.module('register', ['leaflet-directive', 'schools', 'users', 'proposals', 'companies', 'postcode'])
    .controller('RegisterCtrl', [
        '$scope',
        '$routeParams',
        '$window',
        'leafletBoundsHelpers',
        '_',
        'schoolsService',
        'proposalsService',
        'proposalsBySchoolService',
        'companiesService',
        'postcodeService',
        'User',
        function ($scope, $routeParams, $window, leafletBoundsHelpers, _, schoolsService, proposalsService, proposalsBySchoolService, companiesService, postcodeService, User) {
            var schoolId = $routeParams.schoolId;
            console.log("SchoolId:" + schoolId);

            var homeLoc = {
                lat: parseFloat($routeParams.lat),
                lng: parseFloat($routeParams.lng)
            };
            console.log(homeLoc);
            var proposalId = $routeParams.proposalId;
            console.log("ProposalId:" + proposalId);

            angular.extend($scope, {
                nextButtonClickable: false,
                tipTitle: '',
                tipText: 'Register for this school bus place',
                schoolName: '',
                busCompany: '',
                formSubmitted: false,
                register: false,
                registerError: {
                    error: false,
                    message: ''
                },
                loginError: {
                    error: false,
                    message: ''
                },
                newUser: {},
                credentials: {
                    username: '',
                    password: ''
                }
            });

// Redraw school
            $scope.school = schoolsService.get({schoolId: schoolId}, function (school) {
                $scope.schoolName = school.name;

                // Get bus proposal details for page description
                $scope.proposal = proposalsService.get({proposalId: proposalId}, function (proposal) {
                    proposal.freeseats = proposal.bussize - proposal.users.length;
                    proposal.times = "Pickup at 8am, Drop-off at 4:15pm"; // TODO - Add in a pickup location / time to the Mongo docs
                    proposal.company = companiesService.get({companyId: proposal.company}, function (company) {
                        return(company.description);
                    });

                    $scope.busCompany = proposal.buscompany;
                    $scope.tipText = "You'd like to register for a place on the school bus run by " + $scope.busCompany + " to " + $scope.schoolName + ". Please login or register with us so that we can process your application.";
                });
            });

// Handle user registration
            $scope.register = function (newUser) {
                console.log(newUser);
                // $scope.postCodeInvalid = !postcodeService.validate(user.postcode);   // TODO - Flag invalid postcodes in UI! (see http://code.realcrowd.com/on-the-bleeding-edge-advanced-angularjs-form-validation/ for ideas...)

                // POST /users req.body = user object
                // TODO - Need to secure over HTTP(S) to ensure passwords can't be hacked!!
                var user = new User(newUser);
                console.log('Saving ' + JSON.stringify(user));

                // TODO - Should this be user.register instead of user.save (see usersService.js)??
                user.$save(function (user, headers) {
                    $window.location.href = '#/confirm/' + user._id;
                }, function (error) {
                    // failure
                    console.log("$save failed " + JSON.stringify(error));
                    if (error.status == 409) {
                        console.log("User already exists, so updating...");
                        $scope.registerError = {
                            error: true,
                            message: 'A user with that email already exists, please login instead'
                        };
                    }
                });

            };

            // From https://medium.com/opinionated-angularjs/techniques-for-authentication-in-angularjs-applications-7bbf0346acec
            $scope.login = function (credentials) {
                console.log(credentials);    // TODO - Remove this!!

                $scope.login = function (credentials) {
                    AuthService.login(credentials).then(function (user) {
                        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                        $scope.setCurrentUser(user);
                    }, function () {
                        $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                    });
                };


            };
        }])
;
