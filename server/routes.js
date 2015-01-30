var _ = require('underscore')
    , path = require('path')
    , passport = require('passport')
    , AuthCtrl = require('./controllers/auth')
    , UserCtrl = require('./controllers/user')
    , SchoolCtrl = require('./controllers/school.js')
    , ProposalCtrl = require('./controllers/proposal.js')
    , CompanyCtrl = require('./controllers/company.js')
    , User = require('./models/User.js')
    , userRoles = require('../client/app/scripts/routeConfig').userRoles
    , accessLevels = require('../client/app/scripts/routeConfig').accessLevels;

var routes = [

    // Views
    {
        path: '/partials/*',
        httpMethod: 'GET',
        middleware: [function (req, res) {
            var requestedView = path.join('./', req.url);
            res.render(requestedView);
        }]
    },

    // OAUTH
    {
        path: '/auth/twitter',
        httpMethod: 'GET',
        middleware: [passport.authenticate('twitter')]
    },
    {
        path: '/auth/twitter/callback',
        httpMethod: 'GET',
        middleware: [passport.authenticate('twitter', {
            successRedirect: '/',
            failureRedirect: '/login'
        })]
    },
    {
        path: '/auth/facebook',
        httpMethod: 'GET',
        middleware: [passport.authenticate('facebook')]
    },
    {
        path: '/auth/facebook/callback',
        httpMethod: 'GET',
        middleware: [passport.authenticate('facebook', {
            successRedirect: '/',
            failureRedirect: '/login'
        })]
    },
    /*    {
     path: '/auth/google',
     httpMethod: 'GET',
     middleware: [passport.authenticate('google')]
     },
     {
     path: '/auth/google/return',
     httpMethod: 'GET',
     middleware: [passport.authenticate('google', {
     successRedirect: '/',
     failureRedirect: '/login'
     })]
     },
     {
     path: '/auth/linkedin',
     httpMethod: 'GET',
     middleware: [passport.authenticate('linkedin')]
     },
     {
     path: '/auth/linkedin/callback',
     httpMethod: 'GET',
     middleware: [passport.authenticate('linkedin', {
     successRedirect: '/',
     failureRedirect: '/login'
     })]
     },     */

    // Local Auth
    {
        path: '/register',
        httpMethod: 'POST',
        middleware: [AuthCtrl.register]
    },
    {
        path: '/login',
        httpMethod: 'POST',
        middleware: [AuthCtrl.login]
    },
    {
        path: '/logout',
        httpMethod: 'POST',
        middleware: [AuthCtrl.logout]
    },

    // User resource
    {
        path: '/users',
        httpMethod: 'GET',
        middleware: [UserCtrl.index],
        accessLevel: accessLevels.admin
    },

    // Web services

    // Schools
    {
        path: '/schools',
        httpMethod: 'GET',
        middleware: [SchoolCtrl.findAll],
        accessLevel: accessLevels.public
    },{
        path: '/schools/all',
        httpMethod: 'GET',
        middleware: [SchoolCtrl.findAll],
        accessLevel: accessLevels.public
    },
    {
        path: '/schools/:schoolId',
        httpMethod: 'GET',
        middleware: [SchoolCtrl.findById],
        accessLevel: accessLevels.public
    },
    {
        path: '/schools',
        httpMethod: 'POST',
        middleware: [SchoolCtrl.save],
        accessLevel: accessLevels.admin
    },

    // Proposals
    {
        path: '/proposals',
        httpMethod: 'GET',
        middleware: [ProposalCtrl.findAll],
        accessLevel: accessLevels.public
    },
    {
        path: '/proposals/:proposalId',
        httpMethod: 'GET',
        middleware: [ProposalCtrl.findById],
        accessLevel: accessLevels.public
    },
    {
        path: '/proposals/school/:schoolId',
        httpMethod: 'GET',
        middleware: [ProposalCtrl.findBySchoolId],
        accessLevel: accessLevels.public
    },
    {
        path: '/proposals/user/:userId',
        httpMethod: 'GET',
        middleware: [ProposalCtrl.findBySchoolId],
        accessLevel: accessLevels.public
    },
    {
        path: '/proposals/:proposalId',
        httpMethod: 'POST',
        middleware: [ProposalCtrl.confirm],
        accessLevel: accessLevels.user
    },

    // Bus Companies
    {
        path: '/companies',
        httpMethod: 'GET',
        middleware: [CompanyCtrl.findAll],
        accessLevel: accessLevels.public
    },
    {
        path: '/companies/:companyId',
        httpMethod: 'GET',
        middleware: [CompanyCtrl.findById],
        accessLevel: accessLevels.public
    },
    {
        path:   '/companies',
        httpMethod: 'POST',
        middleware: [CompanyCtrl.save],
        accessLevel: accessLevels.admin
    },

    // All other get requests should be handled by AngularJS's client-side routing system
    {
        path: '/*',
        httpMethod: 'GET',
        middleware: [function (req, res) {
            var role = userRoles.public, username = '';
            if (req.user) {
                role = req.user.role;
                username = req.user.username;
            }
            res.cookie('user', JSON.stringify({
                'username': username,
                'role': role
            }));
            res.render('index');
        }]
    }
];

module.exports = function (app) {

    _.each(routes, function (route) {
        route.middleware.unshift(ensureAuthorized);
        var args = _.flatten([route.path, route.middleware]);

        switch (route.httpMethod.toUpperCase()) {
            case 'GET':
                app.get.apply(app, args);
                break;
            case 'POST':
                app.post.apply(app, args);
                break;
            case 'PUT':
                app.put.apply(app, args);
                break;
            case 'DELETE':
                app.delete.apply(app, args);
                break;
            default:
                throw new Error('Invalid HTTP method specified for route ' + route.path);
                break;
        }
    });
}

function ensureAuthorized(req, res, next) {
    var role;
    if (!req.user) role = userRoles.public;
    else          role = req.user.role;
    var accessLevel = _.findWhere(routes, { path: req.route.path, httpMethod: req.route.stack[0].method.toUpperCase() }).accessLevel || accessLevels.public;

    if (!(accessLevel.bitMask & role.bitMask)) return res.send(403);
    return next();
}