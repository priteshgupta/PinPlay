var express = require('express');
var fs = require('fs');
var app = express();

app.use(express.bodyParser());

app.get('/', function(req, res){
    console.log('GET /')
    //var html = '<html><body><form method="post" action="http://localhost:3000">Name: <input type="text" name="name" /><input type="submit" value="Submit" /></form></body>';
    var html = fs.readFileSync('index.html');
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(html);
});

app.post('/', function(req, res){
    console.log('POST /');
    console.dir(req.body);
    var latLng = req.body.subject.split(',');
    var databaseUrl = 'hp';
    var collections = ['data'];

    var db = require("mongojs").connect(databaseUrl, collections);

    db.data.save({
            lat: latLng[0],
            lng: latLng[1],
            text: req.body.text
        },
        function(err, saved) {
            if (err || !saved) console.log("not saved");
            else console.log("saved");
        });


    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('thanks');
});

port = 3000;
app.listen(port);
console.log('Listening at http://localhost:' + port)