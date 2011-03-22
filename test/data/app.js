var express = require('express')
var app = express.createServer(
  express.logger()
);

app.all('/jsonp/data.js', function(req, res){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Content-Type', 'application/json');
  res.send(req.query.callback + '({"jsonrpc": "2.0","result":[],"error":null})');
});

app.listen(8089);
