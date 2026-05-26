import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Animated, Modal, KeyboardAvoidingView, Platform, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOficina, Agendamento } from '../context/OficinaContext';
import { enviarMensagemWhatsApp } from '../utils/whatsapp';
import { formatarDataHoraBrasileira } from '../utils/formatacao';
import PressableAnimado from '../componentes/PressableAnimado';

const STATUS_CONFIG: Record<Agendamento['status'], { label: string; color: string; bg: string; next?: Agendamento['status'][]; actionLabel?: string }> = {
  AGENDADO: { label: 'Agendado', color: '#888', bg: '#f0f0f0', next: ['CONFIRMADO', 'CANCELADO'], actionLabel: 'Confirmar ✅' },
  CONFIRMADO: { label: 'Confirmado', color: '#007AFF', bg: '#E3F2FD', next: ['EM_ATENDIMENTO', 'NAO_COMPARECEU'], actionLabel: 'Iniciar ⚙️' },
  EM_ATENDIMENTO: { label: 'Em Atendimento', color: '#E6A23C', bg: '#FFF8E1', next: ['CONCLUIDO'], actionLabel: 'Concluir ✅' },
  CONCLUIDO: { label: 'Concluído', color: '#2bcf67', bg: '#E8F5E9' },
  NAO_COMPARECEU: { label: 'Não Compareceu', color: '#E53E3E', bg: '#FFEBEE' },
  CANCELADO: { label: 'Cancelado', color: '#666', bg: '#f5f5f5' },
};

