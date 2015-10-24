module.exports = function(app) 
{
	var SNData = app.models.socialNetworksData;

	var SNDataService = 
	{
		getCommentsByDate: function(initialDate, finalDate, politic, commentsIndex, callback){

			SNData.find({ $and: [ { date : { '$gte': initialDate, '$lte': finalDate }},
				{ 'keyword' : politic }]})
				.skip(commentsIndex)
				.limit(50)
				.select('tweet_id')
				.exec(function(error, comments){
					if (error)
						throw error;

					if (comments)
						callback(comments);

					callback(null);
				});
		},

		getUpdatedComments: function(politics, dateToSearch, callback){
			SNData.find({ $and: [ { date : { '$gt': dateToSearch }},
				{ 'keyword' : { $in : politics }}]})
				.exec(function(error, comments){
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