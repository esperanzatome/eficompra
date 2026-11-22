
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash, faSpinner } from "@fortawesome/free-solid-svg-icons";
import fondo from "../carrito-de-compras.png";


library.add(faTrash, faSpinner);

const ListaCompraCompartir = () => {
  const alias=Object.values(useParams())[1]
  const [listaName, setListaName] = useState(""); 
  const [comprado, setComprado] =useState(false);
  const [products, setProducts] =useState([]);
  const [fecha, setFecha] =useState("")
  const listasdelacompra = Number(Object.values(useParams())[0].replace(/[^0-9]/g, ''));
  const navigate = useNavigate()

  const handleCompartir = (event) => {
  
    localStorage.setItem("listaCompartida",listasdelacompra)
    
   if(localStorage.getItem("tokenSesion")!=""){
    
          const procesarProductosLocales = () => {
         
            if (products && products !== "") {
            
                
                   products.map(i => {
                      return axios.post("https://eficompraserver.onrender.com/miListaCompra", {
                        listaId: listasdelacompra,
                        product: i
                      });
                    });

                    Promise.all(promesasProductos).then(() => {
                      localStorage.setItem("products", "");
                      window.location.href = "/mis_listas_compra";
                    });
                  
          };

        
         
          
         
            axios.post("https://eficompraserver.onrender.com/recuperarListaCompartida", {
              listasdelacompra: listasdelacompra
            })
            .then(response => {
         
              let usuarios = [];
              let comprado = "";
              let listaName = "";
              let usuariosIds = [];

              if (response.data.length > 0) {
                response.data.map(i => {
                  usuarios.push(i.alias);
                  comprado = i.comprado;
                  listaName = i.listaName;
                  usuariosIds.push(i.userId);
                });

                const finalizarListaCompartida = () => {
         
                  const promesasRevocar = usuariosIds.map(i => {
                    return axios.post("https://eficompraserver.onrender.com/revocarPrivilegios", { id: i });
                  });

                  Promise.all(promesasRevocar).then(() => {
                    localStorage.setItem("listaCompartida", "");
                   
                    procesarProductosLocales();
                  });
                };

                if (usuarios.includes(localStorage.getItem("alias")) === false) {
                  axios.post("https://eficompraserver.onrender.com/usuario", {
                    userId: localStorage.getItem("id"),
                    alias: localStorage.getItem("alias"),
                    listasdelacompra: listaCompartida,
                    comprado: comprado,
                    listaName: listaName
                  })
                  .then(response => {
                    console.log("usuario-lista creado");
                    finalizarListaCompartida();
                  });
                } else {
                  finalizarListaCompartida();
                }
              } else {
             
                procesarProductosLocales();
              }
            })
            .catch(error => {
              console.error("Error al recuperar lista compartida:", error);
              procesarProductosLocales();
            });
         

    navigate('/mis_listas_compra')
   }else{
   navigate('/login');
   }
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

export default ListaCompraCompartir;
