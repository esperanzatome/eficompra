import React, { Component } from "react";
import axios from "axios";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash, faSpinner, faShareNodes } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

library.add(faTrash, faSpinner, faShareNodes);

export default class Login extends Component {
  constructor(props) {
    super();
    this.state = {
      email: "",
      password: "",
      inputType: "password"
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleVerContraseña = this.handleVerContraseña.bind(this);
    this.handleDivInput = this.handleDivInput.bind(this);
    this.ajustarViewport = this.ajustarViewport.bind(this);

    this.emailInput = React.createRef();
  }

  componentDidMount() {
    // Escuchamos el cambio de tamaño real provocado por el teclado móvil
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", this.ajustarViewport);
      window.visualViewport.addEventListener("scroll", this.ajustarViewport);
    }
  }

  componentWillUnmount() {
    if (window.visualViewport) {
      window.visualViewport.removeEventListener("resize", this.ajustarViewport);
      window.visualViewport.removeEventListener("scroll", this.ajustarViewport);
    }
  }

  ajustarViewport() {
    // Forzamos al contenedor a medir exactamente el espacio visible que deja el teclado
    const contenedor = document.querySelector(".formulariosContentLogin");
    if (contenedor && window.visualViewport) {
      contenedor.style.height = `${window.visualViewport.height}px`;
      window.scrollTo(0, 0);
    }
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleDivInput(event) {
    this.setState({
      email: event.target.innerText
    });
  }

  handleOnClick(event) {
    let listaId = "";
    let emailInputValue = this.emailInput.current ? this.emailInput.current.innerText : this.state.email;
    
    if (event != undefined && emailInputValue != "" && this.state.password != "") {
      axios
        .post("https://onrender.com", {
          email: emailInputValue,
          password: this.state.password
        })
        .then(response => {
          if (Object.values(response.data).length === 0) {
            window.alert("E-mail o contraseña incorrectos");
          } else {
            localStorage.setItem("id", `${Object.values(response.data).id}`);
            localStorage.setItem("alias", `${Object.values(response.data).alias}`);
            
            if (localStorage.getItem("listaCompartida") != "") {
              axios.post("https://onrender.com", {
                listasdelacompra: localStorage.getItem("listaCompartida")
              })
              .then(response => {
                let usuarios = [];
                let comprado = "";
                let listaName = "";
                let usuariosIds = [];

                if (response.data.length > 0) {
                  response.data.map(i => {
                    usuarios.push(i.alias);
                    comprado = i.comprado;
                    listaName = i.listaName;
                    usuariosIds.push(i.userId);
                  });

                  if (usuarios.includes(localStorage.getItem("alias")) === false) {
                    axios.post("https://onrender.com", {
                      userId: localStorage.getItem("id"),
                      alias: localStorage.getItem("alias"),
                      listasdelacompra: localStorage.getItem("listaCompartida"),
                      comprado: comprado,
                      listaName: listaName
                    })
                    .then(response => {
                      usuariosIds.map(i => {
                        axios.post("https://onrender.com", { id: i });
                      });
                      localStorage.setItem("listaCompartida", "");
                      window.location.href = "/mis_listas_compra";
                    });
                  } else {
                    usuariosIds.map(i => {
                      axios.post("https://onrender.com", { id: i });
                    });
                    localStorage.setItem("listaCompartida", "");
                    window.location.href = "/mis_listas_compra";
                  }
                }
              });
            }
            
            if (localStorage.getItem("products") != "") {
              axios.post("https://onrender.com", {
                listaId: null,
                userId: localStorage.getItem("id")
              })
              .then(response => {
                axios.get("https://onrender.com")
                .then(response => {
                  listaId = Object.values(response.data);
                  axios.post("https://onrender.com", {
                    userId: localStorage.getItem("id"),
                    alias: localStorage.getItem("alias"),
                    listasdelacompra: Object.values(response.data),
                    comprado: [false],
                    listaName: localStorage.getItem("listaTitle")
                  })
                  .then(response => {
                    let products = localStorage.getItem("products");
                    products = products.split(",");
                    products.map(i => {
                      axios.post("https://onrender.com", {
                        listaId: listaId,
                        product: i
                      })
                      .then(response => {
                        localStorage.setItem("products", "");
                        window.location.href = "/mis_listas_compra";
                      });
                    });
                  });
                });
              });
            } else {
              window.location.href = "/mis_listas_compra";
            }
          }
        });
    }
  }

  handleVerContraseña(event) {
    if (event.target.checked === true) {
      this.setState({ inputType: "text" });
    } else {
      this.setState({ inputType: "password" });
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
            <div
              contentEditable
              role="textbox"
              ref={this.emailInput}
              onInput={this.handleDivInput}
              spellCheck="true"
              autoCorrect="on"
              data-placeholder="Your email"
              className="div-input-horizontal"
            ></div>
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
              <Link to="../hacer_lista_compra"></Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

