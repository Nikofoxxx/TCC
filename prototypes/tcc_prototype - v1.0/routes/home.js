module.exports = function(app)
{
	var home = app.controllers.home;
	app.get('/', home.index);
	app.get('/createPoliticModal', home.createPolitic);	
	app.get('/editPoliticModal', home.editPolitic);
	app.get('/removePoliticModal', home.removePolitic);
};
