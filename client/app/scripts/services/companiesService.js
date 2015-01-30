/*
 * Bus Company service
 *
 * Usage:
 *
 * GET full list of schools from back end
 *
 *      $scope.company = companiesService.query();
 *
 * GET details of a single school
 *
 *      $scope.company = companiesService.get({companyId: $routeParams.companyId}, function(company) {
 *          $scope.company = company;
 *      });
 *
 *
 */

'use strict';

angular.module('companies', ['ngResource'])
    .factory('companiesService', ['$resource', function($resource) {
        console.log("companiesService Factory $resource GET");
        return $resource('http://schoolus.local\\:3001/companies/:companyId', {}, {
            query: {method:'GET', params:{companyId:'companies'}, isArray:true}
        })
    }]);