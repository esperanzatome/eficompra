import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { library, text } from "@fortawesome/fontawesome-svg-core";
import { faTrash, faSpinner, faTruckFieldUn } from "@fortawesome/free-solid-svg-icons";
import { toBeEnabled, toHaveAccessibleDescription, toHaveAccessibleErrorMessage } from "@testing-library/jest-dom/matchers";
import { io } from 'socket.io-client';

import carritoImg from '../../carrito-de-compras.png';

library.add(faTrash, faSpinner);


export default class MisListasDeLaCompra extends Component {
  
  constructor(props) {
    super()
  
    this.state={
        data:[],
        productsList:[],
        options:[],
        abecedario:["A","B","C","D","E","F","G","H","I","J","K","L","M","N","Ñ","O","P","Q","R","S","T","U","V","W","X","Y","Z"],
        opcionesPorLetra:[],
        palabrasPorLetra:[],
        productosFrecuentes:[{category:"pan",name:"pan"},{category:"cocinados",name:"comida preparada"},{category:"carne",name:"carne"},{category:"pasta",name:"pasta"},{category:"dulces",name:"azúcar"},{category:"hogar",name:"jabón de la ropa"},{category:"desayuno",name:"café"},{category:"huevos",name:"huevos"},{category:"verduras",name:"verduras"},{category:"pescado",name:"pescado"},{category:"legumbres y arroz",name:"arroz"},{category:"postres",name:"postre"},{category:"lácteos",name:"leche"},{category:"charcuteria",name:"embutido"},{category:"sal y especias",name:"sal"},{category:"caldos purés y sopas",name:"caldo"},{category:"ensaladas",name:"lechuga"},{category:"harina masas y rebozados",name:"harina"},{category:"salsas",name:"ketchup"},{category:"fruta",name:"fruta"}],
        categories:[],
        opcionesPorCategoria:[{}],
        content:"",
        isLoading:true,
        productSelected:[],
        placeholderBuscador:"Añade un producto",
        pageTitle:"Mis listas de la Compra",
        listaCompraTitle:["Mi lista de la compra"],
        optionsBar:
       
              
                <div className="optionsBar">
                  <Link to="../registro">Registro</Link>
                  <Link to="../login">Login</Link>
                </div>,
        email:"",
        password:"",
        miListaCompraId:"",
        listasGuardadas:[],
        listasInactivas:[],
        listaInactivaTitle:["Mi lista de la compra"],
        contenidoAnterior:'',
        listaActivaGuardada:false,
        comprado:[false],
        letterOnHover:false,
        palabrasOnMouseOver:[],
        productoAñadido:false,
        palabrasPorCategoriaClick:false,
        categoryOnClick:"",
        palabrasPorCategoria:[],
        categoryExit:false,
        indxProductoABorrar:[],
        listasInactivasContent:"",
        listaActiva:"",
        compartida:false,
        usersAliasCompartidos:[],
        usersIdCompartidos:[],
        notificaciones:"",
        notificacionesLista:"",
        notificacionesButton: "",
        notificacionesAceptadas:false,
        privileges:true,
        letraActivaId:"",
        productoBorrado:false,
        deferredPrompt: null,
        appYaInstalada: window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true,
       voiceExplication:false
            
            
          }
      this.socket= io("https://eficompraserver.onrender.com",{
        transports: ['websocket'], 
        upgrade: false
      })
      this.abecedarioRef = React.createRef();
            this.getProductsList=this.getProductsList.bind(this);
            this.getOptions=this.getOptions.bind(this);
            this.getOptionsByLetter=this.getOptionsByLetter.bind(this);
            this.getOptionsByCategory=this.getOptionsByCategory.bind(this);
            this.handleOnMouseOver=this.handleOnMouseOver.bind(this);
            this.handleOnMouseLeave=this.handleOnMouseLeave.bind(this)
            this.getContent=this.getContent.bind(this);
            this.handleOnClickCategory=this.handleOnClickCategory.bind(this)
            this.handleOnClick=this.handleOnClick.bind(this);
            this.handleOnClickExit=this.handleOnClickExit.bind(this);
            this.handleDelete=this.handleDelete.bind(this);
          
            this.handleBtnGuardarConNombre=this.handleBtnGuardarConNombre.bind(this)
            this.handleListaTitle=this.handleListaTitle.bind(this);
            this.handleDeleteGuardado=this.handleDeleteGuardado.bind(this)
            this.handleCrearListaNueva=this.handleCrearListaNueva.bind(this)
            this.changeState=this.changeState.bind(this)
            this.handleAbrirLista=this.handleAbrirLista.bind(this)
            this.handleBorrarLista=this.handleBorrarLista.bind(this)
            this.handleBorrarListaInactiva=this.handleBorrarListaInactiva.bind(this)
            this.handleCompartirLista=this.handleCompartirLista.bind(this)
            this.handleNotificaciones=this.handleNotificaciones.bind(this)
            this.handleAceptarNotificaciones=this.handleAceptarNotificaciones.bind(this)
      this.handleBeforeUnload = this.handleBeforeUnload.bind(this);
          
      this.handleLetraClickMóvil = this.handleLetraClickMóvil.bind(this);
        this.handleTouchOutside = this.handleTouchOutside.bind(this);
        this.teclaEnter=this.teclaEnter.bind(this);
      this.recognition = null;
this.escuchandoActivo = false;
this.intentosFallidos = 0;     
this.tiempoInicioVoz = 0;      
this.timerReinicioVoz = null;  
this.ultimoErrorVoz = null;
this.iniciarEscuchaAutomatica = this.iniciarEscuchaAutomatica.bind(this);

this.reintentarAlRecuperarFoco = this.reintentarAlRecuperarFoco.bind(this);
this.gestionarToqueEnPantalla = this.gestionarToqueEnPantalla.bind(this);
this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
this.handleBeforeInstallPrompt = this.handleBeforeInstallPrompt.bind(this);
this.handleAppInstalled = this.handleAppInstalled.bind(this);
this.handleInstalarApp = this.handleInstalarApp.bind(this);
this.handleVoice=this.handleVoice.bind(this)




  }
  
  getProductsList() {
 
      axios
      
        .get("https://eficompraserver.onrender.com/palabrasLista")
        .then(response=> {
      
          this.setState({
              data:response.data
          
          
            })
          
          })
        
  } 
          
      
    getOptions(){
        this.state.data.map(i=>{
          if(this.state.options.includes(i.name)===false){
            
            this.state.options.push(i.name)
          
          }
        })
      this.setState({
      options: this.state.options
      })
    }    
        
  getOptionsByLetter(){
      if(this.state.isLoading===true&&this.state.options.length>0){
      this.state.abecedario.map(letra=>{
    
      this.state.opcionesPorLetra.push({letra:letra,
        palabras:[]
      }
      )
      return(this.state.opcionesPorLetra)
      })
        
          this.state.opcionesPorLetra.map(grupo=>{
      
      this.state.options.map(i=>{
        
        if(i.toLowerCase().startsWith( grupo.letra.toLowerCase())===true&&grupo.palabras.includes(i.toLowerCase())===false){
          grupo.palabras.push(i)
        }
      })
      return(this.state.opcionesPorLetra)
          })
          
        
      this.setState({
        isLoading:false,
        opcionesPorLetra: this.state.opcionesPorLetra
      })
  
      }
  

  }
    
     getOptionsByCategory(){
    
      this.state.data.map(i=>{
      if(this.state.categories.includes(i.category)===false){
      this.state.categories.push(i.category)
      return(this.state.categories)
      }
  
      })
    
    
      this.state.categories.map(cat=>{
   

      const palabrasCat= this.state.data.filter((producto)=>producto.category===cat)

    
      
      this.state.opcionesPorCategoria.push(palabrasCat)
      
      
  
    
    
    
      })
    


      this.setState({
      categories:this.state.categories,
      opcionesPorCategoria:this.state.opcionesPorCategoria
      })

      this.state.opcionesPorCategoria.shift()
    }  

  handleBeforeUnload(event) {
    const mensaje = "Tienes cambios no guardados. ¿Estás seguro de que deseas salir?";
    event.preventDefault(); 
    event.returnValue = mensaje; 
    return mensaje; 
  }
async handleVisibilityChange() {
  if (!("Notification" in window) || Notification.permission !== "granted" || !("serviceWorker" in navigator)) {
    return;
  }

  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) return;

  if (document.visibilityState === "hidden") {
    
    if (this.state.productSelected.length > 0 && this.state.listaActivaGuardada === false) {
      registration.showNotification("EFICOMPRA", {
        body: "Tienes una lista de la compra sin guardar.",
        tag: "aviso-segundo-plano",
        renotify: true
      });
    }
  } else if (document.visibilityState === "visible") {
  
    const notifications = await registration.getNotifications({ tag: "aviso-segundo-plano" });
    notifications.forEach((notificacion) => notificacion.close());
  }
}
handleBeforeInstallPrompt(event) {
  
  this.setState({ deferredPrompt: event });
}

handleAppInstalled() {
 
  this.setState({ deferredPrompt: null, appYaInstalada: true });
}

async handleInstalarApp() {
  const { deferredPrompt } = this.state;

  if (deferredPrompt) {
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        this.setState({ deferredPrompt: null, appYaInstalada: true });
      }
      return;
    } catch (e) {
    
    }
  }


  alert("Para instalarla: abre el menú de tu navegador y pulsa en 'Instalar aplicación' o 'Añadir a pantalla de inicio'.");
}


handleVoice(event){
  return(
this.setState({
voiceExplication:true
})
    )
}

