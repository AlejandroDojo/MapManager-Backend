const multer = require('multer');
const EventControllers = require('../controllers/event.controller');

const upload = multer({ storage: multer.memoryStorage() });


module.exports = (app) => {
    app.get("/api/getEvents", EventControllers.getAllEvents)
    app.get('/api/getEvent/:id', EventControllers.getEventsById);
    app.post('/api/upload', upload.single('imagen'), EventControllers.subiendoEventos)
    app.post('/api/event/creator/:id', EventControllers.agregarCreador);
    app.delete('/api/delete/:id', EventControllers.deleteById)
    app.put('/api/update/:id',upload.single('imagen'), EventControllers.updateOneEvent)
    app.put('/api/asssit/user/:id', EventControllers.asistirEvento)
}