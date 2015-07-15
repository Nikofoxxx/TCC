module.exports = function(app)
{
	var politics = app.controllers.politics;
	app.get('/getAll', politics.getAll);
	app.post('/createPolitic', politics.createPolitic);
	app.post('/editPolitic', politics.editPolitic);
	app.post('/removePolitic', politics.removePolitic);
};