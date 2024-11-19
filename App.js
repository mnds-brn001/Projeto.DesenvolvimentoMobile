import { SQLiteProvider } from 'expo-sqlite';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { initializeDatabase } from './database/initializeDatabase';

import LoginScreen from './screens/login';
import BarberScreen from './screens/barber';
import OptionsScreen from './screens/options';

import CalendarScreen from './screens/calendar';
import ProfileSettingsScreen from './screens/profileSettings';

const Stack = createStackNavigator();


export default function App() {
  return (
    <SQLiteProvider databaseName="barbers.db" onInit={initializeDatabase}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: '' }} />
          <Stack.Screen name="Barber" component={BarberScreen} options={{ title: '' }} />
          <Stack.Screen name="Options" component={OptionsScreen} options={{ title: 'Opções' }} />

          <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} options={{ title: 'Configurações de Perfil...' }} />
          <Stack.Screen name="Calendar" component={CalendarScreen} options={{ title: 'Calendário de Cortes' }} />

        </Stack.Navigator>
      </NavigationContainer>
    </SQLiteProvider>
  )
}