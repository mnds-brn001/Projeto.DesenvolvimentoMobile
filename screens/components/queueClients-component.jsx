import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function QueueClientComponent( {client, onLongPress, onPress} ) {

  const services = client.service_type.split(",")

return (
  <Pressable style={[styles.client, { backgroundColor: client.status ? 'gray' : 'lightgray'}]} onLongPress={onLongPress}>
    <View>
      <Text style={[styles.clientTextName, {
        textDecorationLine: client.status ? 'none' : 'line-through',
        color: client.status ? 'black' : 'gray',
        }]}>{client.name}</Text>
  
      {services && services.length > 0 && (
        <View style={styles.servicesContainer}>
          {services.map((service, index) => (
            <Text key={index} style={[styles.serviceText, {
              textDecorationLine: client.status ? 'none' : 'line-through',
              color: client.status ? 'black' : 'gray',
              }]}>
              {service}
            </Text>
        ))}
        </View>
      )}
      <Pressable  onPress={onPress}>
        <Text style={[styles.clientTextContact,  {
          textDecorationLine: client.status ? 'none' : 'line-through',
          color: client.status ? 'black' : 'gray',
          }]}>{client.contact}</Text>
        </Pressable>
    </View>
    
  </Pressable>
);
}

const styles = StyleSheet.create({
  client: {
    flexDirection: 'column',
    width: '90%',
    borderRadius: 5,
    padding: 10,
    margin: 10,
  },

  clientTextName:{
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: 22,
    width: '100%',
  },

  clientTextContact: {
    textAlign: 'right',
    fontSize: 22,
    fontWeight: 'bold',
    width: '50%',
    alignSelf: 'flex-end',
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
})