module.exports = function(app) 
{
	var Politics = app.services.politics;

	var PoliticsController = 
	{

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
					} 
				});											
								
			}
			catch(ex)
			{
				console.log(ex.message);
				res.status(500).send("Problemas ao buscar todos os políticos!");
			}
		},

		createPolitic: function(req, res)
		{						
			try
			{	
				var politicName = req.body.name;

				PoliticsController.checkIfPoliticExists(politicName, function (result){

					if(result){
						
						res.status(500).send("Político já cadastrado na busca!");

					}else{
						
						Politics.create(politicName, function (politic)
						{			
							if (politic != null) 
							{
								var successMessage = "Político cadastrado com sucesso!";

								res.end(successMessage);
							}
						});
					}	
				});															
			}
			catch(ex)
			{
				console.log(ex.message);
				res.status(500).send("Problemas ao cadastrar político na busca!");
			}
		},

		editPolitic: function(req, res)
		{
			try
			{
				var oldPolitic = req.body.oldName;
				var newPolitic = req.body.newName;

				PoliticsController.checkIfPoliticExists(newPolitic, function (result){

					if(result){
						
						res.status(500).send("Político já existente na busca!");

					}else{
						
						Politics.update(oldPolitic, newPolitic, function (politic)
						{
							if (politic != null) 
							{
								var successMessage = "Político editado com sucesso!";

								res.end(successMessage);
							}
						});
					}
				});
			}
			catch(ex)
			{
				console.log(ex.message);
				res.status(500).send("Problemas ao editar o político!");
			}
		},

		checkIfPoliticExists: function(politicName, callback)
		{
			Politics.getPoliticByName(politicName, function (politic)
			{
				if(politic != null){
					if (politic.length > 0) {
						return callback(true);
					}else{
						return callback(false);
					}	
				}
				
			});
		},

		removePolitic: function(req, res)
		{
			try 
			{
				var politicName = req.body.name;

				Politics.delete(politicName, function (politic)
				{
					if (politic != null) 
					{
						var successMessage = "Político deletado com sucesso!";

						res.end(successMessage);
					}
				});
			}
			catch(ex){
				console.log(ex.message);
				res.status(500).send("Problemas ao deletar o político!");	
			}
		}

	};
	
	return PoliticsController;
};