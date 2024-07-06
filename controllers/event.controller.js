const Event = require("../models/event.model");

const { bucket } = require("../config/firebase.config");

module.exports.index = (req, res) => {
  res.status(200).json({ message: "Api de EVENTS" });
};

module.exports.getAllEvents = (req, res) => {
  Event.find()
    .then((eventos) => res.status(200).json(eventos))
    .catch((err) =>
      res.status(400).json({ msg: "Ocurrio un error al consultar", err })
    );
};

module.exports.getEventsById = (req, res) => {
  const { id } = req.params;
  Event.findById(id)
    .then((evento) => res.status(200).json(evento))
    .catch((err) =>
      res.status(400).json({ msg: "error al buscar por id", err })
    );
};

module.exports.subiendoEventos = (req, res) => {
  try {
    const { name, type, description, startDate, endDate, price, location } =
      req.body;
    const eventImage = req.file;

    if (!eventImage) {
      return res.status(400).send("No se ha subido ninguna imagen");
    }

    const blob = bucket.file(eventImage.originalname);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: eventImage.mimetype,
      },
    });

    blobStream.on("error", (err) => {
      console.error(err);
      res.status(500).send("Error al subir la imagen");
    });

    blobStream.on("finish", async () => {
      await blob.makePublic();

      const imageUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

      const newEvent = new Event({
        name,
        type,
        description,
        startDate,
        endDate,
        price,
        location,
        imageUrl,
      });
      await newEvent.save();

      res.status(201).send("Datos y imagen subidos exitosamente");
    });

    blobStream.end(eventImage.buffer);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error en el servidor");
  }
};

module.exports.deleteById = (req, res) => {
  const { id } = req.params;

  Event.findById(id).then((event) => {
    if (!event) {
      return res.status(404).send("Evento no encontrado");
    }
    const imageUrl = event.imageUrl;
    const imageName = imageUrl.split("/").pop();
    const file = bucket.file(imageName);
    file.delete();
  });

  Event.findByIdAndDelete(id)
    .then(() => res.status(200).json({ msg: "Evento eliminado correctamente" }))
    .catch((err) =>
      res.status(400).json({ msg: "Error al intentar eliminar el evento", err })
    );
};
