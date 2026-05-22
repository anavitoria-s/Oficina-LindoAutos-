import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Animated, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOficina, Orcamento } from '../context/OficinaContext';
import { enviarMensagemWhatsApp } from '../utils/whatsapp';
import { formatarDataHoraBrasileira } from '../utils/formatacao';
import PressableAnimado from '../componentes/PressableAnimado';

export default function Orcamentos() {
  const { orcamentos, atualizarStatusOrcamento, excluirOrcamento, editarOrcamento } = useOficina();
  const [busca, setBusca] = useState('');

  const [orcamentoEditando, setOrcamentoEditando] = useState<Orcamento | null>(null);
  const [editCarro, setEditCarro] = useState('');
  const [editPlaca, setEditPlaca] = useState('');
  const [editDescricao, setEditDescricao] = useState('');
  const [editValor, setEditValor] = useState('');
  const [editTelefone, setEditTelefone] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, []);

  const iniciarEdicao = (item: Orcamento) => {
    setOrcamentoEditando(item);
    setEditCarro(item.carro);
    setEditPlaca(item.placa || '');
    setEditDescricao(item.descricao);
    setEditValor(item.valor);
    setEditTelefone(item.telefone);
  };

  const salvarEdicao = () => {
    if (orcamentoEditando) {
      editarOrcamento(orcamentoEditando.id, {
        carro: editCarro,
        placa: editPlaca,
        descricao: editDescricao,
        valor: editValor,
        telefone: editTelefone,
      });
      setOrcamentoEditando(null);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'APROVADO':
        return { label: 'Aprovado', color: '#2bcf67' };
      case 'REJEITADO':
        return { label: 'Rejeitado', color: '#E53E3E' };
      default:
        return { label: 'Em Aberto', color: '#E6A23C' };
    }
  };

  const orcamentosFiltrados = orcamentos.filter(orc =>
    orc.cliente.toLowerCase().includes(busca.toLowerCase()) ||
    orc.carro.toLowerCase().includes(busca.toLowerCase()) ||
    orc.descricao.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Orçamentos</Text>
          <Text style={styles.subtitle}>Gerencie e aprove orçamentos para iniciar ordens de serviço.</Text>

          <TextInput 
            style={styles.searchBar} 
            value={busca} 
            onChangeText={setBusca} 
            placeholder="🔍 Buscar por cliente, carro ou descrição..." 
            placeholderTextColor="#888"
          />

          {orcamentosFiltrados.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                {orcamentos.length === 0 ? 'Nenhum orçamento cadastrado ainda.' : 'Nenhum orçamento correspondente encontrado.'}
              </Text>
            </View>
          ) : (
            orcamentosFiltrados.map(item => {
              const statusInfo = getStatusStyle(item.status);
              const isAberto = item.status === 'ABERTO';

              return (
                <View key={item.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View>
                      <Text style={styles.cardTitle}>{item.carro}</Text>
                      {item.placa ? <Text style={{ fontSize: 11, fontWeight: '800', color: '#666', marginTop: 2 }}>🎫 Placa: {item.placa}</Text> : null}
                    </View>
                    <View style={[styles.badge, { borderColor: statusInfo.color }]}>
                      <Text style={[styles.badgeText, { color: statusInfo.color }]}>{statusInfo.label}</Text>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  <Text style={styles.cardLine}>Cliente: <Text style={styles.value}>{item.cliente}</Text></Text>
                  <Text style={styles.cardLine}>Telefone: <Text style={styles.value}>{item.telefone || 'Não informado'}</Text></Text>
                  <Text style={styles.cardLine}>Descrição: <Text style={styles.value}>{item.descricao}</Text></Text>
                  <Text style={styles.cardLine}>Valor Estimado: <Text style={styles.valorTotalText}>{item.valor}</Text></Text>

                  <View style={{ marginTop: 8, marginBottom: 8, padding: 8, backgroundColor: '#f9f9f9', borderRadius: 6, borderWidth: 1, borderColor: '#eee' }}>
                    <Text style={{ fontSize: 11, color: '#666', fontWeight: '600' }}>Criado em: {formatarDataHoraBrasileira(item.criadoEm)}</Text>
                    {item.atualizadoEm ? (
                      <Text style={{ fontSize: 11, color: '#007AFF', fontWeight: '800', marginTop: 2 }}>Atualizado em: {formatarDataHoraBrasileira(item.atualizadoEm)}</Text>
                    ) : null}
                  </View>

                  {isAberto ? (
                    <View style={styles.btnRow}>
                      <PressableAnimado 
                        style={[styles.btnAction, styles.btnReject]} 
                        onPress={() => atualizarStatusOrcamento(item.id, 'REJEITADO')}
                      >
                        <Text style={styles.btnRejectText}>Rejeitar 👎</Text>
                      </PressableAnimado>
                      <PressableAnimado 
                        style={[styles.btnAction, styles.btnApprove]} 
                        onPress={() => atualizarStatusOrcamento(item.id, 'APROVADO')}
                      >
                        <Text style={styles.btnApproveText}>Aprovar 👍</Text>
                      </PressableAnimado>
                    </View>
                  ) : (
                    <View style={[styles.statusBanner, { backgroundColor: item.status === 'APROVADO' ? '#EBF8FF' : '#FFF5F5', borderColor: statusInfo.color }]}>
                      <Text style={[styles.statusBannerText, { color: statusInfo.color }]}>
                        {item.status === 'APROVADO' ? '⚙️ Aprovado (OS Gerada Automaticamente)' : '❌ Orçamento Cancelado'}
                      </Text>
                    </View>
                  )}

                  <View style={styles.secondaryRow}>
                    <PressableAnimado 
                      style={[styles.btnSecondary, styles.btnWhatsApp]} 
                      onPress={() => {
                        const msg = `Olá, *${item.cliente}*!\nO orçamento para o seu *${item.carro}* ficou pronto na oficina *LindoAutos*! 🚗\n\n📋 *Serviço*: ${item.descricao}\n💵 *Total estimado*: ${item.valor}\n\nGostaria de aprovar o orçamento para iniciarmos o reparo? 🛠️`;
                        enviarMensagemWhatsApp(item.telefone, msg);
                      }}
                    >
                      <Text style={styles.btnWhatsAppText}>WhatsApp 💬</Text>
                    </PressableAnimado>

                    <PressableAnimado 
                      style={[styles.btnSecondary, styles.btnEdit]} 
                      onPress={() => iniciarEdicao(item)}
                    >
                      <Text style={styles.btnEditText}>Editar ✏️</Text>
                    </PressableAnimado>

                    <PressableAnimado 
                      style={[styles.btnSecondary, styles.btnDelete]} 
                      onPress={() => excluirOrcamento(item.id)}
                    >
                      <Text style={styles.btnDeleteText}>Excluir 🗑️</Text>
                    </PressableAnimado>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      </Animated.View>

      <Modal
        visible={orcamentoEditando !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setOrcamentoEditando(null)}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} keyboardShouldPersistTaps="handled">
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Editar Orçamento</Text>
            
            <Text style={styles.modalLabel}>Carro / Modelo</Text>
            <TextInput style={styles.modalInput} value={editCarro} onChangeText={setEditCarro} />

            <Text style={styles.modalLabel}>Placa do Veículo</Text>
            <TextInput style={styles.modalInput} value={editPlaca} onChangeText={setEditPlaca} autoCapitalize="characters" />

            <Text style={styles.modalLabel}>Descrição do Serviço</Text>
            <TextInput style={styles.modalInput} value={editDescricao} onChangeText={setEditDescricao} />

            <Text style={styles.modalLabel}>Valor Estimado (R$)</Text>
            <TextInput style={styles.modalInput} value={editValor} onChangeText={setEditValor} placeholder="Ex: 250,00" />

            <Text style={styles.modalLabel}>Telefone</Text>
            <TextInput style={styles.modalInput} value={editTelefone} onChangeText={setEditTelefone} keyboardType="phone-pad" />

            <View style={styles.modalBtnRow}>
              <PressableAnimado style={[styles.modalBtn, styles.modalBtnCancel]} onPress={() => setOrcamentoEditando(null)}>
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
  valorTotalText: {
    color: '#2bcf67',
    fontWeight: '800',
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  btnAction: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000',
    marginHorizontal: 4,
  },
  btnReject: {
    backgroundColor: '#fff',
  },
  btnRejectText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '700',
  },
  btnApprove: {
    backgroundColor: '#2bcf67',
  },
  btnApproveText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  statusBanner: {
    borderWidth: 1.5,
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  statusBannerText: {
    fontSize: 11,
    fontWeight: '800',
  },
  secondaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  btnSecondary: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  btnWhatsApp: {
    backgroundColor: '#EFFFEC',
    borderColor: '#2bcf67',
  },
  btnWhatsAppText: {
    color: '#2bcf67',
    fontSize: 13,
    fontWeight: '800',
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
