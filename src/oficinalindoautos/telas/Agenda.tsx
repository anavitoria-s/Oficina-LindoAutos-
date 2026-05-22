import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Animated, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOficina, Agendamento } from '../context/OficinaContext';
import { enviarMensagemWhatsApp } from '../utils/whatsapp';
import { formatarDataHoraBrasileira } from '../utils/formatacao';
import PressableAnimado from '../componentes/PressableAnimado';

export default function Agenda() {
  const { agendamentos, atualizarStatusAgendamento, excluirAgendamento, editarAgendamento } = useOficina();
  const [busca, setBusca] = useState('');

  const [agendamentoEditando, setAgendamentoEditando] = useState<Agendamento | null>(null);
  const [editCarro, setEditCarro] = useState('');
  const [editPlaca, setEditPlaca] = useState('');
  const [editServico, setEditServico] = useState('');
  const [editData, setEditData] = useState('');
  const [editTelefone, setEditTelefone] = useState('');

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

  const agendamentosFiltrados = agendamentos.filter(item =>
    item.cliente.toLowerCase().includes(busca.toLowerCase()) ||
    item.carro.toLowerCase().includes(busca.toLowerCase()) ||
    item.servico.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Agenda</Text>
          <Text style={styles.subtitle}>Gerencie os agendamentos e horários marcados na oficina.</Text>

          <TextInput 
            style={styles.searchBar} 
            value={busca} 
            onChangeText={setBusca} 
            placeholder="🔍 Buscar por cliente, veículo ou serviço..." 
            placeholderTextColor="#888"
          />
          
          {agendamentosFiltrados.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                {agendamentos.length === 0 ? 'Nenhum agendamento cadastrado ainda.' : 'Nenhum agendamento correspondente encontrado.'}
              </Text>
            </View>
          ) : (
            agendamentosFiltrados.map(item => {
              const isPendente = item.status === 'PENDENTE';
              return (
                <View key={item.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View>
                      <Text style={styles.cardTitle}>{item.carro}</Text>
                      {item.placa ? <Text style={{ fontSize: 11, fontWeight: '800', color: '#666', marginTop: 2 }}>🎫 Placa: {item.placa}</Text> : null}
                    </View>
                    <View style={[styles.badge, { borderColor: isPendente ? '#E6A23C' : '#2bcf67' }]}>
                      <Text style={[styles.badgeText, { color: isPendente ? '#E6A23C' : '#2bcf67' }]}>
                        {isPendente ? 'Pendente' : 'Concluído'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  <Text style={styles.cardLine}>Cliente: <Text style={styles.value}>{item.cliente}</Text></Text>
                  <Text style={styles.cardLine}>Telefone: <Text style={styles.value}>{item.telefone || 'Não informado'}</Text></Text>
                  <Text style={styles.cardLine}>Serviço: <Text style={styles.value}>{item.servico}</Text></Text>
                  <Text style={styles.cardLine}>Data Marcada: <Text style={styles.value}>{item.data}</Text></Text>

                  <View style={{ marginTop: 8, marginBottom: 8, padding: 8, backgroundColor: '#f9f9f9', borderRadius: 6, borderWidth: 1, borderColor: '#eee' }}>
                    <Text style={{ fontSize: 11, color: '#666', fontWeight: '600' }}>Registro: {formatarDataHoraBrasileira(item.criadoEm)}</Text>
                    {item.concluidoEm ? (
                      <Text style={{ fontSize: 11, color: '#2bcf67', fontWeight: '800', marginTop: 2 }}>Concluído em: {formatarDataHoraBrasileira(item.concluidoEm)}</Text>
                    ) : null}
                  </View>

                  <View style={styles.actionRow}>
                    {isPendente ? (
                      <PressableAnimado 
                        style={[styles.btnAction, styles.btnComplete]} 
                        onPress={() => atualizarStatusAgendamento(item.id, 'CONCLUIDO')}
                      >
                        <Text style={styles.btnCompleteText}>Concluir ✅</Text>
                      </PressableAnimado>
                    ) : (
                      <View style={[styles.btnAction, styles.btnFinished]}>
                        <Text style={styles.btnFinishedText}>Concluído 🎉</Text>
                      </View>
                    )}

                    <PressableAnimado 
                      style={[styles.btnAction, styles.btnEdit]} 
                      onPress={() => iniciarEdicao(item)}
                    >
                      <Text style={styles.btnEditText}>Editar ✏️</Text>
                    </PressableAnimado>

                    <PressableAnimado 
                      style={[styles.btnAction, styles.btnDelete]} 
                      onPress={() => excluirAgendamento(item.id)}
                    >
                      <Text style={styles.btnDeleteText}>Excluir 🗑️</Text>
                    </PressableAnimado>
                  </View>

                  {isPendente && (
                    <PressableAnimado 
                      style={styles.btnWhatsApp} 
                      onPress={() => {
                        const msg = `Olá, *${item.cliente}*!\nEste é um lembrete da oficina *LindoAutos*! 🚗\n\nSeu agendamento para o veículo *${item.carro}* está confirmado para o dia/horário *${item.data}*!\n\n📋 *Serviço*: ${item.servico}\n\nEstamos aguardando você! 🛠️`;
                        enviarMensagemWhatsApp(item.telefone, msg);
                      }}
                    >
                      <Text style={styles.btnWhatsAppText}>Enviar Lembrete por WhatsApp 💬</Text>
                    </PressableAnimado>
                  )}
                </View>
              );
            })
          )}
        </ScrollView>
      </Animated.View>

      <Modal
        visible={agendamentoEditando !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setAgendamentoEditando(null)}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} keyboardShouldPersistTaps="handled">
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Editar Agendamento</Text>
            
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
    marginHorizontal: 4,
  },
  btnComplete: {
    backgroundColor: '#000',
  },
  btnCompleteText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  btnFinished: {
    backgroundColor: '#f1f1f1',
    borderColor: '#ddd',
  },
  btnFinishedText: {
    color: '#888',
    fontSize: 13,
    fontWeight: '700',
  },
  btnDelete: {
    backgroundColor: '#FFF5F5',
    borderColor: '#E53E3E',
  },
  btnDeleteText: {
    color: '#E53E3E',
    fontSize: 13,
    fontWeight: '700',
  },
  btnEdit: {
    backgroundColor: '#FFD166',
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
