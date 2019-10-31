import Axios from 'axios';
import * as constants from '../constants';

class DashboardService {
  constructor() {
    this.__data = {};
  }

  async get(clientCode) {
    const responses = await Axios.all([
      Axios.get(
        `/Locacao/GraficoLocacao?CodProprietario=${clientCode}&TipoGrafico=1`,
      ),
      Axios.get(
        `/Locacao/GraficoLocacao?CodProprietario=${clientCode}&TipoGrafico=2`,
      ),
    ]);
    if (
      responses.length !== 2 ||
      responses[0].status !== 200 ||
      responses[1].status !== 200
    ) {
      throw new Error('Error fetching rental status.');
    }
    this.__data = {};
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
    return this.data;
  }

  set data(value) {
    this.__data = value;
  }

  get data() {
    return this.__data;
  }

  __process(values) {
    for (let i = 0; i < values.length; i += 1) {
      const status = values[i].Situacao || values[i].SituacaoContrato;
      if (
        constants.DASHBOARD_STATUS_LIST[status] &&
        !this.__data[status] &&
        values[i].Quantidade
      ) {
        this.__data[status] = {
          status: status,
          color:
            values[i].CorGrafico || constants.DASHBOARD_STATUS_LIST[status],
          count: values[i].Quantidade,
          title: status,
          key: `pie-${i}`,
        };
      }
    }
  }
}

export default new DashboardService();
