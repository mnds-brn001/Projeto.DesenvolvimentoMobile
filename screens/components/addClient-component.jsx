import { TextInputMask } from 'react-native-masked-text'
import { Pressable, TextInput, StyleSheet, Text, View, Switch} from 'react-native'

export default function AddClientScreen({
  name, setName, contact, setContact, handleAddClient, cabelo, setCabelo, barba, setBarba, bigode, setBigode
}) {
  return (
    <>
    <TextInput style={styles.input} placeholder='Nome...' value={name} onChangeText={setName} />

    <TextInputMask type={'cel-phone'}
      options={{
        maskType: 'BRL',
        withDDD: true,
        dddMask: '(99) '
      }}
      value={contact}
      onChangeText={setContact}
      style={styles.input}
      placeholder="Telefone..." />
      
      <View style={styles.checkboxContainer}>
        <Switch
          value={cabelo}
          onValueChange={setCabelo}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={cabelo ? '#a6a6a6' : '#f4f3f4'}
        />
        <Text style={styles.label}>Cabelo</Text>
      </View>

      <View style={styles.checkboxContainer}>
      <Switch
          value={barba}
          onValueChange={setBarba}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={barba ? '#a6a6a6' : '#f4f3f4'}
        />
        <Text style={styles.label}>Barba</Text>
      </View>

      <View style={styles.checkboxContainer}>
        <Switch
          value={bigode}
          onValueChange={setBigode}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={bigode ? '#a6a6a6' : '#f4f3f4'}
        />
        <Text style={styles.label}>Bigode</Text>
      </View>

      
      
      <Pressable style={styles.button} onPress={handleAddClient}>
      <Text style={styles.buttonText}>+</Text>
    </Pressable>
    </>
  )
}

const styles = StyleSheet.create({
  

  input: {
    paddingLeft: 10,
    borderRadius: 5,
    height: 40,
    fontSize: 20,
    fontWeight: 'bold',
    width: '80%',
    backgroundColor: 'white',
    borderColor: 'white',
    color: 'black',
    borderWidth: 1,
    margin: 10,
  },

  buttonText: {
    backgroundColor: 'white',
    color: 'black',
    width: '50%',
    fontSize: 28,
    fontWeight: 'bold',
    padding: 2,
    borderRadius: 5,
    textAlign: 'center',
  },
  
  button: {
    alignItems: 'center',
    width: '80%',
  },
  checkboxContainer: {

    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '50%',
  },

  label: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },

})