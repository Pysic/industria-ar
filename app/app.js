var mysql = require('mysql');
var http = require('http');
var url = require('url');
const fs = require('fs');
const { stringify } = require('querystring');

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  console.log('rodando na: '+add+'\n /get-all (ultimos 10 dados) \n /get-last (ultimo dado) \n /insert-data?tensao="float"&corrente="float"&potencia="float"&frequencia="float" (insere dados)');
})

var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: ''
});

con.connect(function(err) {
  if (err) throw err;
  http.createServer(function (req, res) {

    function query(queryCall){
      con.query(queryCall, function (err, result, fields) {
        if (err) throw err;
        var stringRes = JSON.stringify(result)
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(stringRes);
      });
    }

    if(req.url === "/"){
      res.writeHead(200, { 'content-type': 'text/html' })
      fs.readFile('index.html', 'utf-8', (err, data) => res.end(data))
    }

    if(req.url === "/assets/lamp.gltf"){
      res.writeHead(200, { 'content-type': 'text/html' })
      fs.readFile('public/assets/lamp.gltf', 'utf-8', (err, data) => res.end(data))
    }

    if(req.url === "/css/style.css"){
      res.writeHead(200, { 'content-type': 'text/html' })
      fs.readFile('public/css/style.css', 'utf-8', (err, data) => res.end(data))
    }

    if(req.url === "/js/script.js"){
      res.writeHead(200, { 'content-type': 'text/html' })
      fs.readFile('public/js/script.js', 'utf-8', (err, data) => res.end(data))
    }

    if(req.url === "/get-all"){
      query("SELECT * FROM tcc.dados ORDER BY id DESC LIMIT 10")
    }

    if(req.url === "/get-last"){
      query("SELECT * FROM tcc.dados ORDER BY id DESC LIMIT 1")
    }

    if(req.url.split("?")[0] === "/insert-data"){
      var insertObj = url.parse(req.url, true).query
      query("INSERT INTO tcc.dados (tensao, corrente, potencia, frequencia, dataStore) VALUES ("+insertObj.tensao+", "+insertObj.corrente*1000+", "+insertObj.tensao*insertObj.corrente+", "+insertObj.frequencia+", now());")
    }
  }).listen(80);
});
