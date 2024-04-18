const express = require("express");
const cors = require('cors');
const app = express();
const dotenv = require("dotenv");
dotenv.config();

//conexión con la base de datos
const {connection} = require("../../config.db");

const getProductos = (request, response) => {
    connection.query("SELECT * FROM `hacercompra`", 
    (error, results) => {
        if(error)
            throw error;
        response.status(200).json(results);
    });
};

//ruta
app.route("/hacerCompra")
.get(getProductos);


const postProductos = (request, response) => {
    const {idHacerCompra,supermarket,name,
    trademark,cantidad,product_id,price,reference_price} = request.body;
    connection.query("INSERT INTO hacercompra(idHacerCompra,name,cantidad,price,supermarket) VALUES (?,?,?,?,?) ", 
    [idHacerCompra,name,cantidad,price,supermarket],
    (error, results) => {
        if(error)
            throw error;
        response.status(201).json({"Item añadido correctamente": results.affectedRows});
    });
};

//ruta
app.route("/hacerCompra")
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
app.route("/hacerCompra/:id")
.delete(delProductos);


module.exports = app;