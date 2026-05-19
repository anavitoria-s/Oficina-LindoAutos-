import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';

import styles from '../styles/servicoStyles';

export default function CriarOS() {
  const [cliente, setCliente] = useState('');
  const [veiculo, setVeiculo] = useState('');
  const [servico, setServico] = useState('');

  function salvarOS() {
    Alert.alert(
      'Sucesso',
      'Ordem de serviço criada!'
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        Nova Ordem de Serviço
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Cliente"
        value={cliente}
        onChangeText={setCliente}
      />

      <TextInput
        style={styles.input}
        placeholder="Veículo"
        value={veiculo}
        onChangeText={setVeiculo}
      />

      <TextInput
        style={styles.input}
        placeholder="Serviço"
        value={servico}
        onChangeText={setServico}
      />

      <TouchableOpacity
        style={styles.botao}
        onPress={salvarOS}
      >
        <Text style={styles.botaoTexto}>
          Salvar
        </Text>
      </TouchableOpacity>
    </View>
  );
}
