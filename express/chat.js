var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs")
    port = process.argv[2] || 80;

var httpServer = http.createServer(function(request, response) {

    var uri = url.parse(request.url).pathname,
        filename = path.join(process.cwd(), uri);

    path.exists(filename, function(exists) {
        if (!exists) {
            response.writeHead(404, {
                "Content-Type": "text/plain"
            });
            response.write("404 Not Found\n");
            response.end();
            return;
        }

        if (fs.statSync(filename).isDirectory()) filename += '/index.html';

        fs.readFile(filename, "binary", function(err, file) {
            if (err) {
                response.writeHead(500, {
                    "Content-Type": "text/plain"
                });
                response.write(err + "\n");
                response.end();
                return;
            }

            response.writeHead(200);
            response.write(file, "binary");
            response.end();
        });
    });
}).listen(parseInt(port, 10));

//Listen for and handle socket.io connections
var io = require("socket.io").listen(httpServer);
io.sockets.on("connection", function(socket) {
    socket.on('join', function(latLng, callback) {
        socket.latLng = latLng;

        retrieve(function(markers) {
            callback(true, markers);
        });
    });

    // Handle chat messages
    socket.on("chat", function(res) {
        io.sockets.emit("chat", {
            sender: socket.latLng,
            message: res.message
        });
        store(res.latLng, res.message);
    });
});

// Store data on db

function store(latLng, message) {
    var databaseUrl = 'hp';
    var collections = ['data'];

    var db = require("mongojs").connect(databaseUrl, collections);

    db.data.save({
            lat: latLng.lat,
            lng: latLng.lng,
            text: message
        },
        function(err, saved) {
            if (err || !saved) console.log("not saved");
            else console.log("saved");
        });
}

// Retrieve data from db

function retrieve(callback) {
    var databaseUrl = 'hp';
    var collections = ['data'];

    var db = require("mongojs").connect(databaseUrl, collections);

    db.data.find(function(err, markers) {
        if (err || !markers) console.log("No markers found")
        else {
            callback(markers);
        };
    });
}
