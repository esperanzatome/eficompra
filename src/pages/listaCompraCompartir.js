import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash, faSpinner } from "@fortawesome/free-solid-svg-icons";
import fondo from "../carrito-de-compras.png";

library.add(faTrash, faSpinner);

const ListaCompraCompartir = () => {
  const params = useParams();
  const alias = Object.values(params)[1];
  const listasdelacompra = Number(Object.values(params)[0].replace(/[^0-9]/g, ''));

  const [listaName, setListaName] = useState("");
  const [comprado, setComprado] = useState(false);
  const [products, setProducts] = useState([]);
  const [fecha, setFecha] = useState("");
  const navigate = useNavigate();

  const handleCompartir = () => {
    localStorage.setItem("listaCompartida", listasdelacompra);

    // Comprobación segura de sesión (evita el fallo con null)
    if (localStorage.getItem("tokenSesion")) {
      const procesarProductosLocales = () => {
        if (products && products.length > 0) {
          const promesasProductos = products.map((i) => {
            return axios.post("https://eficompraserver.onrender.com/miListaCompra", {
              listaId: listasdelacompra,
              product: i,
            });
          });

          Promise.all(promesasProductos).then(() => {
            localStorage.setItem("products", "");
            navigate("/mis_listas_compra");
          });
        } else {
          navigate("/mis_listas_compra");
        }
      };

      axios
        .post("https://eficompraserver.onrender.com/recuperarListaCompartida", {
          listasdelacompra: listasdelacompra,
        })
        .then((response) => {
          let usuarios = [];
          let compradoResp = false;
          let listaNameResp = "";
          let usuariosIds = [];

          if (response.data.length > 0) {
            response.data.forEach((i) => {
              usuarios.push(i.alias);
              compradoResp = i.comprado;
              listaNameResp = i.listaName;
              usuariosIds.push(i.userId);
            });

            const finalizarListaCompartida = () => {
              const promesasRevocar = usuariosIds.map((idUsuario) => {
                return axios.post("https://eficompraserver.onrender.com/revocarPrivilegios", {
                  id: idUsuario,
                });
              });

              Promise.all(promesasRevocar).then(() => {
                localStorage.setItem("listaCompartida", "");
                procesarProductosLocales();
              });
            };

            if (!usuarios.includes(localStorage.getItem("alias"))) {
              axios
                .post("https://eficompraserver.onrender.com/usuario", {
                  userId: localStorage.getItem("id"),
                  alias: localStorage.getItem("alias"),
                  listasdelacompra: listasdelacompra, // Corregido (antes ponía listaCompartida)
                  comprado: compradoResp,
                  listaName: listaNameResp,
                })
                .then(() => {
                  console.log("usuario-lista creado");
                  finalizarListaCompartida();
                });
            } else {
              finalizarListaCompartida();
            }
          } else {
            procesarProductosLocales();
          }
        })
        .catch((error) => {
          console.error("Error al recuperar lista compartida:", error);
          procesarProductosLocales();
        });
    } else {
      navigate("/login");
    }
  };

  const handleRechazar = () => {
    navigate("/");
  };

  useEffect(() => {
    axios
      .post("https://eficompraserver.onrender.com/recuperarUserData", {
        listasdelacompra: listasdelacompra,
      })
      .then((res) => {
        if (!res.data || res.data.length === 0) return;

        setComprado(res.data[0].comprado !== 0);

        return axios.post("https://eficompraserver.onrender.com/recuperarListaCompra", {
          listaId: res.data[0].listasdelacompra,
        });
      })
      .then((resLista) => {
        if (!resLista || !resLista.data || resLista.data.length === 0) return;

        setListaName(resLista.data[0].listaName);

        // Creamos un array nuevo sin duplicados en lugar de mutar el estado
        const productosUnicos = [...new Set(resLista.data.map((i) => i.product))];
        setProducts(productosUnicos);

        const fechaNew = new Date(resLista.data[0].fecha);
        const opcionesFechaHora = {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        };
        setFecha(fechaNew.toLocaleString("es-ES", opcionesFechaHora));
      })
      .catch((error) => {
        console.error("Error al recuperar datos de la lista:", error);
      });
  }, [listasdelacompra]);

  return (
    <div className="content-wrapper-listaCompartir">
      <div className="title-wrapper-listaCompartir">
        <div className="titleListaCompartir">
          <h1>EFICOMPRA</h1>
        </div>
        <div className="img-wrapper">
          <img src={fondo} alt="Fondo" />
        </div>
      </div>
      <div className="subtitle-wrapper">
        <div className="subtitle">
          {alias} quiere compartir esta lista de la compra contigo.
        </div>
      </div>
      <div className="listaCompraCompartir">
        <div className="title">{listaName}</div>
        <div className="listaCompartir">
          <div className="cabecero">
            <div className="estadoComprado">
              Comprado
              <input type="checkbox" id="compradoCheck" checked={comprado} disabled />
            </div>
            <div className="fecha">{fecha}</div>
          </div>

          <div className="listaCompraProducts-listaCompartir">
            <div className="products">
              {products.map((i, idx) => (
                <div className="product" key={idx}>
                  {i}
                </div>
              ))}
            </div>

            <div className="optionsBar-listaCompartir">
              <button className="compartir" onClick={handleCompartir}>
                Aceptar
              </button>
              <button className="rechazar" onClick={handleRechazar}>
                Rechazar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListaCompraCompartir;
