
var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
});

app.use('/client', express.static(__dirname + '/client'));
serv.listen(2000);
console.log("server started");

var SOCKET_LIST = {};
var USER_LIST = {};

var User = function (id) {
    var self = {
        x: 250,
        y: 250,
        id: id,
        number: "" + Math.floor(10 * Math.random())
    }
return self;
}
var io = require('socket.io')(serv, {});
io.sockets.on('connection', function (socket) {
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;

    var user = User(socket.id);
    USER_LIST[socket.id] = user;

    socket.on('disconnect', function () {
        delete SOCKET_LIST[socket.id];
        delete USER_LIST[socket.id];
    });
});

setInterval(function () {
    var pack = [];
    for (var i in USER_LIST) {
        var user = USER_LIST[i];
        user.x++;
        user.y++;
        pack.push({
            x: user.x,
            y: user.y,
            number: user.number
        });
    }
    for (var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i];
        socket.emit('newPositions', pack);
    }
}, 1000/25);

