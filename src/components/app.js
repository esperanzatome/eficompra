
import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faTrash,
  faSignOutAlt,
  faEdit,
  faSpinner
} from "@fortawesome/free-solid-svg-icons";

import Home from './pages/home';
import NoMatch from "./pages/no-match";
import HacerListaCompraContainer from './pages/hacer_lista_compra/hacer_lista_compra_container';
import HacerCompra from './pages/hacer_compra';
import HacerListaCompraTodos from './pages/hacer_lista_compra/hacer_lista_compra_todos';
import MiListaCompra from './pages/hacer_lista_compra/mi_lista_compra';


library.add(faTrash, faSignOutAlt, faEdit, faSpinner);

export default class App extends Component {
  constructor(props) {
    super();

    
  }

  
  render() {  
 
    return (
      <div className="container">
        
        <Router>
          <div>
            <Switch>

              <Route exact path="/" component={Home}/>      
              <Route path="/hacer_lista_compra" component={HacerListaCompraContainer} />
              <Route path="/hacer_compra" render={props=>(
                <HacerCompra {...props}/>)}
              />
             <Route path="/hacer_lista_compra_todos"component={HacerListaCompraTodos}/>
             <Route path="/mi_lista_compra"component={MiListaCompra}/>
              <Route component={NoMatch}/>
            </Switch>
          </div>
        </Router>
      </div>
    )
  }
}