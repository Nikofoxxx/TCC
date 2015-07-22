module.exports = function(app) 
{
	var Schema = require('mongoose').Schema;

   	var SNSchema = Schema({
		  politic_name: { type: String },
		  comment: { type: String },
		  date: { type: Date, default: Date.now }
	});

	return db.model('social_networks_data', SNSchema);
};