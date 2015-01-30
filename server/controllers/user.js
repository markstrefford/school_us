/*
 Handle routes for the users collection in MongoDB
 */

var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
var cors = require('../common/cors');


/*
 Add the controllers for users to app
 */

var addUserRoutes = function (app, userProvider) {
    app.get('/users/all', function (req, res) {

        userProvider.findAll(function (error, users) {
            cors.setHeaders(res);
            res.send(users);
        })
    });
    app.get('/users/:userId', function (req, res) {
        userProvider.findById(req.params.userId, function (error, user) {
            console.log("userProvider.findById: GET /users/" + req.params.userId);
            cors.setHeaders(res);
            res.send(user);
        })
    });
    app.put('/users/:userId', function (req, res) {
        userProvider.update(req.body, function (error, user) {
            cors.setHeaders(res);
            res.send(user);
        })
    });
    app.post('/users', function (req, res) {
        // TODO - Check validity of req.body, does it have all of the required fields?
        // Check for an existing user first
        console.log(req.body);
        userProvider.findByEmail(req.body.email, function (error, user) {
            if (error) {
                console.log(error);

            }
            else {
                if (user == null) {
                    console.log("Didn't find user with email " + req.body.email + ", creating...");
                    userProvider.insert(req.body, function (error, user) {
                        cors.setHeaders(res);
                        res.send(user);
                    })
                } else {
                    console.log("Found user with email " + req.body.email + ", exiting...");
                    cors.setHeaders(res);
                    res.status(409).send('{"error" : 409, "message": "User with email address ' + req.body.email + ' already exists"}');
                }

            }
        })

    });
    app.options('/users', cors.preflight);
    app.options('/users/:userId', cors.preflight);
}

exports.addUserRoutes = addUserRoutes;


/*
 Provider for MongoDB collection queries and updates
 */

UserProvider = function (host, database, port) {
    this.db = new Db(database, new Server(host, port, {auto_reconnect: true}, {}));
    this.db.open(function () {
    });
};


UserProvider.prototype.getCollection = function (callback) {
    this.db.collection('users', function (error, users_collection) {
        if (error) callback(error);
        else callback(null, users_collection);
    });
};

UserProvider.prototype.findAll = function (callback) {
    this.getCollection(function (error, users_collection) {
        if (error) callback(error)
        else {
            users_collection.find().toArray(function (error, users) {
                if (error) callback(error)
                else callback(null, users)
            });
        }
    });
};


UserProvider.prototype.findById = function (id, callback) {
    this.getCollection(function (error, user_collection) {
        if (error) callback(error)
        else {
            user_collection.findOne({_id: user_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function (error, user) {
                if (error) callback(error)
                else callback(null, user)
            });
        }
    });
};

UserProvider.prototype.findByEmail = function (email, callback) {
    this.getCollection(function (error, user_collection) {
        if (error) callback(error);
        else {
            user_collection.findOne({'email': email}, function (error, user) {
                if (error) {
                    console.log("findByEmail() Error:" + JSON.stringify(error));
                    callback(error);
                }
                else {
                    console.log("findByEmail() User:" + JSON.stringify(user));
                    callback(null, user);
                }
            })
        }
    });
};

UserProvider.prototype.update = function (users, callback) {
    this.getCollection(function (error, user_collection) {
        if (error) callback(error)
        else {
            if (typeof(users.length) == "undefined")
                users = [users];

            for (var i = 0; i < users.length; i++) {
                user = users[i];
                user.created_at = new Date();
            }

            // TODO - Need to change insert here to update / upsert
            user_collection.insert(users, function () {
                callback(null, users);
            });
        }
    });
};

UserProvider.prototype.insert = function (user, callback) {
    this.getCollection(function (error, user_collection) {
        if (error) callback(error)
        else {
            //if (typeof(users.length) == "undefined")
            //    users = [users];
            //
            //for (var i = 0; i < users.length; i++) {
            //    user = users[i];
                user.created_at = new Date();
                console.log("UserProvider.insert: " + user.name);
            //}

            user_collection.insert(user, function () {
                callback(null, user);
            });
        }
    });
};

/*
UserProvider.prototype.insert = function (users, callback) {
    this.getCollection(function (error, user_collection) {
        if (error) callback(error)
        else {
            if (typeof(users.length) == "undefined")
                users = [users];

            for (var i = 0; i < users.length; i++) {
                user = users[i];
                user.created_at = new Date();
                console.log("UserProvider.insert: " + user.name);
            }

            user_collection.insert(users, function () {
                callback(null, users);
            });
        }
    });
};
*/


exports.UserProvider = UserProvider;



