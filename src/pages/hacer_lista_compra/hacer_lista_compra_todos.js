import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash, faSpinner } from "@fortawesome/free-solid-svg-icons";

library.add(faTrash, faSpinner);

export default class MisListasDeLaCompra extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      productsList: [],
      options: [],
      abecedario: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "Ñ", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
      opcionesPorLetra: [],
      palabrasPorLetra: [],
      productosFrecuentes: [
        { category: "pan", name: "pan" }, { category: "cocinados", name: "comida preparada" },
        { category: "carne", name: "carne" }, { category: "pasta", name: "pasta" },
        { category: "dulces", name: "azúcar" }, { category: "hogar", name: "jabón de la ropa" },
        { category: "desayuno", name: "café" }, { category: "huevos", name: "huevos" },
        { category: "verduras", name: "verduras" }, { category: "pescado", name: "pescado" },
        { category: "legumbres y arroz", name: "arroz" }, { category: "postres", name: "postre" },
        { category: "lácteos", name: "leche" }, { category: "charcuteria", name: "embutido" },
        { category: "sal y especias", name: "sal" }, { category: "caldos purés y sopas", name: "caldo" },
        { category: "ensaladas", name: "lechuga" }, { category: "harina masas y rebozados", name: "harina" },
        { category: "salsas", name: "ketchup" }, { category: "fruta", name: "fruta" }
      ],
      categories: [],
      opcionesPorCategoria: [{}],
      content: "",
      isLoading: true,
      productSelected: [],
      placeholderBuscador: "Añade un producto",
      pageTitle: "Mis listas de la Compra",
      listaCompraTitle: ["Mi lista de la compra"],
      email: "",
      password: "",
      miListaCompraId: "",
      listasGuardadas: [],
      listasInactivas: [],
      listaInactivaTitle: ["Mi lista de la compra"],
      contenidoAnterior: '',
      listaActivaGuardada: false,
      comprado: [false],
      letterOnHover: false,
      palabrasOnMouseOver: [],
      productoAñadido: false,
      palabrasPorCategoriaClick: false,
      categoryOnClick: "",
      palabrasPorCategoria: [],
      categoryExit: false,
      indxProductoABorrar: [],
      listasInactivasContent: "",
      compartida: false,
      usersAliasCompartidos: [],
      usersIdCompartidos: [],
      notificaciones: "",
      notificacionesLista: "",
      notificacionesButton: "",
      notificacionesAceptadas: false,
      privileges: true,
      inputBuscador: "password",
      inputListaTitle: "password"
    };

    this.getProductsList = this.getProductsList.bind(this);
    this.getOptions = this.getOptions.bind(this);
    this.getOptionsByLetter = this.getOptionsByLetter.bind(this);
    this.getOptionsByCategory = this.getOptionsByCategory.bind(this);
    this.handleOnMouseOver = this.handleOnMouseOver.bind(this);
    this.handleOnMouseLeave = this.handleOnMouseLeave.bind(this);
    this.handleOnClickCategory = this.handleOnClickCategory.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleOnClickExit = this.handleOnClickExit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleBtnGuardarConNombre = this.handleBtnGuardarConNombre.bind(this);
    this.handleListaTitle = this.handleListaTitle.bind(this);
    this.handleBeforeUnload = this.handleBeforeUnload.bind(this);
  }

  getProductsList() {
    axios
      .get("https://onrender.com")
      .then(response => {
        this.setState({ data: response.data });
      });
  }

  getOptions() {
    const nuevasOpciones = [...this.state.options];
    this.state.data.forEach(i => {
      if (!nuevasOpciones.includes(i.name)) {
        nuevasOpciones.push(i.name);
      }
    });
    this.setState({ options: nuevasOpciones });
  }

  getOptionsByLetter() {
    if (this.state.options.length > 0) {
      const opcionesLetra = this.state.abecedario.map(letra => ({
        letra: letra,
        palabras: []
      }));

      opcionesLetra.forEach(grupo => {
        this.state.options.forEach(i => {
          if (i.toLowerCase().startsWith(grupo.letra.toLowerCase()) && !grupo.palabras.includes(i.toLowerCase())) {
            grupo.palabras.push(i);
          }
        });
      });

      this.setState({ opcionesPorLetter: opcionesLetra });
    }
  }

  getOptionsByCategory() {
    const nuevasCategorias = [...this.state.categories];
    this.state.data.forEach(i => {
      if (!nuevasCategorias.includes(i.category)) {
        nuevasCategorias.push(i.category);
      }
    });

    const opcionesCat = nuevasCategorias.map(cat => {
      return this.state.data.filter(producto => producto.category === cat);
    });

    this.setState({
      categories: nuevasCategorias,
      opcionesPorCategoria: opcionesCat
    });
  }

  handleBeforeUnload(event) {
    const mensaje = "Tienes cambios no guardados. ¿Estás seguro de que deseas salir?";
    event.preventDefault();
    event.returnValue = mensaje;
    return mensaje;
  }

  handleOnMouseOver(event) {
    if (!event) return;
    const palabrasMouseOver = [];
    this.state.opcionesPorLetra.forEach(i => {
      if (event.target.id === i.letra) {
        palabrasMouseOver.push(i.palabras);
      }
    });

    if (palabrasMouseOver.length > 0) {
      this.setState({
        letterOnHover: true,
        palabrasOnMouseOver: palabrasMouseOver
      });
    }
  }

  handleOnMouseLeave() {
    this.setState({
      letterOnHover: false,
      palabrasOnMouseOver: []
    });
  }

  handleOnClick(event) {
    this.setState({
      palabrasPorCategoriaClick: false,
      categoryOnClick: ""
    });

    if (event && event.target.value && !this.state.productSelected.includes(event.target.value)) {
      this.setState(prevState => ({
        productSelected: [...prevState.productSelected, event.target.value]
      }));
      event.target.value = '';
    }
  }

  handleOnClickCategory(event) {
    if (!event) return;
    let categoryOnClick = "";
    let palabrasPorCategoria = [];

    this.state.opcionesPorCategoria.forEach(i => {
      i.forEach(cat => {
        if (event.target.innerHTML === "cuidado personal" && cat.category === "cuidado_personal") {
          palabrasPorCategoria.push(cat.name);
          categoryOnClick = cat.category;
        } else if (event.target.innerHTML === cat.category) {
          palabrasPorCategoria.push(cat.name);
          categoryOnClick = cat.category;
        }
      });
    });

    this.setState({
      palabrasPorCategoriaClick: true,
      categoryOnClick: categoryOnClick,
      palabrasPorCategoria: palabrasPorCategoria
    });
  }

  handleOnClickExit() {
    this.setState({ palabrasPorCategoriaClick: false });
  }

  handleListaTitle(event) {
    if (!event) return;
    this.setState({
      listaCompraTitle: [event.target.value]
    });
  }

  handleDelete(event) {
    if (!event) return;
    const valorABorrar = event.target.value;
    this.setState(prevState => ({
      productSelected: prevState.productSelected.filter(item => item !== valorABorrar)
    }));
  }

  handleBtnGuardarConNombre() {
    localStorage.setItem("products", this.state.productSelected);
    localStorage.setItem("listaTitle", this.state.listaCompraTitle[0]);
    window.removeEventListener("beforeunload", this.handleBeforeUnload);
    window.location.href = "/login";
  }

  componentDidMount() {
    window.addEventListener("beforeunload", this.handleBeforeUnload);
    this.getProductsList();
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.handleBeforeUnload);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.data.length === 0 && this.state.data.length > 0) {
      this.getOptions();
      this.getOptionsByCategory();
      this.getOptionsByLetter();
      this.setState({ isLoading: false });
    }
  }

  render() {
    // 1. Renderizado Dinámico de la Lista Activa basada puramente en el estado plano
    let listaActiva = "";

    if (this.state.productSelected.length > 0) {
      listaActiva = (
        <div className="columnaListaActiva">
          <div className="optionsBarList"></div>
          <div className="listaCompra">
            <div className="listaCompraTitle">
              <input
                type={this.state.inputListaTitle}
                name="listaCompraTitle"
                id="listaCompraTitle"
                value={this.state.listaCompraTitle[0] || ""}
                placeholder="Mi lista de la compra"
                onChange={this.handleListaTitle}
                onKeyUp={this.teclaEnter}
                onFocus={() => this.setState({ inputListaTitle: "text" })}
                onBlur={() => this.setState({ inputListaTitle: "password" })}
              />
            </div>

            <div className="listaCompraProducts">
              {this.state.productSelected.map((producto, index) => (
                <div className="productSelected" key={index}>
                  <div className="productSelectedName">{producto}</div>
                  <div className="borrarBtn">
                    <button className="borrarBtn" value={producto} onClick={this.handleDelete}></button>
                  </div>
                </div>
              ))}
            </div>

            <div className="opcionesGuardarLista">
              <div className="guardarBtnConNombre">
                <button className="guardarBtnConNombre" onClick={this.handleBtnGuardarConNombre}>
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 2. Construcción de los bloques de contenido principal
    // 2. Construcción de los bloques de contenido principal
    let abc = (
      <div className="abecedario">
        {(this.state.opcionesPorLetra.length > 0 ? this.state.opcionesPorLetra : this.state.abecedario).map((i, index) => {
          const letraStr = typeof i === 'object' ? i.letra : i;
          return (
            <div
              className="letra"
              key={index}
              id={letraStr}
              onMouseOver={this.state.opcionesPorLetra.length > 0 ? this.handleOnMouseOver : undefined}
            >
              {letraStr}
            </div>
          );
        })}
      </div>
    );

    let content = (
      <div className={listaActiva !== "" ? "contentWhithListTodos" : "content"}>
        <div className="columnaCentral">
          <div className="buscadorProductos">
            <input
              type={this.state.inputBuscador}
              name="buscadorProductos"
              placeholder={this.state.placeholderBuscador}
              onClick={this.handleOnClick}
              onKeyUp={this.teclaEnter}
              onFocus={() => this.setState({ inputBuscador: "text" })}
              onBlur={() => this.setState({ inputBuscador: "password" })}
            />
          </div>

          <div className="productosFrecuentes">
            {[...this.state.productosFrecuentes]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((i, index) => i.name && (
                <button className="productoFrecuente" key={index} value={i.name} onClick={this.handleOnClick}>
                  {i.name}
                </button>
              ))
            }
          </div>

          <div className="categories">
            {[...this.state.opcionesPorCategoria]
              .filter(cat => cat && cat[0] !== undefined) // Validamos que el primer elemento de la subcategoría exista
              .sort((a, b) => a[0].category.localeCompare(b[0].category))
              .map((cat, index) => {
                const esCuidadoPersonal = cat[0].category === "cuidado_personal";
                const catId = esCuidadoPersonal ? cat[0].category : cat[0].category.replaceAll(" ", "");
                const catDisplay = esCuidadoPersonal ? "cuidado personal" : cat[0].category;

                return (
                  <div className="category" key={index} id={catId} onClick={this.handleOnClickCategory}>
                    <div className="categoryName">{catDisplay}</div>
                  </div>
                );
              })
            }
          </div>
        </div>
        <div className="listaActiva">{listaActiva}</div>
      </div>
    );

    // 3. Manejo de vistas superpuestas (Búsqueda por letras / Categorías abiertas)
    if (this.state.letterOnHover && this.state.palabrasOnMouseOver.length > 0 && this.state.palabrasOnMouseOver[0]) {
      const tieneMuchasPalabras = this.state.palabrasOnMouseOver[0].length > 5;
      content = (
        <div className={tieneMuchasPalabras ? "productosPorLetra" : "pocosProductosPorLetra"} onMouseLeave={this.handleOnMouseLeave}>
          {this.state.palabrasOnMouseOver[0].map((i, index) => (
            <button className="palabra" key={index} value={i} onClick={this.handleOnClick}>
              {i}
            </button>
          ))}
        </div>
      );
      listaActiva = "";
    }

    if (this.state.palabrasPorCategoriaClick) {
      listaActiva = "";
      content = (
        <div className="productosPorCategory" id={`palabrasCat${this.state.categoryOnClick.replaceAll(" ", "")}`}>
          <div className="categoryTitle" id={`titleCat${this.state.categoryOnClick.replaceAll(" ", "")}`}>
            <div className="categoryName">{this.state.categoryOnClick}</div>
            <div className="exit">
              <button className="exitBtn" value="exit" onClick={this.handleOnClickExit}></button>
            </div>
          </div>
          <div className="categoryPalabras">
            {this.state.palabrasPorCategoria.map((i, index) => (
              <button className="palabra" key={index} value={i} onClick={this.handleOnClick}>{i}</button>
            ))}
          </div>
        </div>
      );
    }

    if (this.state.isLoading) {
      content = <div className="Loading">Loading...</div>;
    }

    // 4. Retorno final de la estructura JSX limpia de React
    return (
      <div className="hacer-lista-compra-productos-wrapper">
        <div className="content-wrapper">
          <div className="title-wrapper">
            <div className="title">{this.state.pageTitle}</div>
          </div>
          <div className="optionsBar">
            <Link to="../registro">Registro</Link>
            <Link to="../login">Login</Link>
          </div>
          <div className="abcUser"></div>
          {content}
          {abc}
        </div>
      </div>
    );
  } // Cierre de render()
} // Cierre de la Clase MisListasDeLaCompra
