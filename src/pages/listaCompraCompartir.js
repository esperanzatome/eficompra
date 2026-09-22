
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash, faSpinner } from "@fortawesome/free-solid-svg-icons";
import fondo from "../carrito-de-compras.png";

// Agregar iconos a la biblioteca
library.add(faTrash, faSpinner);

const ListaCompraCompartir = () => {
  const alias=Object.values(useParams())[1]
  const [listaName, setListaName] = useState(""); 
  const [comprado, setComprado] =useState(false);
  const [products, setProducts] =useState([]);
  const [fecha, setFecha] =useState("")
  const listasdelacompra = Number(Object.values(useParams())[0].replace(/[^0-9]/g, ''));
  const navigate = useNavigate()
console.log(alias)
  const handleCompartir = (event) => {
    // Implementar la lógica de compartir aquí
    localStorage.setItem("listaCompartida",listasdelacompra)
    
   
   navigate('/login');
  };
const handleRechazar = (event) =>{
  navigate('/');

}
  useEffect(() => {
    axios.post("https://eficompraserver.onrender.com/recuperarUserData", {
      listasdelacompra: listasdelacompra 
      
    })
    .then(res => {
       console.log(res);
       
      if(res.data[0].comprado===0){
        setComprado(false)
      }else{
         setComprado(true)
      }
     

      
axios.post("https://eficompraserver.onrender.com/recuperarListaCompra",{
        listaId: res.data[0].listasdelacompra
      })
      .then(res=>{
          console.log(res.data)
        setListaName(res.data[0].listaName);
     
        res.data.map(i=>{
          if(products.includes(i.product)===false){
            products.push(i.product)
          }
         
          setProducts(products)
        })
       
           const fechaNew = new Date(res.data[0].fecha);

       const opcionesFechaHora = { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
    };
    const fechaHoraFormateada = fechaNew.toLocaleString('es-ES', opcionesFechaHora);
        setFecha(fechaHoraFormateada)
      })
     
    
    })
    
    .catch(error => {
      console.error("Error al recuperar user data:", error);
    });
  }, [listasdelacompra]); // Dependencia para que se ejecute cuando cambie listasdelacompra

  return (
     
    <div className="content-wrapper-listaCompartir">
      <div className="title-wrapper-listaCompartir">
        <div className="titleListaCompartir">
          <h1>EFICOMPRA</h1>
        </div>
        <div className="img-wrapper">
          <img src={fondo} alt="Fondo" />
        </div>
      </div>
      <div className="subtitle-wrapper">
        <div className="subtitle">
          {alias} quiere compartir esta lista de la compra contigo.
        </div>
      </div>
      <div className="listaCompraCompartir">
        <div className="title">{listaName}</div>
        <div className="listaCompartir">
          <div className="cabecero">
  <div className="estadoComprado">
            Comprado
    
            <input type="checkbox" id="compradoCheck" checked = {comprado} disabled />
          </div>
          <div className="fecha">
          {fecha}

          </div>
          </div>
        
          <div className="listaCompraProducts-listaCompartir">

<div className="products">

  {products.map(i=>{
    return(
      <div className="product">
        {i}
      </div>
    )
  })}
</div>

            <div className="optionsBar-listaCompartir">
              <button className="compartir" onClick={handleCompartir}>
              Aceptar
              </button>
              <button className="rechazar" onClick={handleRechazar}>Rechazar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 //localStorage.setItem("listaCompartida","")
export default ListaCompraCompartir;
