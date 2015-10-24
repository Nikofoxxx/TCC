module.exports = function(app)
{
    var isLogged = require('./../middleware/isLogged')
        , SNData = app.controllers.socialNetworksData;

    app.post('/getCommentsByDate', isLogged, SNData.getCommentsByDate);
};
