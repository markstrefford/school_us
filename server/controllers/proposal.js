/*
 Handle routes for the proposals collection in MongoDB
 */

var url = require('url');
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
var company = require('./company');

var parseUrlParams = function (req, res, next) {
    req.urlParams = url.parse(req.url, true);
    next();
}


/* TODO - Wrap this into a controller function below

 app.put('/proposals/:proposalId', parseUrlParams, function (req, res) {
 if (req.urlParams.query.action == 'confirm') {
 console.log("PUT /proposals/:proposalId?action=confirm...");
 console.log(req.urlParams);
 console.log(req.body);
 //proposalProvider.confirm(req.params.proposalId, req.urlParams.query.userId, function (error, proposal) {
 //    cors.setHeaders(res);
 //res.send(proposal);
 //})
 res.send("OK");
 } else {
 err = 'Undefined action';
 callback(err);
 }

 });*/


/*
 Provider for MongoDB collection queries and updates
 */

ProposalProvider = function (host, database, port) {
    this.db = new Db(database, new Server(host, port, {auto_reconnect: true}, {}));
    this.db.open(function () {
    });
};


ProposalProvider.prototype.getCollection = function (callback) {
    this.db.collection('proposals', function (error, proposals_collection) {
        if (error) callback(error);
        else callback(null, proposals_collection);
    });
};

ProposalProvider.prototype.findAll = function (callback) {
    this.getCollection(function (error, proposals_collection) {
        if (error) callback(error)
        else {
            proposals_collection.find().toArray(function (error, proposals) {
                if (error) callback(error)
                else callback(null, proposals)
            });
        }
    });
};


ProposalProvider.prototype.findById = function (id, callback) {
    this.getCollection(function (error, proposal_collection) {
        if (error) callback(error)
        else {
            proposal_collection.findOne({_id: proposal_collection.db.bson_serializer.ObjectID.createFromHexString(id)},
                function (error, proposal) {
                    if (error) callback(error)
                    else callback(null, proposal)
                });
        }
    });
};


ProposalProvider.prototype.findBySchoolId = function (schoolId, callback) {
    this.getCollection(function (error, proposal_collection) {
        if (error) callback(error)
        else {
            proposal_collection.find({"school_id": schoolId}).toArray(function (error, proposals) {
                if (error) callback(error)
                else callback(null, proposals)
            });
        }
    });
};


ProposalProvider.prototype.findByUserId = function (userId, callback) {
    this.getCollection(function (error, proposal_collection) {
        if (error) callback(error)
        else {
            proposal_collection.find({"users": userId}).toArray(function (error, proposals) {
                if (error) callback(error)
                else callback(null, proposals)
            });
        }
    });
};

ProposalProvider.prototype.save = function (proposals, callback) {
    this.getCollection(function (error, proposal_collection) {
        if (error) callback(error)
        else {
            if (typeof(proposals.length) == "undefined")
                proposals = [proposals];

            for (var i = 0; i < proposals.length; i++) {
                proposal = proposals[i];
                proposal.created_at = new Date();
            }

            proposal_collection.insert(proposals, function () {
                callback(null, proposals);
            });
        }
    });
};

// ProposalProvider.prototype.update = functioN(proposal, callback) {...}
// ProposalProvider.prototype.update = functioN(proposal, callback) {...}

ProposalProvider.prototype.confirm = function (proposalId, userId, callback) {
    this.getCollection(function (error, proposal_collection) {
        if (error) callback(error)
        else {
            proposal_collection.findOne({_id: proposal_collection.db.bson_serializer.ObjectID.createFromHexString(proposalId)},
                function (error, proposal) {
                    if (error) callback(error)
                    else {
                        console.log("Adding " + userId + " to " + proposalId);
                        console.log("Proposal = " + proposal.id);
                        // TODO - Might want to validate whether the user ID exists in this list before adding it again
                        proposal_collection.update({_id: proposal_collection.db.bson_serializer.ObjectID.createFromHexString(proposalId)},
                            { $push: { users: userId}}, function (error, proposal) {
                                if (error) callback(error)
                                else {
                                    console.log("Proposal.confirm.update - done");
                                    callback(null, proposal)
                                }
                            }
                        )


                    }
                });
        }
    });

    /* this.getCollection(function (error, proposal_collection) {
     if (error) callback(error)
     else {
     console.log("Proposal.checkout - We are here as a user has confirmed a proposal!!!");
     proposalProvider.findById(proposalId, function (error, proposal) {
     if (error) callback(error)
     else {
     if (typeof(proposal.length) == "undefined")
     proposal = [proposal];
     // Add user to list of users
     // TODO - Validate its not already there and that user actually exists!!
     console.log("Adding " + userId + " to " + proposalId);
     console.log("Proposal = " + proposal.id);
     //proposal.users.push(userId);
     proposal.users = userId;
     console.log("Proposal users: " + proposal.users);
     console.log("Now saving back...");
     proposal_collection.save(proposal, function(error, proposal) {
     if (error) {
     console.log("confirm error at proposal save!");
     callback(error)
     }
     else {
     console.log("saved!");
     return proposal;
     }
     })
     }
     })
     }
     callback(null, proposal);

     }) */
}

exports.ProposalProvider = ProposalProvider;



