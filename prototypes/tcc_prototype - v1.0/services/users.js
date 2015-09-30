
module.exports = function(app) 
{

	var Users = app.models.users;

	var UsersService = 
	{
		getUserByLogin: function(userName, callback)
		{

			var query = { userName: userName };
	
			Users.find(query)
				.select('userName')
				.exec(function(error, user)
				{
					if (error)
						throw error;

					if (user)
						callback(user);

					callback(null);
				});						
		},

		create: function(newUser, callback) 
		{
			var document = new Users(newUser);

			document.save(function (error, user) 
			{
				if(error)
					throw error;				

				callback(user);
			});			
		},

		update: function(userToEdit, userName, callback)
		{
			var statement;

			if(userToEdit.passwd != null && userToEdit.passwd != "")
				statement = { firstName : userToEdit.firstName, lastName : userToEdit.lastName
							, passwd : userToEdit.passwd };
			else
				statement = { firstName : userToEdit.firstName, lastName : userToEdit.lastName };

			Users.update({ userName: userName }, { $set : statement }, function(error, user)
				{
					if(error)
						throw error;

					callback(user);
				});
		},

		getToLogin: function(userName, password, callback)
		{

			var query = { userName: userName, passwd: password };
		
			Users.findOne(query)
				.exec(function(error, user)
				{
					if (error)
						throw error;

					if (user) 
						callback(user);
					
					callback(null);
				});			
		},
	};
	
	return UsersService;
};	