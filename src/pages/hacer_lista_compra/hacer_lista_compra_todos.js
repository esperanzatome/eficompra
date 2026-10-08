import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { library, text } from "@fortawesome/fontawesome-svg-core";
import { faTrash, faSpinner, faTruckFieldUn } from "@fortawesome/free-solid-svg-icons";
import { toBeEnabled, toBeVisible, toHaveAccessibleDescription, toHaveAccessibleErrorMessage } from "@testing-library/jest-dom/matchers";
import { io } from 'socket.io-client';
import carritoImg from '../../carrito-de-compras.png'
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
        inputBuscador: "password",
        inputListaTitle:"text",
         letterOnHover: false,
    palabrasOnMouseOver: [],
    letraActivaId: null 
  
      
      
    }
      this.abecedarioRef = React.createRef();
      this.getProductsList=this.getProductsList.bind(this);
      this.getOptions=this.getOptions.bind(this);
      this.getOptionsByLetter=this.getOptionsByLetter.bind(this);
      this.getOptionsByCategory=this.getOptionsByCategory.bind(this);
      this.handleOnMouseOver=this.handleOnMouseOver.bind(this);
      this.handleOnMouseLeave=this.handleOnMouseLeave.bind(this)
    this.handleLetraClickMóvil = this.handleLetraClickMóvil.bind(this);
  this.handleTouchOutside = this.handleTouchOutside.bind(this);
      this.handleOnClickCategory=this.handleOnClickCategory.bind(this)
      this.handleOnClick=this.handleOnClick.bind(this);
      this.handleOnClickExit=this.handleOnClickExit.bind(this);
      this.handleDelete=this.handleDelete.bind(this);
this.teclaEnter=this.teclaEnter.bind(this)
      this.handleBtnGuardarConNombre=this.handleBtnGuardarConNombre.bind(this)
      this.handleListaTitle=this.handleListaTitle.bind(this);
      this.handleInputBuscador=this.handleInputBuscador.bind(this);
