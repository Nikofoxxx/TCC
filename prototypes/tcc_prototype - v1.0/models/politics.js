module.exports = function(app) 
{
	var Schema = require('mongoose').Schema;

   	var PoliticSchema = Schema({
		  politic_name: { type: String }
	});

	return db.model('users_keywords', PoliticSchema);
};