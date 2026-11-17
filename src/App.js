import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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

library.add(faTrash, faSignOutAlt, faShareNodes);

function RedireccionInicial({ children }) {
  const token = localStorage.getItem('tokenSesion');
  const location = useLocation(); // Captura ?voz=1 si viene en la URL
  return token ? <Navigate to={`/mis_listas_compra${location.search}`} replace /> : children;
}

function RutaPrivada({ children }) {
  const token = localStorage.getItem('tokenSesion'); 
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <div className="container">
      <Router>
        <div>
          <Routes>
            <Route 
              path="/" 
              element={
                <RedireccionInicial>
                  <Home />
                </RedireccionInicial>
              } 
            />
            <Route 
              path="/login" 
              element={
                <RedireccionInicial>
                  <Login />
                </RedireccionInicial>
              } 
            />
            <Route 
              path="/mis_listas_compra" 
              element={
                <RutaPrivada>
                  <MisListasDeLaCompra />
                </RutaPrivada>
              } 
            />
            <Route path="/hacer_lista_compra" element={<HacerListaCompraContainer />} />
            <Route path="/hacer_compra_copytoshare" element={<HacerCompraCopyToShare />} />
            <Route path="/hacer_lista_compra_todos" element={<HacerListaCompraTodos />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/listaCompraCompartir/:listadelacompra/:alias" element={<ListaCompraCompartir />} />
            <Route path="*" element={<NoMatch />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
