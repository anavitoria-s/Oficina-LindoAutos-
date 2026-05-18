import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';
import { OficinaProvider } from './context/OficinaContext';
import Inicio from './telas/Inicio';
import Agenda from './telas/Agenda';
import Orcamentos from './telas/Orcamentos';
import Clientes from './telas/Clientes';
import NovoAgendamento from './telas/NovoAgendamento';
import NovoOrcamento from './telas/NovoOrcamento';

enableScreens();

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="Início"
        component={Inicio}
        options={{ tabBarIcon: () => <Text style={styles.tabIcon}>🏠</Text> }}
      />
      <Tab.Screen
        name="Agenda"
        component={Agenda}
        options={{ tabBarIcon: () => <Text style={styles.tabIcon}>📅</Text> }}
      />
      <Tab.Screen
        name="Orçamentos"
        component={Orcamentos}
        options={{ tabBarIcon: () => <Text style={styles.tabIcon}>📋</Text> }}
      />
      <Tab.Screen
        name="Clientes"
        component={Clientes}
        options={{ tabBarIcon: () => <Text style={styles.tabIcon}>👤</Text> }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <OficinaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Principal" component={Tabs} />
          <Stack.Screen name="NovoAgendamento" component={NovoAgendamento} />
          <Stack.Screen name="NovoOrcamento" component={NovoOrcamento} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </OficinaProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 70,
    paddingBottom: 10,
    paddingTop: 8,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  tabIcon: {
    fontSize: 18,
  },
});
