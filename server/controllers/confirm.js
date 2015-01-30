/**
 * Created with JetBrains WebStorm.
 * User: markstrefford
 * Date: 14/09/2013
 * Time: 07:37
 * To change this template use File | Settings | File Templates.
 */

var url = require('url');
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
var company = require('./company');

var parseUrlParams = function(req, res, next) {
    req.urlParams = url.parse(req.url, true);
    next();
}
/*
 Add the controllers for proposals to app
 */

var addConfirmRoutes = function (app, proposalProvider) {
    app.get('/confirm', parseUrlParams, function (req, res) {
        console.log("confirmProvider.findById: GET /users/" + req.params.userId);
        proposalProvider.confirm(req.urlParams.query.proposalId, req.urlParams.query.userId, function (error, proposal) {
            //res.send(proposal);
            res.redirect(req.urlParams.query.confirm_ok_url);
        })
    });
    app.options('/confirm', cors.preflight);

}

exports.addConfirmRoutes = addConfirmRoutes;

// Confirm provider currently does nothing, but leave here to use the same pattern as other parts of the code!!
ConfirmProvider = function (host, database, port) {
    //this.db = new Db(database, new Server(host, port, {auto_reconnect: true}, {}));
    //this.db.open(function () {
    //});
};

exports.ConfirmProvider = ConfirmProvider;




