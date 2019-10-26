import Axios from 'axios';

import Service from './service';
import * as constants from '../constants';

class UserInformationService extends Service {
  constructor() {
    super(
      {name: '', email: '', profilePhoto: ''},
      constants.USER_INFORMATION_SERVICE_KEY,
    );
  }

  async get() {
    const value = await this.cachedData;
    if (value) {
      await (this.data = value);
      return value;
    }
    const response = await Axios.get('/Usuario');
    if (response.status !== 200) {
      throw new Error('Error fetching user information.');
    }
    await (this.data = {
      name: response.data.Dados.NomeUsuario,
      email: response.data.Dados.Email,
      profilePhoto: response.data.Dados.UrlFoto,
    });
    return this.data;
  }
}

export default new UserInformationService();
