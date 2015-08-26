module.exports = function (app) {
    var SNData = app.services.socialNetworksData;
    var Politics = app.services.politics;

    var dateToSearch = new Date().toISOString();
    var dateToCompare = new Date();

    var SNDataController =
    {
        getUpdatedComments: function (client, user) {
            try {
                var queryComments = setTimeout(function () {

                    Politics.getAllUserPolitics(user, function (politics) {
                        if (politics != null) {

                            var politicsArray = [];

                            politics.forEach(function (item) {
                                item.user_keywords.forEach(function (keyword) {
                                    politicsArray.push(keyword);
                                });
                            });

                            if (politicsArray.length > 0) {
                                SNData.getUpdatedComments(politicsArray, dateToSearch, function (snData) {
                                    if (snData != null) {
                                        clearTimeout(queryComments);
                                        if (snData.length > 0) {
                                            snData.forEach(function (item) {
                                                if (item.date >= dateToCompare) {
                                                    console.log(item);
                                                    dateToCompare = item.date;
                                                    dateToSearch = item.date.toISOString();
                                                    client.emit('data', item);
                                                } else {
                                                    console.log("Registro com data menor!");
                                                }
                                            });
                                        } else {
                                            console.log("Sem registros novos!");
                                        }
                                    }
                                });
                            } else {
                                console.log("Sem nenhum político cadastrado na busca!");
                            }
                        }
                    });
                    SNDataController.getUpdatedComments(client, user);
                }, 1000);
            }
            catch (ex)
            {
                console.log(ex.message);
                res.status(500).send("Problemas ao buscar os comentários atualizados!");
            }
        },

        getCommentsByDate: function(req, res) {
            try
            {
                var initialDate = new Date(req.body.initialDate).toISOString();
                var finalDate = new Date(req.body.finalDate).toISOString();
                var politic = req.body.politic;

                SNData.getCommentsByDate(initialDate, finalDate, politic, function (comments) {
                    if(comments != null) {
                        if (comments.length > 0) {

                           var array = [];

                           comments.forEach(function(comment){ array.push(comment.tweet_id); });
                           res.end(JSON.stringify(array));
                        }
                        else {
                            res.status(500).send("Não foram encontrados tweets entre este intervalo de tempo!");
                        }
                    }
                });
            }
            catch(ex)
            {
                console.log(ex.message);
                res.status(500).send("Problemas ao buscar os comentários por data!");
            }
        }
    };
    return SNDataController;
};

