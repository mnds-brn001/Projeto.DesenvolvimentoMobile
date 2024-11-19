import { Pressable, StyleSheet, Text, View, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSQLiteContext } from 'expo-sqlite'
import QueueClientComponent from './components/queueClients-component'
import AddClientScreen from './components/addClient-component';
import { capitalize, copyContact } from '../utils/utils'

export default function BarberScreen({ navigation }) {

  const db = useSQLiteContext()

  const [name, setName] = useState('')
  const [contact, setContact] = useState('')

  const [cabelo, setCabelo] = useState(false);
  const [barba, setBarba] = useState(false);
  const [bigode, setBigode] = useState(false);

  const [clients, setClients] = useState([])
  const [barber, setBarber] = useState({})

  const [isRegisterVisible, setIsRegisterVisible] = useState(false);


  async function getBarber() {
    try {
      const result = await db.getFirstAsync('SELECT * FROM barbers')
      setBarber(result)
    } catch (error) {
      console.error("Erro ao buscar barbeiro", error)
    }
  }

  async function handleAddClient() {
    try {

      const selectedServices = [];
      if (cabelo) selectedServices.push('Cabelo');
      if (barba) selectedServices.push('Barba');
      if (bigode) selectedServices.push('Bigode');

      if (!name || name.trim() === '' || !contact || contact.trim() === '' || contact.trim().length !== 15 || selectedServices.length === 0) {
        alert('Preencha todos os campos')
        return
      }
      const serviceType = selectedServices.join(', ');
      console.log("serviceType", serviceType)

      clientName = capitalize(name.trim())
      clientContact = contact.trim()

      const statement = await db.prepareAsync("INSERT INTO clients (name, contact, service_type) VALUES ($name, $contact, $service_type);")

      try {
        const result = await statement.executeAsync({ 
          $name: clientName,
          $contact: clientContact,
          $service_type: serviceType
        })
        console.log("Cliente inserido com sucesso: ID ", result.lastInsertRowId.toString())
        setName('')
        setContact('')
        setCabelo(false)
        setBarba(false)
        setBigode(false)
        handleQueue()
      } catch(error) {
        console.log("Erro ao inserir cliente")
      } finally {
        await statement.finalizeAsync()  
      }

    } catch (error) {
      console.error("erro detalhado", error)
    }
  }

  async function handleQueue() {
    try {
      const result = await db.getAllAsync("SELECT * FROM clients WHERE DATE(date) = DATE('now', '-3 hours') ORDER BY status DESC, datetime(date) DESC;")

      console.log("Clientes", result)
      setClients(result)
    } catch (error) {
      console.error("Erro ao buscar clientes", error)
    }
  }

  async function handleClientAlert(client) {
    Alert.alert(
      `${client.name}`,
      'O que você gostaria de fazer com este cliente?',
      [
        { text: 'fechar', style: 'cancel' },
        { text: client.status ? 'Finalizar' : 'Abrir', onPress: () => handleCompleteClient(client) },
        { text: 'Deletar', onPress: () => handleDeleteClient(client), style: 'destructive' },
      ]
    );
  }

  async function handleCompleteClient(client) {
    let currentStatus = client.status;
    let newStatus = currentStatus ? 0 : 1;
    try {
      const statement = await db.prepareAsync("UPDATE clients SET status = $status WHERE id = $id")
      try {
        await statement.executeAsync({ $id: client.id, $status: newStatus })
        handleQueue()
      } catch (error) {
        console.error("Erro ao concluir cliente", error)
      } finally {
        await statement.finalizeAsync()
      }
    } catch (error) {
      console.error("Erro ao concluir cliente", error)
    }
  }

  async function handleDeleteClient(client) {
    try {
      const statement = await db.prepareAsync("DELETE FROM clients WHERE id = $id")
      try {
        await statement.executeAsync({ $id: client.id })
        handleQueue()
      } catch (error) {
        console.error("Erro ao deletar cliente", error)
      } finally {
        await statement.finalizeAsync()
      }
    } catch (error) {
      console.error("Erro ao deletar cliente", error)
    }
  }

  function goOptions() {
    navigation.navigate('Options')
  }

  function toggleRegisterView() {
    setIsRegisterVisible(!isRegisterVisible);
  }

  getBarber()
  useEffect(() => {
    handleQueue();
  }, [])

  return (
    <View style={styles.body}>
      <View style={styles.welcome}>
        <Text style={styles.welcomeText}>Seja bem-vindo, <Text style={{fontWeight: 'bold', fontStyle: 'italic'}}>{barber.name}</Text>.</Text>
        <Pressable style={styles.buttonSettings} onPress={goOptions}>
        <Icon name='bars' size={35} color="#000"/>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.container} >
        <View  style={styles.addClientContainer}>
          <Pressable style={styles.addClientCollapse} onPress={toggleRegisterView} ><Text style={[styles.title, styles.addClientTitle]}>Adicionar Cliente {isRegisterVisible ? <Icon name='chevron-down' size={20} color="white"/> : <Icon name='chevron-up' size={20} color="white"/>} </Text></Pressable>
          {isRegisterVisible && (
          <AddClientScreen handleAddClient={handleAddClient} name={name} setName={setName} contact={contact} setContact={setContact} cabelo={cabelo} setCabelo={setCabelo} barba={barba} setBarba={setBarba} bigode={bigode} setBigode={setBigode}/>
          )}
        </View>
  
        <View style={styles.clientContainer}>
          <Text style={styles.title}>Fila de Clientes</Text>
          {clients.length === 0 ? <Text style={styles.queueText}>Adicione a fila...</Text> : (clients.map((client, index) => (

          <QueueClientComponent key={client.id} client={client} onLongPress={()=> handleClientAlert(client)} onPress={()=> copyContact(client)}/>
          )))}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  body: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },

  welcome: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: -20,
    width: '100%',
  },
  
  welcomeText: {
    marginLeft: 30,
    fontSize: 20,
  },

  buttonSettings: {
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    paddingTop: -50,
    paddingBottom: 50,
  },
  

  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingBottom: 50
  },


  title: {
    fontSize: 28, 
    fontWeight: 'bold',
    marginBottom: -5,
  },

  addClientCollapse: {
    width: '100%',
    alignItems: 'center',
  },

  addClientTitle: {
    color: 'white',
  
  },
  addClient: {
    marginTop: 30,
  },

  addClientContainer: {
    width: '80%',
    borderRadius: 5,
    alignContent: 'center',
    backgroundColor: 'black',
    alignItems: 'center',
    paddingBottom: 10,
  },

  queueText: {
    fontSize: 20,
    fontStyle: 'italic',
    margin: 10,
    marginTop: 50,
    paddingBottom: 10,
  },

  clientContainer: {
    width: '100%',
    alignContent: 'center',
    alignItems: 'center',
    top: 20,
  }

})