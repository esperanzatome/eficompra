import React from "react";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import NoMatch from "./pages/no-match";
import HacerListaCompraContainer from './pages/hacer_lista_compra/hacer_lista_compra_container';
import Registro from './pages/registro';
import Login from './pages/login';
import HacerCompraCopyToShare from './pages/hacer_compra_copytoshare';
import HacerListaCompraTodos from './pages/hacer_lista_compra/hacer_lista_compra_todos';
import MisListasDeLaCompra from './pages/hacer_lista_compra/mis_listas_compra';
import ListaCompraCompartir from './pages/listaCompraCompartir';
import Home from './pages/home';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash, faSignOutAlt, faShareNodes } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect } from 'react';
library.add(faTrash, faSignOutAlt, faShareNodes);


function App() {
useEffect(()=>{
const forzarHorizontal = async()=>{
  try{
    if(document.documentElement.requestFullscreen){
      await document.documentElement.requestFullscreen();
    }
     if(screen.orientation&&screen.orientation.lock){
      await screen.orientation.lock('landscape-primary');
    }
  } catch(error){
  console.log("El navegador obliga a hacer click primero:",error);
  }
}
window.addEventListener("click", forzarHorizontal);{
return()=>window.removeEventListener("click", forzarHorizontal);
}
},[]);
  return (
    <div className="container">
        
    <Router>
      <div >
       <Routes>
          <Route exact path="/" element={<Home/>}/>      
          <Route path="/hacer_lista_compra" element={<HacerListaCompraContainer/>} />
          <Route path="/hacer_compra_copytoshare" element={<HacerCompraCopyToShare/>}/>
          <Route path="/hacer_lista_compra_todos"element={<HacerListaCompraTodos/>}/>
          <Route path="/registro"element={<Registro/>}/>
          <Route path="/login"element={<Login/>}/>
          <Route path="/mis_listas_compra"element={<MisListasDeLaCompra/>}/>
          <Route path="/listaCompraCompartir/:listadelacompra/:alias" element={<ListaCompraCompartir/>}/>
          <Route element={<NoMatch/>}/>

       </Routes>


         
   
      </div>
    </Router>
  </div>
  );
}

export default App;
