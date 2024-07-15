require('dotenv').config();
const bcrypt = require("bcrypt");
const HASH_SALT = 10;
const saltGenerado = bcrypt.genSaltSync(HASH_SALT);
console.log(saltGenerado);
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

module.exports.uniqueUser = (req, res) => {
  const _id = req.params.id;
  return User.findOne({_id: _id})
    .then((User) => {
      console.log(User)
      return res.status(200).json(User);
    })
    .catch((error) => {
      return res.status(500).json({ mensaje: "Algo salió mal", error });
    });
};

module.exports.userPorEmail = (req, res) => {
  const {token} = req.params;
  const {email}= jwt.verify(token,SECRETO)
  
  


  User.findOne({email})
    .then((User) => {
      console.log(User)
      return res.status(200).json(User.createdEvents);
    })
    .catch((error) => {
      return res.status(500).json({ mensaje: "Algo salió mal", error });
    });
};

module.exports.eventosAasitir = (req, res) => {
  const {token} = req.params;
  const {email}= jwt.verify(token,SECRETO)
  
  


  User.findOne({email})
    .then((User) => {
      console.log(User)
      return res.status(200).json(User.assignedEvents);
    })
    .catch((error) => {
      return res.status(500).json({ mensaje: "Algo salió mal", error });
    });
};




module.exports.agregarUser = (req, res) => {
  let pass;
  try {
    pass = bcrypt.hashSync(req.body.password, saltGenerado);
  } catch (e) {
    console.log(e)
  }
  const UserNuevo = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: pass
  };

  console.log(UserNuevo)

  // Falta validar los campos a agregar

  return User.create(UserNuevo)
    .then((UserConId) => {
      const infoEnToken = {
        _id: UserConId._id,
        firstName: UserConId.firstName,
        lastName: UserConId.lastName,
        email: UserConId.email,
      };

      jwt.sign(infoEnToken, SECRETO, (error, token) => {
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
  const {token} = req.header;
  const {email} = jwt.verify(token, SECRETO);
  const ID = req.params.eventID;
  console.log(ID)
  Event.findOne({ _id: ID }).then((EventEncontrado) => {
    User.findOneAndUpdate(
      { email: email },
      { $push: { assignedEvents: EventEncontrado } },
      { new: true }
    ).then((UserActualizado) => {
      console.log(UserActualizado);
      return res.status(200).json(UserActualizado);
    });
  });
};


module.exports.agregarEventosCreados = (req, res) => {
  const {id} = req.params;
  const {token} = req.body;
  const {email} = jwt.verify(token, SECRETO);
  


  console.log(id)
  Event.findOne({ _id: id }).then((EventEncontrado) => {
    User.findOneAndUpdate(
      { email: email },
      { $push: { createdEvents: EventEncontrado._id } },
      { new: true }
    ).then((UserActualizado) => {
      console.log(UserActualizado)
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
        _id: UserEncontrado._id,
        firstName: UserEncontrado.firstName,
        lastName: UserEncontrado.lastName,
        email: UserEncontrado.email,
      };

    jwt.sign(infoEnToken, SECRETO, (error, token) => {
      if (error) {
        return res
          .status(400)
          .json({ mensaje: "Algo falló al generar el token" });
      }
      return res.status(200).json({ token });
    });
  });
};

module.exports.remember = (req, res) => {
  const token_usuario = req.headers.token_usuario;
  console.log(req.headers)
  console.log(token_usuario);
  jwt.verify(token_usuario, SECRETO, (error, decodificado) => {
    if(error){
      console.log(error);
      return res.status(401).json({mensaje: "Token no valido. No autorizado."});
    }
    return res.status(200).json({message: "Restaurando sessión"});
 })
};
