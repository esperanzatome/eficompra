const express = require("express");
const fs  =require("fs");
const cors= require("cors");
const PORT = process.env.PORT || 3001;

const app = express();

app.get("/api", (req, res) => {
  res.json({ message: "Hola desde el servidor!" });
});
app.use(cors());
//nos ayuda a analizar el cuerpo de la solicitud POST
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//cargamos el archivo de rutas
app.use(require('./routes/productosDeSupermercados'));
app.use(require('./routes/hacerCompra'));
app.use(require('./routes/miListaCompra'))
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
module.exports = app;