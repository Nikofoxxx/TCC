module.exports = function(app)
{
	var isLogged = require('./../middleware/isLogged')
	, politics = app.controllers.politics;

	app.get('/getAll', isLogged, politics.getAll);
	app.post('/createPolitic', isLogged, politics.createPolitic);
	app.post('/editPolitic', isLogged, politics.editPolitic);
	app.post('/removePolitic', isLogged, politics.removePolitic);
};