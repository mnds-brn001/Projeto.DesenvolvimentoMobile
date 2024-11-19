import { StyleSheet, Text, View, TextInput, Pressable, Modal, Button } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {  useState } from 'react';
import { Calendar } from 'react-native-calendars';
import { useSQLiteContext } from 'expo-sqlite';
import { ScrollView } from 'react-native-gesture-handler';

export default function CalendarScreen({ navigation }) {

  const [selectedDate, setSelectedDate] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [clientList, setClientList] = useState([]);

  const db = useSQLiteContext();

  async function listClients(day){
    console.log("day", day);
    const clientsOnDate = await db.getAllAsync("SELECT * FROM clients WHERE DATE(date) = ?", [day]);
    console.log("clientList", clientsOnDate);
    setClientList(clientsOnDate);
  }

  const formatDateString = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <View style={styles.container}>

      <Pressable style={styles.button} onPress={() => setModalVisible(!modalVisible)}>
        <Text style={styles.buttonText}>Calendário {modalVisible ? <Icon name='chevron-down' size={20} color="white"/> : <Icon name='chevron-up' size={20} color="white"/>}</Text>
      </Pressable>
        {!modalVisible ? <Text style={styles.dateText}>DATA:</Text> : <Calendar
          onDayPress={day => {
          listClients(day.dateString);
          const formattedDate = formatDateString(day.dateString);
          setSelectedDate(formattedDate);
        }}
        markedDates={{
          [selectedDate]: { selected: true, marked: true, selectedColor: 'gray' },
        }}
        theme={{
          backgroundColor: '#000',
          calendarBackground: '#000',
          textSectionTitleColor: 'white',
          textSectionTitleDisabledColor: 'gray',
          selectedDayBackgroundColor: 'gray',
          selectedDayTextColor: 'white',
          todayTextColor: 'white',
          dayTextColor: 'white',
          textDisabledColor: 'gray',
          dotColor: 'white',
          arrowColor: 'white',
          monthTextColor: 'white',
          indicatorColor: 'white',
        }}
        style={styles.calendar}
      />

  }

      <Text style={styles.dateText}>{selectedDate}</Text>

      <ScrollView style={styles.clientListContainer}>
      {selectedDate && clientList.length > 0 ? clientList.map((client, index) => (

          <View style={styles.clientContainer} key={client.id}>
            
            
            <Text style={styles.clientTextName}>{client.name}</Text>
            
            <View style={styles.servicesContainer}>
              {client.service_type.split(",").map((service, index) => (
                <Text style={styles.serviceText} key={index}>{service}</Text>
              ))}
            </View>
            <Text style={styles.clientTextContact}>{client.contact}</Text>
            
          </View>
          
        )) : <View style={styles.container}><Text style={styles.dateTextWarning}>Selecione uma data válida</Text></View>
      }
      </ScrollView>
    
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
  
  calendar: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 10,
    padding: 10,
    height: 330,
  },
  
  dateText: {
    marginTop: 10,
    fontWeight : 'bold',
    fontSize: 18,
  },

  dateTextWarning: {
    marginTop: 10,
    fontWeight : 'bold',
    fontSize: 18,
    color: 'black',
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

  clientContainer:{
    width: '90%',
    marginLeft: '5%',
    justifyContent: 'center',
    backgroundColor: 'gray',
    marginBottom: 10,
    padding: 10,
    alignItems: 'center', 
    borderRadius: 10,

  },

  clientListContainer: {
    backgroundColor: 'white',
    width: '100%',
    alignContent: 'center',
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },

  servicesContainer: {
    alignContent: 'center',
    justifyContent: 'center',
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  serviceText: {
    fontStyle: 'italic',
    width: 'auto',
    borderRadius: 5,
    padding: 5,
    margin: 5,
    fontSize: 20,
  },

  clientTextName:{
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: 20,
    width: '100%',
  },

  clientTextContact: {
    textAlign: 'right',
    fontSize: 20,
    fontWeight: 'bold',
    width: '50%',
    alignSelf: 'flex-end',
  },

});