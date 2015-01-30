/**
 * Created with JetBrains WebStorm.
 * User: markstrefford
 * Date: 24/08/2013
 * Time: 18:55
 * To change this template use File | Settings | File Templates.
 */


/*
 * Set up headers for pre-flight checks
 *
 * TODO - Move all of this to a utility class
 */

var preflight = function (req, res) {
            console.log("Pre-flight and set headers");
            setHeaders(res);
            res.send(200);
}

var setHeaders = function (res) {
    res.header('Access-Control-Allow-Origin', "*");     // TODO - Make this more secure!!
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST');
    res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept');
}

exports.preflight = preflight;
exports.setHeaders = setHeaders;
