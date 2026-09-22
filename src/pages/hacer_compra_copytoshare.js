import React, { Component } from "react";
import axios from "axios";
import fondo from "../hoja-arrugada.jpg";
import postIt from "../post-it.jpg";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash, faSpinner } from "@fortawesome/free-solid-svg-icons";



library.add(faTrash, faSpinner);

export default class HacerCompraCopyToShare extends Component {
  
  constructor(props){
    super()
    this.state={
      data: JSON.parse(localStorage.getItem("dataCopy")),
      productsBySupermarketOrdened:JSON.parse(localStorage.getItem("productsBySupermarketOrdenedCopy")),
      total: JSON.parse(localStorage.getItem("totalCopy"))
    }


  }
  render(){
   
    return(
       
 
    <div className="content" style={{backgroundImage:`url(${fondo})`}}>

      <div className="title">
    
        <h1>Comprar</h1>
      </div>

     <div className="listaCompraHacerCompra">
     
    
    {this.state.data.map(i=>{
      

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
           
              
                  name={i.name}
                  className="numberHacerCompra">
                  </input>
     
               _ {i.total.toFixed(2)}€ _ 
                </div>
                <div className="supermarket-borrar">
                <div className="supermarket">
        
                  {i.supermarket}
                </div>
  
                <div className="borrarHacerCompra">
                  <div className="btn">
                    <button id={i.idHacerCompra} 
                    className="btn"></button>
                    <div className="iconHacerCompra">
                      <FontAwesomeIcon icon="trash" />
                    </div>
                  </div>
                </div>
                </div>
              </div>
            </div>
          
        )
        
      
    
      
    })}

    </div>
    <div className="parteBajaCopyToShare">

      <div className="total">
        <div className="total-title">
          <h2>Total:  </h2>
        </div>

        <div className="total-cantidad">
       
  
     {this.state.total[0]}


       
          
          
        </div>
      </div>
</div>
    <div className="compra-by-supermarket-wrapper">
      
   
{this.state.productsBySupermarketOrdened.map(i=>{

  if(Object.values(i)[0].length>0){
  
    return(
      <div className="compra-by-supermarket"style={{backgroundImage:`url(${postIt})`}}>
        <div key={Object.keys(1)} className="products-by-supermarket-title">
        <div className="selected-title">
        <h3> Su compra en:</h3>
        </div> 
      <div className="supermarketBySupermarket">
          <h3 style={{marginBottom:25}}>{Object.keys(i)} </h3>
          </div>
        </div>
    
        <div className="listaCompraBySupermarket">
        
       
        {Object.values(i)[0].map(product=>{
         
            
            return(
              <div key={product.idHacerCompra} className="productsBySupermarket">
              <div className="parteIzquierdaBySupermarket">
              
              {product.name}
                  </div>
                  
                      <div className="parteDerechaBySupermarket">
                      
                      <input type='number'id={product.name} min='1' placeholder={product.cantidad}
                      onChange={this.handleSelectCantidad}
                       value={product.cantidad}name={product.name}
                     
                    ></input>
                    _ {product.total.toFixed(2)}€ 
                    <div className="borrar">
             
                        <div className="btn">
                          <button id={product.name} 
                          onClick={this.handleDelete} 
                          className="btn"></button>
                          <div className="iconBySupermarket">
                            <FontAwesomeIcon icon="trash" />
                          </div>
                          
                          
                        </div>
                      </div>
                    </div>
                   
               </div>
             
            )
          })
          
         
    }
    
    
    <div className="total-by-supermarket">
            
         <h4>Total:  <i className="cantidadTotal" > 
         {Object.values(i)[0].reduce((a,b)=>a+b.total,0).toFixed(2)}  €</i> </h4>
       </div>
      </div>
    
      </div>
    )
  }

  
  
  
    })}

 
</div>
</div>)}}