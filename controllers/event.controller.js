const Event = require("../models/event.model");

const { bucket } = require('../config/firebase.config');
module.exports.index = (req, res) => {
  res.status(200).json({ message: "Api de EVENTS" });
};

module.exports.subiendoEventos = (req, res) => {
  try {
    const { name, type,description,startDate,endDate,price,location } = req.body;
    const eventImage = req.eventImage;

    if (!eventImage) {
      return res.status(400).send('No se ha subido ninguna imagen');
    }

    
    const blob = bucket.eventImage(eventImage.originalname);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: eventImage.mimetype
      }
    });

    blobStream.on('error', (err) => {
      console.error(err);
      res.status(500).send('Error al subir la imagen');
    });

    blobStream.on('finish', async () => {
      
      const imagenUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

      
      const newEvent = new Event({ name, type,description,startDate,endDate,price,location, imagenUrl });
      await newEvent.save();

      res.status(201).send('Datos y imagen subidos exitosamente');
    });

    blobStream.end(eventImage.buffer);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
}