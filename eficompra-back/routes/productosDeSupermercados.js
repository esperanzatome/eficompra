const express = require("express");
const cors = require('cors');
const app = express();
const dotenv = require("dotenv");
dotenv.config();

//conexión con la base de datos
const {connection} = require("../../config.db");

const getProductos = (request, response) => {
    connection.query
("SELECT distinct id,name,supermarket,zip_code,category,url,description,trademark,trademark_propietary_flag,price,reference_price,reference_unit,offer_flag,offer_price,offer_type FROM `productosdesupermercados.sql`ORDER BY reference_price ASC LIMIT 100", 
    (error, results) => {
        if(error)
            throw error;
        response.status(200).json(results);
    });
};

//ruta
app.route("/productosDeSupermercados")
.get(getProductos);


const postProductos = (request, response) => {
    const {id,url,supermarket,zip_code,category,name,description,
    trademark,trademark_propietary_flag,price,reference_price,reference_unit,
    offer_flag,offer_price,offer_type,insert_date} = request.body;
    connection.query("INSERT INTO productosdesupermercados(id,url,supermarket,zip_code,category,name,description,trademark,trademark_propietary_flag,price,reference_price,reference_unit,offer_flag,offer_price,offer_type,insert_date) VALUES (?,?,?,?) ", 
    [id,url,supermarket,zip_code,category,name,description,trademark,trademark_propietary_flag,price,reference_price,reference_unit,offer_flag,offer_price,offer_type,insert_date],
    (error, results) => {
        if(error)
            throw error;
        response.status(201).json({"Item añadido correctamente": results.affectedRows});
    });
};

//ruta
app.route("/productosDeSupermercados")
.post(postProductos);


const delProductos = (request, response) => {
    const id = request.params.id;
    connection.query("Delete from productosdesupermercados where id = ?", 
    [id],
    (error, results) => {
        if(error)
            throw error;
        response.status(201).json({"Item eliminado":results.affectedRows});
    });
};

//ruta
app.route("/productosDeSupermercados/:id")
.delete(delProductos);


module.exports = app;