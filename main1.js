const express = require('express');
const pcapp = express();
const fs = require('fs');

pcapp.use(express.static('public'));


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


pcapp.listen(8080);
