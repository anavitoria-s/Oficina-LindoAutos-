import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Alert, Animated } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BotaoCartao from '../componentes/BotaoCartao';
import { useOficina } from '../context/OficinaContext';
import PressableAnimado from '../componentes/PressableAnimado';

export default function Inicio() {
  const navigation = useNavigation<NavigationProp<any>>();
  const { agendamentos, orcamentos, clientes, ordensServico, limparDados } = useOficina();
  const proximoAgendamento = agendamentos.length ? agendamentos[0] : null;

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const confirmarLimparDados = () => {
    Alert.alert(
      'Limpar Todos os Dados',
      'Tem certeza de que deseja apagar todos os registros do aplicativo? Esta ação é irreversível.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Limpar 🧹', style: 'destructive', onPress: limparDados },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        <View style={styles.headerTop}>
          <Image source={require('../assets/logo.jpeg')} style={styles.logoImageSmall} />
          <View style={styles.la}>
            <Text style={styles.laText}>LA</Text>
          </View>
        </View>
        
        <View style={styles.divider} />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{agendamentos.length}</Text>
              <Text style={styles.statLabel}>Agendamentos</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{ordensServico.length}</Text>
              <Text style={styles.statLabel}>Serviços (OS)</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{orcamentos.length}</Text>
              <Text style={styles.statLabel}>Orçamentos</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{clientes.length}</Text>
              <Text style={styles.statLabel}>Clientes</Text>
            </View>
          </View>

          <View style={styles.buttonGrid}>
            <BotaoCartao icone="📅" titulo={'NOVO\nAGENDAMENTO'} onPress={() => navigation.navigate('NovoAgendamento')} />
            <BotaoCartao icone="📋" variante="branco" titulo={'NOVO\nORÇAMENTO'} onPress={() => navigation.navigate('NovoOrcamento')} />
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>PRÓXIMO AGENDAMENTO</Text>
            <Text style={styles.seeAll} onPress={() => navigation.navigate('Agenda')}>VER TODOS</Text>
          </View>

          {proximoAgendamento ? (
            <View style={[styles.card, styles.agendaCard]}>
              <Text style={styles.carIcon}>🚗</Text>
              <View style={{ flex: 1 }}>
                <View style={styles.carHeader}>
                  <Text style={styles.carName}>{proximoAgendamento.carro}</Text>
                  <View style={styles.statusBadge}><Text style={styles.statusText}>{proximoAgendamento.status}</Text></View>
                </View>
                <Text style={styles.carService}>{proximoAgendamento.servico}</Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.clientName}>👤 {proximoAgendamento.cliente}</Text>
                  <Text style={styles.dateTime}>📅 {proximoAgendamento.data}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={[styles.card, styles.emptyCard]}>
              <Text style={styles.emptyText}>Nenhum agendamento cadastrado. Crie um novo agendamento para começar.</Text>
            </View>
          )}

          <PressableAnimado style={styles.btnReset} onPress={confirmarLimparDados}>
            <Text style={styles.btnResetText}>Limpar Todos os Dados 🧹</Text>
          </PressableAnimado>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  headerTop: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingVertical: 14, 
    backgroundColor: '#fff' 
  },
  logoImageSmall: {
    width: 250,
    height: 76,
    resizeMode: 'contain',
  },
  la: { borderWidth: 2, borderColor: '#000', paddingHorizontal: 10, paddingVertical: 6 },
  laText: { fontSize: 13, fontWeight: '800' },
  divider: { height: 2, backgroundColor: '#000' },
  scrollContent: { paddingHorizontal: 16, paddingVertical: 16, paddingBottom: 30 },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20, marginTop: 10 },
  statCard: { 
    width: '23%', 
    backgroundColor: '#fff', 
    borderWidth: 2, 
    borderColor: '#000', 
    padding: 8, 
    marginVertical: 4, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  statValue: { fontSize: 18, fontWeight: '800', color: '#007AFF' },
  statLabel: { fontSize: 8, fontWeight: '800', marginTop: 4, textAlign: 'center', textTransform: 'uppercase' },
  buttonGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#000' },
  sectionTitle: { fontSize: 12, fontWeight: '800' },
  seeAll: { fontSize: 11, color: '#007AFF', fontWeight: '800' },
  card: { 
    borderWidth: 2, 
    borderColor: '#000', 
    backgroundColor: '#fff', 
    padding: 12, 
    marginBottom: 16, 
    flexDirection: 'row', 
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  agendaCard: { alignItems: 'center' },
  emptyCard: { justifyContent: 'center' },
  emptyText: { fontSize: 13, color: '#666' },
  carIcon: { fontSize: 26, marginRight: 12 },
  carHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  carName: { fontSize: 14, fontWeight: '700', color: '#007AFF' },
  statusBadge: { borderWidth: 1, borderColor: '#000', paddingHorizontal: 8, paddingVertical: 2 },
  statusText: { fontSize: 10, fontWeight: '700' },
  carService: { fontSize: 12, color: '#000', marginBottom: 8 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  clientName: { fontSize: 12, color: '#000' },
  dateTime: { fontSize: 12, color: '#007AFF' },
  btnReset: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#E53E3E',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
    shadowColor: '#E53E3E',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  btnResetText: {
    color: '#E53E3E',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});
