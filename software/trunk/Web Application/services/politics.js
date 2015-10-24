module.exports = function(app) 
{

	var Users = app.models.users;

	var PoliticsService = 
	{
		getAllUserPolitics: function(login, callback) 
		{
			var query = { userName : login };

			Users.find(query).select('user_keywords').exec(function(error, politics)
			{
			
					if (error)
						throw error;

					if (politics)
						callback(politics);

					callback(null);
			});				
		},

		getPoliticByName: function(user, politicName, callback)
		{

			Users.find( { $and: [ { userName: user }, { user_keywords: politicName } ] } )
				.exec(function(error, politic)
				{
					if (error)
						throw error;

					if (politic)
						callback(politic);

					callback(null);
				});						
		},

		create: function(user, politicName, callback) 
		{
			Users.update( { userName: user }, { $push: { user_keywords: politicName } }, function(error, politic){

				if(error)
					throw error;			

				if(politic)
					callback(politic);

				callback(null);

			});			
		},

		update: function(user, oldPolitic, newPolitic, callback) 
		{
			Users.update({ userName: user, user_keywords:  oldPolitic }, 
					     { $set: {"user_keywords.$": newPolitic } }, function(error, politic) 
			{
				if(error)
					throw error;				

				callback(politic);
			});		
		},

		delete: function(user, politicName, callback) 
		{
			Users.update( { userName: user }, { $pull: { user_keywords: politicName } }, function(err, politic) {
			  
				if (err) 
			  		throw err;
			    	
		    	callback(politic);

			});		
		}
	};
	
	return PoliticsService;
};	