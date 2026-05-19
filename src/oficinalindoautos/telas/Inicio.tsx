import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import BotaoCartao from '../componentes/BotaoCartao';
import { useOficina } from '../context/OficinaContext';
import { useFonts } from 'expo-font';

// Centralização da paleta de cores para facilitar manutenção e consistência
const CORES = {
  azul: '#007AFF',
  fundo: '#F2F2F7',
  branco: '#FFFFFF',
  textoPrincipal: '#1C1C1E',
  textoSecundario: '#8E8E93',
  borda: '#E5E5EA',
  badgeBorda: '#3A3A3C'
};

export default function Inicio() {
  const navigation = useNavigation<NavigationProp<any>>();
  const { agendamentos, orcamentos, clientes } = useOficina();
  const proximoAgendamento = agendamentos.length ? agendamentos[0] : null;

  return (
    <View style={styles.container}>
      {/* Cabeçalho com Logo */}
      <View style={styles.logoContainer}>
        <Image source={require('../assets/logo.jpeg')} style={styles.logoImage} />
      </View>

      <View style={styles.headerTop}>
        <Text style={styles.logo}>
          <Text style={styles.logoLindo}>LINDO</Text>
          <Text style={styles.logoAutos}>AUTOS</Text>
        </Text>
        <View style={styles.laBadge}>
          <Text style={styles.laText}>LA</Text>
        </View>
      </View>
      <View style={styles.divider} />

      {/* Conteúdo Rolável */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Painel de Estatísticas */}
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

        {/* Ações Rápidas */}
        <View style={styles.buttonGrid}>
          <BotaoCartao icone="📅" titulo={'NOVO\nAGENDAMENTO'} onPress={() => navigation.navigate('NovoAgendamento')} />
          <BotaoCartao icone="📋" variante="branco" titulo={'NOVO\nORÇAMENTO'} onPress={() => navigation.navigate('NovoOrcamento')} />
        </View>

        {/* Seção do Próximo Agendamento */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>PRÓXIMO AGENDAMENTO</Text>
          <Text style={styles.seeAll} onPress={() => navigation.navigate('Agenda')}>VER TODOS</Text>
        </View>

        {proximoAgendamento ? (
          <View style={[styles.card, styles.agendaCard]}>
            <Text style={styles.carIcon}>🚗</Text>
            <View style={styles.carDetails}>
              <View style={styles.carHeader}>
                <Text style={styles.carName}>{proximoAgendamento.carro}</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{proximoAgendamento.status}</Text>
                </View>
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
  container: { 
    flex: 1, 
    backgroundColor: CORES.fundo 
  },
  logoContainer: { 
    alignItems: 'center', 
    backgroundColor: CORES.branco, 
    paddingVertical: 12 
  },
  logoImage: { 
    width: 140, 
    height: 70, 
    resizeMode: 'contain' 
  },
  headerTop: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingBottom: 12, 
    backgroundColor: CORES.branco 

  },
  logo: { 
    fontSize: 22, 
    fontWeight: '800', 
    letterSpacing: 0.5,
 
  },
  logoLindo: { 
    color: CORES.textoPrincipal 
  },
  logoAutos: { 
    color: CORES.azul 
  },
  laBadge: { 
    borderWidth: 1.3, 
    borderColor: CORES.textoPrincipal, 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 4 
  },
  laText: { 
    fontSize: 12, 
    fontWeight: '700' 
  },
  divider: { 
    height: 1, 
    backgroundColor: CORES.borda 
  },
  scrollContent: { 
    paddingHorizontal: 16, 
    paddingTop: 16, 
    paddingBottom: 32 
  },
  statsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 20 
  },
  statCard: { 
    flex: 1, 
    backgroundColor: CORES.branco, 
    borderWidth: 1, 
    borderColor: CORES.borda, 
    borderRadius: 12, 
    padding: 14, 
    marginHorizontal: 4, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2
  },
  statValue: { 
    fontSize: 22, 
    fontWeight: '800', 
    color: CORES.azul 
  },
  statLabel: { 
    fontSize: 11, 
    fontWeight: '600', 
    color: CORES.textoSecundario, 
    marginTop: 4, 
    textAlign: 'center' 
  },
  buttonGrid: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 24 
  },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 12, 
    paddingBottom: 6, 
    borderBottomWidth: 1, 
    borderBottomColor: CORES.borda 
  },
  sectionTitle: { 
    fontSize: 13, 
    fontWeight: '700', 
    color: CORES.textoSecundario, 
    letterSpacing: 0.5 
  },
  seeAll: { 
    fontSize: 12, 
    color: CORES.azul, 
    fontWeight: '700' 
  },
  card: { 
    borderWidth: 1, 
    borderColor: CORES.borda, 
    backgroundColor: CORES.branco, 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 16, 
    flexDirection: 'row', 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2
  },
  agendaCard: { 
    alignItems: 'flex-start' 
  },
  carDetails: { 
    flex: 1 
  },
  emptyCard: { 
    justifyContent: 'center', 
    paddingVertical: 24 
  },
  emptyText: { 
    fontSize: 14, 
    color: CORES.textoSecundario, 
    textAlign: 'center', 
    lineHeight: 20 
  },
  carIcon: { 
    fontSize: 24, 
    marginRight: 12, 
    marginTop: 2 
  },
  carHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 4 
  },
  carName: { 
    fontSize: 15, 
    fontWeight: '700', 
    color: CORES.textoPrincipal 
  },
  statusBadge: { 
    borderWidth: 1, 
    borderColor: CORES.badgeBorda, 
    paddingHorizontal: 6, 
    paddingVertical: 2, 
    borderRadius: 4 
  },
  statusText: { 
    fontSize: 10, 
    fontWeight: '700', 
    color: CORES.badgeBorda 
  },
  carService: { 
    fontSize: 13, 
    color: CORES.textoSecundario, 
    marginBottom: 12 
  },
  cardFooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    borderTopWidth: 1, 
    borderTopColor: CORES.fundo, 
    paddingTop: 8 
  },
  clientName: { 
    fontSize: 12, 
    color: CORES.textoPrincipal, 
    fontWeight: '500' 
  },
  dateTime: { 
    fontSize: 12, 
    color: CORES.azul, 
    fontWeight: '600' 
  },
});