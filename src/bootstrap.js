import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { BrowserRouter } from "react-router-dom";
import App from "./components/app";
import reducers from "./reducers";

const createStoreWithMiddleware = applyMiddleware()(createStore);
var babel = require("@babel/core");
import { transform } from "@babel/core";
import * as babel from "@babel/core";
import "./style/main.scss";

function main() {
  ReactDOM.render(
    <Provider store={createStoreWithMiddleware(reducers)}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>,
    document.querySelector(".app-wrapper")
  );
}

document.addEventListener("DOMContentLoaded", main);
