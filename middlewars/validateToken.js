const jwt = require('jsonwebtoken');
require('dotenv').config();

const validateToken = ((req, res, next) => {
    console.log(req.headers)
    const token_usuario = req.headers.token_usuario;
    jwt.verify(token_usuario, process.env.SECRET, (error, decodificado) => {
        if(error){
            return res.status(406).json({mensaje: "Token no valido. No autorizado."});
        }
        req.infoUsuario = {
            _id: decodificado._id,
            firstName: decodificado.firstName,
            lastName: decodificado.lastName,
            email: decodificado.email
        }
        next();
    });
});

module.exports = validateToken;