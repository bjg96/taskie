var config = require('./user_modules/config.js');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var knex = require('knex');
var KnexSessionStore = require('connect-session-knex')(session);
var routes = require('./routes/index');
var apiV1 = require('./routes/api.v1');
var tasks = require('./user_modules/tasks.js');

var knexSql = new knex({
	client: 'mysql',
	connection: {
		host: config.mysql.host,
		user: config.mysql.user,
		password : config.mysql.password,
		database : config.mysql.database
	}
});

var store = new KnexSessionStore({
    knex: knexSql,
    tablename: 'sessions' // optional. Defaults to 'sessions'
});

var app = express();

app.use(session({
    secret: config.session.secret,
    resave: config.session.resave,
    saveUninitialized: config.session.saveUninitialized,
    cookie: {
        maxAge: config.session.cookie.maxAge
    },
    store: store
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/api/v1', apiV1);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var taskNotify = function () {
	console.log("Looking up due tasks...");
	tasks.getNotifTasks(function (err, results) {
		if (results.success) {
			for (var i=0; i<results.data.length; i++) {
				var data = results.data[i];
				var params = {
					task_id: data.TaskID,
					email: data.email,
					task_desc: data.TaskDesc,
					task_due_date: data.TaskDueDate,
					task_name: data.TaskTitle
				}
				
				tasks.sendNotifTask(params, null);
				console.log("Sending task notification for task_id: " + params.task_id);
			}
		}
	});
};

setInterval(taskNotify, 300000);
taskNotify();


module.exports = app;
