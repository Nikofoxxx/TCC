module.exports = function(app) 
{
	var Politics = app.services.politics;

	var PoliticsController = 
	{

		getAll: function(req, res)
		{			
			try
			{	
				var user = req.session.user.userName;

				Politics.getAllUserPolitics(user, function (politics)
				{
					if (politics != null) {
						
						var array = {
							data : []
						};
						
						politics.forEach(function (item) {
							item.user_keywords.forEach(function (keyword){
								array.data.push({
									"politic_name" : keyword
								});
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
				var user = req.session.user.userName;
				var politicName = req.body.name;

				PoliticsController.checkIfPoliticExists(user, politicName, function (result){

					if(result){
						
						res.status(500).send("Político já cadastrado na busca!");

					}else{
						Politics.create(user, politicName, function (politic)
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
				var user = req.session.user.userName;
				var oldPolitic = req.body.oldName;
				var newPolitic = req.body.newName;

				PoliticsController.checkIfPoliticExists(user, newPolitic, function (result){

					if(result){
						
						res.status(500).send("Político já existente na busca!");

					}else{
						
						Politics.update(user, oldPolitic, newPolitic, function (politic)
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

		checkIfPoliticExists: function(user, politicName, callback)
		{
			Politics.getPoliticByName(user, politicName, function (politics)
			{
				if(politics != null){
					if(politics.length > 0)
						return callback(true);
					return callback(false);
				}
			});
		},

		removePolitic: function(req, res)
		{
			try 
			{
				var user = req.session.user.userName;
				var politicName = req.body.name;

				Politics.delete(user, politicName, function (politic)
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