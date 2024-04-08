import React from "react";
import { NavLink } from "react-router-dom";

const NavigationComponent = props => {
  
  return (
    <div className="nav-wrapper">
      
   
        <div className="nav-link-wrapper">
          <NavLink to={"/hacer_lista_compra"}>
            <h2
            style={{marginTop:61}}
            >Hacer lista de la compra </h2>
          </NavLink>
        </div>

       
  </div>
  );
};

export default NavigationComponent;