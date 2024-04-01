import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import fondo from "../hoja-arrugada.jpg";
import postIt from "../post-it.jpg";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash, faSpinner } from "@fortawesome/free-solid-svg-icons";




library.add(faTrash, faSpinner);

export default class HacerCompra extends Component {
  state={
    data:[],
    productsBySupermarket:[],
    supermarketsSelected:[],
    isLoading:true,
    productsBySupermarketOrdened:[]
  }
  getProductsToBuy(){
    axios
    .get("http://localhost:3001/hacerCompra")
    .then((response) => {
      this.setState({
        data:response.data,
        isLoading:false
})


this.selectSupermarket()
this.productsBySupermarket()
this.keysByCompraBySupermarkets()
this.limpiarBaseDatos()



  })}
    
limpiarBaseDatos(){
 
  this.state.data.map(i=>{
   
    return(
      axios
      .delete("http://localhost:3001/hacerCompra/${i.idHacerCompra}"),[i.idHacerCompra]
    )
    
   
    
})}
    

selectSupermarket(){
  this.state.data.map(i=>{
    
    
    if(this.state.supermarketsSelected.includes(i.supermarket)===false){
      return(
        this.setState({
          supermarketsSelected:this.state.supermarketsSelected.unshift(i.supermarket)
        })
      )
    }})}
    
  productsBySupermarket(){
    this.state.supermarketsSelected.map(sm=>{
     
      this.state.productsBySupermarket.unshift(this.state.data.filter(i=>i.supermarket===sm))
      
 
      return(
        this.setState({
          productsBySupermarket:this.state.productsBySupermarket
        })
       
      )
   
  }

    )}
 keysByCompraBySupermarkets(){
 
  this.state.productsBySupermarket.map(i=>{

 const iOrdened=Object.groupBy(i, ({ supermarket }) => supermarket)

this.state.productsBySupermarketOrdened.unshift(iOrdened)
this.setState({
  productsBySupermarketOrdened: this.state.productsBySupermarketOrdened
})



})}
getTotalProduct(){
 
  this.state.data.map(i=>{
    i.total=i.cantidad*i.price
  })
  this.state.productsBySupermarketOrdened.map(i=>{
    
    
    Object.values(i).map(products=>{
    products.map(product=>{
      product.total=product.cantidad*product.price
      
    })
    })
      
    
  })
}



  constructor(props){
    super()

    this.handleSelectCantidad=this.handleSelectCantidad.bind(this)
    this.handleDelete=this.handleDelete.bind(this)
    this.handleNewList=this.handleNewList.bind(this)
    this.selectSupermarket=this.selectSupermarket.bind(this)
    this.productsBySupermarket=this.productsBySupermarket.bind(this)
    this.keysByCompraBySupermarkets=this.keysByCompraBySupermarkets.bind(this)
    this.limpiarBaseDatos=this.limpiarBaseDatos.bind(this)
  }

 


