import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert, Animated, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOficina, Cliente } from '../context/OficinaContext';
import PressableAnimado from '../componentes/PressableAnimado';

export default function Clientes() {
  const { clientes, adicionarCliente, excluirCliente, ordensServico, orcamentos, editarCliente } = useOficina();
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [carro, setCarro] = useState('');
  const [busca, setBusca] = useState('');
  
  const [clienteExpandido, setClienteExpandido] = useState<string | null>(null);

  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [editNome, setEditNome] = useState('');
  const [editTelefone, setEditTelefone] = useState('');
  const [editCarro, setEditCarro] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, []);

  const salvar = () => {
    if (!nome.trim() || !telefone.trim()) {
      Alert.alert('Erro', 'Nome e Telefone são obrigatórios.');
      return;
    }
    adicionarCliente({ nome, telefone, carro });
    setNome('');
    setTelefone('');
    setCarro('');
  };

  const iniciarEdicao = (item: Cliente) => {
    setClienteEditando(item);
    setEditNome(item.nome);
    setEditTelefone(item.telefone);
    setEditCarro(item.carro || '');
  };

  const salvarEdicao = () => {
    if (clienteEditando) {
      if (!editNome.trim() || !editTelefone.trim()) {
        Alert.alert('Erro', 'Nome e Telefone são obrigatórios.');
        return;
      }
      editarCliente(clienteEditando.id, {
        nome: editNome,
        telefone: editTelefone,
        carro: editCarro,
      });
      setClienteEditando(null);
    }
  };

  const clientesFiltrados = clientes.filter(c =>
    c.nome.toLowerCase().includes(busca.toLowerCase()) ||
    (c.carro && c.carro.toLowerCase().includes(busca.toLowerCase()))
  );

  const toggleExpandir = (id: string) => {
    if (clienteExpandido === id) {
      setClienteExpandido(null);
    } else {
      setClienteExpandido(id);
    }
  };

  const parseValor = (valStr: string) => {
    const limpo = parseFloat(valStr.replace(/[^\d.,]/g, '').replace(',', '.'));
    return isNaN(limpo) ? 0 : limpo;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>Clientes e CRM</Text>
            <Text style={styles.subtitle}>Cadastre clientes e visualize o histórico completo de serviços e finanças.</Text>

            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Novo Cliente</Text>
              
              <Text style={styles.label}>Nome do Cliente *</Text>
              <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Ex: João Silva" />

              <Text style={styles.label}>Telefone / WhatsApp *</Text>
              <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} placeholder="Ex: (11) 98888-7777" keyboardType="phone-pad" />

              <Text style={styles.label}>Veículo Atual (Opcional)</Text>
              <TextInput style={styles.input} value={carro} onChangeText={setCarro} placeholder="Ex: Gol G6 2015" />

              <PressableAnimado style={styles.btnSalvar} onPress={salvar}>
                <Text style={styles.btnSalvarTexto}>Cadastrar Cliente 👤</Text>
              </PressableAnimado>
            </View>

            <Text style={styles.sectionTitle}>Clientes Registrados ({clientesFiltrados.length})</Text>

            <TextInput 
              style={styles.searchBar} 
              value={busca} 
              onChangeText={setBusca} 
              placeholder="🔍 Buscar por nome ou veículo..." 
              placeholderTextColor="#888"
            />

            {clientesFiltrados.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>
                  {clientes.length === 0 ? 'Nenhum cliente cadastrado ainda.' : 'Nenhum cliente correspondente encontrado.'}
                </Text>
              </View>
            ) : (
              clientesFiltrados.map(c => {
                const isExpandido = clienteExpandido === c.id;
                
                const historicoOS = ordensServico.filter(os => os.cliente.toLowerCase() === c.nome.toLowerCase());
                const historicoOrcamentos = orcamentos.filter(orc => orc.cliente.toLowerCase() === c.nome.toLowerCase());

                const totalGasto = historicoOS
                  .filter(os => os.status === 'CONCLUIDO')
                  .reduce((acc, os) => acc + parseValor(os.valor), 0);

                const totalGastoFormatado = `R$ ${totalGasto.toFixed(2).replace('.', ',')}`;

                return (
                  <View key={c.id} style={styles.clientCard}>
                    <TouchableOpacity style={styles.clientHeader} onPress={() => toggleExpandir(c.id)}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.clientName}>{c.nome}</Text>
                        <Text style={styles.clientSub}>📞 {c.telefone} {c.carro ? `| 🚗 ${c.carro}` : ''}</Text>
                      </View>
                      <View style={styles.crmBadge}>
                        <Text style={styles.crmBadgeText}>{isExpandido ? 'Fechar CRM 🔼' : 'Ver CRM 🔽'}</Text>
                      </View>
                    </TouchableOpacity>

                    {isExpandido && (
                      <View style={styles.crmPanel}>
                        <View style={styles.crmDivider} />
                        
                        <Text style={styles.crmTitle}>Estatísticas de Valor</Text>
                        <View style={styles.crmMetricsRow}>
                          <View style={styles.crmMetricBox}>
                            <Text style={styles.crmMetricValue}>{totalGastoFormatado}</Text>
                            <Text style={styles.crmMetricLabel}>Investido pelo Cliente</Text>
                          </View>
                          <View style={styles.crmMetricBox}>
                            <Text style={styles.crmMetricValue}>{historicoOS.length}</Text>
                            <Text style={styles.crmMetricLabel}>Ordens de Serviço</Text>
                          </View>
                        </View>

                        <Text style={styles.crmSubTitle}>Histórico de Serviços (OS)</Text>
                        {historicoOS.length === 0 ? (
                          <Text style={styles.crmEmptyText}>Nenhum serviço realizado ainda.</Text>
                        ) : (
                          historicoOS.map(os => (
                            <View key={os.id} style={styles.historyItem}>
                              <View style={styles.historyHeader}>
                                <Text style={styles.historyCar}>{os.carro}</Text>
                                <Text style={[styles.historyStatus, { color: os.status === 'CONCLUIDO' ? '#2bcf67' : '#E6A23C' }]}>
                                  {os.status}
                                </Text>
                              </View>
                              <Text style={styles.historyService}>{os.servico}</Text>
                              <Text style={styles.historyValue}>Valor: {os.valor}</Text>
                            </View>
                          ))
                        )}

                        <Text style={styles.crmSubTitle}>Histórico de Orçamentos</Text>
                        {historicoOrcamentos.length === 0 ? (
                          <Text style={styles.crmEmptyText}>Nenhum orçamento cadastrado.</Text>
                        ) : (
                          historicoOrcamentos.map(orc => (
                            <View key={orc.id} style={styles.historyItem}>
                              <View style={styles.historyHeader}>
                                <Text style={styles.historyCar}>{orc.carro}</Text>
                                <Text style={[styles.historyStatus, { color: orc.status === 'APROVADO' ? '#2bcf67' : orc.status === 'REJEITADO' ? '#E53E3E' : '#E6A23C' }]}>
                                  {orc.status}
                                </Text>
                              </View>
                              <Text style={styles.historyService}>{orc.descricao}</Text>
                              <Text style={styles.historyValue}>Valor: {orc.valor}</Text>
                            </View>
                          ))
                        )}

                        <View style={styles.crmActionsRow}>
                          <PressableAnimado 
                            style={[styles.btnCrmAction, styles.btnCrmEdit]} 
                            onPress={() => iniciarEdicao(c)}
                          >
                            <Text style={styles.btnCrmEditText}>Editar Dados ✏️</Text>
                          </PressableAnimado>

                          <PressableAnimado 
                            style={[styles.btnCrmAction, styles.btnCrmDelete]} 
                            onPress={() => {
                              Alert.alert(
                                'Excluir Cliente',
                                `Deseja realmente excluir ${c.nome}?`,
                                [
                                  { text: 'Cancelar', style: 'cancel' },
                                  { text: 'Excluir', style: 'destructive', onPress: () => excluirCliente(c.id) }
                                ]
                              );
                            }}
                          >
                            <Text style={styles.btnCrmDeleteText}>Excluir Registro 🗑️</Text>
                          </PressableAnimado>
                        </View>
                      </View>
                    )}
                  </View>
                );
              })
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </Animated.View>

      <Modal
        visible={clienteEditando !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setClienteEditando(null)}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} keyboardShouldPersistTaps="handled">
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Editar Cliente</Text>
            
            <Text style={styles.modalLabel}>Nome do Cliente</Text>
            <TextInput style={styles.modalInput} value={editNome} onChangeText={setEditNome} />

            <Text style={styles.modalLabel}>Telefone / WhatsApp</Text>
            <TextInput style={styles.modalInput} value={editTelefone} onChangeText={setEditTelefone} keyboardType="phone-pad" />

            <Text style={styles.modalLabel}>Veículo Cadastrado</Text>
            <TextInput style={styles.modalInput} value={editCarro} onChangeText={setEditCarro} />

            <View style={styles.modalBtnRow}>
              <PressableAnimado style={[styles.modalBtn, styles.modalBtnCancel]} onPress={() => setClienteEditando(null)}>
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
  formCard: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  formTitle: { fontSize: 16, fontWeight: '800', marginBottom: 16, color: '#000' },
  label: { fontSize: 12, fontWeight: '700', marginBottom: 6, color: '#000' },
  input: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 6,
    padding: 10,
    marginBottom: 14,
    fontSize: 14,
  },
  btnSalvar: {
    backgroundColor: '#000',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000',
    shadowColor: '#007AFF',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  btnSalvarTexto: { color: '#fff', fontWeight: '800', fontSize: 13 },
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
  sectionTitle: { fontSize: 16, fontWeight: '800', marginBottom: 12, color: '#000' },
  clientCard: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  clientHeader: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  clientName: { fontSize: 16, fontWeight: '800', color: '#000' },
  clientSub: { fontSize: 12, color: '#666', marginTop: 4 },
  crmBadge: {
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#f1f1f1',
  },
  crmBadgeText: { fontSize: 10, fontWeight: '800', color: '#000' },
  crmPanel: {
    padding: 16,
    paddingTop: 0,
    backgroundColor: '#fafafa',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  crmDivider: {
    height: 2,
    backgroundColor: '#000',
    marginBottom: 12,
  },
  crmTitle: { fontSize: 13, fontWeight: '800', color: '#000', marginBottom: 8, textTransform: 'uppercase' },
  crmMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  crmMetricBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#000',
    padding: 10,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  crmMetricValue: { fontSize: 14, fontWeight: '800', color: '#2bcf67' },
  crmMetricLabel: { fontSize: 9, color: '#666', marginTop: 2, textAlign: 'center' },
  crmSubTitle: { fontSize: 12, fontWeight: '800', color: '#000', marginTop: 8, marginBottom: 8, textTransform: 'uppercase' },
  crmEmptyText: { fontSize: 11, color: '#888', fontStyle: 'italic', marginBottom: 12 },
  historyItem: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyCar: { fontSize: 12, fontWeight: '800', color: '#007AFF' },
  historyStatus: { fontSize: 9, fontWeight: '800' },
  historyService: { fontSize: 12, color: '#000', marginTop: 4 },
  historyValue: { fontSize: 11, fontWeight: '700', color: '#2bcf67', marginTop: 4 },
  crmActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  btnCrmAction: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    paddingHorizontal: 10,
  },
  btnCrmEdit: {
    backgroundColor: '#FFD166',
    borderColor:'#f6c042',
  },
  btnCrmEditText: {
    color: '#000',
    fontSize: 11,
    fontWeight: '800',
  },
  btnCrmDelete: {
    backgroundColor: '#FFF5F5',
    borderColor: '#E53E3E',
  },
  btnCrmDeleteText: {
    color: '#E53E3E',
    fontSize: 11,
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
    marginTop: 10,
  },
  emptyText: { fontSize: 14, color: '#666', textAlign: 'center' },
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
