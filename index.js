const express = require('express');
const bodyParser = require('body-parser');
const socket = require('socket.io');

var app = express();

app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('mediatoolbar',);
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT);

//Socket Setup
const io = socket(server);

io.on('connection', function (socket) {
    socket.on('joinRoom', function (data) {
        socket.room = data.agentId;
        socket.join(data.agentId);
    });
});

app.post('/inboundCallNotification', (req, res) => {
    io.to(req.body.agentId).emit('inboundCallNotification', req.body);
    res.json({ "Status": "OK" });
});

app.post('/startCommEvent', (req, res) => {
    io.to(req.body.agentId).emit('startCommEvent', req.body);
    res.json({ "Status": "OK" });
});

app.post('/closeCommEvent', (req, res) => {
    io.to(req.body.agentId).emit('closeCommEvent', req.body);
    res.json({ "Status": "OK" });
});