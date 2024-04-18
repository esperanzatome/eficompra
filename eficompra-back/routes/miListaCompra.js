const express = require("express");
const cors = require('cors');
const app = express();
const dotenv = require("dotenv");
dotenv.config();

//conexión con la base de datos
const {connection} = require("../config.db");

const getProductos = (request, response) => {
    connection.query("SELECT * FROM `hacercompra`", 
    (error, results) => {
        if(error)
            throw error;
        response.status(200).json(results);
    });
};

//ruta
app.route("/miListaCompra")
.get(getProductos);


const postProductos = (request, response) => {
    const {idHacerCompra,supermarket,name,
    trademark,cantidad,product_id,price,reference_price} = request.body;
    connection.query("INSERT INTO milistacompra(idMiListaCompra,name,cantidad,price,supermarket) VALUES (?,?,?,?,?) ", 
    [idMiListaCompra,name,cantidad,price,supermarket],
    (error, results) => {
        if(error)
            throw error;
        response.status(201).json({"Item añadido correctamente": results.affectedRows});
    });
};

//ruta
app.route("/miListaCompra")
.post(postProductos);


const delProductos = (request, response) => {
    const id = request.params.id;
    connection.query("DELETE  FROM hacercompra;", 
    [id],
    (error, results) => {
        if(error)
            throw error;
        response.status(201).json({"Item eliminado":results.affectedRows});
    });
};

//ruta
app.route("/miListaCompra")
.delete(delProductos);


module.exports = app;