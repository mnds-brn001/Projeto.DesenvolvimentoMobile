import AsyncStorage from '@react-native-async-storage/async-storage';


async function setToken(key) {
  const expiryInMs = 8 * 60 * 60 * 1000
  const expiry = Date.now() + expiryInMs

  try {
    await AsyncStorage.setItem(key, JSON.stringify(expiry))
  } catch (error) {
    console.error('Erro ao salvar token', error)
  }
}

async function getToken(key) {
  try {
    const value = await AsyncStorage.getItem(key)
    if (Date.now > JSON.parse(value)) {
      await AsyncStorage.removeItem(key);
      return null;
    }

  } catch (error) {
    console.error('Erro ao buscar token', error)
  }
}

async function removeToken(key) {
  try {
    await AsyncStorage.removeItem(key)
  } catch (error) {
    console.error('Erro ao remover token', error)
  }
}

export { setToken, getToken, removeToken }
