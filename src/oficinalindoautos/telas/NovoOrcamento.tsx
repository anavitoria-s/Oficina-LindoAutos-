import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useOficina } from '../context/OficinaContext';

export default function NovoOrcamento() {
  const navigation = useNavigation<any>();
  const { adicionarOrcamento } = useOficina();
  const [cliente, setCliente] = useState('');
  const [carro, setCarro] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');

  const salvar = () => {
    if (!cliente || !carro || !descricao || !valor) {
      return;
    }

    adicionarOrcamento({ cliente, carro, descricao, valor });
    navigation.navigate('Orçamentos');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Novo orçamento</Text>
        <Text style={styles.label}>Nome do cliente</Text>
        <TextInput style={styles.input} value={cliente} onChangeText={setCliente} placeholder="Maria Pereira" />
        <Text style={styles.label}>Carro</Text>
        <TextInput style={styles.input} value={carro} onChangeText={setCarro} placeholder="Toyota Corolla 2021" />
        <Text style={styles.label}>Descrição do serviço</Text>
        <TextInput style={styles.input} value={descricao} onChangeText={setDescricao} placeholder="Troca de óleo e revisão geral" multiline />
        <Text style={styles.label}>Valor estimado</Text>
        <TextInput style={styles.input} value={valor} onChangeText={setValor} placeholder="R$ 450,00" keyboardType="numeric" />

        <TouchableOpacity style={[styles.botao, !(cliente && carro && descricao && valor) && styles.botaoDesativado]} onPress={salvar} disabled={!(cliente && carro && descricao && valor)}>
          <Text style={styles.botaoTexto}>Salvar orçamento</Text>
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
