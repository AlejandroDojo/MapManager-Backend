module.exports = (socket, io) => {
    socket.on('join', (room) => {
        socket.join(room);
        console.log(`Usuario ${socket.id} Se unió al grupo ${room}`);
    });

    socket.on('leave', (room) => {
        socket.leave(room);
        console.log(`Usuario ${socket.id} se fué del grupo ${room}`);
    });

    socket.on('message', (data) => {
        console.log(data)
        console.log(`${data.room}: ${data.message}`);
        // Broadcast message to room
        //socket.broadcast.emit('message', data.message);
        io.emit('message', data.message)
    });
};