getContent() {
  let notificaciones = [];
  let listasInactivas = [];

  axios.post("https://eficompraserver.onrender.com/misListasCompraGuardadas", {
    userId: localStorage.getItem("id")
  })
  .then(response => {
    console.log("Respuesta del servidor listas guardadas:", response.data);

    if (response.data && response.data.length > 0) {
    
      let listasPromesas = response.data.map(lista => {
      
        const idCorrecto = lista.listasdelacompra !== undefined ? lista.listasdelacompra : lista.listaId;

        return {
          comprado: lista.comprado === 1 || lista.comprado === true ? true : false,
          listaName: lista.listaName || "Lista sin nombre",
          listaId: idCorrecto, 
          userAlias: lista.alias,
          products: [],
          fecha: lista.fecha || new Date().toISOString(), 
          compartida: false,
          usersAliasCompartidos: [],
          usersIdCompartidos: []
        };
      });


      listasPromesas = listasPromesas.filter(l => l.listaId !== undefined && l.listaId !== null);

  
      let promesasDetalles = listasPromesas.map(i => {
        return axios.post("https://eficompraserver.onrender.com/recuperarListaCompra", { listaId: i.listaId })
          .then(res => {
            
            if (res.data && res.data.length > 0) {
              i.products = res.data.map(p => p.product);
              if(res.data[0].fecha) i.fecha = res.data[0].fecha;
            }

           
            return axios.post("https://eficompraserver.onrender.com/comprobarListaCompartida", {
              listasdelacompra: i.listaId,
              userId: localStorage.getItem("id")
            })
            .then(resCompartida => {
              if (resCompartida.data && resCompartida.data.length > 0) {
                i.compartida = true;
                i.usersAliasCompartidos = resCompartida.data.map(uc => uc.alias);
                i.usersIdCompartidos = resCompartida.data.map(uc => uc.userId);
              }
              return i; 
            })
            .catch(() => i); 
          })
          .catch(err => {
            console.error(`Error recuperando productos de lista ${i.listaId}:`, err);
            return i;
          });
      });

  
      Promise.all(promesasDetalles).then(resultados => {
       
        listasInactivas = resultados.filter(lista => lista.products.length > 0 || lista.compartida === true);

      
        listasInactivas = listasInactivas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        let contenidoHTML = null;
        if (listasInactivas.length > 0) {
          contenidoHTML = (
            <div className="listasInactivasWrapper">
              <div className="columnaTitle"> Listas guardadas</div>
              <div className="listasGuardadas">
                {listasInactivas.map(i => {
                  const fecha = new Date(i.fecha);
                  const opcionesFechaHora = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false };
                  const fechaHoraFormateada = isNaN(fecha.getTime()) ? "Fecha pendiente" : fecha.toLocaleString('es-ES', opcionesFechaHora);

                  return (
                    <div key={i.listaId}>
                      <span style={{fontWeight: 'bold'}}>Comprado</span>
                      <input type="checkbox" id="compradoCheckGuardado" checked={i.comprado} disabled />
                      
                      <div className={i.compartida ? "listaCompraCompartida" : "listaCompra"}>
                        <div className="columnaIzda">
                          <div className="listaCompraTitle" >
                            {i.listaName} 
                          </div>
                          <div className="listaCompraFecha">{fechaHoraFormateada}</div>
                        </div>
                        
                        {i.compartida && (
                          <div className="columnaDerecha">
                            <div className="compartida">
                              <div className="compartidaTitle">Compartida</div>
                              <div className="compartidaUsers">
                                {i.usersAliasCompartidos.map((u, idx) => <div key={idx} className="user-badge">{u}</div>)}
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div className="optionsBarList">
                          <button className="AbrirLista" onClick={this.handleAbrirLista} value={listasInactivas.indexOf(i)}>Abrir Lista</button>
                          <button className="CompartirLista" onClick={this.handleCompartirLista} value={i.listaId}>Compartir Lista</button>
                          <button className="BorrarLista" onClick={this.handleBorrarListaInactiva} value={i.listaId}>Borrar Lista</button>
                        </div>
                        
                        <div className="listaCompraProducts">
                          {i.products.length > 0 ? (
                            i.products.map((product, idx) => (
                              <div className="productSelected" key={idx}>
                                <div className="productSelectedName">{product}</div>
                              </div>
                            ))
                          ) : (
                            <div className="no-products" style={{fontStyle: 'italic', padding: '8px', color: '#999'}}>Lista compartida (Aún sin productos registrados)</div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }

        this.setState({
          listasInactivas: listasInactivas,
          listasInactivasContent: contenidoHTML,
          isLoading:false,
          listaActiva:""
       
        });

        this.recuperarNotificacionesFlujo(listasInactivas, notificaciones);
      });

    } else {
      this.recuperarNotificacionesFlujo([], notificaciones);
      this.setState({
        isLoading:false
      })
    }
  })
  .catch(err => console.error("Error en misListasCompraGuardadas:", err));
}

  

        teclaEnter = (event, accionAceptar) => {
          const esTeclaEnter = 
            event.key === 'Enter' || 
            event.keyCode === 13 || 
            event.which === 13;

          if (esTeclaEnter) {
            event.preventDefault();
            event.target.blur();  
            
          
            if (accionAceptar) {
              accionAceptar(event); 
            }
          }
        }

  handleOnMouseOver(event){
          if (!window.matchMedia('(hover: hover)').matches) return;
            
              if (event && event.target) {
            const targetId = event.target.id;
            const encontrada = this.state.opcionesPorLetra.find(i => i.letra === targetId);
            
            if (encontrada) {
              this.setState({
                letterOnHover: true,
                palabrasOnMouseOver: encontrada.palabras, 
                  letraActivaId: targetId
              });
            }
          }

      }
 
  handleOnMouseLeave(event){

        if (!window.matchMedia('(hover: hover)').matches) return;
          
            this.setState({
              letterOnHover:false,
              palabrasOnMouseOver:[],
              letraActivaId: null
          
        
          
          
            })
      }
        handleTouchOutside(event) {
          const tocoFueraAbecedario = this.abecedarioRef.current && !this.abecedarioRef.current.contains(event.target);
            const tocoFueraPalabras = !event.target.closest('.productosPorLetra') && !event.target.closest('.pocosProductosPorLetra');

            if (tocoFueraAbecedario && tocoFueraPalabras) {
              this.setState({
                letterOnHover: false,
                palabrasOnMouseOver: [],
                letraActivaId: null
                
              });
            }
    }

    handleLetraClickMóvil(event, item) {
      if (window.matchMedia('(hover: hover)').matches) return;

      event.stopPropagation();
      
      if (event.nativeEvent) {
        event.nativeEvent.stopImmediatePropagation();
      }

      if (this.state.letraActivaId === item.letra) {
        this.setState({
          letterOnHover: false,
          palabrasOnMouseOver: [],
          letraActivaId: null,
          inputBuscador:"password",
      
        });
      } else {
        this.setState({
          letterOnHover: true,
          palabrasOnMouseOver: item.palabras,
          letraActivaId: item.letra,
          inputBuscador:"password",
        
        });
      }
    }
   handleTouchOutside(event) {
    const tocoFueraAbecedario = this.abecedarioRef.current && !this.abecedarioRef.current.contains(event.target);
      const tocoFueraPalabras = !event.target.closest('.productosPorLetra') && !event.target.closest('.pocosProductosPorLetra');

      if (tocoFueraAbecedario && tocoFueraPalabras) {
        this.setState({
          letterOnHover: false,
          palabrasOnMouseOver: [],
          letraActivaId: null,
          
        });
      }
    }
  handleOnClick(event){
           
           
              this.setState({
                palabrasPorCategoriaClick:false,
                categoryOnClick:"",
          

              })

            if(event.target.value!=undefined&&event.target.value!=""&&this.state.productSelected.includes(event.target.value)===false){
            this.state.productSelected.push(event.target.value)
            return this.state.productSelected
            }
 

            


                 
                  this.setState({
                  productSelected:this.state.productSelected,
                  palabrasOnMouseOver:[],
                  })
                  if(this.state.listaActivaGuardada===true){

                      axios.post("https://eficompraserver.onrender.com/miListaCompra",{
                        
                          listaId:this.state.miListaCompraId,
                          product:event.target.value
                          
                        })
                  
                        .then(response=>{
                      
                          console.log("productosGuardados")
                          if(this.state.compartida===true){
                            let alias= localStorage.getItem("alias")
                          
                            this.state.usersIdCompartidos.map(i=>{
              
                                axios.post("https://eficompraserver.onrender.com/notificaciones",{
                      
                                      emisor:localStorage.getItem("id"),
                                      receptor:i,
                                    accion: `${alias}/+/${event.target.value}/${this.state.miListaCompraId}/${this.state.listaCompraTitle[0]}`
                                        })
                          .then(response=>{
                            console.log("usuario compartido informado de +")
                          })
                          })
                          }

                      

                        })
              
                  }
      

      
            
           
  }
 

  handleOnClickCategory(event){

            let categoryOnClick=""
            let palabrasPorCategoria=[]
                this.state.opcionesPorCategoria.map(i=>{
                  i.map(cat=>{

                  if(event!=undefined&&event.target.innerHTML === "cuidado personal"&&cat.category==="cuidado_personal"){
                      palabrasPorCategoria.push(cat.name)
                      categoryOnClick=cat.category
                    }
                    else if(event!=undefined&&event.target.innerHTML ===cat.category){
                    
                      palabrasPorCategoria.push(cat.name)
                      categoryOnClick=cat.category
                      
                    }
                  })
                })
                  this.setState({
                    palabrasPorCategoriaClick:true,
                categoryOnClick:categoryOnClick,
                palabrasPorCategoria:palabrasPorCategoria
                  
                  })
                
              
  }
    handleOnClickExit(event){
        this.setState({
          palabrasPorCategoriaClick:false,
       
        
        })
      
    }
        
      handleListaTitle(event){


            let listaName=[event.target.value]
            

              if(this.state.miListaCompraId!="" ){



                  
                    axios.patch("https://eficompraserver.onrender.com/usuario",{
              
                        listaName:listaName[0],
                          listasdelacompra:this.state.miListaCompraId,
                        
                    })
                    .then(response=>{
                  
              
                  
                      console.log("Nombre de la lista actualizado en la base de datos")
                  
              
                        
                      this.state.usersIdCompartidos.map(i=>{
            
                          axios.post("https://eficompraserver.onrender.com/notificaciones",{
                                
                                    emisor:localStorage.getItem("id"),
                                    receptor:i,
                                    accion: `${localStorage.getItem("alias")}/title/${listaName[0]}/${this.state.miListaCompraId}`
                          })
                                .then(response=>{
                                  console.log("usuario compartido informado de title")
                                })
                      })
                      return(
                          this.setState({
                                    listaCompraTitle:listaName,
                                   
                    
                          })
                      )
                    })
                
              }  
 this.setState({
                                    listaCompraTitle:listaName,
                            
                    
                          })
      }
      
    changeState(event){
    
            let comprado=event.target.checked

              const valorBackend = comprado ? 1 : 0
           
            if(this.state.miListaCompraId!=""){

                          axios.patch("https://eficompraserver.onrender.com/misListasDeLaCompra",{
                                comprado:valorBackend,
                                listasdelacompra:this.state.miListaCompraId
                          })
                        
                          .then(response=>{
                        
                            console.log("Estado de la lista actualizado")

                            this.state.usersIdCompartidos.map(i=>{
                              axios.post("https://eficompraserver.onrender.com/notificaciones",{
                                
                                    emisor:localStorage.getItem("id"),
                                    receptor:i,
                                    accion: `${localStorage.getItem("alias")}/change/${valorBackend}/${this.state.miListaCompraId}/${this.state.listaCompraTitle[0]}`
                              })
                                  .then(response=>{
                                    console.log("usuario compartido informado de change")
                                  })
                            })
                          })


                              if(this.state.productSelected.length>0){
                                      this.setState({
                                        comprado:[event.target.checked],
                                
                                      })
                              }else{
                                this.setState({
                                  comprado:[event.target.checked],
                                  compradoChange:true,
                                  listaActiva:""
                                })
                              }

            }else{
              if(this.state.productSelected.length>0){
          
                    this.setState({
                      comprado:[event.target.checked],
    
                    })
          
              }
            }

      


    
    
    }
    handleDelete(event) {
  const productoABorrar = event.target.value;
  
  
  const nuevosProductos = this.state.productSelected.filter(producto => producto !== productoABorrar);

  if (nuevosProductos.length > 0) {
    this.setState({
      productSelected: nuevosProductos,
      indxProductoABorrar: [],
      
    });
    return this.state.productSelected
  } else {
    this.setState({
       productSelected: [],
      indxProductoABorrar: [],
      listaCompraTitle: ["Mi lista de la compra"],
      comprado: [false]
    });
    return this.state.productSelected
  }
}

  
    handleBtnGuardarConNombre(event){
      
                        let listaId=0
                        if(this.state.miListaCompraId===''){
                      axios.post("https://eficompraserver.onrender.com/misListasDeLaCompra",{
                          
                              listaId: null,
                              userId: localStorage.getItem("id")
                        
                            })
                            .then(response=>{
                            
                            console.log("lista creada")
                            
                            axios.get("https://eficompraserver.onrender.com/misListasDeLaCompra")
                            .then(response=>{
                              listaId= Object.values(response.data[0])
                            
                              axios.post("https://eficompraserver.onrender.com/usuario",{
                              userId: localStorage.getItem("id"),
                              alias: localStorage.getItem("alias"),
                              listasdelacompra: Object.values(response.data[0]),
                              comprado:this.state.comprado[0],
                              listaName:this.state.listaCompraTitle[0]
                            })
                            .then(response=>{
                              console.log("usuario-lista creado")
                              
                            this.state.productSelected.map(i=>{
                                
                              axios.post("https://eficompraserver.onrender.com/miListaCompra",{
                                
                                  listaId:listaId,
                                  product:i
                                  
                            })

                            .then(response=>{

                            this.setState({
                            miListaCompraId:listaId[0],
                            listaActivaGuardada:true,
                            listaActiva:
                            <div>
                              <div className="columnaListaActivaGuardada">
                            <div className="columnaTitle"> Lista de la compra activa</div>
                          <div className="optionsBarList">
                        <button className="CrearLista"onClick={this.handleCrearListaNueva}>Nueva Lista</button>
                            <button className="CompartirLista"onClick={this.handleCompartirLista}value={listaId}>Compartir Lista</button>
                            <button className="BorrarLista"onClick={this.handleBorrarLista}>Borrar Lista</button>
                          </div>
                          
                          {this.state.productSelected.map(i=>{
                          if(this.state.productSelected.length>0&&this.state.productSelected.indexOf(i)===0){
                            return(
                              <div className="listaActivaGuardada">
                              Comprado
                              <input type="checkbox" id="compradoCheck" checked={this.state.comprado[0]} onChange={this.changeState}></input>
                          <div className="listaCompraGuardada">
                          
                          <div className="listaCompraTitle">
                            
                          <input type='text'name="listaCompraTitle" key={this.state.miListaCompraId}autocomplete="off"id="listaCompraTitle"placeholder={this.state.listaCompraTitle[0]}onChange={this.handleListaTitle}
                            onKeyUp={this.teclaEnter}/>
                            </div>
                          
                          <div className="listaCompraProducts">
                            {this.state.productSelected.map(i=>{
                              return(
                                <div className="productSelected">
                                  <div className="productSelectedName">
                                    {i} 
                                  </div>
                                <div className="borrarBtn">
                                  <button className="borrarBtnGuardado"value={i} onClick={this.handleDeleteGuardado}></button>
                                </div>
                                </div>
                              )
                            })}
                            
                          </div>
                          <div className="opcionesGuardarLista">
                          <div className="guardarBtnGuardado">
                              <button className="guardarBtnGuardado">
                            Guardado
                              </button>
                              
                          </div>
                          
                          </div>
                        </div>
                        </div>
                            )
                          }
                          })}
                          
                        </div>
                            </div>
                            })
                              
                            })
                                
                          })
                            
                        
                          })

                        
                          })})

                        }
                        }
                      handleDeleteGuardado(event){
                      let listaProducts
                      let product= event.target.value
                      const nuevosProductos = this.state.productSelected.filter(p => p !== product);
                          if(this.state.productSelected.length===1){

                            if(this.state.usersIdCompartidos.length>0){
                              if(window.confirm("Si eliminas todos los productos de la lista, se eliminará la lista para ti y para todos los usuarios con quienes la compartas. ¿Estás seguro de que quieres continuar?")===true){
                                 this.setState({ productSelected: nuevosProductos });
                          axios.post("https://eficompraserver.onrender.com/miListaCompraProducts",{
                            product:event.target.value,
                            listaId:this.state.miListaCompraId
                          })
                          .then(response=>{
                        if(response.data.length>0){
                      listaProducts=response.data[0].listaProducts

                            axios.delete(`https://eficompraserver.onrender.com/miListaCompraProducts?listaProducts=${listaProducts}`)
                            .then(response=>{
                        
                          console.log("producto borrado")
                          this.state.usersIdCompartidos.map(i=>{
                            axios.post("https://eficompraserver.onrender.com/notificaciones",{
                              
                                  emisor:localStorage.getItem("id"),
                                  receptor:i,
                                  accion: `${localStorage.getItem("alias")}/-/${product}/${this.state.miListaCompraId}/${this.state.listaCompraTitle[0]}`
                                  })
                                  .then(response=>{
                                    console.log("usuario compartido informado de -")
                                  })
                                  })
                            })
                        
                            axios.post(`https://eficompraserver.onrender.com/borrarListaCompra`,{
                                listasdelacompra:this.state.miListaCompraId,
                                userId: localStorage.getItem("id")
                              })
                          
                            .then(response=>{
                      console.log(response.data)
                              if(response.data.length>0){
                                  let usuarioListaId= response.data[0].usuarioListaId

                            return(
                      axios.delete(`https://eficompraserver.onrender.com/borrarListaCompra?usuarioListaId= ${usuarioListaId}`)
                            .then(response=>{
                          console.log("lista activa borrada")
                          this.state.usersIdCompartidos.map(i=>{
                              axios.post("https://eficompraserver.onrender.com/notificaciones",{
                              
                                  emisor:localStorage.getItem("id"),
                                  receptor:i,
                                  accion: `${localStorage.getItem("alias")}/-/lista/${this.state.miListaCompraId}/${this.state.listaCompraTitle[0]}`
                                  })
                                  .then(response=>{
                                    console.log("usuario compartido informado de -")
                                    
                                  axios.post("https://eficompraserver.onrender.com/revocarPrivilegios",{
                                  id:i
                                    }).then(response=>{
                                                              console.log(response)
                                                            })
                                                      
                                    this.setState({
                            productSelected:this.state.productSelected,
                            listaActiva:"",
                            miListaCompraId:"",
                            listaActivaGuardada:false,
                          listaCompraTitle:["Mi lista de la compra"],
                          comprado:[false],
                          usersIdCompartidos:[],
                   

                        })    
                        return this.state.productSelected
                                  })
                                })
                            })
                          )
                              }
                            
                            
                            })
                        
                          }
                            })
                            }else{return}
                          }else{
                             this.setState({ productSelected: nuevosProductos });
                          axios.post("https://eficompraserver.onrender.com/miListaCompraProducts",{
                            product:event.target.value,
                            listaId:this.state.miListaCompraId
                          })
                          .then(response=>{
                        if(response.data.length>0){
                      listaProducts=response.data[0].listaProducts

                            axios.delete(`https://eficompraserver.onrender.com/miListaCompraProducts?listaProducts=${listaProducts}`)
                            .then(response=>{
                        
                          console.log("producto borrado")
                            })}})
                            axios.post(`https://eficompraserver.onrender.com/borrarListaCompra`,{
                                listasdelacompra:this.state.miListaCompraId,
                                userId: localStorage.getItem("id")
                              })
                          
                            .then(response=>{
                      
                              if(response.data.length>0){
                                  let usuarioListaId= response.data[0].usuarioListaId

                            return(
                      axios.delete(`https://eficompraserver.onrender.com/borrarListaCompra?usuarioListaId= ${usuarioListaId}`)
                            .then(response=>{
                          console.log("lista activa borrada")
                              this.setState({
                            productSelected: nuevosProductos,
                   
                            miListaCompraId: "",
                            listaActivaGuardada: false,
                            listaCompraTitle: ["Mi lista de la compra"], 
                            comprado: [false],
                                                      

                        })   
                        return this.state.productSelected 
                            })
                          )
                              }
                            
                            
                            })
                          }
                          
                          }else{
                           this.setState({ productSelected: nuevosProductos });
                      
                            if(this.state.usersIdCompartidos.length>0){
                              axios.post("https://eficompraserver.onrender.com/miListaCompraProducts",{
                            product:event.target.value,
                            listaId:this.state.miListaCompraId
                          })
                          .then(response=>{
                          
                        if(response.data.length>0){
                      listaProducts=response.data[0].listaProducts

                            axios.delete(`https://eficompraserver.onrender.com/miListaCompraProducts?listaProducts=${listaProducts}`)
                            .then(response=>{

                          console.log("producto borrado")
                          this.state.usersIdCompartidos.map(i=>{

                            axios.post("https://eficompraserver.onrender.com/notificaciones",{
                              
                                  emisor:localStorage.getItem("id"),
                                  receptor:i,
                                  accion: `${localStorage.getItem("alias")}/-/${product}/${this.state.miListaCompraId}/${this.state.listaCompraTitle[0]}`
                                  })
                                  .then(response=>{
                                    console.log("usuario compartido informado de -")
                                  })
                                  })
                            })
                        }
                      })
                            }else{
                              
                      axios.post("https://eficompraserver.onrender.com/miListaCompraProducts",{
                            product:event.target.value,
                            listaId:this.state.miListaCompraId
                          })
                          .then(response=>{
                        if(response.data.length>0){
                      listaProducts=response.data[0].listaProducts

                            axios.delete(`https://eficompraserver.onrender.com/miListaCompraProducts?listaProducts=${listaProducts}`)
                            .then(response=>{
                        
                          console.log("producto borrado")
                            })}
                          
                          })}
                          let comprado=this.state.comprado[0]
                            if(comprado===0||comprado===false){
                      comprado=false
                            }else{
                              comprado=true
                            }
                          this.setState({
                            productSelected:nuevosProductos,
                            
                            

      })
      return this.state.productSelected
      
        }
        
                
            


      
    }
    handleBorrarLista(event){
      
                  let usersIdCompartidos=this.state.usersIdCompartidos
                  let listaId=this.state.miListaCompraId
                  let listaName=this.state.listaCompraTitle[0]
                if(this.state.miListaCompraId!=''&&this.state.compartida===false){
                  if(this.state.productSelected.length>0){
                    this.state.productSelected.map(i=>{
                      axios.post("https://eficompraserver.onrender.com/miListaCompraProducts",{
                        product:i,
                        listaId:this.state.miListaCompraId
                      })
                      .then(response=>{
                    
                        
                        let listaProducts= response.data[0].listaProducts

                        
                        axios.delete(`https://eficompraserver.onrender.com/miListaCompraProducts?listaProducts=${listaProducts}`)
                      
                        .then(response=>{
                          console.log("lista vacía")
                        });
                    
                    
                      })
                    })
                }
                      
                        
                      axios.post(`https://eficompraserver.onrender.com/borrarListaCompra`,{
                            listasdelacompra:this.state.miListaCompraId,
                            userId: localStorage.getItem("id")
                          })
                      
                        .then(response=>{
                  
                          if(response.data.length>0){
                              let usuarioListaId= response.data[0].usuarioListaId

                        return(
                      axios.delete(`https://eficompraserver.onrender.com/borrarListaCompra?usuarioListaId= ${usuarioListaId}`)
                        .then(response=>{
                      console.log("lista activa borrada")
                        
                        })
                      )
                          }
                        
                        
                        })
                        
                      }
                    
                      if(this.state.compartida===true){


                    
                    
                          axios.post(`https://eficompraserver.onrender.com/borrarListaCompra`,{
                            listasdelacompra:this.state.miListaCompraId,
                            userId: localStorage.getItem("id")
                          })
                      
                        .then(response=>{
                      
                          let usuarioListaId= response.data[0].usuarioListaId
                      
                        axios.delete(`https://eficompraserver.onrender.com/borrarListaCompra?usuarioListaId=${usuarioListaId}`)
                        .then(response=>{
                          console.log("lista activa borrada")
                    usersIdCompartidos.map(i=>{

                        axios.post("https://eficompraserver.onrender.com/notificaciones",{
                          
                              emisor:localStorage.getItem("id"),
                              receptor:i,
                              accion: `${localStorage.getItem("alias")}/-/lista/${listaId}/${listaName}`
                              })
                              .then(response=>{
                                console.log("usuario compartido informado de -")
                              })
                              })
                      })
                    })


                    
                  
                    
                    
                      
                      }
                      return(
                      
                        this.setState({
                      miListaCompraId:"",
                      productSelected:[],
                      listaActivaGuardada:false,
                      listaCompraTitle:["Mi lista de la compra"],
                      comprado:[false],
                      listaActiva:""
                        })
                      )
    }
      
      
handleLetraClickMóvil(event, item) {
   if (window.matchMedia('(hover: hover)').matches) return;

  event.stopPropagation();
  
  if (event.nativeEvent) {
    event.nativeEvent.stopImmediatePropagation();
  }

  if (this.state.letraActivaId === item.letra) {
    this.setState({
      letterOnHover: false,
      palabrasOnMouseOver: [],
      letraActivaId: null,
       inputBuscador:"password",
   
    });
  } else {
    this.setState({
      letterOnHover: true,
      palabrasOnMouseOver: item.palabras,
      letraActivaId: item.letra,
      inputBuscador:"password",
     
    });
  }
}
      
    handleCrearListaNueva(event){

        this.setState({
          miListaCompraId:"",
            productSelected:[],
            listaActivaGuardada:false,
            listaCompraTitle:["Mi lista de la compra"],
            comprado:[false],
             isLoading: true,
             listaActiva:"",
             listasInactivasContent: "",
          }, () => {
            this.getContent() 
          
        })
  
       
    }
      
    handleAbrirLista(event){

      if(this.state.productSelected.length===0){
              
              let comprado=false
              let usersAliasCompartidos=this.state.usersAliasCompartidos
              let usersIdCompartidos=this.state.usersIdCompartidos
              let compartida=this.state.compartida
              let indx=event.target.value
              let listasInactivas=this.state.listasInactivas



              listasInactivas[indx].products.map(i=>{
                        this.state.productSelected.push(i)
                      return(this.state.productSelected)
              })
                      let listaId= listasInactivas[indx].listaId
                  
              
                  
                      this.setState({
                      
                        miListaCompraId:listaId,
                        listaActivaGuardada: true,
                  
                      })
                
                      this.state.listaCompraTitle.shift()    
              
                this.state.listaCompraTitle.push(listasInactivas[indx].listaName)

                this.state.comprado.shift()
                this.state.comprado.push(listasInactivas[indx].comprado)
              this.state.comprado.map(i=>{
                  if(i===0||i===false){
                  
                    comprado=false
                  }else(
                    
                    comprado=true
                  )     
              })

              usersAliasCompartidos=listasInactivas[indx].usersAliasCompartidos
              usersIdCompartidos=listasInactivas[indx].usersIdCompartidos
              listasInactivas.splice(indx,1)

              if(usersAliasCompartidos.length>0){
                  compartida=true
                  }else{
                  compartida=false
              }

              this.setState({
                  comprado:[comprado],
                  listaCompraTitle:this.state.listaCompraTitle,
                  productSelected:this.state.productSelected,
                  listasInactivas:listasInactivas,
                  listaActivaGuardada:true,
                  usersAliasCompartidos:usersAliasCompartidos,
                  usersIdCompartidos:usersIdCompartidos,
                  compartida:compartida,
              })
              
              if(listasInactivas.length===0){
                this.setState({
                  listasInactivasContent:"",
                  
                })

              }else{
                this.setState({
                
                  listasInactivasContent: 
                    <div className="listasInactivasWrapper">
                                    <div className="columnaTitle"> Listas guardadas</div>
                      <div className="listasGuardadas">
                          
                              
                          { listasInactivas.map(i=>{
                                      let compradoInactivo=i.comprado
                                          const fechaISO = i.fecha;
                                          const fecha = new Date(fechaISO);

                                          const opcionesFechaHora = { 
                                            year: 'numeric', 
                                            month: '2-digit', 
                                            day: '2-digit', 
                                            hour: '2-digit', 
                                            minute: '2-digit', 
                                            hour12: false 
                                        };
                                        const fechaHoraFormateada = fecha.toLocaleString('es-ES', opcionesFechaHora);
                                        if(compradoInactivo===0||compradoInactivo===false){
                                          compradoInactivo=false
                                        }else{
                                          compradoInactivo=true
                                        }
                                      if(i.compartida===false){
                                    
                                        return(
                                            <div>
                                                  Comprado
                                                
                                              <input type="checkbox" id="compradoCheckGuardado"checked={compradoInactivo} disabled></input>
                                              <div className="listaCompra" >
                                                  
                                                <div className="listaCompraTitle">
                                              
                                                  {i.listaName}
                                                    
                                                </div>
                                                <div className="listaCompraFecha">



                                                    {fechaHoraFormateada}
                                                </div>
                                                <div className="optionsBarList">
                                                      <button className="AbrirLista" onClick={this.handleAbrirLista} value={listasInactivas.indexOf(i)} >Abrir Lista</button>
                                                      <button className="CompartirLista" onClick={this.handleCompartirLista}value={i.listaId}>Compartir Lista</button>
                                                      <button className="BorrarLista"onClick={this.handleBorrarListaInactiva}value={i.listaId}>Borrar Lista</button>
                                                </div>
                                                <div className="listaCompraProducts">
                                                
                                                  
                                            
                                            
                                                    {i.products.map(product=>{
                                                        return(
                                                          <div className="productSelected">
                                                            <div className="productSelectedName">
                                                            {product} 
                                                            </div>
                                                          
                                                
                                                
                                                          </div>
                                                        )
                                                    })}

                                                    
                                              
                                                
                                                
                                                </div>
                                              </div>
                                            </div>
                                           
                                        )
                                      }else{
                                        return(
                                          <div>
                                                  Comprado
                                                
                                                  <input type="checkbox" id="compradoCheckGuardado"checked={compradoInactivo} disabled></input>
                                                  <div className="listaCompraCompartida" >
                                                    <div className="columnaIzda">
                                                    <div className="listaCompraTitle">
                                              
                                                {i.listaName}
                                                    
                                                    </div>
                                                  <div className="listaCompraFecha">



                                                    {fechaHoraFormateada}
                                                  </div>
                                                  </div>
                                                <div className="columnaDerecha">
                                                <div className="compartida">
                                                <div className="compartidaTitle">Compartida</div>
                                                <div className="compartidaUsers">
                                                {i.usersAliasCompartidos.map(i=>{
                                                  return(
                                                    <div>{i}</div>
                                                  )
                                                })}
                                                </div>

                                                </div>
                                                </div>
                                                  <div className="optionsBarList">
                                                      <button className="AbrirLista" onClick={this.handleAbrirLista} value={this.state.listasInactivas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).indexOf(i)} >Abrir Lista</button>
                                                      <button className="CompartirLista" onClick={this.handleCompartirLista}value={i.listaId}>Compartir Lista</button>
                                                      <button className="BorrarLista"onClick={this.handleBorrarListaInactiva}value={i.listaId}>Borrar Lista</button>
                                                    </div>
                                                  <div className="listaCompraProducts">
                                                
                                                  
                                            
                                            
                                              {i.products.map(product=>{
                                              return(
                                              <div className="productSelected">
                                              <div className="productSelectedName">
                                              {product} 
                                              </div>
                                              
                                        
                                        
                                                </div>
                                            )
                                            })}
                                                          
                                                        
                                                  
                                                    
                                                    
                                                      </div>
                                                    </div>
                                            </div>
                                        )
                                      }

                                              
                          })}
                      </div>
                                  
                    </div>
                })
              
            
              }
      }else{
                if(this.state.listaActivaGuardada===false){
                    if(window.confirm("La lista activa no está guardada.¿Quieres continuar sin guardar?")===true){


                          let comprado=false
                          let usersAliasCompartidos=this.state.usersAliasCompartidos
                          let usersIdCompartidos=this.state.usersIdCompartidos
                          let compartida=this.state.compartida
                          let indx=event.target.value
                          let productSelected=[]
                          let compradoInactivo=false
                          let listasInactivas=this.state.listasInactivas
                          let listaName=[]


                          listasInactivas[indx].products.map(i=>{
                                    productSelected.push(i)
                                  return(productSelected)
                          })
                          let listaId= listasInactivas[indx].listaId
                            
                      
                      
                          this.setState({
                          
                            miListaCompraId: listaId,
                            listaActivaGuardada: true,
                            
                          })
                        
                    
                          listaName=[this.state.listasInactivas[indx].listaName]
                          this.state.comprado.shift()
                          this.state.comprado.push(this.state.listasInactivas[indx].comprado)
                          this.state.comprado.map(i=>{
                              if(i===0||i===false){
                              
                                comprado=false
                              }else{
                                
                                comprado=true
                              }    
                          })
                          usersAliasCompartidos=this.state.listasInactivas[indx].usersAliasCompartidos
                          usersIdCompartidos=this.state.listasInactivas[indx].usersIdCompartidos
                          compartida=this.state.listasInactivas[indx].compartida
                          listasInactivas.splice(indx,1)
                          
                          this.setState({
                                comprado:[comprado],
                              listaCompraTitle:listaName,
                              productSelected:productSelected,
                              listasInactivas:listasInactivas,
                              listaActivaGuardada:true,
                              usersAliasCompartidos:usersAliasCompartidos,
                              usersIdCompartidos:usersIdCompartidos,
                              compartida:compartida,

                          })
                            
                            
                    }else{
                        this.handleBtnGuardarConNombre()
                    }
              }else{
                    
                    
                                let comprado=false
                          let compradoInactivo=false
                          let productSelected=[]
                          let usersAliasCompartidos=this.state.usersAliasCompartidos
                          let usersIdCompartidos=this.state.usersIdCompartidos
                          let compartida=this.state.compartida
                          let indx=event.target.value
                          let listaName=[]
                          let listaActivada={
                            comprado:this.state.comprado[0],
                                          products:this.state.productSelected,
                                        listaName:this.state.listaCompraTitle[0],
                                          fecha:new Date().toISOString(),
                                listaId:this.state.miListaCompraId,
                                compartida:compartida,
                                userAlias:localStorage.getItem("id"),
                                usersAliasCompartidos:usersAliasCompartidos,
                                usersIdCompartidos:usersIdCompartidos
                          }
                          let listasInactivas =this.state.listasInactivas



                                listasInactivas[indx].products.map(i=>{
                                          productSelected.push(i)
                                        return(productSelected)
                                })
                                        let listaId= listasInactivas[indx].listaId
                                    
                                    
                                    
                                        this.setState({
                                        
                                          miListaCompraId:listaId,
                                          listaActivaGuardada: true
                                      
                                        })
                                  
                                    
                                listaName=[listasInactivas[indx].listaName]
                                  this.state.comprado.shift()
                                  this.state.comprado.push(listasInactivas[indx].comprado)
                                this.state.comprado.map(i=>{
                                    if(i===0||i===false){
                                    
                                      comprado=false
                                    }else{
                                      
                                      comprado=true
                                    }
                                })
                                usersIdCompartidos=listasInactivas[indx].usersIdCompartidos
                                usersAliasCompartidos=listasInactivas[indx].usersAliasCompartidos
                                  if(usersAliasCompartidos.length>0){
                                    compartida=true
                                    }else{
                                    compartida=false
                                  }

                                listasInactivas.splice(indx,1)
                                listasInactivas.unshift(listaActivada)

                                  this.setState({
                                        comprado:[comprado],
                                        listaCompraTitle:listaName,
                                        productSelected:productSelected,
                                        listasInactivas:listasInactivas,
                                        listaActivaGuardada:true,
                                        usersAliasCompartidos:usersAliasCompartidos,
                                        usersIdCompartidos:usersIdCompartidos,
                                        compartida:compartida,

                              })
                        
                    
                      
                    
              }   
                          
                   
                      
        
              
      

      }
        
    }     
    handleBorrarListaInactiva(event){

          let listaId=""
          let listaName=""
          let usersIdCompartidos=[]
            this.state.listasInactivas.map(i=>{
              listaId=i.listaId
              listaName=i.listaName
              usersIdCompartidos=i.usersIdCompartidos
              if(i.compartida===false){
                  if(Number(event.target.value)===i.listaId){
                      i.products.map(i=>{
                              axios.post("https://eficompraserver.onrender.com/miListaCompraProducts",{
                                    product:i,
                                    listaId: Number(event.target.value)
                              })
                              .then(response=>{
                                  
                                    
                                        let listaProducts=response.data[0].listaProducts
                                          
                                          axios.delete(`https://eficompraserver.onrender.com/miListaCompraProducts?listaProducts=${listaProducts}`)
                                        
                                          .then(response=>{
                                            console.log("lista vacía")
                                          });
                            
                            
                              })
                      })
              
                      axios.post(`https://eficompraserver.onrender.com/borrarListaCompra`,{
                        listasdelacompra:Number(event.target.value),
                        userId: localStorage.getItem("id")
                      })
                
                      .then(response=>{
                  
                              let usuarioListaId= response.data[0].usuarioListaId
                            
                            axios.delete(`https://eficompraserver.onrender.com/borrarListaCompra?usuarioListaId=${usuarioListaId}`)
                            .then(response=>{
                              console.log("lista inactiva borrada")
                        
                          })
                      })

                      if(this.state.listasInactivas.length===1){
                              this.setState({
                            listasInactivas: [],
                            listasInactivasContent:"",
                           

                            })
                      }else{
                        this.state.listasInactivas.splice(this.state.listasInactivas.indexOf(i),1)
                        this.setState({
                          listasInactivas: this.state.listasInactivas,
                          
                          listasInactivasContent:
                              <div className="listasInactivasWrapper">
                                <div className="columnaTitle"> Listas guardadas</div>
                                  <div className="listasGuardadas">
                                    { this.state.listasInactivas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).map(i=>{
                                                                
                                                                const fechaISO = i.fecha;
                                                                const fecha = new Date(fechaISO);

                                                                const opcionesFechaHora = { 
                                                                  year: 'numeric', 
                                                                  month: '2-digit', 
                                                                  day: '2-digit', 
                                                                  hour: '2-digit', 
                                                                  minute: '2-digit', 
                                                                  hour12: false 
                                                        };
                                                          const fechaHoraFormateada = fecha.toLocaleString('es-ES', opcionesFechaHora);
                                                          
                                                        if(i.compartida===false){
                                                      
                                                          return(
                                                                  
                                                            <div>
                                                                    Comprado 
                                                                  
                                                                    <input type="checkbox" id="compradoCheckGuardado"checked={i.comprado} disabled></input>
                                                            
                                                                    <div className="listaCompra" >
                                                                    
                                                                    <div className="listaCompraTitle">
                                                                
                                                                  {i.listaName}
                                                                      
                                                                      </div>
                                                                    <div className="listaCompraFecha">



                                                                      {fechaHoraFormateada}
                                                                    </div>
                                                                    <div className="optionsBarList">
                                                                        <button className="AbrirLista" onClick={this.handleAbrirLista} value={this.state.listasInactivas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).indexOf(i)} >Abrir Lista</button>
                                                                        <button className="CompartirLista" onClick={this.handleCompartirLista}value={i.listaId}>Compartir Lista</button>
                                                                        <button className="BorrarLista"onClick={this.handleBorrarListaInactiva}value={i.listaId}>Borrar Lista</button>
                                                                      </div>
                                                                    <div className="listaCompraProducts">
                                                                  
                                                                    
                                                              
                                                              
                                                                        {i.products.map(product=>{
                                                                        return(
                                                                        <div className="productSelected">
                                                                        <div className="productSelectedName">
                                                                        {product} 
                                                                        </div>
                                                                        
                                                                        
                                                                        
                                                                        </div>
                                                                        )
                                                                        })}
                                                                                      
                                                                                    
                                                                              
                                                                                
                                                                                
                                                                                  </div>
                                                                                </div>
                                                            </div>
                                                          )                                             
                                                        }else{
                                                          return(
                  
                                                            <div>
                                                              Comprado
                                                                                      
                                                              <input type="checkbox" id="compradoCheckGuardado"checked={i.comprado[0]} disabled></input>
                                                              <div className="listaCompraCompartida" >
                                                                <div className="columnaIzda">
                                                                  <div className="listaCompraTitle">
                                                                                    
                                                                    {i.listaName}
                                                                                          
                                                                  </div>
                                                                  <div className="listaCompraFecha">



                                                                    {fechaHoraFormateada}
                                                                  </div>
                                                                </div>
                                                                <div className="columnaDerecha">
                                                                  <div className="compartida">
                                                                    <div className="compartidaTitle">Compartida</div>
                                                                    <div className="compartidaUsers">
                                                                        {i.usersAliasCompartidos.map(i=>{
                                                                          return(
                                                                                            
                                                                            <div>{i}</div>
                                                                          )
                                                                        })}
                                                                    </div>
                                                                                      

                                                                  </div>
                                                                </div>
                                                                <div className="optionsBarList">
                                                                                              <button className="AbrirLista" onClick={this.handleAbrirLista} value={this.state.listasInactivas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).indexOf(i)} >Abrir Lista</button>
                                                                                              <button className="CompartirLista" onClick={this.handleCompartirLista}value={i.listaId}>Compartir Lista</button>
                                                                                              <button className="BorrarLista"onClick={this.handleBorrarListaInactiva}value={i.listaId}>Borrar Lista</button>
                                                                </div>
                                                                <div className="listaCompraProducts">
                                                                                        
                                                                                          
                                                                                    
                                                                                    
                                                                  {i.products.map(product=>{
                                                                                return(
                                                                                <div className="productSelected">
                                                                                <div className="productSelectedName">
                                                                                {product} 
                                                                                </div>
                                                                                
                                                                                
                                                                                
                                                                                </div>
                                                                                )
                                                                  })}
                                                                                              
                                                                                            
                                                                                      
                                                                                        
                                                                                        
                                                                </div>
                                                              </div>
                                                            </div>
                                                                            
                                                          )
                                                        }

                                                                                        
                                    })}                 
                                  </div>
                              </div>
                        })
                      }
                                                                        
                                                                          
                  }  
              }else{
                    if(Number(event.target.value)===i.listaId){

              
              
                          axios.post(`https://eficompraserver.onrender.com/borrarListaCompra`,{
                            listasdelacompra:Number(event.target.value),
                            userId: localStorage.getItem("id")
                          })
                      
                          .then(response=>{
                      
                              let usuarioListaId= response.data[0].usuarioListaId
                      
                              axios.delete(`https://eficompraserver.onrender.com/borrarListaCompra?usuarioListaId=${usuarioListaId}`)
                              .then(response=>{
                                console.log("lista inactiva borrada")
                            
                                  usersIdCompartidos.map(i=>{

                                    axios.post("https://eficompraserver.onrender.com/notificaciones",{
                                      
                                      emisor:localStorage.getItem("id"),
                                      receptor:i,
                                      accion: `${localStorage.getItem("alias")}/-/lista/${listaId}/${listaName}`
                                    })
                                    .then(response=>{
                                      console.log("usuario compartido informado de -")
                                    })
                                  })
                              })
                          })
                      if(this.state.listasInactivas.length===1){
                        this.setState({
                          listasInactivas: [],
                          listasInactivasContent:"",
                         
                        })
                      }else{
                        this.state.listasInactivas.splice(this.state.listasInactivas.indexOf(i),1)
                          this.setState({
                            listasInactivas: this.state.listasInactivas,
                            
                            listasInactivasContent:
                            <div className="listasInactivasWrapper">
                              <div className="columnaTitle"> Listas guardadas</div>
                              <div className="listasGuardadas">
                                { this.state.listasInactivas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).map(i=>{
                                
                                const fechaISO = i.fecha;
                                const fecha = new Date(fechaISO);

                                const opcionesFechaHora = { 
                                  year: 'numeric', 
                                  month: '2-digit', 
                                  day: '2-digit', 
                                  hour: '2-digit', 
                                  minute: '2-digit', 
                                  hour12: false 
                              };
                              const fechaHoraFormateada = fecha.toLocaleString('es-ES', opcionesFechaHora);
                              
                            if(i.compartida===false){
                          
                              return(
                                        
                                      <div>
                                        Comprado 
                                      
                                        <input type="checkbox" id="compradoCheckGuardado"checked={i.comprado} disabled></input>
                                
                                        <div className="listaCompra" >
                                        
                                        <div className="listaCompraTitle">
                                    
                                      {i.listaName}
                                          
                                          </div>
                                        <div className="listaCompraFecha">



                                          {fechaHoraFormateada}
                                        </div>
                                        <div className="optionsBarList">
                                            <button className="AbrirLista" onClick={this.handleAbrirLista} value={this.state.listasInactivas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).indexOf(i)} >Abrir Lista</button>
                                            <button className="CompartirLista" onClick={this.handleCompartirLista}value={i.listaId}>Compartir Lista</button>
                                            <button className="BorrarLista"onClick={this.handleBorrarListaInactiva}value={i.listaId}>Borrar Lista</button>
                                          </div>
                                        <div className="listaCompraProducts">
                                      
                                        
                                  
                                  
                              {i.products.map(product=>{
                              return(
                              <div className="productSelected">
                              <div className="productSelectedName">
                              {product} 
                              </div>
                              
                              
                              
                              </div>
                              )
                              })}
                                            
                                          
                                    
                                      
                                      
                                        </div>
                                      </div>
                                      </div>
                                        )
                            }else{
                              return(
                              
                                        <div>
                                        Comprado
                                      
                                        <input type="checkbox" id="compradoCheckGuardado"checked={i.comprado[0]} disabled></input>
                                        <div className="listaCompraCompartida" >
                                          <div className="columnaIzda">
                                          <div className="listaCompraTitle">
                                    
                                      {i.listaName}
                                          
                                          </div>
                                        <div className="listaCompraFecha">



                                          {fechaHoraFormateada}
                                        </div>
                                        </div>
                                      <div className="columnaDerecha">
                                      <div className="compartida">
                                      <div className="compartidaTitle">Compartida</div>
                                      <div className="compartidaUsers">
                                      {i.usersAliasCompartidos.map(i=>{
                                          return(
                                          
                                          <div>{i}</div>
                                          )
                                        })}
                                      </div>

                                      </div>
                                      </div>
                                        <div className="optionsBarList">
                                            <button className="AbrirLista" onClick={this.handleAbrirLista} value={this.state.listasInactivas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).indexOf(i)} >Abrir Lista</button>
                                            <button className="CompartirLista" onClick={this.handleCompartirLista}value={i.listaId}>Compartir Lista</button>
                                            <button className="BorrarLista"onClick={this.handleBorrarListaInactiva}value={i.listaId}>Borrar Lista</button>
                                          </div>
                                        <div className="listaCompraProducts">
                                      
                                        
                                  
                                  
                              {i.products.map(product=>{
                              return(
                              <div className="productSelected">
                              <div className="productSelectedName">
                              {product} 
                              </div>
                              
                              
                              
                              </div>
                              )
                              })}
                                            
                                          
                                    
                                      
                                      
                                        </div>
                                      </div>
                                        </div>
                                    
                                        )
                            }

                                        
                            })}
                            </div>
                            </div>
                          })
                      }
                          
                            
                    }  
              }
            })

    }
    
    handleCompartirLista(event){
    
            let listaToShare=""

            if(Number(event.target.value)===this.state.miListaCompraId){
            listaToShare=`lista${event.target.value}`

              }else{
                this.state.listasInactivas.map(i=>{
                
              
                  if(Number(event.target.value)===i.listaId){
                    
                      listaToShare=`lista${i.listaId}`
                    
                  }
                })
              }
                navigator.share({
                                    title: 'EFICOMPRA',
                                    text: 'Quiero compartir contigo esta lista de la compra',
                                    url: `${window.location.origin}/listaCompraCompartir/${listaToShare}/${localStorage.getItem("alias")}`,
                                });
    } 
    handleNotificaciones(event){

              let notificaciones=[]
                let notificacionesAccionTitle=[]
              let notificacionesFilter=[]

              this.state.notificaciones.map(i=>{
                const fechaISO = i.fecha;
                  const fecha = new Date(fechaISO);

                  const opcionesFechaHora = { 
                    year: 'numeric', 
                    month: '2-digit', 
                    day: '2-digit', 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    hour12: false 
                };
                const fechaHoraFormateada = fecha.toLocaleString('es-ES', opcionesFechaHora);
            let notificacionAccion=i.accion.split("/")

            let emisor= notificacionAccion[0]
            let accion= notificacionAccion[1]
            let product=notificacionAccion[2]
            let listaId=notificacionAccion[3]
            i.listaId=listaId
            let preposition=""
            let listaName=i.listaName
            if(accion==="+"){
              accion="ha añadido"
              preposition="a"
              notificaciones.push([fechaHoraFormateada,emisor,accion,product,preposition,listaName])
            }else if(accion==="-"){

            if(product==="lista"){
              listaName=notificacionAccion[4]
            accion="ha eliminado"
            product="la lista"
            preposition=""
            notificaciones.push([fechaHoraFormateada,emisor,accion,product,preposition,listaName])
            }else{
            accion="ha eliminado"
            preposition="de"
            notificaciones.push([fechaHoraFormateada,emisor,accion,product,preposition,listaName])
            }
            }else if(accion==="change"){
            accion="ha cambiado el estado de la lista a "
            preposition="en"

            if(Number(product)===1){
            product="comprado"
            }else{
            product="no comprado"
            }
            notificaciones.push([fechaHoraFormateada,emisor,accion,product,preposition,listaName])
            }else if(accion==="title"){
            
            notificacionesAccionTitle.push(i)
            }



              })

            notificacionesFilter=[notificacionesAccionTitle[0]]

            if(notificacionesAccionTitle.length>0){
            notificacionesAccionTitle.map(i=>{

            if(i.listaId===notificacionesFilter[0].listaId&&i.emisor===notificacionesFilter[0].emisor&&i.fecha.startsWith(notificacionesFilter[0].fecha.slice(0,16))===true){
              notificacionesFilter.shift()
              notificacionesFilter.push(i)
              
            }else{
              notificacionesFilter.unshift(i)
              
            }
              })
              
            
              notificacionesFilter.map(i=>{
                const fechaISO = i.fecha;
                  const fecha = new Date(fechaISO);

                  const opcionesFechaHora = { 
                    year: 'numeric', 
                    month: '2-digit', 
                    day: '2-digit', 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    hour12: false 
                };
                const fechaHoraFormateada = fecha.toLocaleString('es-ES', opcionesFechaHora);

                let notificacionAccion=i.accion.split("/")

            let emisor= notificacionAccion[0]
            let product=notificacionAccion[2]
            let accion="ha cambiado el nombre a"
            let listaName=""
            let preposition=""

            notificaciones.push([fechaHoraFormateada,emisor,accion,product,preposition,listaName])
              })
            }
              
            let notificacionesOrdenadas= notificaciones.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))





              let notificacionesLista=
              <div className="modal-overlay">
            <div className="notificacionesLista">
              <div className="notificacionesTitle">
            NOTIFICACIONES
              </div>

              { notificacionesOrdenadas.map(i=>{
                return(
                  <div className="notificacion">
                    <div className="notificacionFecha"> {i[0]}</div>
                    <div className="notificacionEmisorProduct">
                      <a>{i[1]} </a>
                      {i[2]} 
                      <a> {i[3]} </a>
                    {i[4]}
                      <a>{ i[5]} </a>
                  </div>
                      
                  </div>
                
                )
              })}
              <div className="buttonBar">
            <button className="aceptarNotificaciones" onClick={this.handleAceptarNotificaciones}>Aceptar</button>
            </div>
            </div>
            </div>
            this.setState({
              notificacionesLista:notificacionesLista,
              notificacionesAceptadas:false
             
            })
    }
    handleAceptarNotificaciones(event){
    

          let notificaciones=this.state.notificaciones

          notificaciones.map(i=>{

          axios.delete(`https://eficompraserver.onrender.com/notificaciones?idnotificaciones=${i.idnotificaciones}`)
          .then(response=>{
        console.log(response)
        
            
            
          })
        .catch(error => {
                console.error("Error en la eliminación:", error);
              });
          })

        notificaciones=[]
        
        this.setState({
          notificacionesAceptadas:true,
     
        })
            if(this.state.listaActivaGuardada===false){
              this.setState({
        
              notificaciones:notificaciones,
              notificacionesLista:"",
              notificacionesButton:"",
              listasInactivasContent:"",
              listasInactivas:[]

            })
            return(
              this.getContent()
            )
            }else{
              this.setState({
                notificaciones:notificaciones,
              notificacionesLista:"",
              notificacionesButton:"",
                  listaActiva:"",
                  miListaCompraId:"",
                  comprado:[false],
                  listaCompraTitle:["Mi lista de la compra"],
                  productSelected:[],
                  listaActivaGuardada:false,
                  compartida:false,
                  usersAliasCompartidos:[],
                  usersIdCompartidos:[],
                  listasInactivasContent:"",
              listasInactivas:[],
           
                })
                return(
                this.getContent()
                )
            }
          
    
      }
    

