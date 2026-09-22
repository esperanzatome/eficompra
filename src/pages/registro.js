import React, { Component } from "react";
import axios from "axios";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash, faSpinner,faShareNodes } from "@fortawesome/free-solid-svg-icons";

import { Link } from "react-router-dom";



library.add(faTrash, faSpinner, faShareNodes);

export default class Registro extends Component {
  
  constructor(props){
    super()
    this.state = {
        email: "",
        emailConfirm:"",
        password: "",
        passwordConfirm:"",
        inputType: "password",
        alias:"",
        listaCompraTitle:[]
      };
  
      this.handleChange = this.handleChange.bind(this);
      this.handleClick = this.handleClick.bind(this);
      this.handleVerContraseña = this.handleVerContraseña.bind(this);
   
    }
  
    handleChange(event) {
      this.setState({
        [event.target.name]: event.target.value
      });
    }
   
     
     
       
    
    handleClick(event) {
      let listaId=""
     
      if(event!=undefined&&this.state.email!=""&&this.state.email===this.state.emailConfirm&&this.state.password!=""&&this.state.password===this.state.passwordConfirm){
       
        axios
        .post("http://localhost:10000/registro",{
          id: null,
          email:this.state.email,
          password:this.state.password,
          alias:this.state.alias
        })

        .then(response=>{

        if(response.data.error==="usuario existente"){
          if(window.confirm(`El usuario ${this.state.email} ya está registrado.
            ¿Quieres recuperar la contraseña?`)===true){
            window.alert(`Se mandará un Email a ${this.state.email}`)
            }
        }else{

  if( window.confirm(`¡Ya has sido registrado!. 
            Se mandará un mensaje de confirmación a ${this.state.email}
              ¿Quieres ir a "Mis listas de la compra?`)===true){
               axios.post("https://eficompraserver.onrender.com/recuperarIdRegistro",{
          email: this.state.email})
          .then(response=>{
      
             localStorage.setItem("id", `${response.data[0].id}`)
             localStorage.setItem("alias",this.state.alias)
             if(localStorage.getItem("products")!==null&&localStorage.getItem("products").length>0){



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
        console.log(products)
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






          
            
             }
               if(localStorage.getItem("listaCompartida")!=""){
                axios.post("https://eficompraserver.onrender.com/recuperarListaCompartida",{
                 
                   listasdelacompra:localStorage.getItem("listaCompartida")
                 
             
                 })
                       .then(response=>{
                  
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
             
              
                         if(usuarios.includes(localStorage.getItem("id"))===false){
             
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
                          /*
                               usuariosIds.map(i=>{
                                     console.log(i)
                                      axios.post("http://localhost:10000/revocarPrivilegios",{
                                       id:i
                                     }).then(response=>{
                                       console.log(response)
                                     })
                                   })
                                     */
                                    localStorage.setItem("listaCompartida","")
                               window.location.href ="/mis_listas_compra"
                                 
                         }
                         
                           
             
                         
                       
                       
             
                      }
                       
                                   
                       })
                     }
                     else{
              window.location.href="\mis_listas_compra"
             }
          })
               
              
              }else(
                window.location.href="\hacer_lista_compra"
              )




        
         
            }}
        )
       

        
        
    
      }
      else if(this.state.alias===""){
        window.alert("Por favor introduzca un alias")
      }
      else{
        window.alert("Los datos son incorrectos")
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
    
    render() {
      return (
        <div className="containerRegistro">
          
  <div className="formulariosContentRegistro">
    <div className="registroTitle">
  <h1>Registro</h1>
  </div>
  <div className="form">
    <div className="emailInput">
          <div className="inputTitle">
            Email
          </div>
            <input
              type="email"
              name="email"
              placeholder="Your email"
              value={this.state.email}
              onChange={this.handleChange}
            />
            </div>
            <div className="emailInput">
  <div className="inputTitle">
            Confirmar Email
          </div>
            <input
              type="email"
              name="emailConfirm"
              placeholder="Your email"
              value={this.state.emailConfirm}
              onChange={this.handleChange}
            />
            </div>
    <div className="contraseña">
            <div className="contraseñaInput">
              <div className="inputTitle">
             Contraseña
              </div>
              <input
              type={this.state.inputType}
              name="password"
              placeholder="Your password"
              value={this.state.password}
              onChange={this.handleChange}
              />
            </div>
            <div className="contraseñaCheckBox">
              <div className="checkBoxTitle">
                Ver contraseña
              </div>
                <input type="checkbox" id="verContraseña" onClick={this.handleVerContraseña} value={this.state.password}/>
            </div>
            
             
            </div>
    <div className="contraseña">
         <div className="contraseñaInput">
           <div className="inputTitle">
          Confirmar Contraseña
           </div>
           <input
           type={this.state.inputType}
           name="passwordConfirm"
           placeholder="Your password"
           value={this.state.passwordConfirm}
           onChange={this.handleChange}
           />
         </div>
         {/*
         <div className="contraseñaCheckBox">
           <div className="checkBoxTitle">
             Ver contraseña
           </div>
             <input type="checkbox" id="verContraseña" onClick={this.handleVerContraseña} value={this.state.passwordConfirm}/>
         </div>
         */}
        
         </div>
    <div className="alias">
      <div className="aliasInput">
           <div className="inputTitle">
          Alias
           </div>
           <input
           type= "text"
           name="alias"
           placeholder="Alias"
           value={this.state.alias}
           onChange={this.handleChange}
           />
         </div>
    </div>
    <div className="registroBtn">
            <button onClick={this.handleClick}>Registrar</button>
        </div>
       
        <div className="exit">
              
             <Link to= "../hacer_lista_compra"></Link>
              
        
        </div>
        </div>
        </div>
        </div>
      )}
       }