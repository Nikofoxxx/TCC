module.exports = function(app) 
{
	var Schema = require('mongoose').Schema;

   	var SNSchema = Schema({
		  tweet_id: { type: String },
		  location: { type: String },
		  date: { type: Date, default: Date.now },
		  keyword: { type: String }
	});

	return db.model('social_networks_datas', SNSchema);
};