reintentarAlRecuperarFoco() {
  if (document.visibilityState === "visible" && document.hasFocus()) {
    window.removeEventListener("focus", this.reintentarAlRecuperarFoco);
    document.removeEventListener("visibilitychange", this.reintentarAlRecuperarFoco);
    clearTimeout(this.timerReinicioVoz);
    this.timerReinicioVoz = setTimeout(() => {
      this.iniciarEscuchaAutomatica();
    }, 800);
  }
}
iniciarEscuchaAutomatica() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return;

  if (document.visibilityState !== "visible") return;

  this.escuchandoActivo = true;
  clearTimeout(this.timerReinicioVoz);

  
  if (this.recognition) {
    try {
      this.recognition.onend = null;
      this.recognition.onerror = null;
      this.recognition.abort();
    } catch (e) {}
    this.recognition = null;
  }

  this.recognition = new SpeechRecognition();
  this.recognition.lang = "es-ES";
  this.recognition.continuous = true;
  this.recognition.interimResults = false;

  this.recognition.onstart = () => {
    this.intentosFallidos = 0;
  };

  this.recognition.onresult = (event) => {
    const ultimoIndice = event.results.length - 1;
    if (!event.results[ultimoIndice].isFinal) return;

    const frase = event.results[ultimoIndice][0].transcript
      .toLowerCase()
      .replace(/[.,;!?]/g, "")
      .trim();

    if (frase.includes("apunta")) {
      const partes = frase.split(/\bapunta\b/i);
      const productosAAñadir = partes
        .slice(1)
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      if (productosAAñadir.length > 0) {
        this.escuchandoActivo = false;
        clearTimeout(this.timerReinicioVoz);
        try { this.recognition.stop(); } catch (e) {}

        productosAAñadir.forEach((producto, index) => {
          setTimeout(() => {
            this.handleOnClick({ target: { value: producto } });
          }, index * 150);
        });

        setTimeout(() => {
          window.speechSynthesis.cancel();
          const voz = new SpeechSynthesisUtterance("Hecho");
          voz.lang = "es-ES";

          const reanudar = () => {
            this.iniciarEscuchaAutomatica();
          };

          const respaldo = setTimeout(reanudar, 1500);
          voz.onend = () => {
            clearTimeout(respaldo);
            setTimeout(reanudar, 300);
          };
          voz.onerror = () => {
            clearTimeout(respaldo);
            reanudar();
          };

          window.speechSynthesis.speak(voz);
        }, productosAAñadir.length * 150);
      }
    }
     if (frase.includes("borra")) {
      const partes = frase.split(/\bborra\b/i);
      const productoABorrar = partes
        .slice(1)
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      if (productoABorrar.length > 0) {
        this.escuchandoActivo = false;
        clearTimeout(this.timerReinicioVoz);
        try { this.recognition.stop(); } catch (e) {}

        productoABorrar.forEach((producto, index) => {
          setTimeout(() => {
          if(this.state.listaActivaGuardada===false){
            this.handleDelete({ target: { value: producto } });
            }else{
            this.handleDeleteGuardado({ target: { value: producto } })
            }
          }, index * 150);

        });

        setTimeout(() => {
          window.speechSynthesis.cancel();
          const voz = new SpeechSynthesisUtterance("Hecho");
          voz.lang = "es-ES";

          const reanudar = () => {
            this.iniciarEscuchaAutomatica();
          };

          const respaldo = setTimeout(reanudar, 1500);
          voz.onend = () => {
            clearTimeout(respaldo);
            setTimeout(reanudar, 300);
          };
          voz.onerror = () => {
            clearTimeout(respaldo);
            reanudar();
          };

          window.speechSynthesis.speak(voz);
        }, productoABorrar.length * 150);
      }
    }
    if (frase.includes("abrir lista")) {
      const partes = frase.split(/\babrir lista\b/i);
      const listaAAbrir = partes
        .slice(1)
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      if (listaAAbrir.length > 0) {
        this.escuchandoActivo = false;
        clearTimeout(this.timerReinicioVoz);
        try { this.recognition.stop(); } catch (e) {}

        
          setTimeout(() => {
          if(this.state.listaActivaGuardada===false){
         this.handleAbrirLista({target: { value: 0 }})
          }
          }, 150);


        setTimeout(() => {
          window.speechSynthesis.cancel();
          const voz = new SpeechSynthesisUtterance("Hecho");
          voz.lang = "es-ES";

          const reanudar = () => {
            this.iniciarEscuchaAutomatica();
          };

          const respaldo = setTimeout(reanudar, 1500);
          voz.onend = () => {
            clearTimeout(respaldo);
            setTimeout(reanudar, 300);
          };
          voz.onerror = () => {
            clearTimeout(respaldo);
            reanudar();
          };

          window.speechSynthesis.speak(voz);
        }, listaAAbrir.length * 150);
      }
    }
  };

  this.recognition.onerror = (event) => {
    this.intentosFallidos += 1;
  };

  this.recognition.onend = () => {
    if (!this.escuchandoActivo) return;
    if (this.intentosFallidos >= 4) {
      this.escuchandoActivo = false;
      return;
    }

  
    this.timerReinicioVoz = setTimeout(() => {
      if (this.escuchandoActivo) {
        this.iniciarEscuchaAutomatica();
      }
    }, 1000);
  };

  try {
    this.recognition.start();
  } catch (e) {}
}





