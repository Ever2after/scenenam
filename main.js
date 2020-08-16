const express = require('express');
const pcapp = express();
const mobileapp = express();
const fs = require('fs');
const vhost = require('vhost');

pcapp.use(express.static(__dirname + '/public'));
mobileapp.use(express.static('public'));

pcapp.set('views', './views');
pcapp.set('view engine', 'ejs');
pcapp.engine('html', require('ejs').renderFile);

mobileapp.set('views', './views');
mobileapp.set('view engine', 'ejs');
mobileapp.engine('html', require('ejs').renderFile);

var board = require('./routes/board');    //board 파일 등록

pcapp.use('/board',board);
mobileapp.use('/board',board);


pcapp.get('/', function(request, response){
            fs.readFile('./html/index', 'utf8', function(err, description){
                var html = `${description}`;
                response.send(`${description}`);
              });
});

pcapp.get('/hello', function(request, response){
  fs.readFile('./html/hello', 'utf8', function(err, description){
    var html = `${description}`;

      response.send(`${description}`);
    });
});

pcapp.get('/sorry', function(request, response){
  fs.readFile('./html/sorry', 'utf8', function(err, description){
    var html = `${description}`;

      response.send(`${description}`);
    });
});


mobileapp.get('/', function(request, response){
  fs.readFile('./html/mobile', 'utf8', function(err, description){
    response.send(`${description}`);
  });
});

mobileapp.get('/mobilehello', function(request, response){
  fs.readFile('./html/mobilehello', 'utf8', function(err, description){
    response.send(`${description}`);
  });
});

mobileapp.get('/sorry', function(request, response){
  fs.readFile('./html/mobilesorry', 'utf8', function(err, description){
    response.send(`${description}`);
  });
});

const app = express();

app.use(vhost("scenenam.com", pcapp));
app.use(vhost("www.scenenam.com", pcapp));
app.use(vhost("m.scenenam.com", mobileapp));

app.listen(8080);
