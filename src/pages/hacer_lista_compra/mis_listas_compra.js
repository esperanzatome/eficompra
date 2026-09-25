import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { library, text } from "@fortawesome/fontawesome-svg-core";
import { faTrash, faSpinner, faTruckFieldUn } from "@fortawesome/free-solid-svg-icons";
import { toBeEnabled, toHaveAccessibleDescription, toHaveAccessibleErrorMessage } from "@testing-library/jest-dom/matchers";
import { io } from 'socket.io-client';

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

  
      
      
    }
this.socket= io("https://eficompraserver.onrender.com")
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
      //this.handleBtnGuardar=this.handleBtnGuardar.bind(this);
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
    event.preventDefault(); // Necesario para mostrar el mensaje en algunos navegadores
    event.returnValue = mensaje; // Este valor se mostrará en el cuadro de diálogo
    return mensaje; // Algunos navegadores requieren que se devuelva el mensaje
  }

getContent(){

let notificaciones=[]
let listasInactivas=[]



axios.post("https://eficompraserver.onrender.com/misListasCompraGuardadas",{
    
      userId:localStorage.getItem("id")
    

    })
    .then(response=>{

  
         if(response.data.length>0){


     response.data.map(lista=>{

       listasInactivas.push({
     comprado:lista.comprado,
               listaName:lista.listaName,
              listaId:lista.listasdelacompra,
              userAlias:lista.alias
   })
 
 
   
 })

listasInactivas.map(i=>{
  axios.post("https://eficompraserver.onrender.com/recuperarListaCompra",{
          listaId:i.listaId
        })
         .then(res=>{
       
    if(res.data.length>0){
      
 let products=[]
         res.data.map(i=>{
         
            products.push(i.product)
          
          })
             i.products=products
          i.fecha=res.data[0].fecha
      
          axios.post("https://eficompraserver.onrender.com/comprobarListaCompartida",{
            listasdelacompra:i.listaId,
            userId: localStorage.getItem("id")
          })
.then(response=>{

  let usersAliasCompartidos=[]
  let usersIdCompartidos=[]
  if(response.data.length===0){
    i.compartida=false
    i.usersAliasCompartidos=[]
    i.usersIdCompartidos=[]
  }else{
    i.compartida=true
    response.data.map(i=>{
usersAliasCompartidos.push(i.alias)
usersIdCompartidos.push(i.userId)
    })
    i.usersAliasCompartidos=usersAliasCompartidos
    i.usersIdCompartidos=usersIdCompartidos
 
  }

listasInactivas=listasInactivas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))

this.setState({
  
    listasInactivas:listasInactivas,
    listasInactivasContent:
 
    
     <div className="listasInactivasWrapper">
                    <div className="columnaTitle"> Listas guardadas</div>
              <div className="listasGuardadas">
          
              
          
           {listasInactivas.map(i=>{
   
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
       if(i.compartida===true&&i.products.length>0){
     
return(
   <div>
               Comprado
            
               <input type="checkbox" id="compradoCheckGuardado"checked={i.comprado} disabled></input>
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
       }else if(i.compartida===false&&i.products.length>0){
      
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
       }
              
   

               
  })}
  </div>
  
  </div>

})
 
})
    }else{

     axios.post(`https://eficompraserver.onrender.com/borrarListaCompra`,{
          listasdelacompra:i.listaId,
          userId: localStorage.getItem("id")
         })
     
      .then(response=>{
 
        if(response.data.length>0){
            let usuarioListaId= response.data[0].usuarioListaId

       
axios.delete(`https://eficompraserver.onrender.com/borrarListaCompra?usuarioListaId= ${usuarioListaId}`)
      .then(response=>{
     console.log("lista inactiva borrada")
    listasInactivas.splice(listasInactivas.indexOf(i),1)
    this.setState({
  
    listasInactivas:listasInactivas,
    listasInactivasContent:
 
    
     <div className="listasInactivasWrapper">
                    <div className="columnaTitle"> Listas guardadas</div>
              <div className="listasGuardadas">
          
              
          
           {listasInactivas.map(i=>{
   
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
       if(i.compartida===true&&i.products.length>0){
     
return(
   <div>
               Comprado
            
               <input type="checkbox" id="compradoCheckGuardado"checked={i.comprado} disabled></input>
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
       }else if(i.compartida===false&&i.products.length>0){
      
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
       }
              
   

               
  })}
  </div>
  
  </div>

})
      })
         
      
    
    }
       
        
       

    })  
}

})

})
   axios.post("https://eficompraserver.onrender.com/recuperarNotificaciones",{
      receptor:localStorage.getItem("id")
    })
    .then(response=>{

      if(response.data.length>0){
      let listaName=""

    response.data.map(i=>{
    
      let notificacionAccion=i.accion.split("/")
   
   
      listasInactivas.map(lista=>{

        if(`${lista.listaId}`===notificacionAccion[3]){

         listaName=lista.listaName
      //  notificaciones.push(i)
        
          }
        })
          notificaciones.push(i)
       console.log(notificaciones)
        if(notificaciones.length>0){
        
   
     
         notificaciones.map(not=>{
     not.listaName=listaName

    /*
     if((Object.entries(not)[0])===(['idnotificaciones',i.idnotificaciones])){
   notificaciones.push(i)
   }
   */
   })
   
     
   this.setState({
  notificacionesButton:
  <div className="notificaciones">
<button className="notificaciones" onClick={this.handleNotificaciones}>Notificaciones</button>
        </div>,
        notificaciones:notificaciones
 })
        }
        
         

     

    })
  

 
      

        
      }})
}else{
 axios.post("https://eficompraserver.onrender.com/recuperarNotificaciones",{
      receptor:localStorage.getItem("id")
    })
    .then(response=>{

      if(response.data.length>0){
      let listaName=""

    response.data.map(i=>{
     
      let notificacionAccion=i.accion.split("/")
      
   listaName=notificacionAccion[4]
   notificaciones.push(i)
  if(notificaciones.length>0){
         notificaciones.map(not=>{
     not.listaName=listaName
    
     if((Object.entries(not)[0])===(['idnotificaciones',i.idnotificaciones])){
   notificaciones.push(i)
   }
   })
   this.setState({
  notificacionesButton:
  <div className="notificaciones">
<button className="notificaciones" onClick={this.handleNotificaciones}>Notificaciones</button>
        </div>,
        notificaciones:notificaciones
 })
        }
     

     

    })
  

 
      

        
      }})
}

})
 
    
           
           
    
  
}


  handleOnMouseOver(event){
   
    
      this.state.opcionesPorLetra.map(i=>{
        if(event!=undefined&&event.target.id===i.letra){
        this.state.palabrasOnMouseOver.push(i.palabras)
          return(
          this.setState({
            letterOnHover:true,
            palabrasOnMouseOver:this.state.palabrasOnMouseOver
          })
        )
        }
      })

      }
 
      handleOnMouseLeave(event){

  
    
      this.setState({
         letterOnHover:false,
         palabrasOnMouseOver:[]
     
   
    
    
      })
    
    }
    handleOnClick(event){
let productSelected=event.target.value
//event.target.value=''
  this.setState({
    palabrasPorCategoriaClick:false,
    categoryOnClick:""
  })
  console.log(productSelected)
 if(event!=undefined&&this.state.productSelected.includes(productSelected)===false&&productSelected!=''){


    this.state.productSelected.push(productSelected)
   
if(this.state.listaActivaGuardada===true){

   axios.post("https://eficompraserver.onrender.com/miListaCompra",{
          
            listaId:this.state.miListaCompraId,
            product:productSelected
            
      })
     
          .then(response=>{
        
            console.log("productosGuardados")
            if(this.state.compartida===true){
               let alias= localStorage.getItem("alias")
            
this.state.usersIdCompartidos.map(i=>{
 
 axios.post("https://eficompraserver.onrender.com/notificaciones",{
         
            emisor:localStorage.getItem("id"),
            receptor:i,
            accion: `${alias}/+/${productSelected}/${this.state.miListaCompraId}/${this.state.listaCompraTitle[0]}`
            })
            .then(response=>{
              console.log("usuario compartido informado de +")
            })
})
            }

        

  }

)
 
}
  

if(this.state.productSelected.length>0){
    
    
  
if(this.state.listaActivaGuardada===true){
  return(
    this.setState({
    productSelected:this.state.productSelected,
     palabrasOnMouseOver:[],
    listaActiva:
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
      
    <input type='text'name="listaCompraTitle" autocomplete="off"id="listaCompraTitle"placeholder={this.state.listaCompraTitle[0]}onChange={this.handleListaTitle}
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
   </div>)
   }else{
    return(
               <div className="listaActivaCompartida">
               Comprado
            
               <input type="checkbox" id="compradoCheck" checked={i} onChange={this.changeState}></input>
                <div className="compartida">
            <div className="compartidaTitle">Compartida</div>
            <div className="compartidaUsers">
            {this.state.usersAliasCompartidos.map(i=>{
              return(
              <div>{i}</div>
              )
              
            }
         
            )}
              </div>

            </div>
              <div className="listaCompraGuardada" >
       
                <div className="listaCompraTitle">
           <input type='text'name="listaCompraTitle"autocomplete="off" id="listaCompraTitle"placeholder={this.state.listaCompraTitle[0]}onChange={this.handleListaTitle}
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
              </div>)
   }
 
    
    })}
    
  </div>
      </div>
  })
 
)
}else{
  return(
    this.setState({
    productSelected:this.state.productSelected,
     palabrasOnMouseOver:[],
     listaActiva:
  <div>
    <div className="columnaListaActiva">
      <div className="columnaTitle"> Lista de la compra activa</div>
   
    
    {this.state.productSelected.map(i=>{
    if(this.state.productSelected.length>0&&this.state.productSelected.indexOf(i)===0){
      return(
        <div>
        Comprado
        <input type="checkbox" id="compradoCheck" checked={this.state.comprado[0]} onChange={this.changeState}></input>
    <div className="listaCompra">
    
    <div className="listaCompraTitle">
      
    <input type='text'name="listaCompraTitle" autocomplete="off" id="listaCompraTitle"placeholder={this.state.listaCompraTitle[0]}onChange={this.handleListaTitle}
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
     {/*
    <div className="guardarBtn">
         <button className="guardarBtn" onClick={this.handleBtnGuardar}>
       Guardar
         </button>
        
    </div>
    */}
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
  
})
  )
  

} 

}

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
      palabrasPorCategoriaClick:false
     
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
        
        listaActiva:
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
      
    <input type='text'name="listaCompraTitle"autocomplete="off" id="listaCompraTitle"placeholder={listaName[0]}onChange={this.handleListaTitle}
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
   </div>)
   }else{
    return(
               <div className="listaActivaCompartida">
               Comprado
            
               <input type="checkbox" id="compradoCheck" checked={i} onChange={this.changeState}></input>
                <div className="compartida">
            <div className="compartidaTitle">Compartida</div>
            <div className="compartidaUsers">
            {this.state.usersAliasCompartidos.map(i=>{
              return(
 <div>{i}</div>
              )
            }
         
            )}
           
   </div>
            </div>
              <div className="listaCompraGuardada" >
            
                <div className="listaCompraTitle">
           <input type='text'name="listaCompraTitle" autocomplete="off"id="listaCompraTitle"placeholder={listaName[0]}onChange={this.handleListaTitle}
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
              </div>)
   }
 
    
    })}
    
  </div>
      </div>
      
             })    
            )
        })
        
      
     }
      
      else{

          //this.state.listaCompraTitle.push(event.target.value)
          //this.state.listaCompraTitle.shift()
          return(
        this.setState({
        listaCompraTitle:listaName,
        
        listaActiva:
         <div>
    <div className="columnaListaActiva">
      <div className="columnaTitle"> Lista de la compra activa</div>
    
    
    {this.state.productSelected.map(i=>{
    if(this.state.productSelected.length>0&&this.state.productSelected.indexOf(i)===0){
      return(
        <div>
        Comprado
        <input type="checkbox" id="compradoCheck" checked={this.state.comprado[0]} onChange={this.changeState}></input>
    <div className="listaCompra">
    
    <div className="listaCompraTitle">
      
    <input type='text'name="listaCompraTitle" autocomplete="off"id="listaCompraTitle"value={listaName[0]}onChange={this.handleListaTitle}
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
  {/*
    <div className="guardarBtn">
         <button className="guardarBtn" onClick={this.handleBtnGuardar}>
       Guardar
         </button>
        
    </div>
    */}
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
  
        })
          )
      }
  
    }  

  
  
     changeState(event){
 
let comprado=event.target.checked

  
if(event.target.checked===true||event.target.checked===1){
  comprado=[1]
 
 


}else {comprado=[0]}

 if(this.state.miListaCompraId!=""){

axios.patch("https://eficompraserver.onrender.com/misListasDeLaCompra",{
      comprado:comprado[0],
      listasdelacompra:this.state.miListaCompraId
    })
  
      .then(response=>{
   
      console.log("Estado de la lista actualizado")

    this.state.usersIdCompartidos.map(i=>{
 axios.post("https://eficompraserver.onrender.com/notificaciones",{
         
            emisor:localStorage.getItem("id"),
            receptor:i,
            accion: `${localStorage.getItem("alias")}/change/${comprado[0]}/${this.state.miListaCompraId}/${this.state.listaCompraTitle[0]}`
            })
            .then(response=>{
              console.log("usuario compartido informado de change")
            })
          })
            })


if(this.state.productSelected.length>0){
 this.setState({
  comprado:[event.target.checked],
listaActiva:
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
        <input type="checkbox" id="compradoCheck" checked={event.target.checked} onChange={this.changeState}></input>
    <div className="listaCompraGuardada">
    
    <div className="listaCompraTitle">
     
        
<input type='text'name="listaCompraTitle"autocomplete="off" id="listaCompraTitleChanged"placeholder={this.state.listaCompraTitle[0]}onChange={this.handleListaTitle}
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
   </div>)
   }else{
    return(
                <div className="listaActivaCompartida">
               Comprado
            
               <input type="checkbox" id="compradoCheck" checked={event.target.checked} onChange={this.changeState}></input>
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
           <input type='text'name="listaCompraTitle" autocomplete="off"id="listaCompraTitle"placeholder={this.state.listaCompraTitle[0]}onChange={this.handleListaTitle}
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
              </div>)
   }
 
    
    })}
    
  </div>
      </div>
})
}else{
  this.setState({
  comprado:[event.target.checked],
  compradoChange:true,
listaActiva:""})
  }

    }else{
      if(this.state.productSelected.length>0){
      
        this.setState({
  comprado:[event.target.checked],
  listaActiva:
  <div>
    <div className="columnaListaActiva">
      <div className="columnaTitle"> Lista de la compra activa</div>
   
    
   
        <div>
        Comprado
        <input type="checkbox" id="compradoCheck" checked={comprado[0]} onChange={this.changeState}></input>
    <div className="listaCompra">
    
    <div className="listaCompraTitle">
      
    <input type='text'name="listaCompraTitle"autocomplete="off" id="listaCompraTitle"placeholder={this.state.listaCompraTitle[0]}onChange={this.handleListaTitle}
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
     {/*
    <div className="guardarBtn">
         <button className="guardarBtn" onClick={this.handleBtnGuardar}>
       Guardar
         </button>
        
    </div>
    */}
    <div className="guardarBtnConNombre">
         <button className="guardarBtnConNombre" onClick={this.handleBtnGuardarConNombre}>
       Guardar
         </button>
           </div>
    </div>
   </div>
   </div>
    
    
  </div>
  </div>
 
      })
       
}
}

  


 
 
}
  handleDelete(event){ 
this.setState({
  indxProductoABorrar:[]
})
  
  this.state.indxProductoABorrar.unshift(this.state.productSelected.indexOf(event.target.value))
      this.state.productSelected.splice(this.state.indxProductoABorrar[0],1)
      if(this.state.productSelected.length>0){
    
      this.setState({
    productSelected:this.state.productSelected,
  indxProductoABorrar:this.state.indxProductoABorrar,
     listaActiva:
  <div>
    <div className="columnaListaActiva">
      <div className="columnaTitle"> Lista de la compra activa</div>
    
    
    {this.state.productSelected.map(i=>{
    if(this.state.productSelected.length>0&&this.state.productSelected.indexOf(i)===0){
      return(
        <div>
        Comprado
        <input type="checkbox" id="compradoCheck" checked={this.state.comprado[0]} onChange={this.changeState}></input>
    <div className="listaCompra">
    
    <div className="listaCompraTitle">
      
    <input type='text'name="listaCompraTitle" autocomplete="off"id="listaCompraTitle"placeholder={this.state.listaCompraTitle[0]}onChange={this.handleListaTitle}
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
  {/*
    <div className="guardarBtn">
         <button className="guardarBtn" onClick={this.handleBtnGuardar}>
       Guardar
         </button>
        
    </div>
    */}
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
  
})
  

}else{
  this.setState({
     productSelected:this.state.productSelected,
     listaActiva:""
  })
}
  

  }
  /*
     handleBtnGuardar(event){
  
 if(this.state.comprado[0]===false){
this.setState({
  
      listaActiva:
      <div>
        <div className="columnaListaActiva">
      <div className="columnaTitle"> Lista de la compra activa</div>
     
    
    {this.state.productSelected.map(i=>{
    if(this.state.productSelected.length>0&&this.state.productSelected.indexOf(i)===0){
      return(
        <div>
        Comprado
        <input type="checkbox" id="compradoCheck" checked={this.state.comprado[0]} onChange={this.changeState}></input>
    <div className="listaCompra">
    
    <div className="listaCompraTitle">
      
    <input type='text'name="listaCompraTitle" autocomplete="off"id="listaCompraTitle"placeholder={this.state.listaCompraTitle[0]}onChange={this.handleListaTitle}
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
      
   
 })
}else{
  this.setState({
     listaActiva:
  <div>
    <div className="columnaListaActiva">
      <div className="columnaTitle"> Lista de la compra activa</div>
   
    
   
        <div>
        Comprado
        <input type="checkbox" id="compradoCheck" checked={this.state.comprado[0]} onChange={this.changeState}></input>
    <div className="listaCompra">
    
    <div className="listaCompraTitle">
      
    <input type='text'name="listaCompraTitle" autocomplete="off"id="listaCompraTitle"placeholder={this.state.listaCompraTitle[0]}onChange={this.handleListaTitle}
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
    
    
  </div>
  </div>
  })
}

 
  document.getElementById("listaCompraTitle")?.focus()||
    document.getElementById("listaCompraTitleChanged")?.focus()
    console.log(document.activeElement.id)
}
*/
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
      
    <input type='text'name="listaCompraTitle" autocomplete="off"id="listaCompraTitle"placeholder={this.state.listaCompraTitle[0]}onChange={this.handleListaTitle}
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

let product= event.target.value
    const indxProductoABorrar=[]
    let listaProducts=0
     indxProductoABorrar.push(this.state.productSelected.indexOf(event.target.value))
     if(this.state.productSelected.length===1){

      if(this.state.usersIdCompartidos.length>0){
        if(window.confirm("Si eliminas todos los productos de la lista, se eliminará la lista para ti y para todos los usuarios con quienes la compartas. ¿Estás seguro de que quieres continuar?")===true){
          this.state.productSelected.splice(indxProductoABorrar[0],1)
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
    usersIdCompartidos:[]

  })    
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
      this.state.productSelected.splice(indxProductoABorrar[0],1)
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
      productSelected:this.state.productSelected,
      listaActiva:"",
      miListaCompraId:"",
       listaActivaGuardada:false,
    listaCompraTitle:["Mi lista de la compra"],
    comprado:[false]

  })    
      })
    )
        }
      
      
      })
     }
     
    }else{
       this.state.productSelected.splice(indxProductoABorrar[0],1)
 
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
       productSelected:this.state.productSelected,
      listaActiva:
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
        <input type="checkbox" id="compradoCheck" checked={comprado} onChange={this.changeState}></input>
    <div className="listaCompraGuardada" >
    
    <div className="listaCompraTitle">
      
    <input type='text'name="listaCompraTitle" autocomplete="off"id="listaCompraTitle"placeholder={this.state.listaCompraTitle[0]}onChange={this.handleListaTitle}
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
   </div>)
   }else{
    return(
              <div className="listaActivaCompartida">
               Comprado
            
               <input type="checkbox" id="compradoCheck" checked={comprado} onChange={this.changeState}></input>
                <div className="compartida">
            <div className="compartidaTitle">Compartida</div>
            <div className="compartidaUsers">
            {this.state.usersAliasCompartidos.map(i=>{
              return(
 <div >{i}</div>
              )
            })}
           </div>

            </div>
             <div className="listaCompraGuardada" >
            
                <div className="listaCompraTitle">
           <input type='text'name="listaCompraTitle"autocomplete="off" id="listaCompraTitle"placeholder={this.state.listaCompraTitle[0]}onChange={this.handleListaTitle}
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
              </div>)
   }
 
    
    })}
    
  </div>
      </div>

  })
   
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
  
  
  
  handleCrearListaNueva(event){

this.setState({
  miListaCompraId:"",
    productSelected:[],
    listaActivaGuardada:false,
    listaCompraTitle:["Mi lista de la compra"],
    comprado:[false],
    listasInactivas:[],
    listaActiva:
     <div>
        <div className="columnaListaActiva">
      <div className="columnaTitle"> Lista de la compra activa</div>
     <div className="optionsBarList">
 
      <button className="BorrarLista"onClick={this.handleBorrarLista}>Borrar Lista</button>
     </div>
    
   
    
        <div>
        Comprado
        <input type="checkbox" id="compradoCheck" checked={false} onChange={this.changeState}></input>
    <div className="listaCompra">
    
    <div className="listaCompraTitle">
      
    <input type='text'name="listaCompraTitle" autocomplete="off"id="listaCompraTitle"placeholder={"Mi lista de la compra"}onChange={this.handleListaTitle}
       onKeyUp={this.teclaEnter}/>
      </div>
    
    <div className="listaCompraProducts">
      
    </div>
  
   </div>
   </div>
  
    
  </div>
      </div>
})
this.getContent() 
}
  
 handleAbrirLista(event){

  if(this.state.listaActiva===""||this.state.productSelected.length===0){
     
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
          listaActivaGuardada: true
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
    compartida=false}

    this.setState({
        comprado:[comprado],
listaCompraTitle:this.state.listaCompraTitle,
productSelected:this.state.productSelected,
listasInactivas:listasInactivas,
listaActivaGuardada:true,
usersAliasCompartidos:usersAliasCompartidos,
usersIdCompartidos:usersIdCompartidos,
compartida:compartida,

 listaActiva:
  <div>
        <div className="columnaListaActivaGuardada">
      <div className="columnaTitle"> Lista de la compra activa</div>
     <div className="optionsBarList">
  <button className="CrearLista"onClick={this.handleCrearListaNueva}>Nueva Lista</button>
      <button className="CompartirLista"onClick={this.handleCompartirLista}value={listaId}>Compartir Lista</button>
      <button className="BorrarLista"onClick={this.handleBorrarLista}>Borrar Lista</button>
     </div>
    
    {this.state.comprado.map(i=>{
   
     
   if(usersAliasCompartidos.length===0){
 
    return(
              <div className="listaActivaGuardada">
        Comprado
        <input type="checkbox" id="compradoCheck" checked={comprado} onChange={this.changeState}></input>
    <div className="listaCompraGuardada" >
    
    <div className="listaCompraTitle">
      
    <input type='text'name="listaCompraTitle"autocomplete="off" id="listaCompraTitle"placeholder={this.state.listaCompraTitle[0]}onChange={this.handleListaTitle}
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
   }else{
    return(
               <div className="listaActivaCompartida">
               Comprado
            
               <input type="checkbox" id="compradoCheck" checked={comprado} onChange={this.changeState}></input>
                <div className="compartida">
            <div className="compartidaTitle">Compartida</div>
<div className="compartidaUsers">
            {usersAliasCompartidos.map(i=>{
              return(
 <div>{i}</div>
              )
            })}
           </div>

            </div>
              <div className="listaCompraGuardada" >
            
                <div className="listaCompraTitle">
           <input type='text'name="listaCompraTitle"autocomplete="off" id="listaCompraTitle"placeholder={this.state.listaCompraTitle[0]}onChange={this.handleListaTitle}
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
              </div>)
   }
 
    
    })}
    
  </div>
      </div> 
    })
    
    if(listasInactivas.length===0){
     this.setState({
      listasInactivasContent:""
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
              </div>)
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
              </div>)
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

console.log(event.target.value, listasInactivas)
 listasInactivas[indx].products.map(i=>{
          productSelected.push(i)
        return(productSelected)
        })
        let listaId= listasInactivas[indx].listaId
    
     
    
        this.setState({
        
          miListaCompraId: listaId,
          listaActivaGuardada: true
        })
      
   
listaName=[this.state.listasInactivas[indx].listaName]
  this.state.comprado.shift()
  this.state.comprado.push(this.state.listasInactivas[indx].comprado)
 this.state.comprado.map(i=>{
    if(i===0||i===false){
    
      comprado=false
     }else(
      
      comprado=true
     )     
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
 listaActiva:
  <div>
        <div className="columnaListaActivaGuardada">
      <div className="columnaTitle"> Lista de la compra activa</div>
     <div className="optionsBarList">
  <button className="CrearLista"onClick={this.handleCrearListaNueva}>Nueva Lista</button>
      <button className="CompartirLista"onClick={this.handleCompartirLista}value={listaId}>Compartir Lista</button>
      <button className="BorrarLista"onClick={this.handleBorrarLista}>Borrar Lista</button>
     </div>
     
    {this.state.comprado.map(i=>{
   

   if(usersAliasCompartidos.length===0){
 
    return(
              <div className="listaActivaGuardada">
        Comprado
        <input type="checkbox" id="compradoCheck" checked={comprado} onChange={this.changeState}></input>
     <div className="listaCompraGuardada" >
    
    <div className="listaCompraTitle">
      
    <input type='text'name="listaCompraTitle" autocomplete="off"id="listaCompraTitle"placeholder={this.state.listaCompraTitle[0]}onChange={this.handleListaTitle}
       onKeyUp={this.teclaEnter}/>
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
   </div>)
   }else{
    return(
                <div className="listaActivaCompartida">
               Comprado
            
               <input type="checkbox" id="compradoCheck" checked={comprado} onChange={this.changeState}></input>
                <div className="compartida">
            <div className="compartidaTitle">Compartida</div>
            <div className="compartidaUsers">
            {usersAliasCompartidos.map(i=>{
              return(
 <div>{i}</div>
              )
            })}
           </div>

            </div>
            <div className="listaCompraGuardada" >
            
                <div className="listaCompraTitle">
           <input type='text'name="listaCompraTitle" autocomplete="off"id="listaCompraTitle"placeholder={listaName[0]}onChange={this.handleListaTitle}
       onKeyUp={this.teclaEnter}/>
                
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
              </div>)
   }
 
    
    })}
    
    {/*
    {this.state.productSelected.map(i=>{
    if(this.state.productSelected.length>0&&this.state.productSelected.indexOf(i)===0){
      return(
        <div>
        Comprado
        <input type="checkbox" id="compradoCheck" checked={comprado} onChange={this.changeState}></input>
    <div className="listaCompra">
    
    <div className="listaCompraTitle">
      
    <input type='text'name="listaCompraTitle" id="listaCompraTitle"placeholder={this.state.listaCompraTitle[0]}onChange={this.handleListaTitle}
       onKeyUp={this.teclaEnter}/>
      </div>
    
    <div className="listaCompraProducts">
      {productSelected.map(i=>{
        return(
          <div className="productSelected">
            <div className="productSelectedName">
              {i} 
            </div>
          <div className="borrarBtn">
            <button className="borrarBtnGuardado"value={i} onClick={this.handleDeleteGuardado}>Borrar</button>
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
    */}
  </div>
      </div> 
    })
    if(listasInactivas.length===0){
     this.setState({
      listasInactivasContent:""
     })

    }else{
this.setState({
  
  listasInactivasContent: 
      <div className="listasInactivasWrapper">
                  <div className="columnaTitle"> Listas guardadas</div>
              <div className="listasGuardadas">
          
                
           { listasInactivas.map(i=>{
   
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
    if(i.comprado===0||i.comprado===false){
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
              </div>)
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
              </div>)
   }

               
  })}
  </div>
  
  </div>
})
    }
    
    }else{
      this.handleBtnGuardar()
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
     }else(
      
      comprado=true
     )     
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
 listaActiva:
   <div>
        <div className="columnaListaActivaGuardada">
      <div className="columnaTitle"> Lista de la compra activa</div>
     <div className="optionsBarList">
  <button className="CrearLista"onClick={this.handleCrearListaNueva}>Nueva Lista</button>
      <button className="CompartirLista"onClick={this.handleCompartirLista}value={listaId}>Compartir Lista</button>
      <button className="BorrarLista"onClick={this.handleBorrarLista}>Borrar Lista</button>
     </div>
    
    {this.state.comprado.map(i=>{
   
      
   if(usersAliasCompartidos.length===0){
 
    return(
              <div className="listaActivaGuardada">
        Comprado
        <input type="checkbox" id="compradoCheck" checked={comprado} onChange={this.changeState}></input>
    <div className="listaCompraGuardada" >
    
    <div className="listaCompraTitle">
      
    <input type='text'name="listaCompraTitle" autocomplete="off"id="listaCompraTitle"value={listaName}onChange={this.handleListaTitle}
       onKeyUp={this.teclaEnter}/>
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
   </div>)
   }else{
    return(
               <div className="listaActivaCompartida">
               Comprado
            
               <input type="checkbox" id="compradoCheck" checked={comprado} onChange={this.changeState}></input>
                <div className="compartida">
            <div className="compartidaTitle">Compartida</div>
            <div className="compartidaUsers">
            {usersAliasCompartidos.map(i=>{
              return(
 <div>{i}</div>
              )
            })}
           
</div>
            </div>
             <div className="listaCompraGuardada" >
            
                <div className="listaCompraTitle">
           <input type='text'name="listaCompraTitle" autocomplete="off"id="listaCompraTitle"placeholder={listaName[0]}onChange={this.handleListaTitle}
       onKeyUp={this.teclaEnter}/>
                
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
              </div>)
   }
 
    
    })}
    
  </div>
      </div>,
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
              </div>)
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
<div>
  {i}
