/**
 * Module dependencies.
 */

// Node & 3rd party modules require
var newrelic = require('newrelic')
    , express = require('express')
    , http = require('http')
    , path = require('path')
    , passport = require('passport')
    , morgan = require('morgan')
    , bodyParser = require('body-parser')
    , methodOverride = require('method-override')
    , cookieParser = require('cookie-parser')
    , cookieSession = require('cookie-session')
    , session = require('express-session')
    , favicon = require('serve-favicon')
    , csrf = require('csurf')
    , User = require('./models/User.js')
    , Server = require('mongodb').Server;

// Schoolus.org modules
var routes = require('./routes')
    , user = require('./controllers/user')
    , school = require('./controllers/school')
    , proposal = require('./controllers/proposal')
    , company = require('./controllers/company')
    , confirm = require('./controllers/confirm');

var app = module.exports = express();

// Set up web server
var app = express();
app.set('port', process.env.PORT || 3001);
app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs');
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'client')));
app.use(cookieParser());
app.use(session(
    {
        secret: process.env.COOKIE_SECRET || "Superdupersecret"
    }));
app.use(express.static(path.join(__dirname, 'public')));

var env = process.env.NODE_ENV || 'development';
if ('development' === env || 'production' === env) {
    app.use(csrf());
    app.use(function (req, res, next) {
        res.cookie('XSRF-TOKEN', req.csrfToken());
        next();
    });
}

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.localStrategy);
passport.use(User.twitterStrategy());  // Comment out this line if you don't want to enable login via Twitter
passport.use(User.facebookStrategy()); // Comment out this line if you don't want to enable login via Facebook
//passport.use(User.googleStrategy());   // Comment out this line if you don't want to enable login via Google
//passport.use(User.linkedInStrategy()); // Comment out this line if you don't want to enable login via LinkedIn

passport.serializeUser(User.serializeUser);
passport.deserializeUser(User.deserializeUser);


// Set up controllers for site functionality
// Note that this will be probably be quite lightweight as angular.js is expected to be the front end

var userProvider = new UserProvider('mongodb.local', 'schoolusdev', 27017);
var schoolProvider = new SchoolProvider('mongodb.local', 'schoolusdev', 27017);
var proposalProvider = new ProposalProvider('mongodb.local', 'schoolusdev', 27017);
var companyProvider = new CompanyProvider('mongodb.local', 'schoolusdev', 27017);
var confirmProvider = new ConfirmProvider('mongodb.local', 'schoolusdev', 27017);


//TODO - app.post('/proposals/:proposalId/:userId', proposal.addParentToProposal);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));

});
