import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import fondo from "../../../../static/assets/images/libreta/libreta.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default class MiListaCompra extends Component {
  
  constructor(props) {
    super()
    this.state={
    data:[],
    buscador:'',
    datalist:'',
    placeholderBuscador:'Select a product',
    options:[],
    dataTotal:[],
    productsList:[],
    productSelected:[],
    product_list:[],
    añadirButton:''
   
    
  } 
  this.handleSelectCantidad=this.handleSelectCantidad.bind(this),
  this.handleDelete=this.handleDelete.bind(this),
  this.handleAñadirProducto=this.handleAñadirProducto.bind(this),
  this.handleOnClick=this.handleOnClick.bind(this),
  this.handleComprar=this.handleComprar.bind(this)
  }

  getProductsToBuy(){
    axios
    .get("http://localhost:3300/hacerCompra")
    .then(response => {

  this.setState({
    data:response.data
  })})}

  deleteProductsToBuy(){
      axios
      .delete("http://localhost:3300/miListaCompra")
      .then(response=>{
     
  })}

  handleSelectCantidad(event){
 
    this.state.data.map(i=>{
    
      if(parseInt(event.target.id)===i.idHacerCompra){
        
      i.cantidad=event.target.value
    
    }})
    this.setState({
      data:this.state.data
  })}
    
  handleDelete(event){
        
    this.state.data.map(i=>{
    
      if(parseInt(event.target.id)===i.idHacerCompra){

      this.state.data.splice(this.state.data.indexOf(i),1)
    
    }})
    this.setState({
    data:this.state.data
    })

    this.state.productSelected.map(i=>{

    if(parseInt(event.target.id)===i.id){

      this.state.productSelected.splice(this.state.productSelected.indexOf(i),1)
    
    }})
    this.setState({
    data:this.state.data
    })
  }    
          
  getProductsList() {
   
    axios
    .get("http://localhost:3300/productosdeSupermercados")
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
       
        i.productName=`${i.productName.toLowerCase().replace(i.trademark,"")} _${i.price} €`
        
        return this.state.productsList,
        
        this.setState({
          productsList:this.state.productsList
        }),

        this.state.options.push(<option key={this.state.productsList.indexOf(i)}value={i.productName} price={i.price}></option>),
     
      this.setState({
      
          options:this.state.options
  })})})}   

  getTotalProduct(){

    this.state.data.map(i=>{
      i.total=i.cantidad*i.price
    
  })}      

  getAñadirButton(){
 
  
  this.setState({
    añadirButton: 
      <div>
    <div className="añadir-producto">
    <button id="Añadir producto" onClick={this.handleAñadirProducto} className="añadirProductoButton">Añadir producto</button>
    </div>
    </div>
  })}

  handleAñadirProducto(event){
    this.setState({
      buscador:<input key='buscadorProductos' type='text'name="buscadorProductos" list="Products" placeholder={this.state.placeholderBuscador } 
      onClick={this.handleOnClick}>
      </input>,
     datalist: <datalist key='Products'id="Products">
        {this.state.options.map(i=>{
        return i
        })}
        </datalist>,
     añadirButton:''
  })}
  
  handleOnClick(event){
  
    const eventValue=event.target.value
    
    this.state.productsList.map(i=>{      
      const product=i.productName

      if(event.target.value!=' '&&eventValue===product&&this.state.productSelected.includes(i)===false){
        this.state.productSelected.unshift(i)
 
        this.setState({
        productSelected:this.state.productSelected,
        placeholderBuscador:"Select another product"
  
        })

        this.state.data.unshift({idHacerCompra:this.state.productSelected[0].id,name:this.state.productSelected[0].productName,cantidad:1,price:this.state.productSelected[0].price,supermarket:this.state.productSelected[0].supermarket}),
      
        this.setState({
        data:this.state.data
        })
      }

      return (event.target.value='')
    })

    this.state.data.map(i=>{
      if(this.state.data[0].name===i.name&&this.state.data.indexOf(i)!=0){
        this.state.data.splice(0,1)
      }
    })
        
    this.setState({
      data:this.state.data
    })
  }

  handleComprar(){          
             
  if(this.state.data.length>0){

    this.state.data.map(i=>{
   
    axios
        .post("http://localhost:3300/hacerCompra",{
          name:i.name,
          cantidad:parseInt(i.cantidad),
          price:i.price,
          supermarket:i.supermarket
        })
        
    })}
  }
              
  componentDidMount(){
        
    this.getProductsToBuy()
    this.getProductsList()
    this.deleteProductsToBuy()
    this.getAñadirButton()
     
  }

  render(){
    
    this.getTotalProduct()
    
    return(
    
      <div className="content-wrapper">
        <div className="titleMiListaCompra">
          <h2>Mi lista de la compra</h2>
      </div>

      <div className="miListaCompra"style={{backgroundImage:`url(${fondo})`}}>

      <div className="añadirWrapper">
      {this.state.añadirButton}

      <div className="buscador">
      {this.state.buscador}

      </div>
      </div>

      <div className="listaMiListaCompra">
      
      {this.state.data.map(i=>{

    
        if(this.state.data.length>0){
      
          return(
      
          <div key={i.idHacerCompra} className="productsMiListaCompra">

            <div className="parteIzquierdaMiListaCompra">
            {i.name} 
            </div>

            <div className="parteDerechaMiListaCompra">
            
            <input type='number'id={i.idHacerCompra} min='1' placeholder={i.cantidad}value={i.cantidad}onChange={this.handleSelectCantidad} name={i.name}></input>
            
            _ {i.total.toFixed(2)}€
            
            <div className="borrar">
            
              <div className="btn">
              <button id={i.idHacerCompra} onClick={this.handleDelete} className="btn"></button>
              <div className="iconMiListaCompra">
              <FontAwesomeIcon icon="trash" />
              </div>
              </div>
            </div>
            </div>
          </div>
          )
        }
      })}
      </div>

      <div className="comprar">
        <Link to="../hacer_compra" onClick={this.handleComprar}>Comprar</Link>
      </div>

      </div>

      {this.state.datalist}

      </div>
        
    )
  }
}