  handleSelectCantidad(event){
  

  this.state.data.map(i=>{

    if(event.target.name===i.name){
  
      i.cantidad=parseInt(event.target.value)
    }
  })
  
this.state.productsBySupermarket.map(i=>{
i.map(product=>{
  if(event.target.name===product.name){
product.cantidad=parseInt(event.target.value)
  }
})
})
return(

  this.setState({
  data:this.state.data,
  productsBySupermarket:this.state.productsBySupermarket
  })
)
  }
  handleNewList(event){
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

  

  handleDelete(event){
 
  
    this.state.data.map(i=>{

      if(event.target.id===i.idHacerCompra){

        this.state.data.splice(this.state.data.indexOf(i),1)
    
      }else if(event.target.id===i.name){
        this.state.data.splice(this.state.data.indexOf(i),1)
        
      }
   
    })
    
   
    Object.values(this.state.productsBySupermarketOrdened).map(i=>{
     
      Object.values(i).map(product=>{
       
      
        product.map(productLine=>{
         
          if(event.target.id===productLine.idHacerCompra){
            product.splice(product.indexOf(productLine),1)
           
          }else if(event.target.id===productLine.name){
            product.splice(product.indexOf(productLine),1)

          }
        })
      
      
      })
      
    })
      return(

        this.setState({
        data:this.state.data,
        productsBySupermarketOrdened:this.state.productsBySupermarketOrdened
        })
      )
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
                <div className="supermarket-borrar">
                <div className="supermarket">
        
                  {i.supermarket}
                </div>
  
                <div className="borrarHacerCompra">
                  <div className="btn">
                    <button id={i.idHacerCompra} onClick={this.handleDelete}className="btn"></button>
                    <div className="iconHacerCompra">
                      <FontAwesomeIcon icon="trash" />
                    </div>
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

        <Link to="/mi_lista_compra" onClick={this.handleNewList}>Añadir productos</Link>
        {console.log(this.state.data)}
        
       
     
      </div>
    </div>
    <div className="compra-by-supermarket-wrapper">
      
     
{this.state.productsBySupermarketOrdened.map(i=>{
{if(this.state.isLoading===false){
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
          {console.log(Object.keys(i))}
          {console.log(Object.values(i))}
          {console.log(Object.values(i)[0])}
    
       
        {Object.values(i)[0].map(product=>{
         
            console.log(product)
            return(
              <div key={product.idHacerCompra} className="productsBySupermarket">
              <div className="parteIzquierdaBySupermarket">
              
              {product.name}
                  </div>
                  
                      <div className="parteDerechaBySupermarket">
                      
                      <input type='number'id={product.name} min='1' placeholder={product.cantidad}onChange={this.handleSelectCantidad} value={product.cantidad}name={product.name}
                      style={{
                      
                      }}
                    ></input>
                    _ {product.total.toFixed(2)}€
                    <div className="borrar">
             
                        <div className="btn">
                          <button id={product.name} onClick={this.handleDelete} className="btn"></button>
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
}
  
  
  
    }})}
     
 
</div>
</div>)}}
  
  
   
      
  
  


     
 
    
    
     
 
   
     

    
      
 

    {/*
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
 
    
          </div>)}}
            
    

                         
                     
                    
            
            
            
            
            
            
            
            
            
            
            
              
      
{/*
      {this.state.data.map(i=>{
        if(this.state.data.indexOf(i)===0){
          this.state.productsBySupermarket=this.state.data.filter(i=>i.supermarket===this.state.data.indexOf(i).supermarket)
          this.state.supermarketsSelected=i.supermarket
          console.log(this.state.productsBySupermarket)
          console.log(this.state.data.filter(i=>i.supermarket===this.state.data.indexOf(i).supermarket))
          return(
            console.log(i),
            <div className="compra-by-supermarket"
            style={{backgroundImage:`url(${postIt})`}}>
              
            <div key={i.idHacerCompra} className="products-by-supermarket-title">
            <div className="selected-title">
            <h3> Su compra en:</h3>
            </div> 
              <div className="supermarket">
              <h3 style={{marginBottom:25}}>{i.supermarket} </h3>
              </div>
            </div>
        
            <div className="listaCompraBySupermarket">
              {console.log(this.state.productsBySupermarket)}
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
</div>
      </div>
     
    )}

    else if(this.state.data.indexOf(i)!=0&&this.state.supermarketsSelected.includes(i.supermarket)===false){
      //this.state.productsBySupermarket.unshift(this.state.data.filter(i=>i.supermarket===this.state.data.indexOf(i).supermarket))
      //this.state.supermarketsSelected.unshift(i.supermarket)
      return(
        <div className="compra-by-supermarket"
        style={{backgroundImage:`url(${postIt})`}}>
          
        <div key={i.id} className="products-by-supermarket-title">
        <div className="selected-title">
        <h3> Su compra en:</h3>
        </div> 
          <div className="supermarket">
          <h3 style={{marginBottom:25}}>{i.supermarket} </h3>
          </div>
        </div>
    
 
  </div>
 
 
)
    }
          })}
          </div>
          </div>
    )
        }
      }
    
     /*
      <div className="compra-by-supermarket-wrapper">
    {console.log(this.state.productsBySupermarket)}
      {this.state.productsBySupermarket}
      </div>
      
     {this.state.data.map(i=>{
      
       if(this.state.data.indexOf(i)===0){
          this.state.productsBySupermarket = this.state.data.filter(i=>i.supermarket===this.state.data[0].supermarket)
        
              this.state.supermarketsSelected.unshift(this.state.data[0].supermarket)
          
          console.log(this.state.productsBySupermarket);
          console.log(this.state.supermarketsSelected)
          return(
            <div className="compra-by-supermarket"
            style={{backgroundImage:`url(${postIt})`}}>
              
            <div key={this.state.data.indexOf(i)} className="products-by-supermarket-title">
            <div className="selected-title">
            <h3> Su compra en:</h3>
            </div> 
              <div className="supermarket">
              <h3 style={{marginBottom:25}}>{this.sta
                te.data[0].supermarket} </h3>
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
           console.log(this.state.productsBySupermarket)
           console.log(this.state.supermarketsSelected) 
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
          }
         
        })
         
          } 
        
       
        </div>
        */}
     

