import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Modal, Animated, TouchableOpacity, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOficina, OrdemServico } from '../context/OficinaContext';
import CardOS from '../componentes/CardOS';
import PressableAnimado from '../componentes/PressableAnimado';

export default function ListaOS() {
  const { ordensServico, adicionarOrdemServico, clientes, editarOrdemServico } = useOficina();
  const [modalVisivel, setModalVisivel] = useState(false);
  const [busca, setBusca] = useState('');
  const [cliente, setCliente] = useState('');
  const [telefone, setTelefone] = useState('');
  const [carro, setCarro] = useState('');
  const [placa, setPlaca] = useState('');
  const [servico, setServico] = useState('');
  const [valor, setValor] = useState('');
  const [sugestoes, setSugestoes] = useState<any[]>([]);

  const [osEditando, setOsEditando] = useState<OrdemServico | null>(null);
  const [editCarro, setEditCarro] = useState('');
  const [editPlaca, setEditPlaca] = useState('');
  const [editServico, setEditServico] = useState('');
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

  const iniciarEdicao = (item: OrdemServico) => {
    setOsEditando(item);
    setEditCarro(item.carro);
    setEditPlaca(item.placa || '');
    setEditServico(item.servico);
    setEditValor(item.valor);
    setEditTelefone(item.telefone);
  };

  const salvarEdicao = async () => {
    if (osEditando) {
      await editarOrdemServico(osEditando.id, {
        carro: editCarro,
        placa: editPlaca,
        servico: editServico,
        valor: editValor,
        telefone: editTelefone,
      });
      setOsEditando(null);
    }
  };

  const handleClienteChange = (txt: string) => {
    setCliente(txt);
    if (!txt.trim()) {
      setSugestoes([]);
      return;
    }
    const filtrados = clientes.filter(c =>
      c.nome.toLowerCase().includes(txt.toLowerCase())
    ).slice(0, 3);
    setSugestoes(filtrados);
  };

  const selecionarCliente = (c: any) => {
    setCliente(c.nome);
    setTelefone(c.telefone || '');
    if (c.carro) {
      setCarro(c.carro);
    }
    setSugestoes([]);
  };

  const getNumeroLimpo = (val: string) => {
    const limpo = parseFloat(val.replace(/[^\d.,]/g, '').replace(',', '.'));
    return isNaN(limpo) ? 0 : limpo;
  };

  const salvarOS = async () => {
    if (!cliente || !telefone || !carro || !placa || !servico || !valor) {
      return;
    }

    const valorFormatado = `R$ ${getNumeroLimpo(valor).toFixed(2).replace('.', ',')}`;

    await adicionarOrdemServico({ 
      cliente, 
      carro, 
      placa: placa.toUpperCase(),
      servico, 
      valor: valorFormatado, 
      telefone,
      valorPecas: '',
      valorMaoObra: ''
    });

    setCliente('');
    setTelefone('');
    setCarro('');
    setPlaca('');
    setServico('');
    setValor('');
    setSugestoes([]);
    setModalVisivel(false);
  };

  const ordensFiltradas = useMemo(() => {
    return ordensServico.filter(os =>
      os.cliente.toLowerCase().includes(busca.toLowerCase()) ||
      os.carro.toLowerCase().includes(busca.toLowerCase()) ||
      os.servico.toLowerCase().includes(busca.toLowerCase())
    );
  }, [ordensServico, busca]);

  const camposPreenchidos = cliente && telefone && carro && placa && servico && valor;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Ordens de Serviço</Text>
              <Text style={styles.subtitle}>Gerencie e acompanhe a execução dos reparos em tempo real.</Text>
            </View>
            <PressableAnimado style={styles.btnNova} onPress={() => setModalVisivel(true)}>
              <Text style={styles.btnNovaTexto}>+ NOVA OS</Text>
            </PressableAnimado>
          </View>

          <TextInput 
            style={styles.searchBar} 
            value={busca} 
            onChangeText={setBusca} 
            placeholder="🔍 Buscar OS por cliente, carro ou serviço..." 
            placeholderTextColor="#888"
          />

          {ordensFiltradas.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                {ordensServico.length === 0 ? 'Nenhuma ordem de serviço cadastrada ainda.' : 'Nenhuma ordem de serviço correspondente.'}
              </Text>
            </View>
          ) : (
            <FlatList
              data={ordensFiltradas}
              renderItem={({ item }) => <CardOS ordem={item} onEdit={iniciarEdicao} />}
              keyExtractor={(item) => item.id}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={5}
              removeClippedSubviews={true}
              scrollEnabled={false}
            />
          )}
        </ScrollView>

        <Modal visible={modalVisivel} animationType="slide" transparent>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalBg}>
            <View style={styles.modalContent}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.modalTitle}>Nova Ordem de Serviço</Text>
                
                <Text style={styles.label}>Cliente</Text>
                <TextInput 
                  style={styles.input} 
                  value={cliente} 
                  onChangeText={handleClienteChange} 
                  placeholder="Nome do cliente" 
                />

                {sugestoes.length > 0 && (
                  <View style={styles.autocompleteContainer}>
                    {sugestoes.map((c, index) => (
                      <TouchableOpacity 
                        key={index} 
                        style={styles.suggestionItem} 
                        onPress={() => selecionarCliente(c)}
                      >
                        <Text style={styles.suggestionText}>👤 {c.nome}</Text>
                        <Text style={styles.suggestionSub}>🚗 {c.carro || 'Sem veículo'} | 📞 {c.telefone}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <Text style={styles.label}>Telefone do Cliente</Text>
                <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} placeholder="(11) 99999-9999" keyboardType="phone-pad" />

                <Text style={styles.label}>Veículo</Text>
                <TextInput style={styles.input} value={carro} onChangeText={setCarro} placeholder="Modelo e ano do carro" />

                <Text style={styles.label}>Placa do Veículo</Text>
                <TextInput style={styles.input} value={placa} onChangeText={setPlaca} placeholder="Ex: ABC1D23" autoCapitalize="characters" />

                <Text style={styles.label}>Serviço</Text>
                <TextInput style={styles.input} value={servico} onChangeText={setServico} placeholder="Descreva o serviço a fazer" />

                <Text style={styles.label}>Valor do Serviço (R$)</Text>
                <TextInput style={styles.input} value={valor} onChangeText={setValor} placeholder="Ex: 450" keyboardType="numeric" />

                <View style={styles.modalButtons}>
                  <PressableAnimado 
                    style={[styles.btnModal, styles.btnCancelar]} 
                    onPress={() => {
                      setCliente('');
                      setTelefone('');
                      setCarro('');
                      setServico('');
                      setValor('');
                      setSugestoes([]);
                      setModalVisivel(false);
                    }}
                  >
                    <Text style={styles.btnCancelarTexto}>Cancelar</Text>
                  </PressableAnimado>
                  <PressableAnimado 
                    style={[styles.btnModal, styles.btnSalvar, !camposPreenchidos && styles.btnDesativado]} 
                    onPress={salvarOS}
                    disabled={!camposPreenchidos}
                  >
                    <Text style={styles.btnSalvarTexto}>Criar OS</Text>
                  </PressableAnimado>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        <Modal
          visible={osEditando !== null}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setOsEditando(null)}
        >
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} keyboardShouldPersistTaps="handled">
              <View style={styles.modalContentEdit}>
              <Text style={styles.modalTitleEdit}>Editar Ordem de Serviço</Text>
              
              <Text style={styles.modalLabelEdit}>Carro / Modelo</Text>
              <TextInput style={styles.modalInputEdit} value={editCarro} onChangeText={setEditCarro} />

              <Text style={styles.modalLabelEdit}>Placa do Veículo</Text>
              <TextInput style={styles.modalInputEdit} value={editPlaca} onChangeText={setEditPlaca} autoCapitalize="characters" />

              <Text style={styles.modalLabelEdit}>Serviço realizado</Text>
              <TextInput style={styles.modalInputEdit} value={editServico} onChangeText={setEditServico} />

              <Text style={styles.modalLabelEdit}>Valor Cobrado (R$)</Text>
              <TextInput style={styles.modalInputEdit} value={editValor} onChangeText={setEditValor} placeholder="Ex: 450,00" />

              <Text style={styles.modalLabelEdit}>Telefone</Text>
              <TextInput style={styles.modalInputEdit} value={editTelefone} onChangeText={setEditTelefone} keyboardType="phone-pad" />

              <View style={styles.modalBtnRowEdit}>
                <PressableAnimado style={[styles.modalBtnEdit, styles.modalBtnCancelEdit]} onPress={() => setOsEditando(null)}>
                  <Text style={styles.modalBtnCancelTextEdit}>Cancelar</Text>
                </PressableAnimado>
                <PressableAnimado style={[styles.modalBtnEdit, styles.modalBtnSaveEdit]} onPress={salvarEdicao}>
                  <Text style={styles.modalBtnSaveTextEdit}>Salvar 💾</Text>
                </PressableAnimado>
              </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </Modal>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#000',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    paddingRight: 8,
  },
  btnNova: {
    backgroundColor: '#007AFF',
    borderWidth: 2,
    borderColor: '#0360c5',
    borderRadius: 4,
    paddingHorizontal: 13,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnNovaTexto: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },
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
  emptyCard: {
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 8,
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 3,
    borderColor: '#000',
    padding: 24,
    paddingBottom: 40,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 20,
    color: '#000',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
    color: '#000',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
    fontSize: 14,
  },
  autocompleteContainer: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 8,
    marginTop: -10,
    marginBottom: 16,
    zIndex: 99,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  suggestionSub: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  btnModal: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  btnCancelar: {
    backgroundColor: '#fff',
  },
  btnCancelarTexto: {
    color: '#000',
    fontWeight: '700',
    paddingHorizontal: 8,
  },
  btnSalvar: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    borderColor:'#0360c5',
  },
  btnDesativado: {
    backgroundColor: '#aacfff',
    paddingHorizontal: 12,
    borderColor:'#95c0f8',
  },
  btnSalvarTexto: {
    color: '#fff',
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContentEdit: {
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
  modalTitleEdit: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 16,
    color: '#000',
  },
  modalLabelEdit: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    color: '#000',
  },
  modalInputEdit: {
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 6,
    padding: 10,
    marginBottom: 14,
    fontSize: 14,
    color: '#000',
    backgroundColor: '#fff',
  },
  modalBtnRowEdit: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalBtnEdit: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnCancelEdit: {
    backgroundColor: '#f3f3f3',
    marginRight: 10,
  },
  modalBtnCancelTextEdit: {
    color: '#000',
    fontWeight: '700',
  },
  modalBtnSaveEdit: {
    backgroundColor: '#2bcf67',
  },
  modalBtnSaveTextEdit: {
    color: '#fff',
    fontWeight: '900',
  },
});