function parseDataHora(dataStr: string): Date | null {
  const hoje = new Date();
  const partes = dataStr.toLowerCase().trim();
  const match = partes.match(/(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?\s*(?:[às\s]+)?(\d{1,2}):?(\d{2})?/);
  if (match) {
    const [, dia, mes, ano, hora, minuto] = match;
    let anoCompleto = ano ? (ano.length === 2 ? 2000 + parseInt(ano) : parseInt(ano)) : hoje.getFullYear();
    const data = new Date(anoCompleto, parseInt(mes) - 1, parseInt(dia), parseInt(hora || '0'), parseInt(minuto || '0'));
    return isNaN(data.getTime()) ? null : data;
  }
  return null;
}

function formatarDataInput(text: string): string {
  // Remove tudo exceto números
  const nums = text.replace(/\D/g, '');
  
  if (nums.length <= 2) return nums;
  if (nums.length <= 4) return `${nums.slice(0, 2)}/${nums.slice(2)}`;
  if (nums.length <= 8) return `${nums.slice(0, 2)}/${nums.slice(2, 4)} às ${nums.slice(4, 6)}:${nums.slice(6, 8) || ''}`;
  return `${nums.slice(0, 2)}/${nums.slice(2, 4)}/${nums.slice(4, 8)} às ${nums.slice(8, 10)}:${nums.slice(10, 12) || ''}`;
}

function isHoje(dataStr: string): boolean {
  const data = parseDataHora(dataStr);
  if (!data) return false;
  const hoje = new Date();
  return data.getDate() === hoje.getDate() && 
         data.getMonth() === hoje.getMonth() && 
         data.getFullYear() === hoje.getFullYear();
}

function isFuturo(dataStr: string): boolean {
  const data = parseDataHora(dataStr);
  if (!data) return false;
  return data.getTime() > Date.now();
}

function isPassado(dataStr: string): boolean {
  const data = parseDataHora(dataStr);
  if (!data) return false;
  return data.getTime() < Date.now() - 24 * 60 * 60 * 1000;
}

export default function Agenda() {
  const { agendamentos, atualizarStatusAgendamento, excluirAgendamento, editarAgendamento } = useOficina();
  const [busca, setBusca] = useState('');
  const [abaAtiva, setAbaAtiva] = useState<'hoje' | 'futuro' | 'passado' | 'todos'>('hoje');
  const [statusFiltro, setStatusFiltro] = useState<Agendamento['status'] | null>(null);

  const [agendamentoEditando, setAgendamentoEditando] = useState<Agendamento | null>(null);
  const [editCarro, setEditCarro] = useState('');
  const [editPlaca, setEditPlaca] = useState('');
  const [editServico, setEditServico] = useState('');
  const [editData, setEditData] = useState('');
  const [editTelefone, setEditTelefone] = useState('');
  
  const [remarcando, setRemarcando] = useState<Agendamento | null>(null);
  const [novaData, setNovaData] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, []);

  const iniciarEdicao = (item: Agendamento) => {
    setAgendamentoEditando(item);
    setEditCarro(item.carro);
    setEditPlaca(item.placa || '');
    setEditServico(item.servico);
    setEditData(item.data);
    setEditTelefone(item.telefone);
  };

  const salvarEdicao = () => {
    if (agendamentoEditando) {
      editarAgendamento(agendamentoEditando.id, {
        carro: editCarro,
        placa: editPlaca,
        servico: editServico,
        data: editData,
        telefone: editTelefone,
      });
      setAgendamentoEditando(null);
    }
  };

  const iniciarRemarcacao = (item: Agendamento) => {
    setRemarcando(item);
    setNovaData(item.data);
  };

  const confirmarRemarcacao = () => {
    if (remarcando && novaData.trim()) {
      editarAgendamento(remarcando.id, {
        carro: remarcando.carro,
        placa: remarcando.placa || '',
        servico: remarcando.servico,
        data: novaData,
        telefone: remarcando.telefone,
      });
      setRemarcando(null);
      setNovaData('');
    }
  };

  const agendamentosFiltrados = useMemo(() => {
    return agendamentos.filter(item => {
      const matchBusca = item.cliente.toLowerCase().includes(busca.toLowerCase()) ||
                         item.carro.toLowerCase().includes(busca.toLowerCase()) ||
                         item.servico.toLowerCase().includes(busca.toLowerCase());
      
      if (!matchBusca) return false;
      if (statusFiltro && item.status !== statusFiltro) return false;
      
      if (abaAtiva === 'hoje') return isHoje(item.data);
      if (abaAtiva === 'futuro') return isFuturo(item.data);
      if (abaAtiva === 'passado') return isPassado(item.data);
      return true;
    });
  }, [agendamentos, busca, statusFiltro, abaAtiva]);

  const contagem = useMemo(() => ({
    hoje: agendamentos.filter(a => isHoje(a.data)).length,
    futuro: agendamentos.filter(a => isFuturo(a.data)).length,
    passado: agendamentos.filter(a => isPassado(a.data)).length,
    todos: agendamentos.length,
  }), [agendamentos]);

  const renderizarCard = useMemo(() => {
    return ({ item }: { item: Agendamento }) => {
      const config = STATUS_CONFIG[item.status];
      const ehHoje = isHoje(item.data);
      
      return (
        <View style={[styles.card, ehHoje && styles.cardHoje]}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{item.carro}</Text>
            {item.placa ? <Text style={styles.placaText}>🎫 Placa: {item.placa}</Text> : null}
          </View>
          <View style={[styles.badge, { backgroundColor: config.bg, borderColor: config.color }]}>
            <Text style={[styles.badgeText, { color: config.color }]}>{config.label}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoSection}>
          <Text style={styles.cardLine}>👤 <Text style={styles.value}>{item.cliente}</Text></Text>
          <Text style={styles.cardLine}>📞 <Text style={styles.value}>{item.telefone || 'Não informado'}</Text></Text>
          <Text style={styles.cardLine}>🔧 <Text style={styles.value}>{item.servico}</Text></Text>
          <Text style={[styles.cardLine, ehHoje && styles.dataHoje]}>
            📅 <Text style={styles.value}>{item.data}</Text>
            {ehHoje && <Text style={styles.hojeBadge}> HOJE</Text>}
          </Text>
        </View>

        <View style={styles.actionRow}>
          {config.next ? (
            <PressableAnimado 
              style={[styles.btnAction, { backgroundColor: config.color, borderColor: config.color }]} 
              onPress={() => atualizarStatusAgendamento(item.id, config.next![0])}
            >
              <Text style={[styles.btnActionText, { color: '#fff' }]}>{config.actionLabel}</Text>
            </PressableAnimado>
          ) : (
            <View style={[styles.btnAction, styles.btnDisabled]}>
              <Text style={styles.btnDisabledText}>{config.label}</Text>
            </View>
          )}

          <PressableAnimado 
            style={[styles.btnAction, styles.btnRemarcar]} 
            onPress={() => iniciarRemarcacao(item)}
          >
            <Text style={styles.btnRemarcarText}>⏰ Remarcar</Text>
          </PressableAnimado>

          <PressableAnimado 
            style={[styles.btnAction, styles.btnEdit]} 
            onPress={() => iniciarEdicao(item)}
          >
            <Text style={styles.btnEditText}>✏️</Text>
          </PressableAnimado>

          <PressableAnimado 
            style={[styles.btnAction, styles.btnDelete]} 
            onPress={() => excluirAgendamento(item.id)}
          >
            <Text style={styles.btnDeleteText}>🗑️</Text>
          </PressableAnimado>
        </View>

        {config.next && config.next.length > 1 && (
          <View style={styles.altStatusRow}>
            {config.next.slice(1).map(altStatus => (
              <PressableAnimado 
                key={altStatus}
                style={[styles.btnAltStatus, { borderColor: STATUS_CONFIG[altStatus].color }]} 
                onPress={() => atualizarStatusAgendamento(item.id, altStatus)}
              >
                <Text style={[styles.btnAltStatusText, { color: STATUS_CONFIG[altStatus].color }]}>
                  {STATUS_CONFIG[altStatus].label}
                </Text>
              </PressableAnimado>
            ))}
          </View>
        )}

        {(item.status === 'CONFIRMADO' || item.status === 'AGENDADO') && (
          <PressableAnimado 
            style={styles.btnWhatsApp} 
            onPress={() => {
              const msg = `Olá, *${item.cliente}*!\n\n📅 Lembrete da oficina *LindoAutos*!\n\nSeu agendamento para o *${item.carro}* está marcado para:\n⏰ *${item.data}*\n\n� *Serviço*: ${item.servico}\n\nEstamos aguardando você! 🚗�`;
              enviarMensagemWhatsApp(item.telefone, msg);
            }}
          >
            <Text style={styles.btnWhatsAppText}>💬 Enviar Lembrete WhatsApp</Text>
          </PressableAnimado>
        )}
        </View>
      );
    };
  }, [atualizarStatusAgendamento, excluirAgendamento, editarAgendamento]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>📅 Agenda da Oficina</Text>
          <Text style={styles.subtitle}>Gerencie agendamentos e acompanhe status dos clientes</Text>

          <TextInput 
            style={styles.searchBar} 
            value={busca} 
            onChangeText={setBusca} 
            placeholder="🔍 Buscar por cliente, veículo ou serviço..." 
            placeholderTextColor="#888"
          />

          {/* Abas de filtro por data */}
          <View style={styles.abasContainer}>
            {(['hoje', 'futuro', 'passado', 'todos'] as const).map(aba => (
              <PressableAnimado
                key={aba}
                style={[styles.aba, abaAtiva === aba && styles.abaAtiva]}
                onPress={() => setAbaAtiva(aba)}
              >
                <Text style={[styles.abaText, abaAtiva === aba && styles.abaTextAtiva]}>
                  {aba === 'hoje' ? `📍 Hoje (${contagem.hoje})` : 
                   aba === 'futuro' ? `🔜 Futuro (${contagem.futuro})` :
                   aba === 'passado' ? `📜 Passado (${contagem.passado})` :
                   `📋 Todos (${contagem.todos})`}
                </Text>
              </PressableAnimado>
            ))}
          </View>
          
          {agendamentosFiltrados.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                {agendamentos.length === 0 
                  ? '📭 Nenhum agendamento cadastrado.\n\nToque em "Novo" na barra inferior para criar.' 
                  : '🔍 Nenhum agendamento encontrado para este filtro.'}
              </Text>
            </View>
          ) : (
            <FlatList
              data={agendamentosFiltrados}
              renderItem={renderizarCard}
              keyExtractor={(item) => item.id}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={5}
              removeClippedSubviews={true}
              scrollEnabled={false}
            />
          )}
        </ScrollView>
      </Animated.View>

      {/* Modal de Edição */}
      <Modal
        visible={agendamentoEditando !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setAgendamentoEditando(null)}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} keyboardShouldPersistTaps="handled">
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>✏️ Editar Agendamento</Text>
            
              <Text style={styles.modalLabel}>Carro / Modelo</Text>
              <TextInput style={styles.modalInput} value={editCarro} onChangeText={setEditCarro} />

              <Text style={styles.modalLabel}>Placa do Veículo</Text>
              <TextInput style={styles.modalInput} value={editPlaca} onChangeText={setEditPlaca} autoCapitalize="characters" />

              <Text style={styles.modalLabel}>Serviço</Text>
              <TextInput style={styles.modalInput} value={editServico} onChangeText={setEditServico} />

              <Text style={styles.modalLabel}>Data / Horário</Text>
              <TextInput style={styles.modalInput} value={editData} onChangeText={setEditData} />

              <Text style={styles.modalLabel}>Telefone</Text>
              <TextInput style={styles.modalInput} value={editTelefone} onChangeText={setEditTelefone} keyboardType="phone-pad" />

              <View style={styles.modalBtnRow}>
                <PressableAnimado style={[styles.modalBtn, styles.modalBtnCancel]} onPress={() => setAgendamentoEditando(null)}>
                  <Text style={styles.modalBtnCancelText}>Cancelar</Text>
                </PressableAnimado>
                <PressableAnimado style={[styles.modalBtn, styles.modalBtnSave]} onPress={salvarEdicao}>
                  <Text style={styles.modalBtnSaveText}>Salvar 💾</Text>
                </PressableAnimado>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      {/* Modal de Remarcação */}
      <Modal
        visible={remarcando !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => { setRemarcando(null); setNovaData(''); }}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} keyboardShouldPersistTaps="handled">
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>⏰ Remarcar Atendimento</Text>
              
              {remarcando && (
                <View style={{ marginBottom: 16, padding: 12, backgroundColor: '#f9f9f9', borderRadius: 8 }}>
                  <Text style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>👤 <Text style={{ fontWeight: '800', color: '#000' }}>{remarcando.cliente}</Text></Text>
                  <Text style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>🚗 <Text style={{ fontWeight: '800', color: '#000' }}>{remarcando.carro}</Text></Text>
                  <Text style={{ fontSize: 14, color: '#666' }}>📅 Data atual: <Text style={{ fontWeight: '800', color: '#E53E3E' }}>{remarcando.data}</Text></Text>
                </View>
              )}

              <Text style={styles.modalLabel}>Nova Data e Horário</Text>
              <TextInput 
                style={[styles.modalInput, { fontSize: 16, fontWeight: '700' }]} 
                value={novaData} 
                onChangeText={(text) => setNovaData(formatarDataInput(text))}
                placeholder="DD/MM/AAAA às HH:mm"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />

              <View style={styles.modalBtnRow}>
                <PressableAnimado style={[styles.modalBtn, styles.modalBtnCancel]} onPress={() => { setRemarcando(null); setNovaData(''); }}>
                  <Text style={styles.modalBtnCancelText}>Cancelar</Text>
                </PressableAnimado>
                <PressableAnimado style={[styles.modalBtn, styles.modalBtnSave]} onPress={confirmarRemarcacao}>
                  <Text style={styles.modalBtnSaveText}>Confirmar ⏰</Text>
                </PressableAnimado>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  scrollContainer: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 6, color: '#000' },
  subtitle: { fontSize: 13, color: '#666', marginBottom: 20 },
  searchBar: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  card: { 
    backgroundColor: '#fff', 
    borderWidth: 2, 
    borderColor: '#000', 
    borderRadius: 8, 
    padding: 16, 
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  cardHoje: {
    borderColor: '#007AFF',
    borderWidth: 3,
    shadowColor: '#007AFF',
  },
  placaText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#666',
    marginTop: 2,
  },
  infoSection: {
    marginBottom: 8,
  },
  dataHoje: {
    color: '#007AFF',
  },
  hojeBadge: {
    backgroundColor: '#007AFF',
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#007AFF' },
  badge: {
    borderWidth: 1.5,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginBottom: 12,
  },
  cardLine: { fontSize: 13, marginBottom: 6, fontWeight: '700', color: '#333' },
  value: { fontWeight: '500', color: '#000' },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  btnAction: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000',
    marginHorizontal: 2,
    minWidth: 60,
  },
  btnActionText: {
    fontSize: 12,
    fontWeight: '800',
  },
  btnDisabled: {
    backgroundColor: '#f1f1f1',
    borderColor: '#ddd',
  },
  btnDisabledText: {
    color: '#888',
    fontSize: 12,
    fontWeight: '700',
  },
  btnRemarcar: {
    backgroundColor: '#FFD166',
    borderColor: '#f6c042',
  },
  btnRemarcarText: {
    color: '#000',
    fontSize: 11,
    fontWeight: '800',
  },
  altStatusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  btnAltStatus: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1.5,
    backgroundColor: '#fff',
  },
  btnAltStatusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  abasContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  aba: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  abaAtiva: {
    borderColor: '#007AFF',
    backgroundColor: '#E3F2FD',
  },
  abaText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#666',
  },
  abaTextAtiva: {
    color: '#007AFF',
    fontWeight: '900',
  },
  btnDelete: {
    backgroundColor: '#f7d1d1',
    borderColor: '#E53E3E',
    maxWidth: 50,
  },
  btnDeleteText: {
    color: '#E53E3E',
    fontSize: 14,
    fontWeight: '700',
  },
  btnEdit: {
    backgroundColor: '#FFD166',
    borderColor: '#f6c042',
  },
  btnEditText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '700',
  },
  btnWhatsApp: {
    backgroundColor: '#EFFFEC',
    borderWidth: 2,
    borderColor: '#2bcf67',
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  btnWhatsAppText: {
    color: '#2bcf67',
    fontSize: 13,
    fontWeight: '800',
  },
  emptyCard: {
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 8,
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#000',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 16,
    color: '#000',
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    color: '#000',
  },
  modalInput: {
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 6,
    padding: 10,
    marginBottom: 14,
    fontSize: 14,
    color: '#000',
    backgroundColor: '#fff',
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalBtn: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnCancel: {
    backgroundColor: '#f3f3f3',
    marginRight: 10,
  },
  modalBtnCancelText: {
    color: '#000',
    fontWeight: '700',
  },
  modalBtnSave: {
    backgroundColor: '#2bcf67',
  },
  modalBtnSaveText: {
    color: '#fff',
    fontWeight: '900',
  },
});
