/*
 * Schools service
 *
 * Usage:
 *
 * GET full list of schools from back end
 *
 *      $scope.schools = schoolsService.query();
 *
 * GET details of a single school
 *
 *      $scope.school = schoolsService.get({schoolId: $routeParams.schoolId}, function(school) {
 *          $scope.school = school;
 *      });
 *
 *
 */

'use strict';

angular.module('schools', ['ngResource'])
    .factory('schoolsService', ['$resource', function($resource) {
        console.log("schoolsService Factory $resource GET");
        return $resource('http://schoolus.local\\:3001/schools/:schoolId', {}, {
            query: {method:'GET', params:{schoolId:'all'},isArray:true}
        })
  }]);
