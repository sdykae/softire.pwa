/* eslint-disable no-console */
import { html } from 'lit-element';
import { PageViewElement } from './page-view-element.js';
import { store } from '../store.js';
import { historyReducer } from '../reducers/historyReducer.js';
import {
  getAllTires,
  getAllTireBrands,
  getAllTireModels,
  getAllTireDesigns,
  getAllTireConditions,
  getAllTireMeasures
} from '../actions/historyAction.js';
store.addReducers({
  history: historyReducer
});
//store.dispatch(getAllTires());

import { connect } from 'pwa-helpers/connect-mixin.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';
import '@vaadin/vaadin-grid/vaadin-grid.js';
import '@vaadin/vaadin-grid/vaadin-grid-filter-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-sort-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-selection-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-filter.js';
import '@vaadin/vaadin-combo-box/vaadin-combo-box.js';
import './softireComponents/tires-search-element.js';

class MyView4 extends connect(store)(PageViewElement) {
  constructor() {
    super();
    this.pageSize = 20;
    this.value = 1;
    this.vehiculos = [];
    this.marcasVehiculo = [];
    this.modelosVehiculo = [];
    this.tiposVehiculo = [];
    this.configuraciones = [];

    this.vehiculosPage = [];
    /* filters*/
    this.codModeloFilter = '';
    this.codMedidaFilter = '';
    this.codDisenoFilter = '';
    this.codMarcaFilter = '';
    /* ENDfilters*/
    this.fetchURL = `https://azaryah.sdyalor.me/api/graphql`;
    /*  Fetch fromVehicles */
    this.fetchModelosVehiculo = fetch(`${this.fetchURL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ query: `query { modeloVehiculo { codModelo descripcion } }` })
    })
      .then(r => r.json())
      .then(data => (this.modelosVehiculo = data['data']['modeloVehiculo']));
    this.fetchTiposVehiculo = fetch(`${this.fetchURL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ query: `query { tipoVehiculo { codTipo descripcion } }` })
    })
      .then(r => r.json())
      .then(data => (this.tiposVehiculo = data['data']['tipoVehiculo']));
    /** historial vehiculos*/
    this.fetchVehiculos = fetch(`${this.fetchURL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        query: `query { vehiculo {codVehiculo codMarca codModelo codTipo placa codConfiguracion} }`
      })
    })
      .then(r => r.json())
      .then(data => {
        this.vehiculos = data['data']['vehiculo'];
        this.vehiculosPage = this.vehiculos.slice((1 - 1) * this.pageSize, 1 * this.pageSize);
      });
    this.fetchMarcasVehiculo = fetch(`${this.fetchURL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ query: `query { marcaVehiculo { codMarca descripcion } }` })
    })
      .then(r => r.json())
      .then(data => (this.marcasVehiculo = data['data']['marcaVehiculo']));
    this.fetchConfiguracionesVehiculo = fetch(`${this.fetchURL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ query: `query { configuracion { codConfi descripcion } }` })
    })
      .then(r => r.json())
      .then(data => (this.configuraciones = data['data']['configuracion']));
    /* Fetch fromTires */
  }
  static get styles() {
    return [SharedStyles];
  }
  static get properties() {
    return {
      vehiculosPage: { type: Array },
      vehiculos: { type: Array },
      codModeloFilter: { type: String },
      codMedidaFilter: { type: String },
      codDisenoFilter: { type: String },
      codMarcaFilter: { type: String },
      marcasVehiculo: { type: Array },
      modelosVehiculo: { type: Array },
      tiposVehiculo: { type: Array },
      configuraciones: { type: Array },
      _tires: { type: Array }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    console.log('on connect');
    store.dispatch(getAllTires());
    store.dispatch(getAllTireBrands());
    store.dispatch(getAllTireModels());
    store.dispatch(getAllTireDesigns());
    store.dispatch(getAllTireConditions());
    store.dispatch(getAllTireMeasures());
  }

  render() {
    return html`
      <section>
        <h1>Historial de Vehiculos</h1>
        <!-- codVehiculo fromVehicles-->
        <!--End  Configurationces fromVehicles -->
      </section>
      <!-- Start Table -->

      <vaadin-grid
        theme="column-borders"
        page-size="${this.pageSize}"
        height-by-rows
        column-reordering-allowed
        multi-sort
        .items=${this.vehiculosPage}
      >
        <vaadin-grid-selection-column auto-select frozen></vaadin-grid-selection-column>
        <vaadin-grid-filter-column
          width="9em"
          path="codVehiculo"
          header="Vehiculo"
        ></vaadin-grid-filter-column>
        <vaadin-grid-filter-column
          width="9em"
          path="codMarca"
          header="Marca de Vehiculo"
        ></vaadin-grid-filter-column>
        <vaadin-grid-filter-column
          width="9em"
          path="codModelo"
          flex-grow="2"
          header="Modelo de Vehiculo"
        ></vaadin-grid-filter-column>
        <vaadin-grid-filter-column
          width="9em"
          path="codTipo"
          header="Tipo de Vehiculo"
        ></vaadin-grid-filter-column>
        <vaadin-grid-filter-column
          width="9em"
          path="placa"
          header="Placa de Vehiculo"
        ></vaadin-grid-filter-column>
        <vaadin-grid-filter-column
          width="9em"
          path="codConfiguracion"
          header="Configuracion de Vehiculo"
        ></vaadin-grid-filter-column>
      </vaadin-grid>
      <div id="pages">
        ${this.vehiculos.length > 2
          ? Array.apply(null, { length: Math.ceil(this.vehiculos.length / this.pageSize) }).map(
              (item, index) =>
                html`
                  <button @click=${e => this.updateItemsFromPage(e.target.innerText)}>
                    ${index + 1}
                  </button>
                `
            )
          : 'false'}
      </div>
      <div></div>

      <tires-search-element></tires-search-element>

      <style>
        button,
        p {
          display: inline-block;
        }
        #pages {
          display: flex;
          flex-wrap: wrap;
          margin: 20px;
        }

        #pages > button {
          user-select: none;
          padding: 5px;
          margin: 0 5px;
          border-radius: 10%;
          border: 0;
          background: transparent;
          font: inherit;
          outline: none;
          cursor: pointer;
        }

        #pages > button:not([disabled]):hover,
        #pages > button:focus {
          color: #ccc;
          background-color: #eee;
        }

        #pages > button[selected] {
          font-weight: bold;
          color: white;
          background-color: #ccc;
        }

        #pages > button[disabled] {
          opacity: 0.5;
          cursor: default;
        }
      </style>
    `;
  }
  updateItemsFromPage(innerText) {
    this.vehiculosPage = this.vehiculos.slice(
      (innerText - 1) * this.pageSize,
      innerText * this.pageSize
    );
  }
  stateChanged(state) {
    console.log('state has changed');
    console.log(state);
    this._tires = state.history.tires.neumaticos;
  }
}

window.customElements.define('my-view4', MyView4);
