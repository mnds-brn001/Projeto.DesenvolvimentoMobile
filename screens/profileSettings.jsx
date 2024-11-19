import { StyleSheet, Text, View, TextInput, Pressable, Modal, Button } from 'react-native';
import React, { useEffect, useState } from 'react'
import { useSQLiteContext } from 'expo-sqlite'
import { capitalize } from '../utils/utils';

export default function ProfileSettingsScreen({ navigation }) {
  const [barber, setBarber] = useState({})
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [modalVisible, setModalVisible] = useState(false);



  const db = useSQLiteContext()

  async function getBarber() {
    try {
      const result = await db.getFirstAsync('SELECT * FROM barbers')
      setBarber(result)
    } catch (error) {
      console.error("Erro ao buscar barbeiro", error)
    }
  }

  async function handleUpdateProfile() {
    try {
      if (!name || name.trim() === '' || !surname || surname.trim() === '' || !username || username.trim() === '') {
        alert('Preencha todos os campos')
        return
      }

      const statement = await db.prepareAsync("UPDATE barbers SET name = $name, surname = $surname, username = $username")
      try {
        const result = await statement.executeAsync({
          $name: capitalize(name.trim()),
          $surname: capitalize(surname.trim()),
          $username: username.trim(),
        })
        setName('')
        setSurname('')
        setUsername('')
        getBarber()
      } catch (error) {
        console.log("Erro ao atualizar perfil")
      } finally {
        await statement.finalizeAsync()
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil", error)
    }
  }

  const handleUsernameChange = (text) => {
    const cleanedUsername = text.replace(/\s/g, '');
    setUsername(cleanedUsername);
  };

  async function handleUpdatePassword() {
    try {
      if (!password || password.trim() === '' || !newPassword || newPassword.trim() === '') {
        alert('Preencha todos os campos')
        return
      }
      if(password !== barber.password){
        alert('Senha atual incorreta')
        return
      }
      if (password === newPassword) {
        alert('A nova senha não pode ser igual a senha atual')
        return
      }

      const statement = await db.prepareAsync("UPDATE barbers SET password = $newPassword WHERE password = $password")
      try {
        const result = await statement.executeAsync({
          $password: password.trim(),
          $newPassword: newPassword.trim(),
        })
        setPassword('')
        setNewPassword('')
        getBarber()
        setModalVisible(false)
      } catch (error) {
        console.log("Erro ao atualizar senha")
      } finally {
        await statement.finalizeAsync()
      }
    } catch (error) {
      console.error("Erro ao atualizar senha", error)
  }
}
  useEffect(() => {
    getBarber();
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome:</Text>
      <TextInput
        style={styles.input}
        value={name}
        placeholder={barber.name}
        onChangeText={setName}
      />
      <Text style={styles.label}>Sobrenome:</Text>
      <TextInput
        style={styles.input}
        value={surname}
        placeholder={barber.surname}
        onChangeText={setSurname}
      />
      <Text style={styles.label}>Nome de usuário:</Text>
      <TextInput
        style={styles.input}
        value={username}
        placeholder={barber.username}
        onChangeText={handleUsernameChange}
      />
      <Pressable style={styles.button} onPress={handleUpdateProfile}>
        <Text style={styles.buttonText}>Salvar</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => setModalVisible(true)} >
        <Text style={styles.buttonText}>Atualizar Senha</Text>
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <View style={styles.modalBackground} >
            <Text style={styles.modalText}>Atualizar Senha</Text>
            <TextInput
              style={[styles.input, {width: '100%', marginBottom: 10}]}
              placeholder="Senha Atual"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TextInput
              style={[styles.input, {width: '100%'}]}
              placeholder="Nova senha"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
          </View>

          <Pressable style={styles.button} onPress={handleUpdatePassword}>
            <Text style={styles.buttonText}>Salvar nova senha</Text>
          </Pressable>

          <Pressable style={styles.button} onPress={() => setModalVisible(false)}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </Pressable>

        </View>
      </Modal>

    </View>
  );
  
}
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 20
  },
  

  input: {
    paddingLeft: 10,
    borderRadius: 5,
    height: 40,
    fontSize: 20,
    fontWeight: 'bold',
    width: '80%',
    borderColor: 'black',
    borderWidth: 1,

  },

  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    width: '80%',
    marginLeft: 10,
  },

  buttonText: {
    backgroundColor: 'black',
    color: 'white',
    width: '80%',
    fontSize: 22,
    fontWeight: 'bold',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
  },
  
  button: {
    marginTop: 20,
    alignItems: 'center',
    width: '80%',
  },

  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingTop:50,
  },
  modalBackground: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    paddingBottom: 40,
    width: '100%',
  },

  modalText: {
    marginBottom: 20,
    fontSize: 22,
    fontWeight: 'bold',
  },


});