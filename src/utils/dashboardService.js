import Axios from 'axios';
import * as constants from '../constants';
import localStorageService from './localStorageService';
import translationService from './translationService';

class DashboardService {
  constructor() {
    this.__data = {};
    this.__reports = {};
    this.__dataStorageKey = constants.DASHBOARD_DATA_SERVICE_KEY;
    this.__reportStorageKey = constants.DASHBOARD_REPORT_SERVICE_KEY;
  }

  async init(clientCode) {
    let cachedData = await localStorageService.get(
      `${this.__dataStorageKey}/${clientCode}`,
    );
    let cachedReports = await localStorageService.get(
      `${this.__reportStorageKey}/${clientCode}`,
    );
    this.__data = cachedData || {};
    this.__reports = cachedReports || {};
  }

  async get(clientCode) {
    const responses = await Axios.all([
      Axios.get(
        `/Locacao/GraficoLocacao?CodProprietario=${clientCode}&TipoGrafico=1`,
      ),
      Axios.get(
        `/Locacao/GraficoLocacao?CodProprietario=${clientCode}&TipoGrafico=2`,
      ),
      Axios.get(
        `/Locacao/GraficoLocacao?CodProprietario=${clientCode}&TipoGrafico=3`,
      ),
    ]);
    if (
      responses.length !== 3 ||
      responses[0].status !== 200 ||
      responses[1].status !== 200 ||
      responses[2].status !== 200
    ) {
      throw new Error(translationService.get('dashboardError'));
    }
    this.__data = {};
    this.__reports = {};
    this.__process(responses[0].data.Dados.Valores);
    this.__process(responses[1].data.Dados.Valores);
    let total = 0;
    const keys = Object.keys(this.__data);
    for (let i = 0; i < keys.length; i += 1) {
      total += this.__data[keys[i]].count;
    }
    for (let i = 0; i < keys.length; i += 1) {
      this.__data[keys[i]].percentage = this.__data[keys[i]].value =
        (this.__data[keys[i]].count * 100.0) / total;
    }
    let sortedData = {};
    if (this.__data['em dia']) {
      sortedData['em dia'] = this.__data['em dia'];
    }
    keys.map(key => {
      if (key !== 'em dia') {
        sortedData[key] = this.__data[key];
      }
    });
    this.__data = sortedData;
    const values = responses[2].data.Dados.Valores;
    for (let i = 0; i < values.length; i += 1) {
      this.__reports[values[i].DataDeposito] = {
        date: values[i].DataDeposito,
        displayDate: values[i].Legenda,
        revenue: values[i].Receita,
        expense: values[i].Despesa,
        income: values[i].Total,
      };
    }
    await localStorageService.set(
      `${this.__dataStorageKey}/${clientCode}`,
      this.__data,
    );
    await localStorageService.set(
      `${this.__reportStorageKey}/${clientCode}`,
      this.__reports,
    );
    return {
      data: this.__data,
      reports: this.__reports,
    };
  }

  set data(value) {
    this.__data = value;
  }

  get data() {
    return this.__data;
  }

  get reports() {
    return this.__reports;
  }

  __process(values) {
    for (let i = 0; i < values.length; i += 1) {
      let status = values[i].Situacao || values[i].SituacaoContrato;
      if (
        status &&
        constants.STATUS_LIST[status.toLowerCase()] &&
        !this.__data[status.toLowerCase()] &&
        values[i].Quantidade
      ) {
        this.__data[status.toLowerCase()] = {
          status,
          color:
            values[i].CorGrafico || constants.STATUS_LIST[status.toLowerCase()],
          count: values[i].Quantidade,
          title: status,
          key: `pie-${i}`,
        };
      }
    }
  }
}

export default new DashboardService();
