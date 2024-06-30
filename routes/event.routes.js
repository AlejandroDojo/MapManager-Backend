const multer = require('multer');
const EventControllers = require('../controllers/event.controller');

const upload = multer({ storage: multer.memoryStorage() });


module.exports = (app) => {
    app.get('/api', EventControllers.index);
    app.post('/upload', upload.single('imagen'), EventControllers.subiendoEventos)
}