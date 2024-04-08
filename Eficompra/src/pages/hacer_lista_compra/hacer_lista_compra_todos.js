
import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash, faSpinner } from "@fortawesome/free-solid-svg-icons";

import fondo from "../../libreta.png"
library.add(faTrash, faSpinner);
export default class HacerListaCompraTodos extends Component {
  
  constructor(props) {
    super()
    this.state={
        data:[],
        productsList:[],
        options:[],
        productSelected:[],
        placeholderBuscador:"Select a product",
        placeholderCantidad:1,
        hacerLista:[],
        product_list:[],
        botonComprar:"",
        pageTitle:<h2>Hacer lista de la compra</h2>,
        productsToBuy:[],
        isLoading:true
        
    }

    this.handleOnClick=this.handleOnClick.bind(this);
    this.handleDelete=this.handleDelete.bind(this);
    this.handleComprar=this.handleComprar.bind(this);
    this.handleSelectCantidad=this.handleSelectCantidad.bind(this)
  }

  getProductsList() {
   
    axios
      .get("http://localhost:3001/productosdeSupermercados")
      .then(response => {
        this.setState({
            data:response.data,
            isLoading:false
          }
        )
        this.state.data.map(product=>{
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
  })})})}
  
  handleOnClick(event){
    
  this.state.productsList.map(i=>{

  if(event.target.value!=""&&event.target.value===i.productName&&this.state.productSelected.includes(i)===false){
 
    this.state.productSelected.unshift(i)
    this.setState({
      productSelected:this.state.productSelected,
      placeholder:"Select another product",
      product_list:this.state.product_list
    })

    this.hacerListaCompra()
  }
  })
    
  event.target.value=""
  }


  hacerListaCompra(){
   
    

  if(this.state.productSelected.length>0){
 
    this.state.product_list.unshift([
      <div key={this.state.productSelected[0].id}>
      {this.state.productSelected[0].productName}
      <input type='number'id={this.state.productSelected[0].id} min='1' placeholder={this.state.placeholderCantidad} value={1} onChange={this.handleSelectCantidad} name={this.state.productSelected[0].productName}></input>
      
      <button id={this.state.productSelected[0].id} onClick={this.handleDelete} className="btn">
      </button>
      </div>,this.state.productSelected[0].price,this.state.productSelected[0].supermarket
    ])

    this.setState({
      product_list:this.state.product_list
    })  
 
  }
  if(this.state.product_list.length>0){ 
  
    this.setState({
      
      botonComprar:
      <Link to="../hacer_compra" onClick={this.handleComprar}>Comprar</Link>
    })
  }  
  }
   
  handleSelectCantidad(event){

    this.state.productsToBuy.unshift(

    <div key={event.target.name}>
    {event.target.name}
    <input type='number'id={event.target.name} min='1' onChange={this.handleSelectCantidad} value={event.target.value}placeholder={event.target.value}name={event.target.name}></input>
    <button id={event.target.name} onClick={this.handleDelete} className="btn"></button>
    </div>  
    
    )

    this.setState({
      productsToBuy:this.state.productsToBuy,
      placeholderCantidad:'1'
    })
console.log(this.state.productsToBuy)
    this.state.productsToBuy.map(i=>{
        
        if(this.state.productsToBuy[0].key===i.key&&this.state.productsToBuy.length>=1){
          
          const indx=this.state.productsToBuy.indexOf(i)
          if(indx>0)
            this.state.productsToBuy.splice(indx,1)
            this.setState({
              productsToBuy:this.state.productsToBuy
      
            })
    }
    })

    this.state.productsToBuy.map(productoModificado=>{
      console.log(this.state.product_list)
      this.state.product_list.map(i=>{
        if(productoModificado.key===i[0].props.children[0]){
      
          const indx=this.state.product_list.indexOf(i)
        
          this.state.product_list[indx][0]=productoModificado
        }
        this.setState({
          product_list:this.state.product_list,
        placeholderCantidad:1
      })
      console.log(this.state.product_list)
    })
    })
    return
  } 
  
  handleDelete(event){

  this.state.product_list.map(i=>{

   if(i!=undefined&&event.target.id===i[0].key){
    const idx=this.state.product_list.indexOf(i)
    this.state.product_list.splice(idx,1)
   
      this.setState({
        product_list:this.state.product_list
      })

    this.state.productSelected.map(i=>{
  
      if(i!=undefined&&event.target.id===i.id.toString()){
        const idx=this.state.productSelected.indexOf(i)
        this.state.productSelected.splice(idx,1)

      this.setState({
      
        productSelected:this.state.productSelected
      })

  }})}})}  

  handleComprar(){
console.log(this.state.product_list)
  this.state.product_list.map(i=>{

    axios
    .post("http://localhost:3001/hacerCompra",{
      idHacerCompra:i[0].key,
      name:i[0].props.children[0],
      cantidad:parseInt(i[0].props.children[1].props.placeholder),
      price:i[1],
      supermarket:i[2]
  })})}

  componentDidMount(){
      
    this.getProductsList()
        
  }
   
  render(){
  
   return(
      <div className="content-wrapper">
        <div className="title-wrapper">
        {this.state.pageTitle}
        </div>
        <div className="buscador-wrapper">
    <input key='buscadorProductos' type='text'name="buscadorProductos" list="Products" placeholder={this.state.placeholderBuscador } 
    onClick={this.handleOnClick} >
    </input>
   
    <datalist key='Products'id="Products" className="dataList">
      {this.state.options.map(i=>{
        return (
        <div className="option" key={this.state.options.indexOf(i)}>

         { i}
        </div>
        )})}
    </datalist>

    </div>

    {this.state.isLoading?(
      <div className="loader">
     <FontAwesomeIcon icon="fa-solid fa-spinner" />
    </div>
    ):null}
    
    <div className="listaCompra"
    style={{backgroundImage:`url(${fondo})`}}>
<div className="productsList">
    {this.state.product_list.map(i=>{

    return (
    
    <div key={this.state.product_list.indexOf(i)} className="products">
    <div className="parteIzquierda">
    <div className="productName">
    {i[0].props.children[0]}
    </div>
    </div>

    <div className="parteDerecha">
    <div className="cantidad">
    {i[0].props.children[1]}
    </div>

    <div className="borrar">
    <div className="btn">
    {i[0].props.children[2]}
    <div className="icon">
    <FontAwesomeIcon icon="trash" />
    </div>
    </div>
    </div>
    </div>
    </div>
  )})}
  <div className="comprar">

  {this.state.botonComprar}
  </div>
  </div>
  </div>

  </div>
)}}


