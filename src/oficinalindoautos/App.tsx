import React, { useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Animated, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { OficinaProvider } from './context/OficinaContext';
import Inicio from './telas/Inicio';
import Agenda from './telas/Agenda';
import ListaOS from './telas/ListaOS';
import Orcamentos from './telas/Orcamentos';
import Clientes from './telas/Clientes';
import NovoAgendamento from './telas/NovoAgendamento';
import NovoOrcamento from './telas/NovoOrcamento';

enableScreens();

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function IconeTabAnimado({ focused, name, color }: { focused: boolean; name: any; color: string }) {
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (focused) {
      Animated.sequence([
        Animated.spring(scaleValue, {
          toValue: 1.25,
          useNativeDriver: true,
          tension: 180,
          friction: 6,
        }),
        Animated.spring(scaleValue, {
          toValue: 1.12,
          useNativeDriver: true,
          tension: 180,
          friction: 6,
        }),
      ]).start();
    } else {
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
        tension: 180,
        friction: 8,
      }).start();
    }
  }, [focused, scaleValue]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <Ionicons name={name} size={22} color={color} />
    </Animated.View>
  );
}

function Tabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          {
            height: 64 + (insets.bottom > 0 ? insets.bottom : 8),
            paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          }
        ],
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#000000',
      }}
    >
      <Tab.Screen
        name="Início"
        component={Inicio}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <IconeTabAnimado focused={focused} name={focused ? 'home' : 'home-outline'} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="Agenda"
        component={Agenda}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <IconeTabAnimado focused={focused} name={focused ? 'calendar' : 'calendar-outline'} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="Serviços"
        component={ListaOS}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <IconeTabAnimado focused={focused} name={focused ? 'build' : 'build-outline'} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="Orçamentos"
        component={Orcamentos}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <IconeTabAnimado focused={focused} name={focused ? 'document-text' : 'document-text-outline'} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="Clientes"
        component={Clientes}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <IconeTabAnimado focused={focused} name={focused ? 'people' : 'people-outline'} color={color} />
          )
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    'OpenSans-Regular': require('./assets/fonts/OpenSans-VariableFont_wdth,wght.ttf'),
    'OpenSans-Bold': require('./assets/fonts/OpenSans-VariableFont_wdth,wght.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <OficinaProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
              animationDuration: 250,
            }}
          >
            <Stack.Screen name="Principal" component={Tabs} />
            <Stack.Screen name="NovoAgendamento" component={NovoAgendamento} />
            <Stack.Screen name="NovoOrcamento" component={NovoOrcamento} />
          </Stack.Navigator>
          <StatusBar style="auto" />
        </NavigationContainer>
      </OficinaProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 3,
    borderColor: '#000000',
    paddingTop: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginTop: 4,
  },
});
