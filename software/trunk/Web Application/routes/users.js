module.exports = function(app)
{
	var isLogged = require('./../middleware/isLogged')
	, users = app.controllers.users;

	app.get('/', users.index);
	app.get('/registerModal', users.registerModal);
	app.post('/newUser', users.newUser);
	app.get('/editUserModal', users.editUserModal);
	app.post('/editUser', users.editUser);
	app.post('/login', users.login);
	app.post('/logout', isLogged, users.logout)

};
