const Event = require('../models/event.model');

module.exports.index = (req, res) => {
    res.status(200).json({message: "Api de EVENTS"})
} 