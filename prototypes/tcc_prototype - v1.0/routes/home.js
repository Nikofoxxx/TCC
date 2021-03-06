module.exports = function(app)
{
	var isLogged = require('./../middleware/isLogged')
	, home = app.controllers.home;

	app.get('/index', isLogged, home.index);
	app.get('/createPoliticModal', isLogged, home.createPolitic);	
	app.get('/editPoliticModal', isLogged, home.editPolitic);
	app.get('/removePoliticModal', isLogged, home.removePolitic);
	app.get('/tweetsModal', isLogged, home.tweetsModal);
	app.get('/getTweetModalContent', isLogged, home.getTweetModalContent);
	app.get('/about', isLogged, home.about);
};
