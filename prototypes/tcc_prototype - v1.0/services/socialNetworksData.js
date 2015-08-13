module.exports = function(app) 
{
	var SNData = app.models.socialNetworksData;

	var SNDataService = 
	{
		getComments: function(callback){
			SNData.find().exec(function(error, comments) {
				if(error)
					throw error;

				if (comments)
					callback(comments);

				callback(null);
			});
		},

		getUpdatedComments: function(dateToSearch, callback){
			SNData.find(	
  				{ date : { '$gt': dateToSearch }}).exec(function(error, comments){
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