import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import NoMatch from "./pages/no-match";
import HacerListaCompraContainer from './pages/hacer_lista_compra/hacer_lista_compra_container';
import HacerCompra from './pages/hacer_compra';
import HacerListaCompraTodos from './pages/hacer_lista_compra/hacer_lista_compra_todos';
import MiListaCompra from './pages/hacer_lista_compra/mi_lista_compra';
import Home from './pages/home';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

library.add(faTrash, faSignOutAlt);
function App() {
  return (
    <div className="container">
        
    <Router>
      <div >
       <Routes>
          <Route exact path="/" element={<Home/>}/>      
          <Route path="/hacer_lista_compra" element={<HacerListaCompraContainer/>} />
          <Route path="/hacer_compra" element={<HacerCompra/>}/>
          <Route path="/hacer_lista_compra_todos"element={<HacerListaCompraTodos/>}/>
          <Route path="/mi_lista_compra"element={<MiListaCompra/>}/>
          <Route element={<NoMatch/>}/>

       </Routes>


         
   
      </div>
    </Router>
  </div>
  );
}

export default App;
