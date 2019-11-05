import Axios from 'axios';
import momemt from 'moment';

import {formatCurrency} from './index';
import translationService from './translationService';
import * as constants from '../constants';
import localStorageService from './localStorageService';

class ReportService {
  constructor() {
    this.__dates = [];
    this.__expense = '';
    this.__revenue = '';
    this.__income = '';
    this.__properties = [];
    this.__datesStorageKey = constants.REPORT_DATES_SERVICE_KEY;
    this.__propertiesStorageKey = constants.REPORT_PROPERTIES_SERVICE_KEY;
  }

  async initDates(clientCode) {
    const cachedDates = await localStorageService.get(
      `${this.__datesStorageKey}/${clientCode}`,
    );
    this.__dates = cachedDates || [];
  }

  async initRentalDetails(clientCode, selectedDate) {
    const cachedRentalDetails = await localStorageService.get(
      `${this.__propertiesStorageKey}/${clientCode}/${selectedDate}`,
    );
    if (!cachedRentalDetails) {
      return;
    }
    this.__expense = cachedRentalDetails.expense || '';
    this.__revenue = cachedRentalDetails.revenue || '';
    this.__income = cachedRentalDetails.income || '';
    this.__properties = cachedRentalDetails.properties || [];
  }

  async getDates(clientCode) {
    let response;
    try {
      response = await Axios.get(
        `/Locacao/PrestContLocDatUltDepositos?CodProprietario=${clientCode}`,
      );
      if (response.status !== 200) {
        throw new Error(translationService.get('reportDateError'));
      }
    } catch (e) {
      if (e.response) {
        throw new Error(translationService.get('reportDateError'));
      }
      throw e;
    }
    this.__dates = response.data.Dados.map(value => value.DataDeposito);
    await localStorageService.set(
      `${this.__datesStorageKey}/${clientCode}`,
      this.__dates,
    );
    return this.__dates;
  }

  async getRentalDetails(clientCode, selectedDate) {
    let response;
    try {
      response = await Axios.get(
        `/Locacao/Prestacao?CodProprietario=${clientCode}&RemoveSubconta2198=false&DataDeposito=${selectedDate}`,
      );
      if (response.status !== 200) {
        throw new Error(translationService.get('reportRentalError'));
      }
    } catch (e) {
      if (e.response) {
        throw new Error(translationService.get('reportRentalError'));
      }
      throw e;
    }
    this.__expense = formatCurrency(
      response.data.Dados.Prestacoes[0].TotalDebitoProprietario,
    );
    this.__income = formatCurrency(
      response.data.Dados.Prestacoes[0].TotalImovelProprietario,
    );
    this.__revenue = formatCurrency(
      response.data.Dados.Prestacoes[0].TotalCreditoProprietario,
    );
    const propertyDetails = [];
    response.data.Dados.Prestacoes[0].Imoveis.map(value => {
      propertyDetails.push(
        Axios.get(
          `/Locacao/Imovel?CodProprietario=228&CodImovel=${
            value.Imovel.CodImovel
          }`,
        ),
      );
    });
    let responses;
    try {
      responses = await Axios.all(propertyDetails);
      if (
        responses.length !== propertyDetails.length ||
        responses.reduce((result, res) => result || res.status !== 200, false)
      ) {
        throw new Error(translationService.get('reportPropertyDetailsError'));
      }
    } catch (e) {
      if (e.response) {
        throw new Error(translationService.get('reportPropertyDetailsError'));
      }
      throw e;
    }
    this.__properties = responses.map((res, ind) => ({
      code: res.data.Dados.Imovel.CodImovel,
      name: res.data.Dados.Imovel.NomeImovel,
      status:
        res.data.Dados.Imovel.Situacao === 'ALUGADO'
          ? `${res.data.Dados.Imovel.Situacao} ${
              res.data.Dados.Imovel.SituacaoContrato
            }`
          : res.data.Dados.Imovel.Situacao,
      tenant: res.data.Dados.Imovel.Inquilino,
      contractDate: momemt(res.data.Dados.Imovel.ValidadeContrato).format(
        'DD/MM/YYYY',
      ),
      expense: formatCurrency(
        response.data.Dados.Prestacoes[0].Imoveis[ind].TotalDebito,
      ),
      revenue: formatCurrency(
        response.data.Dados.Prestacoes[0].Imoveis[ind].TotalCredito,
      ),
      income: formatCurrency(
        response.data.Dados.Prestacoes[0].Imoveis[ind].TotalImovel,
      ),
    }));
    await localStorageService.set(
      `${this.__propertiesStorageKey}/${clientCode}/${selectedDate}`,
      {
        expense: this.__expense,
        revenue: this.__revenue,
        income: this.__income,
        properties: this.__properties,
      },
    );
    return this.__properties;
  }

  get dates() {
    return this.__dates;
  }

  get expense() {
    return this.__expense;
  }

  get income() {
    return this.__income;
  }

  get revenue() {
    return this.__revenue;
  }

  get properties() {
    return this.__properties;
  }
}

export default new ReportService();
