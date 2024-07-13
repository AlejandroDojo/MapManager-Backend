const UserController = require('../controllers/user.controller');
const validateToken = require('../middlewars/validateToken');

module.exports = (app) => {
    app.get('/api/user', validateToken, UserController.todosLosUsers);
    app.get('/api/check', UserController.remember);
    app.post('/api/user/create/:id', UserController.agregarEventosCreados);
    app.get('/api/user/:id', UserController.uniqueUser);
    app.get('/api/user/unique/:email', UserController.userPorEmail);
    app.post('/api/register/user', UserController.agregarUser);
    app.delete('/api/remover/user', validateToken, UserController.removerUser);
    app.put('/api/actualizar/user', validateToken, UserController.actualizarUser);
    app.put('/api/user/agregarEvent/:eventID', validateToken, UserController.agregarEvent);
    app.post('/api/user/login', UserController.login);
    
}