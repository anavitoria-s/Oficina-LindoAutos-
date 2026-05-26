import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOficina } from '../context/OficinaContext';
import PressableAnimado from '../componentes/PressableAnimado';

function formatarDataInput(text: string): string {
  // Remove tudo exceto números
  const nums = text.replace(/\D/g, '');
  
  if (nums.length <= 2) return nums;
  if (nums.length <= 4) return `${nums.slice(0, 2)}/${nums.slice(2)}`;
  if (nums.length <= 8) return `${nums.slice(0, 2)}/${nums.slice(2, 4)} às ${nums.slice(4, 6)}:${nums.slice(6, 8) || ''}`;
  return `${nums.slice(0, 2)}/${nums.slice(2, 4)}/${nums.slice(4, 8)} às ${nums.slice(8, 10)}:${nums.slice(10, 12) || ''}`;
}

export default function NovoAgendamento() {
  const navigation = useNavigation<any>();
  const { adicionarAgendamento, clientes } = useOficina();
  const [cliente, setCliente] = useState('');
  const [carro, setCarro] = useState('');
  const [placa, setPlaca] = useState('');
  const [servico, setServico] = useState('');
  const [data, setData] = useState('');
  const [telefone, setTelefone] = useState('');
  const [sugestoes, setSugestoes] = useState<any[]>([]);

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

  const salvar = () => {
    if (!cliente || !carro || !servico || !data || !telefone) {
      return;
    }

    adicionarAgendamento({ cliente, carro, placa: placa.toUpperCase(), servico, data, telefone });
    navigation.navigate('Agenda');
  };

  const camposPreenchidos = cliente && carro && servico && data && telefone;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.header}>
          <PressableAnimado style={styles.btnVoltar} onPress={() => navigation.goBack()}>
            <Text style={styles.btnVoltarTexto}>⬅ VOLTAR</Text>
          </PressableAnimado>
          <Text style={styles.headerTitle}>NOVO AGENDAMENTO</Text>
          <View style={{ width: 80 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.label}>Nome do cliente</Text>
          <TextInput 
            style={styles.input} 
            value={cliente} 
            onChangeText={handleClienteChange} 
            placeholder="Comece a digitar o nome..." 
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

          <Text style={styles.label}>Telefone</Text>
          <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} placeholder="(11) 99999-9999" keyboardType="phone-pad" />
          
          <Text style={styles.label}>Carro</Text>
          <TextInput style={styles.input} value={carro} onChangeText={setCarro} placeholder="Modelo e ano do carro" />
          
          <Text style={styles.label}>Placa do Veículo (Opcional)</Text>
          <TextInput style={styles.input} value={placa} onChangeText={setPlaca} placeholder="Ex: ABC1D23" autoCapitalize="characters" />
          
          <Text style={styles.label}>Serviço desejado</Text>
          <TextInput style={styles.input} value={servico} onChangeText={setServico} placeholder="Troca de óleo, alinhamento..." />
          
          <Text style={styles.label}>Data e Hora do Agendamento</Text>
          <TextInput 
            style={[styles.input, { fontSize: 16, fontWeight: '700' }]} 
            value={data} 
            onChangeText={(text) => setData(formatarDataInput(text))} 
            placeholder="DD/MM/AAAA às HH:mm"
            keyboardType="numeric"
          />

          <PressableAnimado 
            style={[styles.botao, !camposPreenchidos && styles.botaoDesativado]} 
            onPress={salvar} 
            disabled={!camposPreenchidos}
          >
            <Text style={styles.botaoTexto}>Confirmar Agendamento 📅</Text>
          </PressableAnimado>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 3,
    borderColor: '#000',
  },
  btnVoltar: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  btnVoltarTexto: {
    fontSize: 10,
    fontWeight: '800',
    color: '#000',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#000',
  },
  content: { padding: 16, paddingBottom: 40 },
  label: { fontSize: 13, fontWeight: '700', marginBottom: 8, color: '#000' },
  input: { 
    backgroundColor: '#fff', 
    borderWidth: 2, 
    borderColor: '#000', 
    borderRadius: 8, 
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
  botao: { 
    backgroundColor: '#007AFF', 
    paddingVertical: 16, 
    borderRadius: 8, 
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    marginTop: 8,
  },
  botaoDesativado: { 
    backgroundColor: '#aacfff',
    shadowOpacity: 0,
    elevation: 0,
  },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
