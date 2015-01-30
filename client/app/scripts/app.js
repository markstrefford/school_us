'use strict';

angular.module('schoolusUiApp', [
    'ngCookies'
    , 'ngResource'
    , 'ngSanitize'
    , 'ui.router'
    , 'underscore'
    , 'main'
    , 'myMap'
    , 'myDetails'
    , 'confirm'
    , 'mysummary'
    , 'selectSchool'
    , 'selectHome'
    , 'selectproposal'
    , 'register'
    , 'postcode'
])
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
        var access = routingConfig.accessLevels;

        // Public routes
        $stateProvider
            .state('public', {
                abstract: true,
                template: "<ui-view/>",
                data: {
                    access: access.public
                }
            })
            .state('public.home', {
                url: '/',
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .state('public.404', {
                url: '/404/',
                templateUrl: '404.html'
            });

        // Anonymous routes
        $stateProvider
            .state('anon', {
                abstract: true,
                template: "<ui-view/>",
                data: {
                    access: access.anon
                }
            })
            .state('anon.login', {
                url: '/login/',
                templateUrl: 'login',
                controller: 'LoginCtrl'
            })
            .state('anon.register', {
                url: '/register/',
                templateUrl: 'register',
                controller: 'RegisterCtrl'
            })
            .state('anon.selectschool', {
                url: '/selectschool',
                templateUrl: 'views/selectschool.html',
                controller: 'SelectschoolCtrl'
            })
            .state('anon.selecthome', {
                url: '/selecthome/:schoolId',
                templateUrl: 'views/selecthome.html',
                controller: 'SelecthomeCtrl'
            })
            .state('anon.selectproposal', {
                url: '/selectbus/:schoolId/homelat/:lat/homelng/:lng',
                templateUrl: 'views/selectproposal.html',
                controller: 'SelectproposalCtrl'
            });

        // Regular user routes
        $stateProvider
            .state('user', {
                abstract: true,
                template: "<ui-view/>",
                data: {
                    access: access.user
                }
            })
            .state('user.confirm', {
                url: '/confirm/:schoolId/:userId/:proposalId',
                templateUrl: 'views/confirm.html',
                controller: 'ConfirmCtrl'
            })
            .state('user.mydetails', {
                url: '/mydetails/:userId',
                templateUrl: 'views/mydetails.html',
                controller: 'MydetailsCtrl'
            });
            /*.state('user.private.home', {
                url: '',
                templateUrl: 'private/home'
            })
            .state('user.private.nested', {
                url: 'nested/',
                templateUrl: 'private/nested'
            })
            .state('user.private.admin', {
                url: 'admin/',
                templateUrl: 'private/nestedAdmin',
                data: {
                    access: access.admin
                }
            });*/


        // Admin routes
        // TODO - Add these back in later
        /*$stateProvider
            .state('admin', {
                abstract: true,
                template: "<ui-view/>",
                data: {
                    access: access.admin
                }
            })
            .state('admin.admin', {
                url: '/admin/',
                templateUrl: 'admin',
                controller: 'AdminCtrl'
            });*/


        $urlRouterProvider.otherwise('/404');

        // FIX for trailing slashes. Gracefully "borrowed" from https://github.com/angular-ui/ui-router/issues/50
        $urlRouterProvider.rule(function ($injector, $location) {
            if ($location.protocol() === 'file')
                return;

            var path = $location.path()
            // Note: misnomer. This returns a query object, not a search string
                , search = $location.search()
                , params
                ;

            // check to see if the path already ends in '/'
            if (path[path.length - 1] === '/') {
                return;
            }

            // If there was no search string / query params, return with a `/`
            if (Object.keys(search).length === 0) {
                return path + '/';
            }

            // Otherwise build the search string and return a `/?` prefix
            params = [];
            angular.forEach(search, function (v, k) {
                params.push(k + '=' + v);
            });
            return path + '/?' + params.join('&');
        });

        $locationProvider.html5Mode(true);

        $httpProvider.interceptors.push(function ($q, $location) {
            return {
                'responseError': function (response) {
                    if (response.status === 401 || response.status === 403) {
                        $location.path('/login');
                    }
                    return $q.reject(response);
                }
            };
        });

    }])

    .run(['$rootScope', '$state', 'Auth', function ($rootScope, $state, Auth) {

        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
            if (!Auth.authorize(toState.data.access)) {
                // TODO - Replace this error message with something more meaningful!
                $rootScope.error = "Seems like you tried accessing a route you don't have access to...";
                event.preventDefault();

                if (fromState.url === '^') {
                    if (Auth.isLoggedIn()) {
                        $state.go('user.mydetails');
                    } else {
                        $rootScope.error = null;
                        $state.go('anon.login');
                    }
                }
            }
        });

    }]);

/*$routeProvider
 .when('/selectschool', {
 templateUrl: 'views/selectschool.html',
 controller: 'SelectschoolCtrl'
 }).when('/selecthome/:schoolId', {
 templateUrl: 'views/selecthome.html',
 controller: 'SelecthomeCtrl'
 }).when('/selectbus/:schoolId/homelat/:lat/homelng/:lng', {
 templateUrl: 'views/selectproposal.html',
 controller: 'SelectproposalCtrl'
 }).when('/register/:schoolId/homelat/:lat/homelng/:lng/proposal/:proposalId', {
 templateUrl: 'views/register.html',
 controller: 'RegisterCtrl'
 }).when('/', {
 templateUrl: 'views/main.html',
 controller: 'MainCtrl'
 })
 .when('/mydetails/:schoolId', {
 templateUrl: 'views/mydetails.html',
 controller: 'MyDetailsCtrl'
 })
 .when('/confirm/:schoolId/:userId/:proposalId', {
 templateUrl: 'views/confirm.html',
 controller: 'ConfirmCtrl'
 })
 // TODO - Handle errors here, so ideally need to go to ConfirmCtrl first, which redirects to MySummaryCtrl perhaps
 // TODO - Sort this out in the proper checkout code
 .when('/confirm/:schoolId/:userId/:proposalId/:status', {
 templateUrl: 'views/mysummary.html',
 controller: 'MySummaryCtrl'
 })
 .otherwise({
 redirectTo: '/'
 });
 }]); */
