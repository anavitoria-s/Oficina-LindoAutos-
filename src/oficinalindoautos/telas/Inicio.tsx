import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import BotaoCartao from '../componentes/BotaoCartao';
import { useOficina } from '../context/OficinaContext';

export default function Inicio() {
  const navigation = useNavigation<NavigationProp<any>>();
  const { agendamentos, orcamentos, clientes } = useOficina();
  const proximoAgendamento = agendamentos.length ? agendamentos[0] : null;

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/logo.jpeg')} style={styles.logoImage} />
      </View>

      <View style={styles.headerTop}>
        <Text style={styles.logo}><Text style={styles.logoLindo}>LINDO</Text><Text style={styles.logoAutos}>AUTOS</Text></Text>
        <View style={styles.la}><Text style={styles.laText}>LA</Text></View>
      </View>
      <View style={styles.divider} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{agendamentos.length}</Text>
            <Text style={styles.statLabel}>Agendamentos</Text>
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#f8f8f8' },
  headerTop: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal:16, paddingVertical:12, backgroundColor:'#fff' },
  logoContainer: { alignItems:'center', backgroundColor:'#fff', paddingVertical:16 },
  logoImage: { width: 160, height: 80, resizeMode:'contain' },
  logo: { fontSize:24, fontWeight:'700' },
  logoLindo: { color:'#000' },
  logoAutos: { color:'#007AFF' },
  la: { borderWidth:2, borderColor:'#000', paddingHorizontal:8, paddingVertical:4 },
  laText: { fontSize:12, fontWeight:'700' },
  divider: { height:1, backgroundColor:'#000' },
  scrollContent: { paddingHorizontal:16, paddingVertical:16, paddingBottom:20 },
  statsRow: { flexDirection:'row', justifyContent:'space-between', marginBottom:24 },
  statCard: { flex:1, backgroundColor:'#fff', borderWidth:2, borderColor:'#000', padding:12, marginHorizontal:4, alignItems:'center' },
  statValue: { fontSize:24, fontWeight:'700', color:'#007AFF' },
  statLabel: { fontSize:12, fontWeight:'700', marginTop:4, textAlign:'center' },
  buttonGrid: { flexDirection:'row', justifyContent:'space-between', marginBottom:24 },
  sectionHeader: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:8, paddingBottom:8, borderBottomWidth:1, borderBottomColor:'#000' },
  sectionTitle: { fontSize:14, fontWeight:'700' },
  seeAll: { fontSize:12, color:'#007AFF', fontWeight:'700' },
  card: { borderWidth:2, borderColor:'#000', backgroundColor:'#fff', padding:12, marginBottom:16, flexDirection:'row', alignItems:'flex-start' },
  agendaCard: { alignItems:'center' },
  emptyCard: { justifyContent:'center' },
  emptyText: { fontSize:14, color:'#666' },
  carIcon: { fontSize:26, marginRight:12 },
  carHeader: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:6 },
  carName: { fontSize:14, fontWeight:'700', color:'#007AFF' },
  statusBadge: { borderWidth:1, borderColor:'#000', paddingHorizontal:8, paddingVertical:2 },
  statusText: { fontSize:10, fontWeight:'700' },
  carService: { fontSize:12, color:'#000', marginBottom:8 },
  cardFooter: { flexDirection:'row', justifyContent:'space-between' },
  clientName: { fontSize:12, color:'#000' },
  dateTime: { fontSize:12, color:'#007AFF' },
});
