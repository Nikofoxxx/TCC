module.exports = function (app) {
    var Users = app.services.users;

    var UsersController =
    {
        index: function (req, res) {
            res.render('login/login');
        },

        registerModal: function (req, res) {
            res.render('login/shared/_registerPartialView.ejs');
        },

        newUser: function (req, res) {
            try {
                var firstName = req.body.firstName;
                var lastName = req.body.lastName;
                var userName = req.body.userName;
                var password = req.body.passwd;

                UsersController.checkIfUserExists(userName, function (result) {

                    if (result) {

                        res.status(500).send("Usuário já cadastrado! Por favor, insira um usuário diferente!");

                    } else {

                        var newUser = {
                            firstName: firstName,
                            lastName: lastName,
                            userName: userName,
                            passwd: password,
                            user_keywords: []
                        };

                        Users.create(newUser, function (user) {
                            if (user != null) {
                                var successMessage = "Usuário cadastrado com sucesso!";

                                res.end(successMessage);
                            }
                        });
                    }
                });
            }
            catch (ex) {
                console.log(ex.message);
                res.status(500).send("Problemas ao cadastrar novo usuário!");
            }
        },

        checkIfUserExists: function (userName, callback) {
            Users.getUserByLogin(userName, function (user) {
                if (user != null) {
                    if (user.length > 0) {
                        return callback(true);
                    } else {
                        return callback(false);
                    }
                }
            });
        },

        login: function (req, res) {
            try {
                var userName = req.body.UserName;
                var password = req.body.Passwd;

                Users.getToLogin(userName, password, function (user) {
                    if (user != null) {
                        var userSession = {
                            'userName': user.userName,
                            'firstName': user.firstName,
                            'lastName': user.lastName
                        };

                        req.session.user = userSession;
                        res.send({redirect: '/index'});
                    }
                    else {
                        if (!res.headersSent)
                            res.status(500).send("Acesso Negado! Usuário e/ou senha inválidos!");
                    }
                });
            }
            catch (ex) {
                res.status(500).send("Problemas ao tentar acessar o Politistatus!");
            }
        },

        editUserModal: function (req, res) {
            res.render('home/shared/_editUserPartialView.ejs');
        },

        editUser: function (req, res) {
            try {
                var firstName = req.body.firstName;
                var lastName = req.body.lastName;
                var userName = req.body.userName;
                var password = req.body.passwd;

                var userToEdit = {
                    firstName: firstName,
                    lastName: lastName,
                    passwd: password
                };

                Users.update(userToEdit, userName, function (user) {
                    if (user != null) {

                        req.session.user.firstName = firstName;
                        req.session.user.lastName = lastName;

                        var userSession = {
                            'firstName': firstName,
                            'lastName': lastName
                        };

                        res.end(JSON.stringify(userSession));
                    }
                });
            }
            catch (ex) {
                console.log(ex.message);
                res.status(500).send("Problemas ao editar usuário!");
            }
        },

        logout: function (req, res) {
            req.session.destroy();
            res.redirect('/');
        }
    };
    return UsersController;
};

