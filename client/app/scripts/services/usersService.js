/*
 * Users service
 *
 * Usage:
 *
 * GET details of a single user
 *
 *
 *
 */

'use strict';

angular.module('users', ['ngResource'])
    .factory('User', ['$resource', function($resource) {
        console.log("User factory $resource GET");
        return $resource('http://schoolus.local\\:3001/users/:userId', {}, {
            query: {method:'GET', params:{userId:'all'}, isArray:true},
            update: {method:'PUT', isArray: true},
            register: {method:'POST', isArray: false}   // TODO - Move this to auth service???
        })
    }]);
