import Axios from 'axios';
import moment from 'moment';
import uuidv5 from 'uuid/v5';
import translationService from './translationService';
import localStorageService from './localStorageService';
import * as constants from '../constants';

class DocumentService {
  constructor() {
    this.__data = [];
    this.__storageKey = constants.DOCUMENT_SERVICE_KEY;
  }

  async init(clientCode) {
    let cachedData = await localStorageService.get(
      `${this.__storageKey}/${clientCode}`,
    );
    this.__data = cachedData || [];
  }

  async get(clientCode) {
    let response;
    try {
      response = await Axios.get(
        `/Locacao/Documentos?Parametros.codProprietario=${clientCode}&Parametros.tipoFiltro=1`,
      );
      if (response.status !== 200) {
        throw new Error(translationService.get('documentError'));
      }
    } catch (e) {
      if (e.response) {
        throw new Error(translationService.get('documentError'));
      }
      throw e;
    }
    this.__data = response.data.Dados.map(data => ({
      title: data.DescrTipoDocumentoWeb,
      description: data.Observacao,
      url: data.UrlArquivo,
      fileDetails: this.__getFileDetails(data.UrlArquivo),
      date: moment(data.DataInclusao).format('DD/MM/YYYY'),
      key: `document-${data.Id}`,
      type: data.UrlArquivo.substr(
        data.UrlArquivo.lastIndexOf('.') + 1,
      ).toLowerCase(),
    }));
    await localStorageService.set(
      `${this.__storageKey}/${clientCode}`,
      this.__data,
    );
  }

  get data() {
    return this.__data;
  }

  __getFileDetails = url => {
    return {
      extension: url.substr(url.lastIndexOf('.') + 1).toLowerCase(),
      name: uuidv5(url, uuidv5.URL),
    };
  };
}

export default new DocumentService();
