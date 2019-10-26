import Axios from 'axios';
import QS from 'qs';

import * as constants from '../constants';

import Service from './service';

class AuthService extends Service {
  constructor() {
    super(
      {
        username: '',
        password: '',
        token: '',
        tokenType: '',
        expiryTime: 0,
      },
      constants.AUTH_SERVICE_KEY,
    );
  }

  async get(username, password) {
    const currentTime = Date.now();
    const value = await this.cachedData;
    console.log(value);
    if (
      value &&
      typeof value.expiryTime === 'number' &&
      currentTime > value.expiryTime
    ) {
      await (this.data = value);
      this.__setDefaults();
      return value;
    }
    const response = await Axios.post(
      'https://api-test.hubert.com.br/token',
      QS.stringify({
        grant_type: 'password',
        username,
        password,
        scope: 'COD_APP=',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    if (response.status !== 200) {
      throw new Error('Invalid username and password combination.');
    }
    await (this.data = {
      username,
      password,
      token: response.data.access_token,
      tokenType: response.data.token_type,
      expiryTime: currentTime + response.data.expires_in,
    });
    this.__setDefaults();
    return this.data;
  }

  __setDefaults() {
    Axios.defaults.headers.common.Authorization = `${this.data.tokenType} ${
      this.data.token
    }`;
    Axios.defaults.baseURL = 'https://api-test.hubert.com.br/api';
  }
}

export default new AuthService();
