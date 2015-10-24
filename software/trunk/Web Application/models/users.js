module.exports = function(app) 
{
	var Schema = require('mongoose').Schema;

	var user = Schema({
		  firstName: { type: String, required: true }
		, lastName: { type: String, required: true }
		, userName: { type: String, required: true }
		, passwd: { type: String, required: true }
		, user_keywords: []
	});

	return db.model('users', user);
};