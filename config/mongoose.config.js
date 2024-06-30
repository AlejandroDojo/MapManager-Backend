require('dotenv').config()
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_DB)
.then(()=>{
    console.log("Conexión exítosa a la base de datos");
})
.catch((error)=>{
    console.log("Error al intentar conectar la base de datos");
})