module.exports = function(app) 
{

	var Politics = app.services.politics;

	var PoliticsController = 
	{
		create: function(req, res)
		{						
			try
			{	
				var politicName = req.body.politicName;

				Politics.getPoliticByName(politicName, function(politic)
				{
					if (politic) {

						var params = { error: "Político já cadastrado na busca!" };

						res.render('home/index', params);
					}
					
					var newPolitic = { politic_name: req.body.politicName };

					Politics.create(newPolitic, function(politic)
					{			
						if (politic) 
						{
							req.session.politic = politic;
							
							var params = { success: "Político cadastrado com sucesso!" };

							res.render('home/index', params);
						}
					})					

				});											
								
			}
			catch(ex)
			{
				var params = { error: ex };

				res.render('home/index', params);
			}
		},

		getAll: function(req, res)
		{			
			try
			{	
				Politics.getAll(function (politics)
				{
					if (politics != null) {
						
						var array = {
							data : []
						};
						
						politics.forEach(function (item) {
  							array.data.push({
  								"politic_name" : item.politic_name
  							});
						});

						res.end(JSON.stringify(array));

					} else {
						res.end();
					}
				});											
								
			}
			catch(ex)
			{
				var params = { "error": ex };

				res.end(params);
			}
		},

		editPolitic: function(req, res)
		{
			try
			{

				var oldPolitic = req.body.oldName;
				var newPolitic = req.body.newName;

				Politics.update(oldPolitic, newPolitic, function (callback)
				{
					var successMessage = "Político editado com sucesso!";

					res.end(successMessage);
				});
			}
			catch(ex)
			{
				var params = { "error": ex };

				res.end(params);
			}
		}
	};
	
	return PoliticsController;
};