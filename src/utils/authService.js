import Axios from 'axios';
import QS from 'qs';

import * as constants from '../constants';

import {restart} from './index';
import Service from './service';
import translationService from './translationService';

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
    if (
      value &&
      typeof value.expiryTime === 'number' &&
      currentTime < value.expiryTime
    ) {
      await (this.data = value);
      this.__setDefaults();
      return value;
    }
    if (!username) {
      throw new Error('Username is required.');
    }
    if (!password) {
      throw new Error('Password is required.');
    }
    let response;
    try {
      response = await Axios.post(
        `${constants.BASE_URL}/token`,
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
        throw new Error(translationService.get('invalidLogin'));
      }
    } catch (e) {
      if (e.response && e.response.data && e.response.data.error_description) {
        throw new Error(e.response.data.error_description);
      }
      throw e;
    }
    await (this.data = {
      username,
      password,
      token: response.data.access_token,
      tokenType: response.data.token_type,
      expiryTime: currentTime + response.data.expires_in * 1000,
    });
    this.__setDefaults();
    return this.data;
  }

  __setDefaults() {
    Axios.defaults.headers.common.Authorization = `${this.data.tokenType} ${
      this.data.token
    }`;
    Axios.defaults.baseURL = `${constants.BASE_URL}/api`;
    Axios.interceptors.response.use(null, e => {
      restart();
      return Promise.reject(e);
    });
  }
}

export default new AuthService();