gestionarToqueEnPantalla(event) {
  if (!event.isTrusted) return;

 
  if (Date.now() - this.tiempoAperturaApp < 800) return;

 
  clearTimeout(this.timerReinicioVoz);

  if (this.escuchandoActivo) {
    this.escuchandoActivo = false;
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch (e) {}
    }
  }
}



    componentDidMount() {
      window.addEventListener("beforeunload", this.handleBeforeUnload);
      if ("Notification" in window && Notification.permission === "default") {
  Notification.requestPermission();
}
document.addEventListener("visibilitychange", this.handleVisibilityChange);

      this.getProductsList();


      
      this.socket.on('privilegiosRevocados', (data) => {
        console.log(`Los privilegios del usuario ${data.userId} han sido revocados.`);
        
        const { listaActiva, listaActivaGuardada } = this.state;


        const otorgarPrivilegios = () => {
          axios.post("https://eficompraserver.onrender.com/otorgarPrivilegios", {
            id: localStorage.getItem("id")
          })
          .then(response => {
            console.log(response.data);
            this.getContent();
          })
          .catch(err => console.error("Error otorgando privilegios:", err));
        };

        if (listaActiva === "" || listaActivaGuardada === false){
          otorgarPrivilegios();
        }else{
      
            this.setState({
              listaActiva: "",
              miListaCompraId: "",
              comprado: [false],
              listaCompraTitle: ["Milista de la compra"],
              productSelected: [],
              listaActivaGuardada: false,
              compartida: false,
              usersAliasCompartidos: [],
              usersIdCompartidos: []
              }, () => {
          
              otorgarPrivilegios();
            });
        }
      });


      this.socket.on('notificacionEnviada', (data) => {
        console.log(`El usuario ${data.receptor} ha sido notificado.`);

        const miId = Number(localStorage.getItem("id"));
            if (data.receptor !== miId) return; 

        axios.post("https://eficompraserver.onrender.com/recuperarNotificaciones", {
          receptor: miId
        })
        .then(response => {
          if (!response.data || response.data.length === 0) return;

          let necesitaResetearLista = false;
          const notificacionesPROCESADAS = [];

          response.data.forEach(item => {
            const notificacionAccion = item.accion.split("/");
            const listaName = notificacionAccion[4];
            
      
            const nuevaNotificacion = { ...item, listaName };
            notificacionesPROCESADAS.push(nuevaNotificacion);

            if (notificacionAccion[2] === "lista" || notificacionAccion[1] === "change") {
              necesitaResetearLista = true;
            }
          });

      
          const nuevoBotonNotificaciones = (
            <div className="notificaciones">
              <button className="notificaciones" onClick={this.handleNotificaciones}>Notificaciones</button>
            </div>
          );

        
          if (necesitaResetearLista && this.state.listaActivaGuardada === true) {
            this.setState({
              listaActiva: "",
              miListaCompraId: "",
              comprado: [false],
              listaCompraTitle: ["Mi lista de la compra"],
              productSelected: [],
              listaActivaGuardada: false,
              compartida: false,
              usersAliasCompartidos: [],
              usersIdCompartidos: [],
              notificacionesButton: nuevoBotonNotificaciones,
              notificaciones: notificacionesPROCESADAS // Aseguramos guardar las notificaciones procesadas
            }, () => this.getContent());
          } else if (necesitaResetearLista) {
            this.setState({
              notificacionesButton: nuevoBotonNotificaciones,
              notificaciones: notificacionesPROCESADAS
            }, () => this.getContent());
          } else {
            this.setState({
              notificacionesButton: nuevoBotonNotificaciones,
              notificaciones: notificacionesPROCESADAS
            });
          }
        })
        .catch(err => console.error("Error recuperando notificaciones:", err));
      });


      this.socketCleanup = () => {
        if (this.socket) {
          this.socket.off('privilegiosRevocados');
          this.socket.off('notificacionEnviada');
        }
      };
       document.addEventListener('touchstart', this.handleTouchOutside);
       document.addEventListener('mousedown', this.handleTouchOutside);

 this.tiempoAperturaApp = Date.now();

window.addEventListener("touchstart", this.gestionarToqueEnPantalla, { passive: true });



this.timerReinicioVoz = setTimeout(() => {
  this.iniciarEscuchaAutomatica();
}, 2800);
window.addEventListener("beforeinstallprompt", this.handleBeforeInstallPrompt);
window.addEventListener("appinstalled", this.handleAppInstalled);
      }

    componentWillUnmount() {
        this.socketCleanup(); 
        window.removeEventListener("beforeunload", this.handleBeforeUnload);
         document.removeEventListener('touchstart', this.handleTouchOutside);
       document.removeEventListener('mousedown', this.handleTouchOutside);
       this.escuchandoActivo = false;
       clearTimeout(this.timerReinicioVoz); 
if (this.recognition) {
  this.recognition.stop();
}
//document.removeEventListener('touchstart', this.desbloquearVozConToque);
//document.removeEventListener('click', this.desbloquearVozConToque);
window.removeEventListener("focus", this.reintentarAlRecuperarFoco);
document.removeEventListener("visibilitychange", this.reintentarAlRecuperarFoco);
window.removeEventListener("touchstart", this.gestionarToqueEnPantalla);
window.removeEventListener("focus", this.reintentarAlRecuperarFoco);
document.removeEventListener("visibilitychange", this.reintentarAlRecuperarFoco);
this.escuchandoActivo = false;
clearTimeout(this.timerReinicioVoz);
if (this.recognition) {
  try {
    this.recognition.abort();
  } catch (e) {}
}
document.removeEventListener("visibilitychange", this.handleVisibilityChange);
window.removeEventListener("beforeinstallprompt", this.handleBeforeInstallPrompt);
window.removeEventListener("appinstalled", this.handleAppInstalled);

    }
      

      
    
      


    componentDidUpdate(){
    
      if(this.state.options.length===0){

        this.getOptions()
        this.getOptionsByLetter()
        this.getOptionsByCategory()
        this.getContent()
        
      }
      if(this.state.productoBorrado===true){
        this.setState({
          productSelected:this.state.productSelected,
          productoBorrado:false
        })
      }

      
    }

      

    render(){
      
            let listasInactivas=this.state.listasInactivas
            let listasInactivasContent=this.state.listasInactivasContent
            let notificacionesButton=this.state.notificacionesButton
            let notificacionesLista=this.state.notificacionesLista
            let instalarApp=""
            let listaActiva= ""
            let content=
              <div className="contentMisListas">
            
                <div className="columnaCentral">
                
                          <div className="buscadorProductos">
                            <input type="text"name="buscadorProductos" list="Products" onClick={this.handleOnClick} 
                              onKeyDown={(event) => this.teclaEnter(event, this.handleOnClick)}  
                              placeholder={this.state.placeholderBuscador} />
                              <datalist key='Products' id="Products" className="dataList">
                            
                        
                                { this.state.options.map(i=>{
                                  
                                
                                    return (
                                
                                
                                        <option key={this.state.options.indexOf(i)} value={i}>{i}</option>
                                
                                    )
                                })}
                                    
                            
                              </datalist>
                          </div>
                        
                        
                        
                        <div className="productosFrecuentes">
                        
                        {this.state.productosFrecuentes.map(i=>{
                      if(i.name!=undefined){
                        return(
                          <button className="productoFrecuente" value={i.name} onClick={this.handleOnClick}>
                          {i.name}
                          </button>
                          
                          )
                      }
                          
                          })}
                        </div>
                        <div className="categories">
                        
                        
                              
                      { 
                        this.state.opcionesPorCategoria.sort((a,b)=>a[0].category.localeCompare(b[0].category)).map(cat=>{
                    
                        
                          if(cat[0]!=undefined&&cat[0].category==="cuidado_personal"){

                  return(
                          <div className="category" id={cat[0].category} onClick={this.handleOnClickCategory} >
                          <div className="categoryName" >
                          cuidado personal
                          </div>
                          
                        
                        </div>
                        )
                          }
                        if(cat[0]!=undefined&&cat[0].category!="cuidado_personal"){
                      
                      let catId=(cat[0].category).replaceAll(" ","")
                    
                        return(
                          <div className="category" id={catId}onClick={this.handleOnClickCategory} >
                          <div className="categoryName" >
                          {cat[0].category}
                          </div>
                          
                        
                        </div>
                        )
                        }
                        

                        
                        
                        })
                        
                        }
                      
                      
                        </div>
                        
                
                </div>
          
              </div>
            let abc= 
              <div className="abecedario">

                      
                {this.state.opcionesPorLetra.map(i=>{
                        return(
                        <div className="letra" onMouseOver={this.handleOnMouseOver} id={i.letra}>
                            {i.letra}
                            
                            </div>
                        )})
                }
              </div>
     
            
     let productSelected= this.state.productSelected 
    
       
     if(this.state.voiceExplication=true){
     content=
        content=
   <div className="voiceExplain">
    <div className="voiceExplainTitle">
      <div className="title">
        Haz tus listas de la compra por voz.
      </div>
      <div className="Micro" >MicroIcono</div>
    </div>
    <div className="voiceExplainContent">
                                    
      {instalarApp}
                                                        <div className="voiceExplication">
                                                        Puedes modificar tu lista de la compra activa o tu última lista de la compra guardada solamente con tu voz.
                                                        Pulsa el icono del micrófono si éste está desconectado y prueba a solicitar una de las acciones disponibles.
                                                        Si pulsas de nuevo la pantalla el micrófono se desconectará.
                                                        </div>
                                                        <div className="ordenesVoz">
                                                        Para añadir un producto a la lista de la compra prueba a decir:

                                                        "Apunta (nombre del producto)" por ejemplo, "Apunta manzanas", o, "Apunta filetes tiernos"

                                                        Para borrar un producto de tu lista de la compra prueba a decir:

                                                        "Borra (nombre del producto) por ejemplo, "Borra manzanas", o, "Borra filetes tiernos"

                                                        Para abrir la última lista guardada y poder modificarla, prueba a decir:

                                                        "Abrir lista"

                                                        </div>
                                                        <div className="notificacionesExplication">
                                                        Cuando instalas Eficompra en tu dispositivo, se solicita permiso para enviar notificaciones. 
                                                        Estas notificaciones solo te avisan por si te dejas una lista de la compra sin guardar, 
                                                        ya que podrías perder la información en el caso de cerrar la sesión o entrar a la app por medio del asistente de voz.
                                                        </div>
                                                        </div>
                                                        </div>                                           
     }
     if (listasInactivas && listasInactivas.length > 0) {
          listasInactivasContent = (
            <div className="listasInactivasWrapper">
              <div className="columnaTitle"> Listas guardadas</div>
              <div className="listasGuardadas">
                {listasInactivas.map((i, index) => {
                  const fecha = new Date(i.fecha);
                  const opcionesFechaHora = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false };
                  const fechaHoraFormateada = isNaN(fecha.getTime()) ? "Fecha pendiente" : fecha.toLocaleString('es-ES', opcionesFechaHora);
                  let compradoInactivo = i.comprado === 0 || i.comprado === false ? false : true;

                  return (
                    <div key={i.listaId || index}>
                      <span style={{fontWeight: 'bold'}}>Comprado</span>
                      <input type="checkbox" id="compradoCheckGuardado" checked={compradoInactivo} disabled />
                      
                      <div className={i.compartida ? "listaCompraCompartida" : "listaCompra"}>
                        <div className="columnaIzda">
                          <div className="listaCompraTitle">{i.listaName}</div>
                          <div className="listaCompraFecha">{fechaHoraFormateada}</div>
                        </div>
                        
                        {i.compartida && (
                          <div className="columnaDerecha">
                            <div className="compartida">
                              <div className="compartidaTitle">Compartida</div>
                              <div className="compartidaUsers">
                                {i.usersAliasCompartidos && i.usersAliasCompartidos.map((u, idx) => (
                                  <div key={idx} className="user-badge">{u}</div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div className="optionsBarList">
                        
                          <button className="AbrirLista" onClick={this.handleAbrirLista} value={index}>Abrir Lista</button>
                          <button className="CompartirLista" onClick={this.handleCompartirLista} value={i.listaId}>Compartir Lista</button>
                          <button className="BorrarLista" onClick={this.handleBorrarListaInactiva} value={i.listaId}>Borrar Lista</button>
                        </div>
                        
                        <div className="listaCompraProducts">
                          {i.products && i.products.length > 0 ? (
                            i.products.map((product, idx) => (
                              <div className="productSelected" key={idx}>
                                <div className="productSelectedName">{product}</div>
                              </div>
                            ))
                          ) : (
                            <div className="no-products" style={{fontStyle: 'italic', padding: '8px', color: '#999'}}>Lista compartida (Aún sin productos registrados)</div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
  }      
     if(productSelected.length>0&&this.state.listaActivaGuardada===true){
                        listaActiva= 
                          <div>
                              <div className="columnaListaActivaGuardada">
                                      <div className="columnaTitle"> Lista de la compra activa</div>
                                      <div className="optionsBarList">
                                            <button className="CrearLista"onClick={this.handleCrearListaNueva}>Nueva Lista</button>
                                              <button className="CompartirLista"onClick={this.handleCompartirLista}value={this.state.miListaCompraId}>Compartir Lista</button>
                                              <button className="BorrarLista"onClick={this.handleBorrarLista}>Borrar Lista</button>
                                      </div>
                                      {this.state.comprado.map(i=>{
                                      
                                          
                                            if(this.state.usersAliasCompartidos.length===0){
                                    
                                              return(
                                                  <div className="listaActivaGuardada">
                                                    Comprado
                                                    <input type="checkbox" id="compradoCheck" checked={i} onChange={this.changeState}></input>
                                                    <div className="listaCompraGuardada">
                                        
                                                            <div className="listaCompraTitle">
                                          
                                                              <input type="text"name="listaCompraTitle" key={this.state.miListaCompraId}id="listaCompraTitle" defaultValue={this.state.listaCompraTitle[0]} placeholder={this.state.listaCompraTitle[0]}onClick={this.handleListaTitle}
                                                                autocomplete="off" onKeyDown={(event) => this.teclaEnter(event, this.handleListaTitle)}  />
                                                            </div>
                                        
                                                            <div className="listaCompraProducts">
                                                                {productSelected.map(i=>{
                                                                    return(
                                                                                    <div className="productSelected">
                                                                                        <div className="productSelectedName">
                                                                                          {i} 
                                                                                        </div>
                                                                                      <div className="borrarBtn">
                                                                                        <button className="borrarBtnGuardado"value={i} onClick={this.handleDeleteGuardado}></button>
                                                                                      </div>
                                                                                    </div>
                                                                          )
                                                                })}
                                          
                                                            </div>
                                                              <div className="opcionesGuardarLista">
                                                                  <div className="guardarBtnGuardado">
                                                                    <button className="guardarBtnGuardado">
                                                                  Guardado
                                                                    </button>
                                                                    
                                                                </div>
                                                                
                                                              </div>
                                                    </div>
                                                  </div>
                                              )
                                            }else{
                                              return(
                                                <div className="listaActivaCompartida">
                                                  Comprado
                                                
                                                  <input type="checkbox" id="compradoCheck" checked={i} 
                                                  onChange={this.changeState}></input>
                                                    <div className="compartida">
                                                      <div className="compartidaTitle">Compartida</div>
                                                      <div className="compartidaUsers">
                                                        {this.state.usersAliasCompartidos.map(i=>{
                                                          return(
                                                            <div>{i}</div>
                                                          )
                                                          
                                                        })}
                                                      </div>

                                                    </div>
                                                  <div className="listaCompraGuardada" >
                                          
                                                    <div className="listaCompraTitle">
                                                      <input type="text"name="listaCompraTitle" key={this.state.miListaCompraId}id="listaCompraTitle" defaultValue={this.state.listaCompraTitle[0]} placeholder={this.state.listaCompraTitle[0]}onClick={this.handleListaTitle}
                                                                        autocomplete="off" onKeyDown={(event) => this.teclaEnter(event, this.handleListaTitle)}  />
                                                                  
                                                            
                                                    </div>
                                                
                                                    <div className="listaCompraProducts">
                                                      {productSelected.map(i=>{
                                                        return(
                                                          <div className="productSelected">
                                                        <div className="productSelectedName">
                                                          {i} 
                                                        </div>
                                                      <div className="borrarBtn">
                                                        <button className="borrarBtnGuardado"value={i} onClick={this.handleDeleteGuardado}></button>
                                                      </div>
                                                      </div>
                                                        )
                                                      })}
                                                
                                                
                                                  
                                              
                                            
                                            
                                        
                                      
                                        
                                                      
                                                    
                                              
                                                
                                                
                                                    </div>
                                                  <div className="opcionesGuardarLista">
                                                    <div className="guardarBtnGuardado">
                                                        <button className="guardarBtnGuardado">
                                                      Guardado
                                                        </button>
                                                        
                                                    </div>
                                        
                                                  </div>
                                                  </div>
                                                </div>
                                              )
                                            }
                                      
                                      })}
                              </div>    
                          </div>
            }
            if(productSelected.length>0&&this.state.listaActivaGuardada===false){
                      
              listaActiva=
                      <div>
                        <div className="columnaListaActiva">
                          <div className="columnaTitle"> Lista de la compra activa</div>
                      
                        
                            {productSelected.map(i=>{
                              if(productSelected.length>0&&productSelected.indexOf(i)===0){
                                return(
                                  <div>
                                              Comprado
                                              <input type="checkbox" id="compradoCheck" checked={this.state.comprado[0]} onChange={this.changeState}></input>
                                    <div className="listaCompra">
                                          
                                      <div className="listaCompraTitle">
                                            
                                          <input type="text"name="listaCompraTitle" id="listaCompraTitle" key={this.state.miListaCompraId}defaultValue={this.state.listaCompraTitle[0]} placeholder={this.state.listaCompraTitle[0]}onClick={this.handleListaTitle}
                                                                   autocomplete="off" onKeyDown={(event) => this.teclaEnter(event, this.handleListaTitle)}  />
                                      </div>
                                          
                                      <div className="listaCompraProducts">
                                          {productSelected.map(i=>{
                                            return(
                                              <div className="productSelected">
                                                <div className="productSelectedName">
                                                  {i} 
                                                </div>
                                                <div className="borrarBtn">
                                                  <button className="borrarBtn"value={i} onClick={this.handleDelete}></button>
                                                </div>
                                              </div>
                                            )
                                          })}
                                          
                                      </div>
                                      <div className="opcionesGuardarLista">
                                            <div className="borrarListaButton">

                                          
                                              <button className="BorrarLista"onClick={this.handleBorrarLista}>Borrar Lista</button>
                                            </div>
                                        
                                            <div className="guardarBtnConNombre">
                                                <button className="guardarBtnConNombre" onClick={this.handleBtnGuardarConNombre}>
                                                    Guardar
                                                </button>
                                            </div>
                                        </div>
                                      </div>
                                    </div>
                                    )
                              }
                            })}
                        
                          </div>
                      </div>

                  }    
          
            

        if(this.state.letterOnHover===true&&this.state.palabrasOnMouseOver.length>0){
            content = 
              <div className="productosPorLetra" onMouseLeave={this.handleOnMouseLeave}>
                {this.state.palabrasOnMouseOver.map(i=>{
                  return(
                    <button key={i} className="palabra" value={i} onClick={this.handleOnClick}>
                      {i}
                    </button>
                  )
                })}
              </div>
        }

            if(this.state.palabrasPorCategoriaClick===true){
              content=
                <div className="productosPorCategory"id={`palabrasCat${this.state.categoryOnClick.replaceAll(" ","")}`} >
                          <div className="categoryTitle"id={`titleCat${this.state.categoryOnClick.replaceAll(" ","")}`}>

                            
                                  <div className="categoryName">
                                    {this.state.categoryOnClick}
                                  </div>
                                  <div className="exit">
                                    <button className="exitBtn"value="exit"onClick={this.handleOnClickExit}>
                                
                                    </button>
                              
                                  </div>
                          </div>
                          <div className="categoryPalabras">
                            {this.state.palabrasPorCategoria.map(i=>{
                            
                                    return(
                                  
                                      <button className="palabra" value={i} onClick={this.handleOnClick}>{i}</button>
                                    )
                            })}
                          </div>
                </div>             
                          
            }
            if(this.state.notificacionesLista!=""){
                            notificacionesButton=""
            }
            if(this.state.palabrasPorCategoriaClick===false&&this.state.palabrasOnMouseOver.length===0&&this.state.productSelected.length>0){
              content=
                      
                <div className="contentWhithList">
                        
                                  {listasInactivasContent}
                      
                        <div className="columnaCentral">
                          
                            <div className="buscadorProductos">
                                    <input type="text" name="buscadorProductos" list="Products" onClick={this.handleOnClick} 
                              onKeyDown={(event) => this.teclaEnter(event, this.handleOnClick)}  
                              placeholder={this.state.placeholderBuscador} />
                                    <datalist key='Products' id="Products" className="dataList">
                                        
                                  
                                  { this.state.options.map(i=>{
                                    
                                  
                                      return (
                                  
                                  
                                      <option key={this.state.options.indexOf(i)} value={i}>{i}</option>
                                  
                                      )})}
                                      
                                      
                                        </datalist>
                            </div>
                                  
                                  
                                  
                            <div className="productosFrecuentes">
                                        
                                        {this.state.productosFrecuentes.map(i=>{
                                      if(i.name!=undefined){
                                        return(
                                          <button className="productoFrecuente" value={i.name} onClick={this.handleOnClick}>
                                          {i.name}
                                          </button>
                                          
                                          )
                                    }
                                    
                                    })}
                            </div>
                            <div className="categories">
                                    
                              {this.state.opcionesPorCategoria.sort((a,b)=>a[0].category.localeCompare(b[0].category)).map(cat=>{
                              
                                  
                                    if(cat[0]!=undefined&&cat[0].category==="cuidado_personal"){

                                      return(
                                        <div className="category" id={cat[0].category} onClick={this.handleOnClickCategory} >
                                        <div className="categoryName" >
                                        cuidado personal
                                        </div>
                                        
                                      
                                        </div>
                                      )
                                  }
                                  if(cat[0]!=undefined&&cat[0].category!="cuidado_personal"){
                                
                                        let catId=(cat[0].category).replaceAll(" ","")
                                      
                                          return(
                                            <div className="category" id={catId}onClick={this.handleOnClickCategory} >
                                            <div className="categoryName" >
                                            {cat[0].category}
                                            </div>
                                            
                                          
                                          </div>
                                          )
                                  }
                                  

                                  
                                  
                              })}
                                
                                
                            </div>
                                
                          
                        </div>
                        <div className="listaActiva">
                                  {listaActiva}
                        </div>
                </div>

                      
            }
            if(listasInactivasContent!=""&&productSelected.length===0&&this.state.palabrasPorCategoriaClick===false&&this.state.palabrasOnMouseOver.length===0){
                                      content=
                                              <div className="contentWhithListasGuardadas">
                        
                                      {listasInactivasContent}
                      
                        <div className="columnaCentral">
                          
                                    <div className="buscadorProductos">
                                    <input type="text"name="buscadorProductos" list="Products" onClick={this.handleOnClick} 
                              onKeyDown={(event) => this.teclaEnter(event, this.handleOnClick)}  
                              placeholder={this.state.placeholderBuscador} />
                                    
                                    <datalist key='Products' id="Products" className="dataList">
                                  
                                  
                                  { this.state.options.map(i=>{
                                    
                                  
                                      return (
                                  
                                  
                                  <option key={this.state.options.indexOf(i)} value={i}>{i}</option>
                                  
                                      )})}
                                      
                                      
                                  </datalist>
                                      </div>
                                  
                                  
                                  
                                  <div className="productosFrecuentes">
                                  
                                  {this.state.productosFrecuentes.map(i=>{
                                if(i.name!=undefined){
                                  return(
                                    <button className="productoFrecuente" value={i.name} onClick={this.handleOnClick}>
                                    {i.name}
                                    </button>
                                    
                                    )
                                }
                                    
                                    })}
                                  </div>
                                  <div className="categories">
                                  
                                  
                                        
                                { 
                                  this.state.opcionesPorCategoria.sort((a,b)=>a[0].category.localeCompare(b[0].category)).map(cat=>{
                              
                                  
                                    if(cat[0]!=undefined&&cat[0].category==="cuidado_personal"){

                    return(
                                    <div className="category" id={cat[0].category} onClick={this.handleOnClickCategory} >
                                    <div className="categoryName" >
                                    cuidado personal
                                    </div>
                                    
                                  
                                  </div>
                    )
                    }
                                  if(cat[0]!=undefined&&cat[0].category!="cuidado_personal"){
                                
                                let catId=(cat[0].category).replaceAll(" ","")
                              
                                  return(
                                    <div className="category" id={catId}onClick={this.handleOnClickCategory} >
                                    <div className="categoryName" >
                                    {cat[0].category}
                                    </div>
                                    
                                  
                                  </div>
                                  )
                                  }
                                  

                                  
                                  
                                  })
                                  
                                  }
                                
                                
                                  </div>
                                  
                          
                        </div>
                    <div className="listaActiva">
                      {listaActiva}
                    </div>

                      </div>
                      
            }
            if(listasInactivasContent!=""&&productSelected.length>0&&this.state.palabrasPorCategoriaClick===false&&this.state.palabrasOnMouseOver.length===0){
                      content=
                      <div className="contentWhithListasYActiva">
                        
                    {listasInactivasContent}
                      
                        <div className="columnaCentral">
                          
                                    <div className="buscadorProductos">
                                     <input type="text"name="buscadorProductos" list="Products" onClick={this.handleOnClick} 
                              onKeyDown={(event) => this.teclaEnter(event, this.handleOnClick)}  
                              placeholder={this.state.placeholderBuscador} />
                                    
                                    <datalist key='Products' id="Products" className="dataList">
                                  
                                  
                                  { this.state.options.map(i=>{
                                    
                                  
                                      return (
                                  
                                  
                                  <option key={this.state.options.indexOf(i)} value={i}>{i}</option>
                                  
                                      )})}
                                      
                                      
                                  </datalist>
                                      </div>
                                  
                                  
                                  
                                  <div className="productosFrecuentes">
                                  
                                  {this.state.productosFrecuentes.map(i=>{
                                if(i.name!=undefined){
                                  return(
                                    <button className="productoFrecuente" value={i.name} onClick={this.handleOnClick}>
                                    {i.name}
                                    </button>
                                    
                                    )
                                }
                                    
                                    })}
                                  </div>
                                  <div className="categories">
                                  
                                  
                                        
                                { 
                                  this.state.opcionesPorCategoria.sort((a,b)=>a[0].category.localeCompare(b[0].category)).map(cat=>{
                              
                                  
                                    if(cat[0]!=undefined&&cat[0].category==="cuidado_personal"){

                    return(
                                    <div className="category" id={cat[0].category} onClick={this.handleOnClickCategory} >
                                    <div className="categoryName" >
                                    cuidado personal
                                    </div>
                                    
                                  
                                  </div>
                                  )
                    }
                                  if(cat[0]!=undefined&&cat[0].category!="cuidado_personal"){
                                
                                let catId=(cat[0].category).replaceAll(" ","")
                              
                                  return(
                                    <div className="category" id={catId}onClick={this.handleOnClickCategory} >
                                    <div className="categoryName" >
                                    {cat[0].category}
                                    </div>
                                    
                                  
                                  </div>
                                  )
                                  }
                                  

                                  
                                  
                                  })
                                  
                                  }
                                
                                
                                  </div>
                              
                          
                        </div>
                    <div className="listaActiva">
                      {listaActiva}
                    </div>
                      </div>
            }
            if(listasInactivas.length===0&&productSelected.length>0&&this.state.palabrasPorCategoriaClick===false&&this.state.palabrasOnMouseOver.length===0){
                     content=
                                              <div className="contentWhithList">
                        
                                  
                      
                        <div className="columnaCentral">
                          
                                    <div className="buscadorProductos">
                                    <input type="text"name="buscadorProductos" list="Products" onClick={this.handleOnClick} 
                              onKeyDown={(event) => this.teclaEnter(event, this.handleOnClick)}  
                              placeholder={this.state.placeholderBuscador} onTouchStart={this.handleInputBuscador}/>
                                    
                                    <datalist key='Products' id="Products" className="dataList">
                                  
                                  
                                  { this.state.options.map(i=>{
                                    
                                  
                                      return (
                                  
                                  
                                  <option key={this.state.options.indexOf(i)} value={i}>{i}</option>
                                  
                                      )})}
                                      
                                      
                                  </datalist>
                                      </div>
                                  
                                  
                                  
                                  <div className="productosFrecuentes">
                                  
                                  {this.state.productosFrecuentes.map(i=>{
                                if(i.name!=undefined){
                                  return(
                                    <button className="productoFrecuente" value={i.name} onClick={this.handleOnClick}>
                                    {i.name}
                                    </button>
                                    
                                    )
                                }
                                    
                                    })}
                                  </div>
                                  <div className="categories">
                                  
                                  
                                        
                                { 
                                  this.state.opcionesPorCategoria.sort((a,b)=>a[0].category.localeCompare(b[0].category)).map(cat=>{
                              
                                  
                                    if(cat[0]!=undefined&&cat[0].category==="cuidado_personal"){

                    return(
                                    <div className="category" id={cat[0].category} onClick={this.handleOnClickCategory} >
                                    <div className="categoryName" >
                                    cuidado personal
                                    </div>
                                    
                                  
                                  </div>
                    )
                    }
                                  if(cat[0]!=undefined&&cat[0].category!="cuidado_personal"){
                                
                                let catId=(cat[0].category).replaceAll(" ","")
                              
                                  return(
                                    <div className="category" id={catId}onClick={this.handleOnClickCategory} >
                                    <div className="categoryName" >
                                    {cat[0].category}
                                    </div>
                                    
                                  
                                  </div>
                                  )
                                  }
                                  

                                  
                                  
                                  })
                                  
                                  }
                                
                                
                                  </div>
                                  
                          
                        </div>
                  
                      <div className="listaActiva">
                      {listaActiva}
                    </div>
                 

                      </div>
            }
            if (this.state.opcionesPorLetra.length > 0) {
              abc = (
                <div className="abecedario" ref={this.abecedarioRef}>
                  {this.state.opcionesPorLetra.map(i => {
                    return (
                      <div 
                        className={`letra ${this.state.letraActivaId === i.letra ? 'activa' : ''}`}
                        key={i.letra}
                        id={i.letra}
                        onMouseOver={this.handleOnMouseOver} 
                      
                        onClick={(e) => this.handleLetraClickMóvil(e, i)}>
                        {i.letra}

                        
                        
                      </div>
                    );
                  })}
                </div>
              );
            }
            if(this.state.isLoading===true){
              content= 
              <div className="Loading">
              <img src={carritoImg} class="carritoCompras"/>
                    </div>
            }
         if(this.state.appYaInstalada===false){
            instalarApp=
              <div className="InstalarAppWrapper">
            <div className="instalarApp">
                                      
            <p> className="mensajeInstalar">
            Puedes <span onClick={this.handleInstalarApp}>instalar</span> Eficompra en tu dispositivo desde el menú del navegador.
            </p>
                                        </div>   
            <div className="asistenteVoz">
            <p className="mensajeAsistenteVoz">
            El asistente de tu dispositivo (Google Gemini), puede abrir Eficompra sin necesidad de tocar la pantalla.
            Con el dispositivo encendido y Eficompra instalado, prueba a decir:
            "Hey Google, abre E-fi-com-pra"  
            Si todo es correcto, oirás el tono del micrófono escuchando desde tus listas de la compra.
            Ahora puedes pedirle que realice una acción.
            </p>
            </div>                                           
              </div>       

         }
            return(
                    
                            <div className="content-wrapper">
                                        {notificacionesLista}
                               
                                    <div className="options_bar">
                                  <div className="voiceButton">
          <button className="voiceButton" onClick={this.handleVoice}>Voice</button>
      </div>

                                          <div className="exitPrincipal">
                                                <button className="exitBtn"value="exit"
                                                onClick={() => { 
                                                  localStorage.removeItem("tokenSesion")
                                                  window.location.href = "/"; }}>
                                            
                                                </button>
                              
                                  </div>
</div>
                                
                                        <div className="title-wrapper">
                                        <div className="title">
                                            {this.state.pageTitle}
                                        </div>
                                  
                                              
                                        </div>
                                        {notificacionesButton}
                                        <div className="abcUser">
                                          
                                        
                                        <div className="user">
                                          <div className="alias">
                                    {localStorage.getItem("alias")}
                                          </div>
                                      </div>
                                    </div>
                                    
                                      {content}
                                      {abc}
                                
                            </div> 
                                
                        
            )

    }
}

                  
