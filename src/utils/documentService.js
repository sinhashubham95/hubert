import Axios from 'axios';
import moment from 'moment';
import translationService from './translationService';

class DocumentService {
  constructor() {
    this.__data = [];
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
      date: moment(data.DataInclusao).format('DD/MM/YYYY'),
      key: `document-${data.Id}`,
      type: data.UrlArquivo.substr(
        data.UrlArquivo.lastIndexOf('.') + 1,
      ).toLowerCase(),
    }));
  }

  get data() {
    return this.__data;
  }
}

export default new DocumentService();
