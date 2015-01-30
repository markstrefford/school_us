/*
 Handle routes for the schools collection in MongoDB
 */

var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

/*
 Provider for MongoDB collection queries and updates
 */

SchoolProvider = function (host, database, port) {
    this.db = new Db(database, new Server(host, port, {auto_reconnect: true}, {}));
    this.db.open(function () {
    });
};


SchoolProvider.prototype.getCollection = function (callback) {
    this.db.collection('schools', function (error, schools_collection) {
        if (error) callback(error);
        else callback(null, schools_collection);
    });
};

SchoolProvider.prototype.findAll = function (callback) {
    this.getCollection(function (error, schools_collection) {
        if (error) callback(error)
        else {
            schools_collection.find().toArray(function (error, schools) {
                if (error) callback(error)
                else callback(null, schools)
            });
        }
    });
};


SchoolProvider.prototype.findById = function (id, callback) {
    this.getCollection(function (error, school_collection) {
        if (error) callback(error)
        else {
            school_collection.findOne({_id: school_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function (error, school) {
                if (error) callback(error)
                else callback(null, school)
            });
        }
    });
};

SchoolProvider.prototype.save = function (schools, callback) {
    this.getCollection(function (error, school_collection) {
        if (error) callback(error)
        else {
            if (typeof(schools.length) == "undefined")
                schools = [schools];

            for (var i = 0; i < schools.length; i++) {
                school = schools[i];
                schools.created_at = new Date();
            }

            school_collection.insert(schools, function () {
                callback(null, schools);
            });
        }
    });
};

exports.SchoolProvider = SchoolProvider;


