/*
 Handle routes for the bus companies collection in MongoDB
 */

var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
var cors = require('../common/cors');


/*
 Provider for MongoDB collection queries and updates
 */

CompanyProvider = function (host, database, port) {
    this.db = new Db(database, new Server(host, port, {auto_reconnect: true}, {}));
    this.db.open(function () {
    });
};


CompanyProvider.prototype.getCollection = function (callback) {
    this.db.collection('companies', function (error, companies_collection) {
        if (error) callback(error);
        else callback(null, companies_collection);
    });
};

CompanyProvider.prototype.findAll = function (callback) {
    this.getCollection(function (error, companies_collection) {
        if (error) callback(error)
        else {
            companies_collection.find().toArray(function (error, companies) {
                if (error) callback(error)
                else callback(null, companies)
            });
        }
    });
};


CompanyProvider.prototype.findById = function (id, callback) {
    this.getCollection(function (error, company_collection) {
        if (error) callback(error)
        else {
            company_collection.findOne({_id: company_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function (error, company) {
                if (error) callback(error)
                else callback(null, company)
            });
        }
    });
};

CompanyProvider.prototype.save = function (companies, callback) {
    this.getCollection(function (error, company_collection) {
        if (error) callback(error)
        else {
            if (typeof(companies.length) == "undefined")
                companies = [companies];

            for (var i = 0; i < companies.length; i++) {
                company = companies[i];
                company.created_at = new Date();
            }

            company_collection.insert(companies, function () {
                callback(null, companies);
            });
        }
    });
};

exports.CompanyProvider = CompanyProvider;

