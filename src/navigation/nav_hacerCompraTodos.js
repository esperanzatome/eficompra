import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { withRouter } from "react-router";
import { NavLink } from "react-router-dom";

const NavHacerCompraTodos = props => {
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
          <NavLink to="../pages/hacer_compra" activeClassName="nav-link-active">
         
            hacer_compra
          </NavLink>
        </div>

        

    
    </div>
  );
};

export default withRouter(NavHacerCompraTodos);