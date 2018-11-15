const app = require('express')();

// DATABASE TO HISTORIC
const lowdb = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./db/chat.json')
const db = lowdb(adapter);

db.defaults({ messages: [] }).write();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "clients"); // PUT ARRAY OF CLIENTS HERE...
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const server = app.listen(5000, () => {
    console.log('App is runing in port 5000');
});

const io = require('socket.io')(server);

io.on('connection', (socket) => {
    socket.on('speak', (message) => {
        db.get('messages').push(message).write();

        io.emit('listen', db.get('messages').value());
    });
});