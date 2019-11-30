import Axios from 'axios';

import Service from './service';
import * as constants from '../constants';
import translationService from './translationService';

class UserInformationService extends Service {
  constructor() {
    super(
      {
        name: '',
        email: '',
        profilePhoto: '',
        clients: [],
        currentClientIndex: 0,
      },
      constants.USER_INFORMATION_SERVICE_KEY,
    );
  }

  async get() {
    const value = await this.cachedData;
    if (value) {
      await (this.data = value);
      return value;
    }
    const responses = await Axios.all([
      Axios.get('/Usuario'),
      Axios.get('/Locacao/Proprietario'),
    ]);
    if (
      responses.length !== 2 ||
      responses[0].status !== 200 ||
      responses[1].status !== 200
    ) {
      throw new Error(translationService.get('userInformationError'));
    }
    const clients = responses[1].data.Dados || [];
    await (this.data = {
      name: responses[0].data.Dados.NomeUsuario,
      email: responses[0].data.Dados.Email,
      profilePhoto: responses[0].data.Dados.UrlFoto,
      clients,
      currentClientIndex: clients.length ? 0 : -1,
    });
    return this.data;
  }

  updateClient(index) {
    let data = this.data;
    if (data == null) {
      return;
    }
    data = Object.assign({}, data, {
      currentClientIndex: index,
    });
    (async () => {
      await (this.data = data);
    })();
  }
}

export default new UserInformationService();
