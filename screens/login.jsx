import { Pressable, TextInput, StyleSheet, Text, View } from 'react-native'
import { useSQLiteContext } from 'expo-sqlite'
import React, { useEffect, useState } from 'react'
import { getToken, setToken } from '../utils/storageUtils'


export default function LoginScreen({ navigation }) {
  
  const db = useSQLiteContext()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    const matchingBarber = await db.getFirstAsync('SELECT * FROM barbers WHERE username = ? AND password = ?', [username, password])
    matchingBarber ? startSession() : alert('Usuário ou senha inválidos')
  }

  function startSession() {
    setToken('token')
    
    navigation.reset({
      index: 0,
      routes: [{ name: 'Barber' }]
    })
  }

  useEffect(() => {
    getToken('token') ? navigation.reset({ index: 0, routes: [{ name: 'Barber' }] }) : null
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput style={styles.input}
      placeholder='Usuário' value={username} onChangeText={setUsername} />

      <TextInput style={styles.input}
      placeholder='Senha' secureTextEntry value={password} onChangeText={setPassword} />

      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>ENTRAR</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 10,
  },

  input: {
    paddingLeft: 10,
    borderRadius: 5,
    height: 40,
    fontSize: 16,
    width: '80%',
    borderColor: 'black',
    borderWidth: 1,
    margin: 10,
  },

  buttonText: {
    backgroundColor: 'black',
    color: 'white',
    width: '100%',
    fontSize: 16,
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
  },
  
  button: {
    width: '80%',
  }
})