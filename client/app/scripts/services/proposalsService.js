'use strict';

angular.module('proposals', ['ngResource'])

  // TODO - Can these 2 services be merged in some way??  May require changes to the node.js URL at the server

  /*
   * Get all proposals, or a proposal with a specified ID
   */
  .factory('proposalsService', ['$resource', function ($resource) {
        console.log("proposalsService Factory $resource GET");
        return $resource('http://schoolus.local\\:3001/proposals/:proposalId', {}, {
            query: {method:'GET', params:{proposalId:'proposals'}, isArray:true},
            addParentPut: {method:'PUT', isArray:true},
            addParentPost: {method:'POST', isArray:true}
        })
    }])
  /*
   * Get proposals for a specific school
   */
  .factory('proposalsBySchoolService', ['$resource', function($resource) {
        console.log("proposalsBySchoolService Factory $resource GET");
        return $resource('http://schoolus.local\\:3001/proposals/school/:schoolId', {}, {
            query: {method:'GET', params:{schoolId:'proposals'}, isArray:true}
        })
    }])
    /*
     * Get proposals for a specific user
     */
    .factory('proposalsByUserService', ['$resource', function($resource) {
        console.log("proposalByUserService Factory $resource GET");
        return $resource('http://schoolus.local\\:3001/proposals/user/:userId', {}, {
            query: {method: 'GET', isArray:true}
        })
    }])


// Call this when a user confirms they have selected a proposal
/*
    .factory('proposalsTransactionService', ['$resource', function($resource) {
        console.log("proposalsTransactionService Factory $resource...." );
        // TODO - what do we need to do here???
        return $resource('http://schoolus.local\\:3001/proposals/confirm/:proposalId/:userId', {}, {
            addParent: {method:'POST'}
        })
    }])
*/

/* angular.module('users', ['ngResource'])
 .factory('usersService', ['$resource', function($resource) {
 console.log("usersService factory $resource GET");
 return $resource('http://schoolus.local\\:3001/users/:userId', {}, {
 query: {method:'GET', isArray:true},
 update: {method:'PUT', isArray: true}
 })
 }]);
 */







