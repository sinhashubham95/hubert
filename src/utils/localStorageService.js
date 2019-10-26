import AsyncStorage from '@react-native-community/async-storage';

class LocalStorageService {
  async set(key, value, cb = () => true) {
    if (!key) {
      throw new Error('Key is required.');
    }
    if (!value) {
      throw new Error('Value is required.');
    }
    await AsyncStorage.setItem(key, JSON.stringify(value), cb);
    return this.get(key);
  }

  async get(key, cb = () => true) {
    if (!key) {
      throw new Error('Key is required.');
    }
    const value = await AsyncStorage.getItem(key, cb);
    return JSON.parse(value);
  }

  async clear(key, cb = () => true) {
    if (!key) {
      throw new Error('Key is required.');
    }
    return AsyncStorage.removeItem(key, cb);
  }

  async clearAll(cb = () => true) {
    return AsyncStorage.clear(cb);
  }
}

export default new LocalStorageService();
