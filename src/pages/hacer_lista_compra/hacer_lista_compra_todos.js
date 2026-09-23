import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { library, text } from "@fortawesome/fontawesome-svg-core";
import { faTrash, faSpinner, faTruckFieldUn } from "@fortawesome/free-solid-svg-icons";
import { toBeEnabled, toBeVisible, toHaveAccessibleDescription, toHaveAccessibleErrorMessage } from "@testing-library/jest-dom/matchers";
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
        //socket : io("https://eficompraserver.onrender.com")
  
      
      
    }

      this.getProductsList=this.getProductsList.bind(this);
      this.getOptions=this.getOptions.bind(this);
      this.getOptionsByLetter=this.getOptionsByLetter.bind(this);
      this.getOptionsByCategory=this.getOptionsByCategory.bind(this);
      this.handleOnMouseOver=this.handleOnMouseOver.bind(this);
      this.handleOnMouseLeave=this.handleOnMouseLeave.bind(this)
    
      this.handleOnClickCategory=this.handleOnClickCategory.bind(this)
      this.handleOnClick=this.handleOnClick.bind(this);
      this.handleOnClickExit=this.handleOnClickExit.bind(this);
      this.handleDelete=this.handleDelete.bind(this);
      //this.handleBtnGuardar=this.handleBtnGuardar.bind(this);
      this.handleBtnGuardarConNombre=this.handleBtnGuardarConNombre.bind(this)
      this.handleListaTitle=this.handleListaTitle.bind(this);
      
      // this.changeState=this.changeState.bind(this)
      
 this.handleBeforeUnload = this.handleBeforeUnload.bind(this);
      
    }
  
  getProductsList() {
 
      axios
      
        .get("https://eficompraserver.onrender.com/palabrasLista")
        .then(response=> {
      
          this.setState({
              data:response.data,
              isLoading:false
          
          
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
      const nuevasLetras = this.state.abecedario.map(letra=>{
    const palabrasFiltradas = this.state.options.filter(i=>
      i.toLowerCase().startsWith(letra.toLowerCase())
      )
        return{
          letra: letra,
          palabras: palabrasFiltradas
        }
      })
        this.setState({
          opcionesPorLetra: nuevasLetras
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
  console.log(event.target.value)
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
      
    <input type='text'name="listaCompraTitle" id="listaCompraTitle"placeholder={this.state.listaCompraTitle[0]}onChange={this.handleListaTitle}
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
 

        this.setState({
        listaCompraTitle:listaName,
        
        listaActiva:
         
    <div className="columnaListaActiva">
      <div className="columnaTitle"></div>
     <div className="optionsBarList">

      
        </div>
    
    {this.state.productSelected.map(i=>{
    if(this.state.productSelected.length>0&&this.state.productSelected.indexOf(i)===0){
      return(
        
        <div className="listaCompra">
    
    <div className="listaCompraTitle">
      
    <input type='text'name="listaCompraTitle" id="listaCompraTitle"value={listaName[0]}onChange={this.handleListaTitle}
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
  
      )
    }
    })}
    
  </div>

  
        })
         
  
    }  

  

 
 

  handleDelete(event){ 
this.setState({
  indxProductoABorrar:[]
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
      
    <input type='text'name="listaCompraTitle" id="listaCompraTitle"placeholder={this.state.listaCompraTitle[0]}onChange={this.handleListaTitle}
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
      )
    }
    })}
    
  </div>
  </div>
  
})
  


  

  }
  /*
     handleBtnGuardar(event){
  
 document.getElementById("listaCompraTitle").focus()
 this.setState({
      listaActiva:
     
        <div className="columnaListaActiva">
      <div className="columnaTitle"> </div>
     <div className="optionsBarList">

     </div>
    
    {this.state.productSelected.map(i=>{
    if(this.state.productSelected.length>0&&this.state.productSelected.indexOf(i)===0){
      return(
        
     <div className="listaCompra">
    
    <div className="listaCompraTitle">
      
    <input type='text'name="listaCompraTitle" id="listaCompraTitle"placeholder={this.state.listaCompraTitle[0]}onChange={this.handleListaTitle}
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
*/
 handleBtnGuardarConNombre(event){

 localStorage.setItem("products",this.state.productSelected)
 localStorage.setItem("listaTitle",this.state.listaCompraTitle[0])
  window.removeEventListener("beforeunload", this.handleBeforeUnload)
    window.location.href ="/login"
  
  
 }
  
  

  componentDidMount(){
   window.addEventListener("beforeunload", this.handleBeforeUnload);
     this.getProductsList() 
    
       
  }

  componentWillUnmount() {
    
    window.removeEventListener("beforeunload", this.handleBeforeUnload);
  }
  

  
 
  


  componentDidUpdate(prevProps, prevState){
 
  if(prevState.data.length===0&&this.state.data.length>0){

  this.getOptions()
  
  this.getOptionsByCategory()

  }

 if(prevState.options.length===0&&this.state.data.length>0){


  this.getOptionsByLetter()
  

  }
  

  
  }

  

  render(){
  
  
  
 

let listaActiva=this.state.listaActiva
    let abc;
let content =
 <div className="content">
    

   
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



     
  if(this.state.opcionesPorLetra.length>0){
    abc=this.state.opcionesPorLetra.map(grupo=>{
       <div className="letra" onMouseOver={this.handleOnMouseOver} id={grupo.letra}>
                  {grupo.letra}
                  
                  </div>
    })
  } 
  
if(this.state.letterOnHover===true&&this.state.palabrasOnMouseOver.length>0&&this.state.palabrasOnMouseOver[0].length>5){
  
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

}else if(this.state.letterOnHover===true&&this.state.palabrasOnMouseOver.length>0&&this.state.palabrasOnMouseOver[0].length<=5){
 content= 
  <div className="pocosProductosPorLetra" onMouseLeave={this.handleOnMouseLeave}>
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
    
        <button className="palabra" value={i} onClick={this.handleOnClick}>{i}</button>
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
                <input type='text'name="buscadorProductos" list="Products" onClick={this.handleOnClick} onKeyUp={this.teclaEnter} placeholder={this.state.placeholderBuscador} />
                
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
return(
 <div className="hacer-lista-compra-productos-wrapper">
      <div className="content-wrapper">
     
        <div className="title-wrapper">
        <div className="title">
             {this.state.pageTitle}
        </div>
   
              
        </div>
   {this.state.optionsBar}
        <div className="abcUser">
         
         
  
 </div>
 
  {content}
  <div className="abecedario">

            
  {abc}
              
                
            
            
                
                  
                  
                  
                  
              
            
            </div>
       </div> 
      </div>
)  
}
}

  



