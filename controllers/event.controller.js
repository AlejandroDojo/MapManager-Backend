const Event = require("../models/event.model");

const { bucket } = require('../config/firebase.config');



module.exports.index = (req, res) => {
  res.status(200).json({ message: "Api de EVENTS" });
};

module.exports.getAllEvents = (req,res)=>{
  Event.find()
    .then((eventos)=> res.status(200).json(eventos))
    .catch((err)=> res.status(400).json({msg: "Ocurrio un error al consultar",err}))
}

module.exports.subiendoEventos = (req, res) => {
  try {
    const { name, type,description,startDate,endDate,price,location } = req.body;
    const eventImage = req.file;

    if (!eventImage) {
      return res.status(400).send('No se ha subido ninguna imagen');
    }

    
    const blob = bucket.file(eventImage.originalname);
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
      
      await blob.makePublic();
      
      const imageUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

      
      const newEvent = new Event({ name, type,description,startDate,endDate,price,location, imageUrl });
      await newEvent.save();

      res.status(201).send('Datos y imagen subidos exitosamente');
    });

    blobStream.end(eventImage.buffer);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
}