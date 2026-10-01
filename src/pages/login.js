import React, { Component } from "react";
import axios from "axios";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash, faSpinner,faShareNodes } from "@fortawesome/free-solid-svg-icons";

import { Link } from "react-router-dom";

library.add(faTrash, faSpinner, faShareNodes);

export default class Login extends Component {

  constructor(props){
    super()
    this.state = {
        email: "",
 
        password: "",
      
        inputType: "password"
      };
  
      this.handleChange = this.handleChange.bind(this);
      this.handleOnClick = this.handleOnClick.bind(this);
      this.handleVerContraseña = this.handleVerContraseña.bind(this);
      

      this.emailInput=React.createRef()
      
    }
    
    handleChange(event) {
      this.setState({
        [event.target.name]: event.target.value
      });
    }
   
     
     
       
    
    handleOnClick(event) {
   let listaId="";
   let emailInputValue= this.emailInput.current.value
      if(event!=undefined&&this.state.email!=""&&this.state.password!=""){

        axios
        .post("https://eficompraserver.onrender.com/login",{
          
          email:emailInputValue,
          password:this.state.password
        })
        
    
        .then(response=>{
 
        if(Object.values(response.data)[0].length===0){
          window.alert("E-mail o contraseña incorrectos")
         
         
        }else{
         localStorage.setItem("id",`${Object.values(response.data)[0][0].id}`)
           localStorage.setItem("alias",`${Object.values(response.data)[0][0].alias}`)
        if(localStorage.getItem("listaCompartida")!=""){
   axios.post("https://eficompraserver.onrender.com/recuperarListaCompartida",{
    
      listasdelacompra:localStorage.getItem("listaCompartida")
    

    })
          .then(response=>{
            console.log(response.data)
       let usuarios=[]
       let comprado=""
       let listaName=""
       let usuariosIds=[]

         if(response.data.length>0){
      
          response.data.map(i=>{
usuarios.push(i.alias)
comprado=i.comprado
listaName=i.listaName
usuariosIds.push(i.userId)
})

 
            if(usuarios.includes(localStorage.getItem("alias"))===false){

axios.post("https://eficompraserver.onrender.com/usuario",{
                    userId: localStorage.getItem("id"),
                    alias: localStorage.getItem("alias"),
                    listasdelacompra:localStorage.getItem("listaCompartida") ,
                    comprado:comprado,
                    listaName:listaName
                  })
                  .then(response=>{
                    console.log("usuario-lista creado")
               
                      usuariosIds.map(i=>{
             
                         axios.post("https://eficompraserver.onrender.com/revocarPrivilegios",{
                          id:i
                        }).then(response=>{
                          console.log(response)
                        })
                      })
                       localStorage.setItem("listaCompartida","")
                  window.location.href ="/mis_listas_compra"
                    
                    })
            }else{
                  usuariosIds.map(i=>{
                
                         axios.post("https://eficompraserver.onrender.com/revocarPrivilegios",{
                          id:i
                        }).then(response=>{
                          console.log(response)
                        })
                      })
                       localStorage.setItem("listaCompartida","")
                  window.location.href ="/mis_listas_compra"
                    
            }
            
              

            
          
          

         }
          
                      
          })
        }
    if(localStorage.getItem("products")!=""){
   
   
   
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
           comprado:[false],
           listaName:localStorage.getItem("listaTitle")
         })
         .then(response=>{
           console.log("usuario-lista creado")
      
           let products=localStorage.getItem("products")
           products=products.split(",")
     
      products.map(i=>{
             
            axios.post("https://eficompraserver.onrender.com/miListaCompra",{
             
               listaId:listaId,
               product:i
               
         })
         .then(response=>{
   
     localStorage.setItem("products","")
                 
   window.location.href="\mis_listas_compra"
            
         })
        })
         
             
       
         
     
       })
   
      
       })})
   
   
   
   
   
   
             
               
                }else{
                 window.location.href="\mis_listas_compra"
                }
      }
      
         
       
        }
      )
       
    }
  
  }
  handleVerContraseña(event){

if(event.target.checked===true){
this.setState({
  inputType:"text"

})
}else(
  this.setState({
    inputType:"password"
  })
)
  }
  componentDidMount() {
    if (navigator.virtualKeyboard) {
      navigator.virtualKeyboard.overlaysContent = true;
    }
  }
        render() {
    return (
      <div className="formulariosContentLogin">
        <div className="loginTitle">
          <h1>Login</h1>
        </div>
        <div className="form">
          
      
          <div className="emailInput">
            <div className="inputTitle">Email</div>
            <input
        
              type="email"
              name="email"
              placeholder="Your email"
              ref={this.emailInput}
              
         spellCheck="false"
            
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="off"
              style={{ fontSize: '16px' }} 
            />
          </div>
              
        
          <div className="contraseña">
            <div className="contraseñaInput">
              <div className="inputTitle">Contraseña</div>
              <input
                type={this.state.inputType}
                name="password"
                placeholder="Your password"
                value={this.state.password}
                onChange={this.handleChange}
    
                autoCapitalize="none"
                autoCorrect="off"
                autoComplete="current-password"
                style={{ fontSize: '16px' }} 
              />
            </div>
            
      
            <div className="contraseñaCheckBox">
              <div className="checkBoxTitle">Ver contraseña</div>
              <input 
                type="checkbox" 
                name="verContraseña" 
                onChange={this.handleVerContraseña} 
                checked={this.state.inputType === "text"} 
              />
            </div>
          </div>
     
          <div className="buttons">
            <div className="loginBtn">
              <button onClick={this.handleOnClick}>Entrar</button>
            </div>
            <div className="registro">
              <Link to="../registro">Registrar</Link>
            </div>
            <div className="exit">
              <Link to="../hacer_lista_compra">Salir</Link>
            </div>
          </div>

        </div>
      </div>
    );
  }

}
