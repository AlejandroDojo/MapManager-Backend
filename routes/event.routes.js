const multer = require('multer');
const EventControllers = require('../controllers/event.controller');

const upload = multer({ storage: multer.memoryStorage() });


module.exports = (app) => {
    app.get('/api', EventControllers.index);
    app.get("/api/getEvents", EventControllers.getAllEvents)
    app.post('/api/upload', upload.single('imagen'), EventControllers.subiendoEventos)
}