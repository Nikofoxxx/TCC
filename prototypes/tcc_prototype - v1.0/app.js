//faz carregamento dos require..
var express = require('express')
	, app = express() //express
	, load = require('express-load') //express load para organizar os codigos em pasta
	, error = require('./middleware/error') //logica de verificação de erros
	, mongoose = require('mongoose')
	, server = require('http').createServer(app) //cria um servidor http passando o gerado pelo express
	, io = require('socket.io').listen(server); //cria o io em cima do server http
//configurar o acesso ao banco
global.db = mongoose.connect('mongodb://localhost/database',function(error){
	if (error) { 
		console.log(error); 
	} else {
		console.log("Conectado ao Banco de Dados!");
	}
});
//seta o caminho das views
app.set('views', __dirname + '/views');
//seta a view engine como ejs..
app.set('view engine', 'ejs');

//habilita os cookies, session, urlencoder, override e uso das rotas
app.use(express.cookieParser('ntalk'));
app.use(express.session());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);

//caminho da area publica site..
app.use(express.static(__dirname + '/public'));

//chamda das paginas de erro..
app.use(error.notFound);
app.use(error.serverError);

//carrega as pastas de models, controls, e rotas.. e insere no servidor
load('models')
    .then('services')
    .then('controllers')
    .then('routes')    
    .into(app);

server.listen(3000, function(){
    console.log('Politistatus Online!');
});

var SNData = app.controllers.socialNetworksData;

io.on('connection', function (client) {
	console.log('Cliente conectado!');
	SNData.getUpdatedComments(client);
});
