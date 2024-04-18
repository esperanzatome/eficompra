const path = require('path');
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
// Hacer que node sirva los archivos de nuestro app React
app.use(express.static(path.resolve(__dirname, '../client/public')));

// Manejar las peticiones GET en la ruta /api
app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

// Todas las peticiones GET que no hayamos manejado en las líneas anteriores retornaran nuestro app React
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/public', 'index.html'));
});
module.exports = app;