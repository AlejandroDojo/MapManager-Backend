require('dotenv').config();
const bcrypt = require("bcrypt");
const HASH_SALT = 10;
const saltGenerado = bcrypt.genSaltSync(HASH_SALT);
const User = require("../models/user.model");
const Event = require("../models/event.model");
const jwt = require("jsonwebtoken");
const SECRETO = process.env.SECRET;
console.log(SECRETO);
module.exports.todosLosUsers = (req, res) => {
  console.log(req.infoUser);
  return User.find()
    .then((Users) => {
      return res.status(200).json(Users);
    })
    .catch((error) => {
      return res.status(500).json({ mensaje: "Algo salió mal", error });
    });
};

module.exports.agregarUser = (req, res) => {
  const UserNuevo = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, saltGenerado),
  };

  // Falta validar los campos a agregar

  return User.create(UserNuevo)
    .then((UserConId) => {
      const infoEnToken = {
        firstName: UserConId.firstName,
        lastName: UserConId.lastName,
        email: UserConId.email,
      };

      jwt.sign(infoEnToken, SECRETO, { expiresIn: "15m" }, (error, token) => {
        if (error) {
          return res
            .status(400)
            .json({ mensaje: "Algo falló al generar el token", error });
        }
        return res.status(201).json({ token });
      });
    })
    .catch((error) => {
      return res.status(500).json({ mensaje: "Algo salió mal", error });
    });
};

module.exports.removerUser = (req, res) => {
  return User.deleteOne({ email: req.infoUser.email })
    .then((UserRemovido) => {
      console.log(UserRemovido);
      return res.status(204).end();
    })
    .catch((error) => {
      return res.status(500).json({ mensaje: "Algo salió mal", error });
    });
};

module.exports.actualizarUser = (req, res) => {
  const camposParaActualizar = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,

    constraseña: req.body.password,
  };

  // Falta agregar validaciones para actualizar

  return User.updateOne({ email: req.infoUser.email }, camposParaActualizar, {
    new: true,
  }).then((UserActualizado) => {
    return res.status(200).json(UserActualizado);
  });
};

module.exports.agregarEvent = (req, res) => {
  const ID = req.params.eventID;

  Event.findOne({ _id: ID }).then((EventEncontrado) => {
    User.findOneAndUpdate(
      { email: req.body.email },
      { $push: { assignedEvents: EventEncontrado } },
      { new: true }
    ).then((UserActualizado) => {
      return res.status(200).json(UserActualizado);
    });
  });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).then((UserEncontrado) => {
    if (!UserEncontrado) {
      return res.status(404).json({ mensaje: "User no encontrado." });
    }
    if (!bcrypt.compareSync(password, UserEncontrado.password)) {
      return res.status(404).json({ mensaje: "Credenciales inválidas." });
    }

    const infoEnToken = {
      firstName: UserEncontrado.firstName,
      lastName: UserEncontrado.lastName,
      email: UserEncontrado.email,
    };

    jwt.sign(infoEnToken, SECRETO, { expiresIn: "15m" }, (error, token) => {
      if (error) {
        return res
          .status(400)
          .json({ mensaje: "Algo falló al generar el token" });
      }
      return res.status(200).json({ token });
    });
  });
};
