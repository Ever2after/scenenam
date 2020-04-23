const express = require('express');
const app = express();
const fs = require('fs');

app.use(express.static('public'));

app.get('/', function(request, response){
  fs.readFile('./html/mobile', 'utf8', function(err, description){
    response.send(`${description}`);
  });
});

app.listen(3000);
