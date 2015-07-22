module.exports = function(app) 
{
	var SNData = app.services.socialNetworksData;

	var dateToSearch = new Date().toISOString();
	var dateToCompare = new Date();

	var SNDataController = 
	{
		getUpdatedComments: function(client){
			try
			{
				var queryComments = setTimeout(function(){ 

					SNData.getUpdatedComments(dateToSearch,function (snData)
					{
						if(snData != null){
							clearTimeout(queryComments);	
							if(snData.length > 0){
								snData.forEach(function (item) {
		  							if(item.date > dateToCompare){
		  								console.log(item);
		  								dateToCompare = item.date;
		  								dateToSearch = item.date.toISOString();
		  								client.emit('data', item);
		  							}else{
		  								console.log("Registro com data menor!");
		  							}
								});
							}else{
								console.log("Sem registros novos!");
							}
						}
					});			
					SNDataController.getUpdatedComments(client);
				}, 1000);
			}
			catch(ex)
			{
				console.log(ex.message);
				res.status(500).send("Problemas ao buscar todos comentários!");
			}
		}	
	};
	return SNDataController;
};

