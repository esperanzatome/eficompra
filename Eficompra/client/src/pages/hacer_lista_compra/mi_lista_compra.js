import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import fondo from "../../libreta.png";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";



export default class MiListaCompra extends Component {
  
  constructor(props) {
    super()
    this.state={
    data:[],
    buscador:'',
    placeholderBuscador:'Select a product',
    options:[],
    dataTotal:[],
    productsList:[],
    productSelected:[],
    product_list:[],
    añadirButton:'',
    
   
    }
  
  this.handleAñadirProducto=this.handleAñadirProducto.bind(this)
  this.handleOnClick=this.handleOnClick.bind(this)
  this.handleSelectCantidad=this.handleSelectCantidad.bind(this)
  this.handleDelete=this.handleDelete.bind(this)
  this.handleComprar=this.handleComprar.bind(this)
  

    
  }

  getProductsToBuy(){
    axios
    .get("http://localhost:3001/hacerCompra")
    .then(response => {

  this.setState({
    data:response.data
    
  })
  console.log(this.state.data)
this.state.data.map(i=>{
  this.state.productSelected.unshift(i.name)
  return(
    this.setState({
      productSelected:this.state.productSelected
    })
  )
})
})

}
 
 

  handleSelectCantidad(event){
 console.log(event.target)
 
    this.state.data.map(i=>{
      console.log(i.idHacerCompra)
      console.log(parseInt(event.target.id))
      if(event.target.id===i.idHacerCompra){
        
      i.cantidad=event.target.value
    return(
      this.setState({
        data:this.state.data
    })
    )
    console.log(this.state.data)
    }})
   }
  getProductsList() {
   
    axios
    .get("http://localhost:3001/productosdeSupermercados")
    .then(response => {
   
      this.setState({
          dataTotal:response.data
        }
      )

      this.state.dataTotal.map(product=>{
          this.state.productsList.push({id:product.id,productName:product.name,trademark:product.trademark,price:product.price,reference_price:product.reference_price,supermarket:product.supermarket})
        }
      )
 
      this.setState({
          productsList:this.state.productsList
        }
      )    

      this.state.productsList.map(i=>{
       
        i.productName=`${i.productName.toLowerCase().replace(i.trademark,"")} __ ${i.price} €`
        
        return this.state.productsList,
        
        this.setState({
          productsList:this.state.productsList
        }),

        this.state.options.push(<option key={this.state.productsList.indexOf(i)}value={i.productName} price={i.price}></option>),
        
      this.setState({
      
          options:this.state.options
          
  })

})})}   
  getTotalProduct(){

    this.state.data.map(i=>{
      i.total=i.cantidad*i.price
    
  })}   
  handleOnClick(event){
    const eventValue=event.target.value
    console.log(this.state.productsList)
    this.state.productsList.map(i=>{      
      const product=i.productName

      if(event.target.value!=' '&&eventValue===product&&this.state.productSelected.includes(product)===false){
        this.state.productSelected.unshift(product)
        console.log(typeof(i.id))
        console.log(this.state.data)
        this.state.data.unshift({idHacerCompra:(i.id).toString(),name:i.productName,cantidad:1,price:i.price,supermarket:i.supermarket})
        console.log(this.state.data.id)
        this.setState({
        productSelected:this.state.productSelected,
        placeholderBuscador:"Select another product",
        data:this.state.data
  
        })

       
      
    
      }
      console.log(this.state.data)
      return (event.target.value='')
    })

    this.state.data.map(i=>{
      if(this.state.data[0].name===i.name&&this.state.data.indexOf(i)!=0){
        this.state.data.splice(0,1)
      }
    })
        
    this.setState({
      data:this.state.data
    })}
        
  
   
  handleAñadirProducto(event){
    this.setState({
      buscador:  <div className="buscador-wrapper-MiListaCompra">
      <input key='buscadorProductos' type='text'name="buscadorProductos" list="Products" placeholder={this.state.placeholderBuscador } 
      onClick={this.handleOnClick}  >
      </input>
     
      <datalist key='Products'id="Products" className="dataList">
        {this.state.options.map(i=>{
          return (
          <div className="option" key={this.state.options.indexOf(i)}>
  
           { i}
          </div>
          )})}
      </datalist>
  
      </div>,
  
     añadirButton:''
  })

}
  getAñadirButton(){
 
  
    this.setState({
      añadirButton: 
        <div>
      <div className="añadir-producto">
      <button id="Añadir producto" onClick={this.handleAñadirProducto} className="añadirProductoButton">Añadir producto</button>
      </div>
      </div>
    })}
  
    
  handleDelete(event){
        
    this.state.data.map(i=>{
   
      if(event.target.id===i.idHacerCompra){

      this.state.data.splice(this.state.data.indexOf(i),1)
      this.state.productSelected.map(pS=>{
        console.log(event.target)
        console.log(i)
     if(i.name===pS){
      this.state.productSelected.splice(this.state.productSelected.indexOf(pS),1)
      console.log(this.state.productSelected)
     }
        
       

    })
    return(
      
      this.setState({
      data:this.state.data,
      productSelected:this.state.productSelected
      })
    )}})
    

   
  
  }    
          

 deleteDataBase(){
  console.log(this.state.data)
  this.state.data.map(i=>{
   return(
    axios
    .delete("http://localhost:3001/hacerCompra/${i.idHacerCompra}"),[i.idHacerCompra]
  )
    } )
      
 }
 
  
  
   
 

  handleComprar(){          
    console.log(this.state.data)     
    
  


  this.state.data.map(i=>{
    return(
    axios
    
    .post("http://localhost:3001/hacerCompra",{
      idHacerCompra:i.idHacerCompra,
      name:i.name,
      cantidad:parseInt(i.cantidad),
      price:i.price,
      supermarket:i.supermarket
    })
    )
  })
 

   
      
          
      
     
        
    }
  
  
  
           
  componentDidMount(){
        
    this.getProductsToBuy()
    this.getProductsList()
    this.getAñadirButton()
    
    
  }

  render(){
   
   
    this.getTotalProduct()
    this.deleteDataBase()
    return(
  
      <div className="content-wrapper">
    
        <div className="titleMiListaCompra">
          <h2>Mi lista de la compra</h2>
        </div>
        <div className="miListaCompra"style={{backgroundImage:`url(${fondo})`}}>
        

<div className="añadirWrapper">
{this.state.añadirButton}

<div className="buscadorMiListaCompra">
{this.state.buscador}

</div>
</div>

<div className="listaMiListaCompra">



{this.state.data.map(i=>{


  return(
   
<div key={i.idHacerCompra} className="productsMiListaCompra">
<div className="parteIzquierdaMiListaCompra">

{i.name} 
</div>

<div className="parteDerechaMiListaCompra">

<input type='number'id={i.idHacerCompra} min='1' placeholder={i.cantidad}value={i.cantidad}onChange={this.handleSelectCantidad} name={i.name}></input>

_ {i.total.toFixed(2)}€

<div className="borrarMiListaCompra">

<div className="btn">
<button id={i.idHacerCompra} onClick={this.handleDelete} className="btn"></button>
<div className="iconMiListaCompra">
<FontAwesomeIcon icon="trash" />
</div>
</div>
</div>
</div>
</div>
) })}

  


 <div className="total-cantidad-miListaCompra">
        TOTAL:  {this.state.data.reduce((a,b)=>a+b.total,0).toFixed(2)} €
        </div>
</div>
<div className="comprarMiListaCompra">
          <Link to="../hacer_compra" onClick={this.handleComprar}>Comprar</Link>
        </div>
        </div>
       
      </div>
      )
    }
  }


      
      