import React, { Component } from "react";
import NavigationComponent from "../navigation/navigation_container";
import "../style/main.scss";

export default class Home extends Component {
  
    render() {
        
        return (
            <div className="container-home">
               
            <div className="titulo-principal">
                <h1 style={{marginTop:-36}}>Eficompra</h1>
            </div>
            
            <div className="seleccion-principal">
                
                <div className="navigation-component">
                    <NavigationComponent/>
                </div>
            </div>
            </div>
        )
    }
}