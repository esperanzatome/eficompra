import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { withRouter } from "react-router";
import { NavLink } from "react-router-dom";

const NavigationComponent = props => {
  const dynamicLink = (route, linkText) => {
    return (
      <div className="nav-link-wrapper">
        <NavLink to={route} activeClassName="nav-link-active">
          {linkText}
        </NavLink>
      </div>
    );
  };

  return (
    <div className="nav-wrapper">
      
   
        <div className="nav-link-wrapper">
          <NavLink to="/hacer_lista_compra" activeClassName="nav-link-active">
            <h2
            style={{marginTop:61}}
            >Hacer lista de la compra </h2>
          </NavLink>
        </div>

       
  </div>
  );
};

export default withRouter(NavigationComponent);