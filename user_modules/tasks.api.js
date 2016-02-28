/*
 * tasks.api.js
 *
 * Simple API procedures that will call functions
 * from tasks.js to accomplish their goals. Also
 * ensures users are authenticated prior to running
 * any tasks.js code.
 */

console.log("Loading tasks.api.js");

var tasks = require('./tasks.js');

var getTask = function (req, res) {
	if (!req.session.user) {
		return res.json(tasks.createResponse(false, ['auth-failure'], {}));
	}

	var params = {
		uid: req.session.user.UserID,
		tid: req.params.task_id
	};
	
	tasks.getTask(params, function (err, result) {
		return res.json(result);
	});
};

var deleteTask = function (req, res) {
	if (!req.session.user) {
		return res.json(tasks.createResponse(false, ['auth-failure'], {}));
	}

	var params = {
		uid: req.session.user.UserID,
		tid: req.params.task_id
	};
	
	tasks.deleteTask(params, function (err, result) {
		return res.json(result);
	});
};

/*
* createTask()
*
* 
*/
var createTask = function (req, res) {
	if (!req.session.user) {
		return res.json(tasks.createResponse(false, ['auth-failure'], {}));
	}

	var params = {
		uid: req.session.user.UserID,
		task_title: req.body.title,
		task_desc: req.body.desc,
		task_parent_id: req.body.parent_id,
		task_date_due: req.body.date_due,
		task_tag: req.body.tag
	};

	tasks.createTask(params, function (err, result) {
		return res.json(result);
	});
};

/*
* putTask()
*
* 
*/
var putTask = function (req, res) {
	if (!req.session.user) {
		return res.json(tasks.createResponse(false, ['auth-failure'], {}));
	}

	var params = {
		uid: req.session.user.UserID,
		tid: req.params.task_id,
		title: req.body.title,
		desc: req.body.desc,
		date_due: req.body.date_due,
		parent_id: req.body.parent_id,
		tag: req.body.tag,
	};

	tasks.updateTask(params, function (err, result) {
		return res.json(result);
	});
};

/*
* getTasks()
*
* 
*/
var getTasks = function (req, res) {
	if (!req.session.user) {
		return res.json(tasks.createResponse(false, ['auth-failure'], {}));
	}

	var params = {
		uid: req.session.user.UserID,
	};

	tasks.getTasks(params, function (err, result) {
		return res.json(result);
	});
};

module.exports = {
	getTask: getTask,
	getTasks: getTasks,
	createTask: createTask,
	deleteTask: deleteTask,
	putTask: putTask,
};