</div>
              )
            })}
            
</div>
            </div>
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
              </div>)
   }

               
  })}
  </div>
  
  </div>
    })
       
   
    
  
    }
     
      
  
  
}}


   
    
    
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
listasInactivasContent:""

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
listasInactivasContent:""
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
//notificacionesAccionTitle.shift()
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
  notificacionesLista:notificacionesLista
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
    if(this.state.listaActiva===""||this.state.listaActivaGuardada===false){
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
      listasInactivas:[]
        })
        return(
        this.getContent()
        )
    }
  
 
  }
  /*
  componentDidMount(){
   window.addEventListener("beforeunload", this.handleBeforeUnload);
     this.getProductsList() 
    
       
    // Escuchar eventos de WebSocket
    this.state.socket.on('privilegiosRevocados', (data) => {
      console.log(`Los privilegios del usuario ${data.userId} han sido revocados.`);
      
      if(this.state.listaActiva===""||this.state.listaActivaGuardada===false){
        axios.post("https://eficompraserver.onrender.com/otorgarPrivilegios",{
          id:localStorage.getItem("id")
        })
      .then(response=>{
        console.log(response.data)
          this.getContent()
      }
      )
      
      }else{
        this.setState({
          listaActiva:"",
          miListaCompraId:"",
          comprado:[false],
          listaCompraTitle:["Milista de la compra"],
          productSelected:[],
          listaActivaGuardada:false,
          compartida:false,
          usersAliasCompartidos:[],
          usersIdCompartidos:[]
        })
         axios.post("https://eficompraserver.onrender.com/otorgarPrivilegios",{
          id:localStorage.getItem("id")
        })
      .then(response=>{
        console.log(response.data)
          this.getContent()
      }
      )
      
      }
    });
    this.state.socket.on('notificacionEnviada', (data) =>{
       console.log(`El usuario ${data.receptor} ha sido notificado.`);
  
      if(data.receptor===Number(localStorage.getItem("id"))){
        axios.post("https://eficompraserver.onrender.com/recuperarNotificaciones",{
      receptor:localStorage.getItem("id")
    })
    .then(response=>{

      if(response.data.length>0){
      let listaName=""
      let notificaciones=[]
     
    response.data.map(i=>{
   
      let notificacionAccion=i.accion.split("/")


   listaName=notificacionAccion[4]

  notificaciones.push(i)
   if(notificaciones.length>0){
         notificaciones.map(not=>{
     not.listaName=listaName
  
   })
  

   if(notificacionAccion[2]==="lista"||notificacionAccion[1]==="change"){
  if(this.state.listaActivaGuardada===true){
        this.setState({
          listaActiva:"",
          miListaCompraId:"",
          comprado:[false],
          listaCompraTitle:["Mi lista de la compra"],
          productSelected:[],
          listaActivaGuardada:false,
          compartida:false,
          usersAliasCompartidos:[],
          usersIdCompartidos:[],
           notificacionesButton:
  <div className="notificaciones">
<button className="notificaciones" onClick={this.handleNotificaciones}>Notificaciones</button>
        </div>
        })
        this.getContent()
      }else{
       this.setState({
        notificacionesButton:
  <div className="notificaciones">
<button className="notificaciones" onClick={this.handleNotificaciones}>Notificaciones</button>
        </div>
       
       })
   
        this.getContent()
      }
}else{
   this.setState({
        notificacionesButton:
  <div className="notificaciones">
<button className="notificaciones" onClick={this.handleNotificaciones}>Notificaciones</button>
        </div>,
        notificaciones:notificaciones
       })
}
        }
   

     

    })
  

 
      

        
      }})
      }
    })

    // Limpiar el socket al desmontar el componente
    this.socketCleanup = () => {
      this.state.socket.off('privilegiosRevocados');
      this.state.socket.off('notificacionEnviada')
    };
    
  }
*/
componentDidMount() {
  window.addEventListener("beforeunload", this.handleBeforeUnload);
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

    if (listaActiva === "" || listaActivaGuardada === false) {
      otorgarPrivilegios();
    } else {
   
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
    if (data.receptor !== miId) return; // Salida rápida si no es para este usuario

    axios.post("https://eficompraserver.onrender.com/recuperarNotificaciones", {
      receptor: miId
    })
    .then(response => {
      if (!response.data || response.data.length === 0) return;

      // 2. PROCESAR DATOS EN SEGUNDO PLANO (Sin tocar el estado aún)
      let necesitaResetearLista = false;
      const notificacionesPROCESADAS = [];

      response.data.forEach(item => {
        const notificacionAccion = item.accion.split("/");
        const listaName = notificacionAccion[4];
        
        // Clonamos el objeto para no mutar el original
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
}

  componentWillUnmount() {
    this.socketCleanup(); 
    window.removeEventListener("beforeunload", this.handleBeforeUnload);
  }
  

  
 
  


  componentDidUpdate(){
 
  if(this.state.options.length===0){

  this.getOptions()
  this.getOptionsByLetter()
  this.getOptionsByCategory()
   this.getContent()
  
  }
  

  
  }

  

  render(){
  
  let listasInactivas=this.state.listasInactivas
  let listasInactivasContent=this.state.listasInactivasContent
    let notificacionesButton=this.state.notificacionesButton
let notificacionesLista=this.state.notificacionesLista
let listaActiva=this.state.listaActiva
let content=
 <div className="contentMisListas">
   
    <div className="columnaCentral">
      
                <div className="buscadorProductos">
                <input type='text'name="buscadorProductos" list="Products" placeholder= {this.state.placeholderBuscador}
                onClick={this.handleOnClick} onKeyUp={this.teclaEnter}/>
                
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
 
   </div>
 let abc= 
 <div className="abecedario">

            
            {this.state.opcionesPorLetra.map(i=>{
              return(
  <div className="letra" onMouseOver={this.handleOnMouseOver} id={i.letra}>
                  {i.letra}
                  
                  </div>
              )})}
              </div>

if(this.state.letterOnHover===true&&this.state.palabrasOnMouseOver.length>0){
  
  content= 
  <div className="productosPorLetra" onMouseLeave={this.handleOnMouseLeave}>
      {this.state.palabrasOnMouseOver[0].map(i=>{
    
        return(
          <button className="palabra" value={i} onClick={this.handleOnClick}>
            {i}
            </button>
        )
      })}
      </div>
      listaActiva=""

}

        
if(this.state.palabrasPorCategoriaClick===true){
  content=
    <div className="productosPorCategory"id={`palabrasCat${this.state.categoryOnClick.replaceAll(" ","")}`} >
      <div className="categoryTitle"id={`titleCat${this.state.categoryOnClick.replaceAll(" ","")}`}>

      
            <div className="categoryName">{this.state.categoryOnClick}</div>
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
if(this.state.listaActiva!=""&&this.state.palabrasPorCategoriaClick===false&&this.state.palabrasOnMouseOver.length===0){
  content=
  
 <div className="contentWhithList">
    
{listasInactivasContent}
   
    <div className="columnaCentral">
      
                <div className="buscadorProductos">
                <input type='text'name="buscadorProductos" list="Products" placeholder= {this.state.placeholderBuscador}
                onClick={this.handleOnClick} onKeyUp={this.teclaEnter}/>
                
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
              {/*
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
                    
              {this.state.opcionesPorCategoria.map(cat=>{
              if(cat[0]!=undefined){
              return(
                <div className="category">
                <div className="categoryName" onClick={this.handleOnClickCategory} id={cat[0].category}>
                {cat[0].category}
                </div>
                
              
              </div>
              )
              }
              
              
              
              })}

              </div>
              */}
      
    </div>
<div className="listaActiva">
  {listaActiva}
</div>
   </div>

  
}
if(listasInactivasContent!=""&&this.state.palabrasPorCategoriaClick===false&&this.state.palabrasOnMouseOver.length===0){
  content=
    <div className="contentWhithListasGuardadas">
    
{listasInactivasContent}
   
    <div className="columnaCentral">
      
                <div className="buscadorProductos">
                <input type='text'name="buscadorProductos" list="Products" placeholder= {this.state.placeholderBuscador}
                onClick={this.handleOnClick} onKeyUp={this.teclaEnter}/>
                
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
if(listasInactivasContent!=""&&this.state.listaActiva!=""&&this.state.palabrasPorCategoriaClick===false&&this.state.palabrasOnMouseOver.length===0){
  content=
   <div className="contentWhithListasYActiva">
    
{listasInactivasContent}
   
    <div className="columnaCentral">
      
                <div className="buscadorProductos">
                <input type='text'name="buscadorProductos" list="Products" placeholder= {this.state.placeholderBuscador}
                onClick={this.handleOnClick} onKeyUp={this.teclaEnter}/>
                
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
              {/*
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
              */}
      
    </div>
<div className="listaActiva">
  {listaActiva}
</div>
   </div>
}
return(
 
      <div className="content-wrapper">
         {notificacionesLista}
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
  {/*
 <div className="abecedario">

            
            {this.state.opcionesPorLetra.map(i=>{
              return(
  <div className="letra" onMouseOver={this.handleOnMouseOver} id={i.letra}>
                  {i.letra}
                  
                  </div>
            )})}
              
                
            
            
                
                  
                  
                  
                  
              
            
            </div>
            */}
       </div> 
      
     
   )

}
}

  



