const EventControllers = require('../controllers/event.controller');

module.exports = (app) => {
    app.get('/api', EventControllers.index);
}