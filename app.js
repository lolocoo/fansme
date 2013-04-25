
/**
 * Module dependencies.
 */
require('./db');
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , fs = require('fs');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser({uploadDir: __dirname+'/public/user_data/temp'}));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/add', routes.add);
app.post('/add', routes.add);
app.get('/delete/:id', routes.delete);
app.get('/stars/:name', routes.stars);

app.get('/todo', routes.todos);
app.get('/listing', routes.listing);

app.get('/upload', routes.upload);
app.post('/upload', function(req, res, next){
  var tmp_path = req.files.thumbnail.path,
      target_path = './public/user_data/star/' + req.files.thumbnail.name;
  fs.rename(tmp_path, target_path, function(err) {
    if(err) throw err;
    fs.unlink(tmp_path, function(){
      if(err) throw err;
      res.send('File uploaded to: ' + target_path + ' ' + req.files.thumbnail.size + ' bytes');
    });
  });
});



http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
