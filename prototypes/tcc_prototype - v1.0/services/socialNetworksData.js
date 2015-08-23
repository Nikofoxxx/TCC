module.exports = function(app) 
{
	var SNData = app.models.socialNetworksData;

	var SNDataService = 
	{
		//TODO: AJAX method fires here
		getComments: function(callback){
			SNData.find().exec(function(error, comments) {
				if(error)
					throw error;

				if (comments)
					callback(comments);

				callback(null);
			});
		},

		getUpdatedComments: function(politics, dateToSearch, callback){
			SNData.find({ $and: [ { date : { '$gt': dateToSearch }},
						{ 'keyword' : { $in : politics }}]}
  				).exec(function(error, comments){
					if (error)
						throw error;

					if (comments)
						callback(comments);

					callback(null);
				});
		}
	};
	
	return SNDataService;
};