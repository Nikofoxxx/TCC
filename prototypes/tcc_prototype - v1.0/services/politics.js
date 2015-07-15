module.exports = function(app) 
{

	var Politics = app.models.politics;

	var PoliticsService = 
	{
		getAll: function(callback) 
		{
			Politics.find(function(error, politics)
				{
			
					if (error)
						throw error;

					if (politics)
						callback(politics);

					callback(null);
				});				
		},

		getPoliticByName: function(politicName, callback)
		{

			var query = { politic_name: politicName };
	
			Politics.find(query)
				.select('politic_name')
				.exec(function(error, politic)
				{
					if (error)
						throw error;

					if (politic)
						callback(politic);

					callback(null);
				});						
		},

		create: function(politicName, callback) 
		{
			var query = { politic_name: politicName };

			var document = new Politics(query);

			document.save(function (error, politic) 
			{
				if(error)
					throw error;				

				callback(politic);
			});			
		},

		update: function(oldPolitic, newPolitic, callback) 
		{
			var query = { politic_name : oldPolitic };

			Politics.update(query, { politic_name : newPolitic }, function(error, politic) 
			{
				if(error)
					throw error;				

				callback(politic);
			});		
		},

		delete: function(politicName, callback) 
		{
			var query = { politic_name: politicName };

			Politics.findOneAndRemove(query, function(err, politic) {
			  
				if (err) 
			  		throw err;
			    	
		    	callback(politic);

			});		
		}
	};
	
	return PoliticsService;
};	