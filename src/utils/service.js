import LocalStorageService from './localStorageService';

export default class Service {
  constructor(data, storageKey) {
    this.__data = data || {};
    this.__loaded = false;
    this.__storageKey = storageKey || this.constructor.name;
  }

  get loaded() {
    return this.__loaded;
  }

  clear() {
    (async () => {
      this.__data = {};
      this.__loaded = false;
      await LocalStorageService.clear(this.__storageKey);
    })();
  }

  get data() {
    if (this.__loaded) {
      return this.__data;
    }
    return null;
  }

  set data(value) {
    (async () => {
      this.__data = value;
      this.__loaded = true;
      await LocalStorageService.set(this.__storageKey, this.__data);
    })();
  }

  get cachedData() {
    return (async () => await LocalStorageService.get(this.__storageKey))();
  }
}
