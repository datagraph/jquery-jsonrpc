var express = require('express'),
    app = express();

app.use(express.static(__dirname));

app.post('/test/data/valid.js', function(req, res) {
  res.sendfile('test/data/valid.js')
});

app.post('/test/data/valid_batch.js', function(req, res) {
  res.sendfile('test/data/valid_batch.js')
});

app.post('/test/data/invalid.js', function(req, res) {
  res.sendfile('test/data/invalid.js')
});

app.listen(3000);
