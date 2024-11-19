import { StyleSheet, Text, View } from 'react-native';
import { Pressable } from 'react-native';

export default function OptionsScreen({ navigation }) {
  return (
    <View style={styles.container}>    
        <Pressable style={styles.button} onPress={() => navigation.navigate('ProfileSettings')}>
          <Text style={styles.buttonText}>Configurações de Perfil</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={() => navigation.navigate('Calendar')}>
          <Text style={styles.buttonText}>Calendário de Cortes</Text>
        </Pressable>
    </View>
  );
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 100,
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

});