this.handleInputTitle=this.handleInputTitle.bind(this);
      
 this.handleBeforeUnload = this.handleBeforeUnload.bind(this);
      
    }
    handleInputBuscador(event){

if (event && event.target && event.target.tagName === 'INPUT') {
    this.setState({
      inputBuscador: "text",
      
    });
  }
      handleInputTitle(event){

if (event && event.target && event.target.tagName === 'INPUT') {
    this.setState({
      inputListaTitle: "password",
      
    });
}
  if(event.target.className==="palabra"){
    this.setState({
      inputBuscador: "password",
  
    });
  }

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
  
      if(this.state.options.length>0){
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
    letterOnHover: false,
    palabrasOnMouseOver: [],
    letraActivaId: null
  });


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
      inputListaTitle:"password"
    });
  } else {
    this.setState({
      letterOnHover: true,
      palabrasOnMouseOver: item.palabras,
      letraActivaId: item.letra,
      inputBuscador:"password",
      inputListaTitle:"password"
    });
  }
}
handleOnClick(event){
if(event.target.name==="buscadorProductos"||event.target.className==="palabra"){
this.setState({
inputBuscador:"text",

})
}
  this.setState({
    palabrasPorCategoriaClick:false,
    categoryOnClick:"",
   
    
    
  })
 if(event!=undefined&&this.state.productSelected.includes(event.target.value)===false&&event.target.value!=''){


    this.state.productSelected.push(event.target.value)

  event.target.value=''


    this.setState({
     
    productSelected:this.state.productSelected,
     palabrasOnMouseOver:[],
     
     listaActiva:
 
    <div className="columnaListaActiva">
   
     <div className="optionsBarList">

      
     
     </div>
    
    {this.state.productSelected.map(i=>{
    if(this.state.productSelected.length>0&&this.state.productSelected.indexOf(i)===0){
      return(
      
        
        <div className="listaCompra">
    
    <div className="listaCompraTitle">
      
    <input type={this.state.inputListaTitle}name="listaCompraTitle" id="listaCompraTitle" defaultValue={this.state.listaCompraTitle[0]} placeholder={this.state.listaCompraTitle[0]}onClick={this.handleListaTitle}
      onTouchStart={this.handleInputTitle}
  onKeyDown={(event) => this.teclaEnter(event, this.handleListaTitle)}  />
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
    
    <div className="guardarBtnConNombre">
         <button className="guardarBtnConNombre" onClick={this.handleBtnGuardarConNombre}>
       Guardar
         </button>
           </div>
    </div>
   </div>
   
      )
    }
    })}
    
  </div>
 
  
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
    palabrasPorCategoria:palabrasPorCategoria,
 
    
      
      })
    
  
    }
    handleOnClickExit(event){
    this.setState({
      palabrasPorCategoriaClick:false
     
    })
  
    }
    
handleListaTitle(event){
console.log((document.getElementById("listaCompraTitle")).value)

 let listaName=[(document.getElementById("listaCompraTitle")).value]

  this.setState({
   listaCompraTitle:listaName,
inputListaTitle:"text",
listaActiva:
   

    <div className="columnaListaActiva">
   
     <div className="optionsBarList">

      
     
     </div>
    
    {this.state.productSelected.map(i=>{
    if(this.state.productSelected.length>0&&this.state.productSelected.indexOf(i)===0){
      return(
      
        
        <div className="listaCompra">
    
    <div className="listaCompraTitle">
      
    <input type="text"name="listaCompraTitle" id="listaCompraTitle"placeholder={listaName[0]}onClick={this.handleListaTitle}
       onKeyDown={(event) => this.teclaEnter(event, this.handleListaTitle)}  onTouchStart={this.handleInputTitle} />
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
    
    <div className="guardarBtnConNombre">
         <button className="guardarBtnConNombre" onClick={this.handleBtnGuardarConNombre}>
       Guardar
         </button>
           </div>
    </div>
   </div>
   
      )
    }
    })}
    
  </div>
 
  
  })
 
 }

      
         
  
    

  

 
 

  handleDelete(event){ 
this.setState({
  indxProductoABorrar:[],
 
})
  
  this.state.indxProductoABorrar.unshift(this.state.productSelected.indexOf(event.target.value))
      this.state.productSelected.splice(this.state.indxProductoABorrar[0],1)
      
    
      this.setState({
    productSelected:this.state.productSelected,
  indxProductoABorrar:this.state.indxProductoABorrar,
  
     listaActiva:
  <div>
    <div className="columnaListaActiva">
      <div className="columnaTitle"> </div>
     <div className="optionsBarList">

      
     </div>
    
    {this.state.productSelected.map(i=>{
    if(this.state.productSelected.length>0&&this.state.productSelected.indexOf(i)===0){
      return(
     
      <div className="listaCompra">
    
    <div className="listaCompraTitle">
      
    <input type={this.state.inputListaTitle}name="listaCompraTitle" id="listaCompraTitle"defaultValue={this.state.listaCompraTitle[0]}placeholder={this.state.listaCompraTitle[0]}onClick={this.handleListaTitle}
      onKeyDown={(event) => this.teclaEnter(event, this.handleListaTitle)}  onTouchStart={this.handleInputTitle}/>
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
    
    <div className="guardarBtnConNombre">
         <button className="guardarBtnConNombre" onClick={this.handleBtnGuardarConNombre}>
       Guardar
         </button>
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
  handleBtnGuardarConNombre(event){

 localStorage.setItem("products",this.state.productSelected)
 localStorage.setItem("listaTitle",this.state.listaCompraTitle[0])
  window.removeEventListener("beforeunload", this.handleBeforeUnload)
    window.location.href ="/login"
  
  
 }
  
  

  componentDidMount(){
   window.addEventListener("beforeunload", this.handleBeforeUnload);
     this.getProductsList() 
    document.addEventListener('touchstart', this.handleTouchOutside);
       
  }

  componentWillUnmount() {
    
    window.removeEventListener("beforeunload", this.handleBeforeUnload);
    document.removeEventListener('touchstart', this.handleTouchOutside);
  }
  

  
 
  


 componentDidUpdate(prevProps, prevState){

  if(prevState.data.length===0&&this.state.data.length>0){

  this.getOptions()
  
  this.getOptionsByCategory()

    this.getOptionsByLetter()
this.setState({
  isLoading:false,
 
})
  }

 }
  render(){
  
  
  
 
let abc=
<div className="abecedario">

            
            {this.state.abecedario.map(i=>{
              return(
  <div className="letra" id={i}>
                  {i}
                  
                  </div>
              )})}
              </div>
let listaActiva=this.state.listaActiva

let content =
 <div className="content">
    

   
    <div className="columnaCentral">
      
                <div className="buscadorProductos">
                <input type={this.state.inputBuscador}name="buscadorProductos" list="Products" placeholder= {this.state.placeholderBuscador}
                onClick={this.handleOnClick} onKeyDown={(event) => this.teclaEnter(event, this.handleOnClick)}  onTouchStart={this.handleInputBuscador}/>
            
                <datalist key='Products' id="Products" className="dataList">
              
              
              { this.state.options.map(i=>{
                
              
                  return (
              
              
              <option key={this.state.options.indexOf(i)} value={i}>{i}</option>
              
                  )})}
                  
                  
              </datalist>
         
                  </div>
              
              
              
              <div className="productosFrecuentes">
              
              {(this.state.productosFrecuentes.sort((a,b)=>a.name.localeCompare(b.name))).map(i=>{
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

      if (this.state.letterOnHover === true && this.state.palabrasOnMouseOver.length > 0) {
  
  
  const claseContenedor = this.state.palabrasOnMouseOver.length > 5 
    ? "productosPorLetra" 
    : "pocosProductosPorLetra";

  content = (
    <div className={claseContenedor} onMouseLeave={this.handleTouchOutside}
    onTouchStart={(e) => e.stopPropagation()}>
      {this.state.palabrasOnMouseOver.map((i, index) => {
        return (
          <button key={index} className="palabra" value={i} onClick={this.handleOnClick}>
            {i}
          </button>
        );
      })}
    </div>
  );
  listaActiva = "";
}

if(this.state.palabrasPorCategoriaClick===true){
  listaActiva=""
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
    
        <button className="palabra" value={i} onClick={this.handleOnClick} onTouchStart={this.handleInputBuscador}>{i}</button>
      )
    })}
            </div>
          
        </div>
}
if(listaActiva!=""){

  content=
  <div className="contentWhithListTodos">
    

   
    <div className="columnaCentral">
      
                <div className="buscadorProductos">
                <input type={this.state.inputBuscador}name="buscadorProductos" list="Products" onClick={this.handleOnClick} onKeyDown={(event) => this.teclaEnter(event, this.handleOnClick)}  placeholder={this.state.placeholderBuscador} onTouchStart={this.handleInputBuscador}/>
                
                <datalist key='Products' id="Products" className="dataList">
              
              
              { this.state.options.map(i=>{
                
              
                  return (
              
              
              <option key={this.state.options.indexOf(i)} value={i}>{i}</option>
              
                  )})}
                  
                  
              </datalist>
              
                  </div>
              
              
              
              <div className="productosFrecuentes">
              
              {(this.state.productosFrecuentes.sort((a,b)=>a.name.localeCompare(b.name))).map(i=>{
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
            onMouseLeave={this.handleTouchOutside}
            onClick={(e) => this.handleLetraClickMóvil(e, i)} 
          >
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

return(
 <div className="hacer-lista-compra-productos-wrapper">
      <div className="content-wrapper">
     
        <div className="title-wrapper">
        <div className="title">
             {this.state.pageTitle}
        </div>
   
              
        </div>
  <div className="optionsBar">
                  <Link to="../registro">Registro</Link>
                  <Link to="../login">Login</Link>
                </div>
        <div className="abcUser">
         
         
  
 </div>
 
  {content}
  {abc}
       </div> 
      </div>
)  
     
   
  
}
}




