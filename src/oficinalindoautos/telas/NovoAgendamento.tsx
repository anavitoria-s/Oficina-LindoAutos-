import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useOficina } from '../context/OficinaContext';

export default function NovoAgendamento() {
  const navigation = useNavigation<any>();
  const { adicionarAgendamento } = useOficina();
  const [cliente, setCliente] = useState('');
  const [carro, setCarro] = useState('');
  const [servico, setServico] = useState('');
  const [data, setData] = useState('');
  const [telefone, setTelefone] = useState('');

  const salvar = () => {
    if (!cliente || !carro || !servico || !data || !telefone) {
      return;
    }

    adicionarAgendamento({ cliente, carro, servico, data, telefone });
    navigation.navigate('Agenda');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Novo agendamento</Text>
        <Text style={styles.label}>Nome do cliente</Text>
        <TextInput style={styles.input} value={cliente} onChangeText={setCliente} placeholder="João Silva" />
        <Text style={styles.label}>Telefone</Text>
        <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} placeholder="(11) 99999-9999" keyboardType="phone-pad" />
        <Text style={styles.label}>Carro</Text>
        <TextInput style={styles.input} value={carro} onChangeText={setCarro} placeholder="Honda Civic 2019" />
        <Text style={styles.label}>Serviço</Text>
        <TextInput style={styles.input} value={servico} onChangeText={setServico} placeholder="Polimento cristalizado" />
        <Text style={styles.label}>Data / Hora</Text>
        <TextInput style={styles.input} value={data} onChangeText={setData} placeholder="15/05 - 17:07" />

        <TouchableOpacity style={[styles.botao, !(cliente && carro && servico && data && telefone) && styles.botaoDesativado]} onPress={salvar} disabled={!(cliente && carro && servico && data && telefone)}>
          <Text style={styles.botaoTexto}>Salvar agendamento</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  content: { padding: 16 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '700', marginBottom: 8, color: '#000' },
  input: { backgroundColor: '#fff', borderWidth: 2, borderColor: '#000', borderRadius: 8, padding: 12, marginBottom: 16 },
  botao: { backgroundColor: '#007AFF', paddingVertical: 16, borderRadius: 8, alignItems: 'center' },
  botaoDesativado: { backgroundColor: '#aacfff' },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
