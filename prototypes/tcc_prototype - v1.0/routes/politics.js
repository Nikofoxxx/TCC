module.exports = function(app)
{
	var politics = app.controllers.politics;
	app.get('/getAll', politics.getAll);
	app.post('/editPolitic', politics.editPolitic);
};