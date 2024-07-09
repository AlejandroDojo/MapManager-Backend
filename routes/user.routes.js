const UserController = require('../controllers/user.controller');
const validateToken = require('../middlewars/validateToken');

module.exports = (app) => {
    app.get('/api/User', validateToken, UserController.todosLosUsers);
    app.post('/api/agregar/User', UserController.agregarUser);
    app.delete('/api/remover/User', validateToken, UserController.removerUser);
    app.put('/api/actualizar/User', validateToken, UserController.actualizarUser);
    app.put('/api/User/agregarEvent/:eventID', validateToken, UserController.agregarEvent);
    app.post('/api/User/login', UserController.login);
}