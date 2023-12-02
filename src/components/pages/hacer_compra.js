import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import fondo from "../../../static/assets/images/comprar/hoja-arrugada.jpg"
import postIt from "../../../static/assets/images/comprar/post-it.jpg"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class HacerCompra extends Component {
  constructor(){
    super()

    this.state={
      data:[],
      productsBySupermarket:[],
      supermarketsSelected:[],
      isLoading:true
    }

    this.handleSelectCantidad=this.handleSelectCantidad.bind(this)
    this.handleDelete=this.handleDelete.bind(this)
  }

  getProductsToBuy(){
    axios
    .get("http://localhost:3300/hacerCompra")
    .then(response => {

  this.setState({
    data:response.data,
    isLoading:false
  })
  })}

    

  getTotalProduct(){

    this.state.data.map(i=>{
      i.total=i.cantidad*i.price
    })
  }


  handleSelectCantidad(event){
  
    this.setState({
      supermarketsSelected:[]
    })
    this.state.data.map(i=>{

      if(parseInt(event.target.id)===i.idHacerCompra){
    
        i.cantidad=parseInt(event.target.value)
      }
    })
    return(

      this.setState({
      data:this.state.data,
      productsBySupermarket:this.state.productsBySupermarket
      })
    )

  }

  handleDelete(event){
    this.setState({
      supermarketsSelected:[]
    })
  
    this.state.data.map(i=>{

      if(parseInt(event.target.id)===i.idHacerCompra){

        this.state.data.splice(this.state.data.indexOf(i),1)
      
      }
    })
    
    this.setState({
      data:this.state.data
    })
  }


  getProductsList() {
   
    axios
    .get("http://localhost:3300/productosdeSupermercados")
    .then(response => {
      this.setState({
          totalData:response.data
        }
      )
      this.state.totalData.map(product=>{
          this.state.productsList.push({id:product.id,productName:product.name,trademark:product.trademark,price:product.price,reference_price:product.reference_price,supermarket:product.supermarket})
        }
      )
 
      this.setState({
          productsList:this.state.productsList
        }
      )    

      this.state.productsList.map(i=>{
       
        i.productName=`${i.productName.toLowerCase().replace(i.trademark,"")}  ${i.price} €`
        
        return this.state.productsList,
        
        this.setState({
          productsList:this.state.productsList
        }),

        this.state.options.push(<option key={this.state.productsList.indexOf(i)}value={i.productName} price={i.price}></option>),
     
        this.setState({
      
          options:this.state.options
        })
      })
    })
  }

  handleOnClick(event){

    this.state.productsList.map(i=>{
  
      if(event.target.value!=""&&event.target.value===i.productName&&this.state.productSelected.includes(i)===false){
   
        this.state.productSelected.unshift(i)
        this.setState({
          productSelected:this.state.productSelected,
          placeholder:"Select another product",
          product_list:this.state.product_list
        })
      }
    })
      
    event.preventDefault(),    
    event.target.value=""
      
  }
    
  componentDidMount(){
    this.getProductsToBuy()
  }
 
  render(){
    
    this.getTotalProduct()

    return(
  
    <div className="content" style={{backgroundImage:`url(${fondo})`}}>

      <div className="title">
    
        <h1>Comprar</h1>
      </div>

      {this.state.isLoading?(
      
        <div className="loader">
          <FontAwesomeIcon icon="spinner" spin/>
        </div>
      ):null}
     
      <div className="listaCompraHacerCompra">
    
      {this.state.data.map(i=>{
        if(this.state.data.length>0){
          return(

            <div key={i.idHacerCompra} className="productsHacerCompra">

              <div className="parteIzquierdaHacerCompra">
                {i.name} 
              </div>

              <div className="parteDerechaHacerCompra">
                
                <div className="cantidadPrecioProducto">

                  <input 
                  type='number'
                  id={i.idHacerCompra} 
                  min='1' 
                  placeholder={i.cantidad}
                  value={i.cantidad}
                  onChange={this.handleSelectCantidad} 
                  name={i.name}
                  className="numberHacerCompra">
                  </input>
       
                  _ {i.total.toFixed(2)}€ _
                </div>
                
                <div className="supermarket">
        
                  {i.supermarket}
                </div>

                <div className="borrar">
                  <div className="btn">
                    <button id={i.idHacerCompra} onClick={this.handleDelete}className="btn"></button>
                    <div className="iconHacerCompra">
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
      <div className="parteBaja">

        <div className="total">
          <div className="total-title">
            <h2>Total:  </h2>
          </div>

          <div className="total-cantidad">
            {this.state.data.reduce((a,b)=>a+b.total,0).toFixed(2)} €
          </div>
        </div>

        <div className="añadir-productos">
          <Link to="/mi_lista_compra">Añadir productos</Link>
        </div>
      </div>
      <div className="compra-by-supermarket-wrapper">

        {this.state.data.map(i=>{
 
        if(this.state.data.indexOf(i)===0){
          this.state.productsBySupermarket = this.state.data.filter(i=>i.supermarket===this.state.data[0].supermarket)
          this.state.supermarketsSelected.unshift(this.state.data[0].supermarket)
          return(
            <div className="compra-by-supermarket"
            style={{backgroundImage:`url(${postIt})`}}>
              
            <div key={this.state.data.indexOf(i)} className="products-by-supermarket-title">
            <div className="selected-title">
            <h3> Su compra en:</h3>
            </div> 
              <div className="supermarket">
              <h3 style={{marginBottom:25}}>{this.state.data[0].supermarket} </h3>
              </div>
            </div>

            <div className="listaCompraBySupermarket">
            {this.state.productsBySupermarket.map(i=>{
               
              return(
             
                <div key={i.idHacerCompra} className="productsBySupermarket">
          
                <div className="parteIzquierdaBySupermarket">
 
                  {i.name}
                  </div>
                  <div className="parteDerecha"
                    style={{
                    fontSize: 28,
                    width: 537,
                    marginRight: 0,
                    }}
                  >
                  <input type='number'id={i.idHacerCompra} min='1' placeholder={i.cantidad}value={i.cantidad}onChange={this.handleSelectCantidad} name={i.name}
                    style={{
                      width: 39,
                      fontSize: 24,
                      borderColor: `black`
                    }}
                  ></input>
          
                  _{i.total.toFixed(2)}€
            
                  <div className="borrar">
        
                    <div className="btn">
                      <button id={i.idHacerCompra} onClick={this.handleDelete} className="btn"></button>
                      <div className="iconBySupermarket">
                        <FontAwesomeIcon icon="trash" />
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              )
            })}
          
            <div className="total-by-supermarket">
              <h4>Total:  <i className="cantidadTotal" > {this.state.productsBySupermarket.reduce((a,b)=>a+b.total,0).toFixed(2)}  €</i> </h4>
            </div>
            </div>
            </div>
          )
        } else if(
          i.supermarket!=this.state.data[0].supermarket&&this.state.supermarketsSelected.includes(i.supermarket)===false){
            
            this.state.supermarketsSelected.unshift(i.supermarket)
            const indx=this.state.data.indexOf(i)
            this.state.productsBySupermarket = this.state.data.filter(i=>i.supermarket===this.state.data[indx].supermarket)
           
            return(
                
                <div className="compra-by-supermarket" style={{backgroundImage:`url(${postIt})`}}>
                  <div key={indx} className="products-by-supermarket-title">
                    <div className="selected-title">
                      <h3 > Su compra en:</h3>
                    </div> 
                  <div className="supermarket">
                    <h3 style={{marginBottom:0}}>{this.state.data[indx].supermarket} </h3>
                  </div>
                </div>
                
                <div className="listaCompraBySupermarket">
                
                {this.state.productsBySupermarket.map(i=>{
                  return(
                    <div key={i.idHacerCompra} className="productsBySupermarket">
                      <div className="parteIzquierdaBySupermarket">
                        {i.name}
                      </div>
                      <div className="parteDerecha"
                        style={{
                        width: 88,
                        fontSize: 26
                        }}  
                      >
                      <input type='number'id={i.idHacerCompra} min='1' placeholder={i.cantidad}value={i.cantidad}onChange={this.handleSelectCantidad} name={i.name}
                          style={{
                          width: 39,
                          fontSize: 24
                          }}  
                      ></input>
                        
                      _{i.total.toFixed(2)}€  
              
                      <div className="borrar">
                        <div className="btn">
                          <button id={i.idHacerCompra} onClick={this.handleDelete} className="btn"></button>
                          <div className="iconBySupermarket">
                            <FontAwesomeIcon icon="trash" />
                          </div>
                        </div>
                      </div>
                    </div>
                    </div>
                  )
                })}
                <div className="total-by-supermarket"
                  style={{marginLeft:353}}>
                
                  <h4>Total:  <i className="cantidadTotal" > {this.state.productsBySupermarket.reduce((a,b)=>a+b.total,0).toFixed(2)}  €</i> </h4>
                </div>
                </div>
              </div>
            )
          }})} 
        

        </div>

      </div>
    ) 
  }
}