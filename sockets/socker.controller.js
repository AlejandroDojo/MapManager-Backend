module.exports = (socket, io) => {
    // Evento de chat
    require('./events/chat')(socket, io);
};